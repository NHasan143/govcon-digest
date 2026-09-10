'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Contact form validation schema
const ContactFormSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().optional(),
    message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;

// Verify the Google reCAPTCHA v2 token. No-op when RECAPTCHA_SECRET_KEY is
// not configured, so the form keeps working before keys are set up.
async function verifyRecaptcha(formData: FormData): Promise<string | null> {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) return null;

    const token = formData.get('g-recaptcha-response');
    if (!token || typeof token !== 'string') {
        return 'Please tick the "I\'m not a robot" box before sending.';
    }

    try {
        const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
        });
        const data = (await res.json()) as { success?: boolean };
        if (!data.success) return 'reCAPTCHA verification failed — please try again.';
        return null;
    } catch {
        return 'Could not verify reCAPTCHA — please try again.';
    }
}

// Contact form submission server action
export async function submitContactForm(formData: FormData) {
    try {
        const captchaError = await verifyRecaptcha(formData);
        if (captchaError) {
            return { success: false, message: captchaError };
        }

        // Extract form data
        const rawData = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            message: formData.get('message') as string,
        };

        // Validate form data
        const validatedData = ContactFormSchema.parse(rawData);

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Here you would typically:
        // 1. Save to database
        // 2. Send email notification
        // 3. Log the contact request
        console.log('Contact form submission:', validatedData);

        // Revalidate the contact page
        revalidatePath('/contact');

        return {
            success: true,
            message: 'Thank you for your message! We will get back to you soon.',
            data: validatedData
        };

    } catch (error) {
        console.error('Contact form error:', error);

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

// Newsletter subscription server action
export async function subscribeNewsletter(formData: FormData) {
    try {
        const email = formData.get('email') as string;
        const name = formData.get('name') as string;

        // Validate email
        const emailSchema = z.string().email('Please enter a valid email address');
        const validatedEmail = emailSchema.parse(email);

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 500));

        // Here you would typically:
        // 1. Save to newsletter subscribers database
        // 2. Send welcome email
        // 3. Add to email marketing list
        console.log('Newsletter subscription:', { email: validatedEmail, name });

        return {
            success: true,
            message: 'Thank you for subscribing to our newsletter!'
        };

    } catch (error) {
        console.error('Newsletter subscription error:', error);

        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Please enter a valid email address.',
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