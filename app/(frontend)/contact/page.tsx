import { Metadata } from "next";
import { SITE } from "@/lib/config";
import ContactForm from "@/components/sections/contact/ContactForm";

export const metadata: Metadata = {
  title: `Contact Us - Get in Touch with ${SITE.name}`,
  description: `Contact ${SITE.name} for inquiries, feedback, or collaboration opportunities. Reach out to our team for advertising, events, or general questions. We're here to help!`,
  keywords: ["contact", "get in touch", "inquiries", "feedback", "advertising", "events", "collaboration"],
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: `Contact Us - Get in Touch with ${SITE.name}`,
    description: `Contact ${SITE.name} for inquiries, feedback, or collaboration opportunities. We're here to help!`,
    url: '/contact',
    siteName: SITE.name,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: `Contact Us - Get in Touch with ${SITE.name}`,
    description: `Contact ${SITE.name} for inquiries, feedback, or collaboration opportunities.`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const infoCards = [
  {
    icon: "ti-email",
    title: "General Inquiries",
    line: "Questions, feedback, or news tips — we read everything.",
    link: { label: SITE.emails.contact, href: `mailto:${SITE.emails.contact}` },
  },
  {
    icon: "ti-announcement",
    title: "Advertising & Partnerships",
    line: "Sponsorships, partner content, and media kits.",
    link: { label: SITE.emails.ads, href: `mailto:${SITE.emails.ads}` },
  },
];

export default function Contact() {
  return (
    <div className="pt-50 pb-50">
      {/* Hero */}
      <div className="text-center mb-50">
        <h1 className="font-weight-900 mb-15">Get in Touch</h1>
        <p className="text-muted font-medium m-auto" style={{ maxWidth: 560 }}>
          Have a question, a story tip, or a partnership idea? Drop us a line —
          we usually reply within one business day.
        </p>
      </div>

      <div className="row">
        {/* Contact info cards */}
        <div className="col-lg-4 mb-30">
          {infoCards.map((card) => (
            <div
              key={card.title}
              className="mb-20 p-30"
              style={{
                border: "1px solid rgba(0,0,0,.08)",
                borderRadius: 10,
              }}
            >
              <div className="d-flex align-items-start">
                <span
                  className="d-inline-flex align-items-center justify-content-center mr-15"
                  style={{
                    width: 44,
                    height: 44,
                    minWidth: 44,
                    borderRadius: 10,
                    background: "#101010",
                    color: "#fff",
                    fontSize: 18,
                  }}
                >
                  <i className={card.icon} />
                </span>
                <div>
                  <h6 className="mb-5 font-weight-bold">{card.title}</h6>
                  <p className="font-small text-muted mb-5">{card.line}</p>
                  {card.link && (
                    <a className="font-small font-weight-bold" href={card.link.href}>
                      {card.link.label}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="col-lg-8 mb-30">
          <div
            className="p-30 h-100 d-flex flex-column"
            style={{
              border: "1px solid rgba(0,0,0,.08)",
              borderRadius: 10,
            }}
          >
            <h4 className="mb-5 font-weight-bold">Send us a message</h4>
            <p className="font-small text-muted mb-20">
              Fill in the form below and our team will get back to you.
            </p>
            <ContactForm fill />
          </div>
        </div>
      </div>
    </div>
  );
}
