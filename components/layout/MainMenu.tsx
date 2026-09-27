"use client";
import Link from "next/link";
import { PARENT_CATEGORIES } from "@/lib/categories";

/* Desktop nav: Latest + the seven sections, each opening its three
   subsections on hover. The dropdown is the template's `ul.sub-menu`
   (CSS-only, `li:hover > ul.sub-menu`); `.govcon-nav` in globals.css tightens
   the spacing so seven full section names fit on one row. */
export default function MainMenu() {
    return (
        <ul className="main-menu govcon-nav d-none d-lg-inline">
            <li>
                <Link href="/latest">Latest</Link>
            </li>
            {PARENT_CATEGORIES.map((category) => (
                <li key={category.slug} className="menu-item-has-children">
                    <Link href={`/${category.slug}`}>{category.menuLabel ?? category.name}</Link>
                    <ul className="sub-menu">
                        {category.children.map((child) => (
                            <li key={child.slug}>
                                <Link href={`/${child.slug}`}>{child.name}</Link>
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    );
}
