"use client";

import Link from "next/link";
import { useState } from "react";
import { PARENT_CATEGORIES } from "@/lib/categories";

type MenuItem = {
  label: string;
  href?: string;
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
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]));
  };

  return (
    <div className="mobile_menu d-lg-none">
      <div className="slicknav_menu">
        <div className={`container ${isOpen ? "slicknav_collapsed" : "slicknav_open"}`}>
          <button onClick={toggleMenu} className="slicknav_btn slicknav_collapsed" aria-expanded={isOpen} aria-label="Toggle navigation">
            <span className="slicknav_menutxt">MENU</span>
            <span className="slicknav_icon">
              {isOpen ? (
                <>
                  <i className="ti-close mr-5"></i>
                </>
              ) : (
                <>
                  <i className="ti-view-grid font-small mr-5"></i>
                  <span className="menu-text">Menu</span>
                </>
              )}
            </span>
          </button>
        </div>

        {isOpen && (
          <ul className="slicknav_nav">
            {menuItems.map((item) => (
              <li key={item.label} className={`slicknav_parent ${openSubmenus.includes(item.label) ? "slicknav_open" : "slicknav_collapsed"}`}>
                {item.submenu ? (
                  <>
                    {/* The label navigates to the section hub; the +/- control
                        expands the subsections without leaving the page. */}
                    <span className="slicknav_item slicknav_row d-flex align-items-center justify-content-between">
                      <Link href={item.href ?? "#"} onClick={() => setIsOpen(false)}>
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleSubmenu(item.label)}
                        aria-expanded={openSubmenus.includes(item.label)}
                        aria-label={`Toggle ${item.label} subsections`}
                        className="slicknav_arrow border-0 bg-transparent"
                      >
                        {openSubmenus.includes(item.label) ? "−" : "+"}
                      </button>
                    </span>
                    {openSubmenus.includes(item.label) && (
                      <ul className="sub-menu text-muted font-small">
                        {item.submenu.map((sub) => (
                          <li key={sub.href} className="py-1">
                            <Link href={sub.href} onClick={() => setIsOpen(false)}>
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link href={item.href ?? "#"} onClick={() => setIsOpen(false)}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
