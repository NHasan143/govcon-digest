import { Metadata } from "next";
import { SITE } from "@/lib/config";
import ContactForm from "@/components/sections/contact/ContactForm";
import styles from "@/components/sections/contact/Contact.module.css";

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
    title: "General Inquiries",
    line: "Questions, feedback, or news tips — we read everything.",
    link: { label: SITE.emails.contact, href: `mailto:${SITE.emails.contact}` },
  },
  {
    title: "Advertising & Partnerships",
    line: "Sponsorships, partner content, and media kits.",
    link: { label: SITE.emails.ads, href: `mailto:${SITE.emails.ads}` },
  },
];

export default function Contact() {
  return (
    <section className={styles.page} aria-labelledby="contact-heading">
      <div className={styles.layout}>
        <div className={styles.inquiries}>
          <header className={styles.introduction}>
            <h1 id="contact-heading">Get in Touch</h1>
            <p>
              Have a question, a story tip, or a partnership idea? Drop us a line —
              we usually reply within one business day.
            </p>
          </header>

          {infoCards.map((card) => (
            <section key={card.title} className={styles.inquiry}>
              <h2>{card.title}</h2>
              <p>{card.line}</p>
              <a className={styles.email} href={card.link.href}>
                <span>{card.link.label}</span>
              </a>
            </section>
          ))}
        </div>

        <section className={styles.messageSection} aria-labelledby="message-heading">
          <div className={styles.formHeading}>
            <h2 id="message-heading">Send us a message</h2>
            <p>Fill in the form below and our team will get back to you.</p>
          </div>
          <ContactForm />
        </section>
      </div>
    </section>
  );
}
