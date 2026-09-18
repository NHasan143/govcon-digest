"use client";
import MobileMenu from "@/components/layout/MobileMenu";
import MainMenu from "@/components/layout/MainMenu";
import { useEffect, useState } from "react";
import SearchForm from "@/components/layout/SearchForm";
import Link from "next/link";
import Image from "next/image";
import { HeaderProps } from "@/types";
import styles from "@/components/layout/Header.module.css";
import { useBodyClass } from "@/hooks/useBodyClass";
import { SITE } from "@/lib/config";

interface HeaderState {
    scroll: boolean;
    isSidebar: boolean;
    isMobileMenu: boolean;
}

export default function Header({ variant = "default", showSearch = true, showSocialLinks = true, logo, menuItems }: HeaderProps = {}) {
    // scroll header
    const [scroll, setScroll] = useState<boolean>(false);
    useEffect(() => {
        const handleScroll = (): void => {
            const scrollCheck: boolean = window.scrollY > 100;
            setScroll(scrollCheck);
        };

        window.addEventListener("scroll", handleScroll);

        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    // Search form
    const [isSearch, setIsSearch] = useState<boolean>(false);
    const handleSearch = () => {
        setIsSearch(!isSearch);
    };
    useBodyClass("open-search-form", isSearch);

    return (
        <>
            {/* Masthead — logo centered, search on the left, Subscribe on the
                right. The tools live up here rather than in the navbar so the
                seven section names below get the full container width to
                themselves. Scrolls away while the navbar stays sticky. */}
            <div className="masthead container pt-20 pb-10">
                <div className="masthead-row d-flex align-items-center justify-content-between">
                    <div className="masthead-side d-none d-lg-flex align-items-center">
                        <button
                            type="button"
                            className="search search-icon search-btn"
                            onClick={handleSearch}
                            aria-label="Search"
                        >
                            <i className="ti-close" />
                            <i className="ti-search" />
                        </button>
                    </div>
                    <Link href="/" className="d-inline-block mx-auto">
                        <Image
                            src="/logo.png"
                            alt={`${SITE.name} logo`}
                            width={141}
                            height={90}
                            priority
                            style={{ objectFit: "contain", height: 90, width: "auto" }}
                        />
                    </Link>
                    <div className="masthead-side d-none d-lg-flex align-items-center justify-content-end">
                        <Link
                            href="/subscribe"
                            className="font-small font-weight-bold text-uppercase"
                            style={{
                                background: "#101010",
                                color: "#fff",
                                padding: "7px 18px",
                                borderRadius: 4,
                                lineHeight: 1.4,
                                whiteSpace: "nowrap",
                            }}
                        >
                            Subscribe
                        </Link>
                    </div>
                </div>
            </div>
            {/* Start Header */}
            <header className={`${styles.header} main-header header-style-1 font-heading header-sticky ${scroll ? "sticky-bar" : ""}`}>
                <MobileMenu />
                <div className="container position-relative">
                    {/* Centered menu; search + subscribe pinned to the right */}
                    <div className="main-nav d-none d-lg-block text-center">
                        <nav className="text-uppercase d-inline-block">
                            <MainMenu />
                        </nav>
                    </div>
                    <div className="clearfix" />
                    <div className="divider-2" />
                </div>
            </header>
            <SearchForm />
        </>
    );
}
