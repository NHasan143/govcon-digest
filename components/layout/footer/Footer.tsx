import Link from "next/link";
import Image from "next/image";
import { FooterProps } from "@/types";
import { SITE } from "@/lib/config";
import { PARENT_CATEGORIES } from "@/lib/categories";

const companyLinks = [
  { label: "Home", href: "/" },
  { label: "News", href: "/stories" },
  { label: "Topics", href: "/topics" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Editorial Standards", href: "/editorial-standards" },
];

// Official social profiles — URLs live in lib/config.ts (env-overridable)
const socialLinks = [
  {
    label: "Facebook",
    href: SITE.socials.facebook,
    icon: "ti-facebook",
    className: "facebook-icon",
  },
  {
    label: "Twitter / X",
    href: SITE.socials.twitter,
    icon: "ti-twitter-alt",
    className: "twitter-icon",
  },
  {
    label: "LinkedIn",
    href: SITE.socials.linkedin,
    icon: "ti-linkedin",
    className: "linkedin-icon",
  },
  {
    label: "Instagram",
    href: SITE.socials.instagram,
    icon: "ti-instagram",
    className: "instagram-icon",
  },
];

// Legal pages — shown below the divider, next to the copyright
const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Cookie Policy", href: "/cookie-policy" },
];

export default function Footer({
  variant = 'default',
  showSocialLinks = true,
  showNewsletter = true,
  logo,
  copyrightText,
}: FooterProps = {}) {
  const copyright =
    copyrightText ?? `© ${new Date().getFullYear()} ${SITE.name}. All rights reserved.`;
  return (
    <>
      {/* Footer Start*/}
      <footer>
        <div className="footer-area">
          <div className="container">
            <div className="row pb-30">
              <div className="col-12">
                <div className="divider-2 mb-30" />
              </div>
              <div className="col-lg-4 col-md-6 mb-lg-0 mb-md-4 mb-sm-4">
                <div className="sidebar-widget widget-latest-posts pr-30">
                  <h4 className="widget-header mb-15">
                    <Link href="/" className="d-inline-block">
                      <Image
                        src="/logo.png"
                        alt={`${SITE.name} logo`}
                        width={110}
                        height={70}
                        style={{ objectFit: "contain", height: 70, width: "auto" }}
                      />
                    </Link>
                  </h4>
                  <div className="textwidget">
                    <p style={{ maxWidth: 260 }}>{SITE.tagline}</p>
                    <ul className="header-social-network d-inline-block list-inline font-small">
                      <li className="list-inline-item">
                        <span className="text-uppercase">
                          <strong className="color-black">Follow us:</strong>
                        </span>
                      </li>
                      {socialLinks.map((social) => (
                        <li key={social.label} className="list-inline-item">
                          <a
                            className={`social-icon ${social.className} text-xs-center`}
                            target="_blank"
                            rel="noopener noreferrer"
                            href={social.href}
                            aria-label={social.label}
                          >
                            <i className={social.icon} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb-lg-0 mb-md-4 mb-sm-4">
                <h5 className="mb-15">Category</h5>
                <ul className="float-start mr-30 font-small">
                  {PARENT_CATEGORIES.map((category) => (
                    <li key={category.slug} className="cat-item">
                      <Link href={`/${category.slug}`}>{category.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-lg-4 col-md-6 mb-lg-0 mb-md-4 mb-sm-4">
                <h5 className="mb-15">Company</h5>
                <ul className="float-start mr-30 font-small">
                  {companyLinks.map((link) => (
                    <li key={link.href} className="cat-item">
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* footer-bottom aera */}
        <div className="footer-bottom-area text-center text-muted">
          <div className="container">
            <div className="footer-border pt-20 pb-20">
              <div className="row d-flex mb-10">
                <div className="col-12">
                  <ul className="list-inline font-small">
                    {legalLinks.map((link) => (
                      <li key={link.href} className="list-inline-item mr-15">
                        <Link href={link.href}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="row d-flex align-items-center justify-content-between">
                <div className="col-12">
                  <div className="footer-copy-right">
                    <p className="font-small text-muted">{copyright}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Footer End*/}
      </footer>
      {/* End Footer */}
    </>
  );
}
