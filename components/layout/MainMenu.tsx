"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PARENT_CATEGORIES, getSection } from "@/lib/categories";
import styles from "./MainMenu.module.css";

function Arrow() {
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

/** Independent disclosure buttons preserve section links on every input type. */
export default function MainMenu() {
    const pathname = usePathname();
    const activeSection = getSection(pathname.split("/")[1] ?? "")?.slug;
    const [openSlug, setOpenSlug] = useState<string | null>(null);
    const root = useRef<HTMLDivElement>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
    const cancelClose = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        closeTimer.current = null;
    };
    const close = () => { cancelClose(); setOpenSlug(null); };

    useEffect(() => { setOpenSlug(null); }, [pathname]);
    useEffect(() => {
        const outside = (event: PointerEvent) => {
            if (!root.current?.contains(event.target as Node)) setOpenSlug(null);
        };
        const resize = () => { if (window.innerWidth < 992) setOpenSlug(null); };
        document.addEventListener("pointerdown", outside);
        window.addEventListener("resize", resize);
        return () => {
            document.removeEventListener("pointerdown", outside);
            window.removeEventListener("resize", resize);
            if (closeTimer.current) clearTimeout(closeTimer.current);
        };
    }, []);

    return (
        <div ref={root} className={styles.navigation}
            onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) close(); }}
            onKeyDown={(event) => {
                if (event.key === "Escape" && openSlug) {
                    event.preventDefault(); event.stopPropagation();
                    const trigger = triggers.current[openSlug];
                    close(); trigger?.focus();
                }
            }}>
            <ul className={styles.menu}>
                <li className={styles.latest}>
                    <Link href="/latest" className={styles.sectionLink} aria-current={pathname === "/latest" ? "page" : undefined}
                        onPointerEnter={(event) => { if (event.pointerType === "mouse") close(); }} onClick={close}>Latest</Link>
                </li>
                {PARENT_CATEGORIES.map((category) => {
                    const isOpen = openSlug === category.slug;
                    return (
                        <li key={category.slug} className={styles.item}
                            style={{ "--section-color": category.color } as CSSProperties}
                            data-open={isOpen} data-active={activeSection === category.slug}
                            onPointerEnter={(event) => {
                                if (event.pointerType !== "mouse") return;
                                cancelClose(); setOpenSlug(category.slug);
                            }}
                            onPointerLeave={(event) => {
                                if (event.pointerType !== "mouse") return;
                                const item = event.currentTarget;
                                cancelClose();
                                closeTimer.current = setTimeout(() => {
                                    if (!item.contains(document.activeElement)) setOpenSlug(null);
                                }, 180);
                            }}>
                            <div className={styles.section}>
                                <button type="button" className={styles.sectionLink}
                                    ref={(element) => { triggers.current[category.slug] = element; }}
                                    aria-label={`${isOpen ? "Close" : "Open"} ${category.name} menu`}
                                    aria-expanded={isOpen} aria-controls={`nav-${category.slug}`}
                                    onClick={() => { cancelClose(); setOpenSlug(isOpen ? null : category.slug); }}
                                    onKeyDown={(event) => {
                                        if (event.key === "ArrowDown") {
                                            event.preventDefault(); cancelClose(); setOpenSlug(category.slug);
                                            requestAnimationFrame(() => document.getElementById(`nav-${category.slug}`)?.querySelector<HTMLAnchorElement>("a")?.focus());
                                        }
                                    }}>
                                    {category.menuLabel ?? category.name}
                                </button>
                            </div>
                            <div id={`nav-${category.slug}`} className={styles.panel} hidden={!isOpen}>
                                <div className={styles.intro}>
                                    <h2>{category.name}</h2>
                                    <p>{category.blurb}</p>
                                    <Link href={`/${category.slug}`} className={styles.allLink} onClick={close}>View all {category.menuLabel ?? category.name}<Arrow /></Link>
                                </div>
                                <ul className={styles.topics} aria-label={`${category.name} topics`}>
                                    {category.children.map((child) => (
                                        <li key={child.slug}>
                                            <Link href={`/${child.slug}`} onClick={close} aria-current={pathname === `/${child.slug}` ? "page" : undefined}>
                                                <span>{child.name}</span><Arrow />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
