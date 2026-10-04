"use client";

import Link from "next/link";
import { useRef, useState, type CSSProperties } from "react";
import { PARENT_CATEGORIES } from "@/lib/categories";
import styles from "./MobileMenu.module.css";

type MenuItem = {
  label: string;
  href?: string;
  color?: string;
  submenu?: { label: string; href: string }[];
};

/* Mirrors the desktop nav: Latest, the seven sections (each expanding to its
   three subsections), then Subscribe. Built from the same registry so the two
   menus can never drift apart. */
const menuItems: MenuItem[] = [
  { label: "Latest", href: "/latest" },
  ...PARENT_CATEGORIES.map((category) => ({
    label: category.menuLabel ?? category.name,
    href: `/${category.slug}`,
    color: category.color,
    submenu: [
      { label: `All ${category.name}`, href: `/${category.slug}` },
      ...category.children.map((child) => ({
        label: child.name,
        href: `/${child.slug}`,
      })),
    ],
  })),
  { label: "Subscribe", href: "/subscribe" },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = () => { setIsOpen(false); setOpenSubmenu(null); };

  return (
    <div className={`d-lg-none ${styles.mobile}`} onKeyDown={(event) => {
      if (event.key === "Escape" && isOpen) { event.preventDefault(); close(); trigger.current?.focus(); }
    }}>
      <div className="container">
        <button ref={trigger} type="button" onClick={() => { if (isOpen) close(); else setIsOpen(true); }}
          className={styles.menuButton} aria-expanded={isOpen} aria-controls="mobile-sections">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d={isOpen ? "M6 6l12 12M6 18 18 6" : "M4 6h16M4 12h16M4 18h16"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {isOpen ? "Close menu" : "Sections"}
        </button>
        <nav id="mobile-sections" aria-label="Mobile navigation" hidden={!isOpen} className={styles.panel}>
          <ul className={styles.list}>
            {menuItems.map((item) => {
              const expanded = openSubmenu === item.label;
              const id = `mobile${item.href?.replaceAll("/", "-")}`;
              return (
                <li key={item.label} style={{ "--section-color": item.color ?? "var(--text-primary)" } as CSSProperties}>
                  <div className={styles.row}>
                    <Link href={item.href ?? "#"} onClick={close}>{item.label}</Link>
                    {item.submenu && <button type="button" onClick={() => setOpenSubmenu(expanded ? null : item.label)}
                      aria-expanded={expanded} aria-controls={id} aria-label={`${expanded ? "Close" : "Open"} ${item.label} topics`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d={expanded ? "M5 12h14" : "M5 12h14M12 5v14"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>}
                  </div>
                  {item.submenu && <ul id={id} className={styles.submenu} hidden={!expanded}>
                    {item.submenu.map((sub) => <li key={sub.href}><Link href={sub.href} onClick={close}>{sub.label}</Link></li>)}
                  </ul>}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
