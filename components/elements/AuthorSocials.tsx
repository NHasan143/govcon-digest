import type { User } from '@/payload-types'

/* Social icon links for an author, from the Users `socials` group in Payload.
   Renders nothing when the author has no links filled in. */
const ICONS: { key: keyof NonNullable<User['socials']>; icon: string; label: string }[] = [
    { key: 'linkedin', icon: 'ti-linkedin', label: 'LinkedIn' },
    { key: 'facebook', icon: 'ti-facebook', label: 'Facebook' },
    { key: 'twitter', icon: 'ti-twitter-alt', label: 'Twitter / X' },
    { key: 'instagram', icon: 'ti-instagram', label: 'Instagram' },
    { key: 'website', icon: 'ti-world', label: 'Website' },
]

export default function AuthorSocials({
    socials,
    name,
}: {
    socials: User['socials']
    name: string
}) {
    if (!socials) return null
    const links = ICONS.filter(({ key }) => socials[key])
    if (links.length === 0) return null

    return (
        <div className="author-socials font-medium mt-10">
            {links.map(({ key, icon, label }) => (
                <a
                    key={key}
                    href={socials[key] as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${name} on ${label}`}
                    title={label}
                    className="text-muted mr-10"
                >
                    <i className={icon} />
                </a>
            ))}
        </div>
    )
}
