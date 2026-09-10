'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/config';

interface NoScriptFallbackProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    showWarning?: boolean;
}

export default function NoScriptFallback({
    children,
    fallback,
    showWarning = true
}: NoScriptFallbackProps) {
    const [hasJavaScript, setHasJavaScript] = useState(true);

    useEffect(() => {
        setHasJavaScript(true);
    }, []);

    if (hasJavaScript) {
        return <>{children}</>;
    }

    return (
        <>
            {showWarning && (
                <noscript>
                    <div className="noscript-warning alert alert-warning" role="alert">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <h4>JavaScript Required</h4>
                                    <p>
                                        This website requires JavaScript for full functionality.
                                        Please enable JavaScript in your browser.
                                    </p>
                                    <hr />
                                    <p className="mb-0">
                                        <strong>Alternative options:</strong>
                                    </p>
                                    <ul className="mb-0">
                                        <li>Use our <Link href="/basic-search" className="alert-link">basic search</Link></li>
                                        <li>Contact us via <a href={`mailto:${SITE.emails.contact}`} className="alert-link">email</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </noscript>
            )}
            {fallback && <noscript>{fallback}</noscript>}
        </>
    );
}

// Standalone NoScript component for specific areas
export function NoScript({ children }: { children: React.ReactNode }) {
    return <noscript>{children}</noscript>;
}

// NoScript warning component
export function NoScriptWarning() {
    return (
        <noscript>
            <div className="noscript-warning alert alert-warning" role="alert">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h4>JavaScript Required</h4>
                            <p>
                                This website requires JavaScript for full functionality.
                                        Please enable JavaScript in your browser.
                            </p>
                            <hr />
                            <p className="mb-0">
                                <strong>Alternative options:</strong>
                            </p>
                            <ul className="mb-0">
                                <li>Use our <Link href="/basic-search" className="alert-link">basic search</Link></li>
                                <li>Contact us via <a href={`mailto:${SITE.emails.contact}`} className="alert-link">email</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </noscript>
    );
} 