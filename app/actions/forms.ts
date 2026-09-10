'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getPayload } from 'payload';
import config from '@payload-config';

// Contact form schema
const ContactFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Comment form schema
const CommentFormSchema = z.object({
    comment: z.string().min(1, 'Comment is required'),
    articleId: z.string().min(1, 'Article ID is required'),
    parentId: z.string().optional(),
});

// Search form schema
const SearchFormSchema = z.object({
    query: z.string().min(1, 'Search query is required'),
    type: z.string().optional(),
});

// Newsletter subscription schema
const NewsletterSchema = z.object({
    email: z.string().email('Invalid email address'),
});

// Contact form server action
export async function submitContactFormServer(formData: FormData) {
    try {
        const rawData = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            message: formData.get('message') as string,
        };

        const validatedData = ContactFormSchema.parse(rawData);

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Here you would typically save to database and send email
        console.log('Contact form submission (server):', validatedData);

        revalidatePath('/contact');
        revalidatePath('/about');

        return {
            success: true,
            message: 'Thank you for your message! We will get back to you soon.',
            data: validatedData
        };

    } catch (error) {
        console.error('Contact form error (server):', error);

        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Please check your input and try again.',
                errors: error.issues.map((err: z.ZodIssue) => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            };
        }

        return {
            success: false,
            message: 'Something went wrong. Please try again later.',
            error: 'Internal server error'
        };
    }
}

// Comment form server action
export async function submitCommentServer(formData: FormData) {
    try {
        const rawData = {
            comment: formData.get('comment') as string,
            articleId: formData.get('articleId') as string,
            parentId: formData.get('parentId') as string,
        };

        const validatedData = CommentFormSchema.parse(rawData);

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Here you would typically save to database
        console.log('Comment submission (server):', validatedData);

        revalidatePath('/single');

        return {
            success: true,
            message: 'Comment submitted successfully!',
            data: validatedData
        };

    } catch (error) {
        console.error('Comment form error (server):', error);

        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Please check your input and try again.',
                errors: error.issues.map((err: z.ZodIssue) => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            };
        }

        return {
            success: false,
            message: 'Something went wrong. Please try again later.',
            error: 'Internal server error'
        };
    }
}

// Search form server action
export async function performSearchServer(formData: FormData) {
    try {
        const rawData = {
            query: formData.get('query') as string,
            type: formData.get('type') as string,
        };

        const validatedData = SearchFormSchema.parse(rawData);

        // Simulate search processing
        await new Promise(resolve => setTimeout(resolve, 500));

        // Here you would typically perform actual search
        console.log('Search performed (server):', validatedData);

        return {
            success: true,
            message: 'Search completed successfully',
            data: validatedData,
            results: [] // Add actual search results here
        };

    } catch (error) {
        console.error('Search error (server):', error);

        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Please enter a valid search query.',
                errors: error.issues.map((err: z.ZodIssue) => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            };
        }

        return {
            success: false,
            message: 'Search failed. Please try again later.',
            error: 'Internal server error'
        };
    }
}

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