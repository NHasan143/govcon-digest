'use client';

import { generateStructuredData } from '@/lib/metadata';

interface StructuredDataProps {
    type: 'article' | 'author' | 'organization' | 'website';
    data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
    const structuredData = generateStructuredData(type, data);

    if (!structuredData) {
        return null;
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(structuredData),
            }}
        />
    );
} 