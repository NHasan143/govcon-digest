"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PARENT_CATEGORIES } from "@/lib/categories";
import styles from "./TopicsDirectory.module.css";

function Arrow({ className }: { className?: string }) {
    return <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function TopicsDirectory() {
    const [query, setQuery] = useState("");
    const search = useRef<HTMLInputElement>(null);
    const grid = useRef<HTMLDivElement>(null);
    const term = query.trim().toLocaleLowerCase();
    const categories = PARENT_CATEGORIES.filter((category) =>
        [category.name, category.menuLabel, category.blurb, ...category.children.map((child) => child.name)]
            .some((text) => text?.toLocaleLowerCase().includes(term)),
    );
    const visibleKey = categories.map((category) => category.slug).join(",");

    useEffect(() => {
        let disposed = false;
        let cleanup: (() => void) | undefined;
        // Keep the directory readable before hydration, and load motion only
        // on this route. MatchMedia owns animations and preference changes.
        import("gsap").then(({ gsap }) => {
            if (disposed || !grid.current) return;
            const media = gsap.matchMedia(grid.current);
            media.add({ all: "all", reduced: "(prefers-reduced-motion: reduce)", hover: "(hover: hover) and (pointer: fine)" }, (context) => {
                const reduced = Boolean(context.conditions?.reduced);
                const hover = Boolean(context.conditions?.hover);
                const cards = [...grid.current!.querySelectorAll<HTMLElement>("[data-topic-card]")];
                const removers: (() => void)[] = [];
                if (!reduced) {
                    gsap.fromTo(cards.map((card) => card.querySelector("[data-rule]")),
                        { scaleX: 0.12 }, { scaleX: 1, duration: 0.48, stagger: 0.035, ease: "power3.out", clearProps: "transform" });
                }
                cards.forEach((card) => {
                    const wash = card.querySelector("[data-wash]");
                    const arrow = card.querySelector("[data-section-arrow]");
                    const timeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out", duration: reduced ? 0 : 0.3 } })
                        .fromTo(wash, { clipPath: "inset(0 100% 0 0)", opacity: 0 }, { clipPath: "inset(0 0% 0 0)", opacity: 1 }, 0)
                        .to(arrow, { rotate: reduced ? 0 : -45 }, 0);
                    const activate = () => timeline.play();
                    const deactivate = () => { if (!card.contains(document.activeElement) && !card.matches(":hover")) timeline.reverse(); };
                    const focusOut = (event: FocusEvent) => {
                        if (!card.contains(event.relatedTarget as Node | null) && (!hover || !card.matches(":hover"))) timeline.reverse();
                    };
                    if (hover) {
                        card.addEventListener("pointerenter", activate);
                        card.addEventListener("pointerleave", deactivate);
                    }
                    card.addEventListener("focusin", activate);
                    card.addEventListener("focusout", focusOut);
                    removers.push(() => {
                        card.removeEventListener("pointerenter", activate);
                        card.removeEventListener("pointerleave", deactivate);
                        card.removeEventListener("focusin", activate);
                        card.removeEventListener("focusout", focusOut);
                    });
                });
                return () => removers.forEach((remove) => remove());
            });
            cleanup = () => media.revert();
        }).catch(() => { /* Navigation and CSS feedback remain available if motion cannot load. */ });
        return () => { disposed = true; cleanup?.(); };
    }, [visibleKey]);

    return (
        <div className={styles.page}>
            <div className={styles.introduction}>
                <h1>Topics</h1>
                <p>Explore the business of government, from contract awards to the people shaping the federal market.</p>
            </div>
            <div className={styles.tools}>
                <div className={styles.search}>
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.5" /><path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    <label className="visually-hidden" htmlFor="topic-search">Search sections and topics</label>
                    <input ref={search} id="topic-search" type="search" value={query} maxLength={120}
                        placeholder="Find a section or topic" onChange={(event) => setQuery(event.target.value)} aria-controls="topic-directory" />
                    {query && <button type="button" aria-label="Clear topic search" onClick={() => { setQuery(""); search.current?.focus(); }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </button>}
                </div>
                <p role="status" aria-live="polite" aria-atomic="true" className={styles.count}>
                    {categories.length} {categories.length === 1 ? "section" : "sections"}<span aria-hidden="true"> / </span><span className="visually-hidden">and </span>{categories.reduce((sum, category) => sum + category.children.length, 0)} topics
                </p>
            </div>
            <div id="topic-directory" ref={grid} className={styles.grid} data-filtered={Boolean(term)} data-count={categories.length}>
                {categories.map((category) => {
                    const featured = category.slug === "government-contracting" || category.slug === "defense";
                    return (
                        <article key={category.slug} data-topic-card data-category={category.slug} data-featured={featured}
                            className={styles.card} style={{ "--section-color": category.color } as CSSProperties} aria-labelledby={`topic-${category.slug}`}>
                            <div data-wash className={styles.wash} aria-hidden="true" />
                            <div className={styles.content}>
                                <h2 id={`topic-${category.slug}`}>
                                    <Link href={`/${category.slug}`} className={styles.sectionLink}>
                                        <span>{category.name}</span><span data-section-arrow className={styles.sectionArrow}><Arrow /></span>
                                    </Link>
                                </h2>
                                <p className={styles.description}>{category.blurb}</p>
                                <div data-rule className={styles.rule} aria-hidden="true" />
                                <ul className={styles.topics} aria-label={`${category.name} topics`}>
                                    {category.children.map((child) => <li key={child.slug}>
                                        <Link href={`/${child.slug}`}><span>{child.name}</span><Arrow /></Link>
                                    </li>)}
                                </ul>
                            </div>
                        </article>
                    );
                })}
            </div>
            {categories.length === 0 && <div className={styles.empty}>
                <h2>No topics match “{query.trim()}”</h2>
                <p>Try a section name, such as Defense, or a topic, such as Federal AI.</p>
                <button type="button" onClick={() => { setQuery(""); search.current?.focus(); }}>Show all topics<Arrow /></button>
            </div>}
        </div>
    );
}
