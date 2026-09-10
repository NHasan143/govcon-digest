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
            {/* Masthead — logo centered above the navbar, Semafor-style.
                Scrolls away while the navbar below stays sticky. */}
            <div className="masthead text-center pt-20 pb-10">
                <Link href="/" className="d-inline-block">
                    <Image
                        src="/logo.png"
                        alt={`${SITE.name} logo`}
                        width={141}
                        height={90}
                        priority
                        style={{ objectFit: "contain", height: 90, width: "auto" }}
                    />
                </Link>
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
                    <div className="header-tools position-absolute top-50 translate-middle-y d-none d-lg-flex align-items-center" style={{ right: 12 }}>
                        <button type="submit" className="search search-icon search-btn mr-15" onClick={handleSearch}>
                            <i className="ti-close" />
                            <i className="ti-search" />
                        </button>
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
                    <div className="clearfix" />
                    <div className="divider-2" />
                </div>
            </header>
            <SearchForm />
        </>
    );
}
