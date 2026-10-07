"use client";

import { useState, useTransition } from "react";
import { submitContactForm } from "@/app/actions/contact";
import styles from "./Contact.module.css";
import { useFormReset } from "@/hooks/useFormReset";
import { NoScript } from "@/components/elements/NoScriptFallback";
import Recaptcha from "@/components/elements/Recaptcha";

interface ContactFormProps {
    formConfig?: {
        namePlaceholder: string;
        emailPlaceholder: string;
        phonePlaceholder: string;
        messagePlaceholder: string;
        submitText: string;
    };
    className?: string;
    /** Stretch the form to fill its container's height (textarea grows to take up the slack). */
    fill?: boolean;
}

interface FormErrors {
    [key: string]: string;
}

export default function ContactForm({
    formConfig = {
        namePlaceholder: "Name",
        emailPlaceholder: "Email",
        phonePlaceholder: "Phone",
        messagePlaceholder: "Message",
        submitText: "Send message",
    },
    className = "",
    fill = false,
}: ContactFormProps) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const { resetKey, resetForm } = useFormReset();

    const handleSubmit = async (formData: FormData) => {
        // Clear previous messages and errors
        setMessage(null);
        setErrors({});

        startTransition(async () => {
            try {
                const result = await submitContactForm(formData);

                if (result.success) {
                    setMessage({ type: "success", text: result.message });
                    resetForm(); // Reset form using React state
                } else {
                    setMessage({ type: "error", text: result.message });

                    // Set field-specific errors if available
                    if (result.errors) {
                        const fieldErrors: FormErrors = {};
                        result.errors.forEach((error: { field: string; message: string }) => {
                            fieldErrors[error.field] = error.message;
                        });
                        setErrors(fieldErrors);
                    }
                }
            } catch (error) {
                setMessage({
                    type: "error",
                    text: "Something went wrong. Please try again later.",
                });
            }
        });
    };

    return (
        <div className={`${styles.formContainer} ${fill ? styles.fill : ""} ${className}`}>
            {message && (
                <div className={styles.feedback} data-type={message.type} role={message.type === "error" ? "alert" : "status"}>
                    {message.text}
                </div>
            )}

            <form key={resetKey} id="contactForm" action={handleSubmit} className={styles.form} aria-busy={isPending}>
                <div className={styles.fields}>
                    <div className={styles.field}>
                        <label htmlFor="name">Name <span aria-hidden="true">*</span></label>
                        <input name="name" id="name" type="text" autoComplete="name" placeholder={formConfig.namePlaceholder} minLength={2} maxLength={50} required disabled={isPending} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
                        {errors.name && <p id="name-error" className={styles.fieldError}>{errors.name}</p>}
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="email">Email <span aria-hidden="true">*</span></label>
                        <input name="email" id="email" type="email" autoComplete="email" placeholder={formConfig.emailPlaceholder} required disabled={isPending} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
                        {errors.email && <p id="email-error" className={styles.fieldError}>{errors.email}</p>}
                    </div>
                    <div className={`${styles.field} ${styles.fullWidth}`}>
                        <label htmlFor="phone">Phone <span aria-hidden="true">*</span></label>
                        <input name="phone" id="phone" type="tel" autoComplete="tel" placeholder={formConfig.phonePlaceholder} required disabled={isPending} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} />
                        {errors.phone && <p id="phone-error" className={styles.fieldError}>{errors.phone}</p>}
                    </div>
                    <div className={`${styles.field} ${styles.fullWidth}`}>
                        <label htmlFor="message">Message <span aria-hidden="true">*</span></label>
                        <textarea name="message" id="message" rows={5} placeholder={formConfig.messagePlaceholder} minLength={10} maxLength={1000} required disabled={isPending} defaultValue="" aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} />
                        {errors.message && <p id="message-error" className={styles.fieldError}>{errors.message}</p>}
                    </div>
                </div>
                <Recaptcha />
                <div className={styles.actions}>
                    <button type="submit" className={styles.submit} disabled={isPending}>
                        {isPending ? "Sending…" : formConfig.submitText}
                    </button>
                </div>
                <NoScript>
                    <p className={styles.hint}>For enhanced form features and real-time validation, please enable JavaScript.</p>
                </NoScript>
            </form>
        </div>
    );
}
