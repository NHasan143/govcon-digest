"use client";

import { useEffect, useRef } from "react";

declare global {
    interface Window {
        grecaptcha?: {
            render: (el: HTMLElement, opts: { sitekey: string }) => number;
            reset: (id?: number) => void;
        };
        onRecaptchaLoad?: () => void;
    }
}

/* Google reCAPTCHA v2 checkbox. Renders nothing when
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not configured. The widget injects a
   hidden `g-recaptcha-response` field into the surrounding form, verified
   server-side in app/actions/contact.ts. */
export default function Recaptcha() {
    const ref = useRef<HTMLDivElement>(null);
    const widgetId = useRef<number | null>(null);
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    useEffect(() => {
        if (!siteKey) return;

        const render = () => {
            if (!ref.current || !window.grecaptcha?.render) return;
            if (widgetId.current === null) {
                widgetId.current = window.grecaptcha.render(ref.current, { sitekey: siteKey });
            }
        };

        if (window.grecaptcha?.render) {
            render();
            return;
        }

        window.onRecaptchaLoad = render;
        if (!document.querySelector('script[src*="recaptcha/api.js"]')) {
            const script = document.createElement("script");
            script.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }
    }, [siteKey]);

    if (!siteKey) return null;
    return <div ref={ref} className="mb-3" />;
}
