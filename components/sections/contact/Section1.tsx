import Link from "next/link";
import { ContactSectionProps } from "@/types";
import ContactForm from "./ContactForm";
import Image from "next/image";
import { SITE } from "@/lib/config";

export default function Section1({
  title = "Contact Us",
  breadcrumb = {
    home: "Home",
    current: "Get in touch"
  },
  companyInfo = {
    name: "AliThemes",
    description: "We are AliThemes, a creative and dedicated group of individuals who love web development almost as much as we love our customers. We are passionate team with the mission for achieving the perfection in web design. All designs are made by love with pixel perfect design and excellent coding quality. Speed, security and SEO friendly alway in our mind.",
  },
  contactInfo = {
    address: "Lorem 142 Str., 2352, Ipsum, State, USA",
    phone: "+01-234 56789",
    generalEmail: SITE.emails.contact,
  },
  advertiseInfo = {
    generalEmail: SITE.emails.ads,
    salesEmail: SITE.emails.sales,
    description: `For large or unique campaigns please email ${SITE.emails.sales} for requests-for-proposal and additional pricing information.`,
  },
  eventInfo = {
    description: "We are a professional event management team, starting in 2012.",
    email: SITE.emails.events,
  },
  socialLinks = [
    { name: "Facebook", href: "#", icon: "ti-facebook", className: "facebook-icon" },
    { name: "Twitter", href: "#", icon: "ti-twitter-alt", className: "twitter-icon" },
    { name: "Pinterest", href: "#", icon: "ti-pinterest", className: "pinterest-icon" },
    { name: "Instagram", href: "#", icon: "ti-instagram", className: "instagram-icon" },
  ],
  advertisement = {
    image: "/assets/imgs/ads/ads-2.jpg",
    href: "#",
    alt: "newsboard",
  },
  formConfig = {
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    phonePlaceholder: "Phone",
    messagePlaceholder: "Message",
    submitText: "Send message",
  },
  className = "",
}: ContactSectionProps) {
  return (
    <>
      {/*archive header*/}
      <div className={`archive-header text-center mb-50 mt-30 ${className}`}>
        <h2 className="font-weight-bold">
          <span className="font-family-normal">{title}</span>
        </h2>
        <div className="breadcrumb font-small">
          <Link href="/">{breadcrumb.home}</Link>
          <span /> {breadcrumb.current}
        </div>
      </div>
      <div className="entry-wraper">
        <div className="mb-30">
          <p>
            We are <strong>{companyInfo.name}</strong> , {companyInfo.description}
          </p>
          <hr className="wp-block-separator is-style-dots" />
        </div>
        <div className="row">
          <div className="col-md-4 col-sm-12">
            <h3 className="mb-30">Contact</h3>
            <p>
              <strong>Address:</strong> {contactInfo.address} <br />
              <strong>Phone:</strong> {contactInfo.phone}
            </p>
            <p>If you would like to partner with Ultra at our next event, contact us at {contactInfo.generalEmail}.</p>
          </div>
          <div className="col-md-4 col-sm-12">
            <h3 className="mb-30">Advertise</h3>
            <p>Please contact us directly at {advertiseInfo.generalEmail}.</p>
            <p>{advertiseInfo.description}</p>
          </div>
          <div className="col-md-4 col-sm-12">
            <h3 className="mb-30">Event</h3>
            <p>{eventInfo.description}</p>
            <p>Please send request details to email {eventInfo.email}</p>
          </div>
        </div>
        <div className="bt-1 border-color-1 mt-30 mb-30" />
        <div className="row">
          <div className="col-lg-12 col-md-12">
            <h1 className="mb-30">Get in touch</h1>
            <ContactForm formConfig={formConfig} />
          </div>
        </div>
        <div className="single-social-share clearfix">
          <p className="text-uppercase">Share this post</p>
          <ul className="d-inline-block list-inline">
            {socialLinks.map((social, index) => (
              <li key={index} className="list-inline-item">
                <a className={`social-icon ${social.className} text-xs-center color-white`} target="_blank" href={social.href}>
                  <i className={social.icon} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-center mt-50">
          <span className="mb-15 text-muted">advertisement</span>
          <br />
          <a href={advertisement.href}>
            <Image className="d-inline border-radius-2" src={advertisement.image} alt={advertisement.alt} width={700} height={105} />
          </a>
        </p>
      </div>
    </>
  );
}
