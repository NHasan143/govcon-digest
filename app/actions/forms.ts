'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import { getPayload } from 'payload';
import config from '@payload-config';
import { clientIp, RATE_LIMIT_MESSAGE, rateLimit } from '@/lib/rateLimit';

// Newsletter subscription schema
const NewsletterSchema = z.object({
    email: z.string().email('Invalid email address'),
});

// A unique-constraint violation on `email` means a concurrent request already
// inserted this address — from the visitor's side that is still a success.
function isDuplicateEmailError(error: unknown): boolean {
    const message = error instanceof Error ? `${error.name} ${error.message}` : String(error);
    return /unique|already exists|SQLITE_CONSTRAINT/i.test(message);
}

// Newsletter subscription server action. Persists to the Payload
// `subscribers` collection — overrideAccess is required because that
// collection denies anonymous create (see payload/collections/Subscribers.ts).
export async function subscribeNewsletterServer(formData: FormData, source?: string) {
    // Per-IP throttle, counted before any other work so floods stay cheap.
    const limited = rateLimit('newsletter', clientIp(await headers()));
    if (!limited.ok) {
        return {
            success: false,
            code: 'rate_limited' as const,
            message: RATE_LIMIT_MESSAGE,
            retryAfterSeconds: limited.retryAfterSeconds,
        };
    }

    // Honeypot: the `website` field is hidden from people, so only bots fill
    // it in. Report success so the bot moves on, but store nothing.
    const honeypot = formData.get('website');
    if (typeof honeypot === 'string' && honeypot.trim() !== '') {
        return {
            success: true,
            code: 'subscribed' as const,
            message: 'Thank you for subscribing to our newsletter!',
        };
    }

    let validatedData: z.infer<typeof NewsletterSchema>;

    try {
        validatedData = NewsletterSchema.parse({
            email: formData.get('EMAIL') as string,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                code: 'invalid' as const,
                message: 'Please enter a valid email address.',
                errors: error.issues.map((err: z.ZodIssue) => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            };
        }
        throw error;
    }

    // Stored lower-cased so Foo@x.com and foo@x.com can't both subscribe.
    const email = validatedData.email.trim().toLowerCase();

    try {
        const payload = await getPayload({ config });

        const existing = await payload.find({
            collection: 'subscribers',
            where: { email: { equals: email } },
            limit: 1,
            overrideAccess: true,
        });

        const current = existing.docs[0];

        if (current) {
            // Re-subscribing after an unsubscribe reactivates the record
            // rather than failing on the unique email.
            if (current.status !== 'active') {
                await payload.update({
                    collection: 'subscribers',
                    id: current.id,
                    data: { status: 'active', source: source ?? current.source },
                    overrideAccess: true,
                });
            }

            return {
                success: true,
                code: 'already' as const,
                message: "You're already subscribed — thanks for reading!",
            };
        }

        await payload.create({
            collection: 'subscribers',
            data: { email, status: 'active', source },
            overrideAccess: true,
        });

        return {
            success: true,
            code: 'subscribed' as const,
            message: 'Thank you for subscribing to our newsletter!',
        };

    } catch (error) {
        if (isDuplicateEmailError(error)) {
            return {
                success: true,
                code: 'already' as const,
                message: "You're already subscribed — thanks for reading!",
            };
        }

        console.error('Newsletter subscription error (server):', error);

        return {
            success: false,
            code: 'error' as const,
            message: 'Subscription failed. Please try again later.',
        };
    }
} 