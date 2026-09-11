// Central site configuration. All values come from environment variables (see .env.example);
// the fallbacks keep the app working when a variable is missing.
// NEXT_PUBLIC_* variables are inlined at build time, so they are safe to use in client components.

const name = process.env.NEXT_PUBLIC_SITE_NAME || 'Govcon Digest';

export const SITE = {
    name,
    // Short mark used for the mobile logo, e.g. "Govcon Digest" -> "GD"
    initials: name.split(/\s+/).map((word) => word[0]).join('').toUpperCase(),
    tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || 'Your trusted news source',
    // One-sentence description — used in metadata and the organization JSON-LD.
    description:
        process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
        `${name} is a news publication.`,
    url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://govcondigest.com').replace(/\/$/, ''),
    twitter: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@govcondigest',
    // Postal address — shown in the footer and emitted in the organization JSON-LD.
    address: {
        street: process.env.NEXT_PUBLIC_ADDRESS_STREET || '123 Example Street, Suite 100',
        locality: process.env.NEXT_PUBLIC_ADDRESS_LOCALITY || 'City',
        region: process.env.NEXT_PUBLIC_ADDRESS_REGION || 'ST',
        postalCode: process.env.NEXT_PUBLIC_ADDRESS_POSTAL_CODE || '00000',
        country: process.env.NEXT_PUBLIC_ADDRESS_COUNTRY || 'US',
    },
    // Official social profiles — footer icons link here.
    socials: {
        linkedin:
            process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ||
            'https://www.linkedin.com/company/govcondigest/',
        twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || 'https://x.com/govcondigest',
        facebook:
            process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || 'https://www.facebook.com/govcondigest',
        instagram:
            process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || 'https://www.instagram.com/govcondigest/',
    },
    emails: {
        contact: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@govcondigest.com',
        ads: process.env.NEXT_PUBLIC_ADS_EMAIL || 'ads@govcondigest.com',
        sales: process.env.NEXT_PUBLIC_SALES_EMAIL || 'sales@govcondigest.com',
        events: process.env.NEXT_PUBLIC_EVENTS_EMAIL || 'events@govcondigest.com',
    },
} as const;

// "123 Example Street, Suite 100, City, ST 00000" — the address on one line.
export const formatAddress = () => {
    const { street, locality, region, postalCode } = SITE.address;
    return `${street}, ${locality}, ${region} ${postalCode}`;
};
