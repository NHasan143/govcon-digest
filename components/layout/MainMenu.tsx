"use client";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export default function MainMenu() {
    return (
        <>
            {/*Desktop menu — category labels per the SEO & content requirements doc*/}
            <ul className="main-menu d-none d-lg-inline">
                <li>
                    <Link href="/latest">Latest</Link>
                </li>
                {CATEGORIES.map((category) => (
                    <li key={category.slug}>
                        <Link href={`/${category.slug}`}>{category.menuLabel}</Link>
                    </li>
                ))}
                <li>
                    <Link href="/stories">News</Link>
                </li>
                {/* Hover dropdown listing the categories (template CSS handles
                    li:hover > ul.sub-menu) */}
                <li className="menu-item-has-children">
                    <Link href="/topics">Topics</Link>
                    <ul className="sub-menu">
                        {CATEGORIES.map((category) => (
                            <li key={category.slug}>
                                <Link href={`/${category.slug}`}>{category.name}</Link>
                            </li>
                        ))}
                    </ul>
                </li>
            </ul>
        </>
    );
}
