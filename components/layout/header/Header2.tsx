"use client";
import MobileMenu from "@/components/layout/MobileMenu";
import OffcanvasSidebar from "@/components/layout/OffcanvasSidebar";
import { useEffect, useState } from "react";
import SearchForm from "@/components/layout/SearchForm";
import MainMenu2 from "@/components/layout/MainMenu2";
import Link from "next/link";
import { useBodyClass } from "@/hooks/useBodyClass";
import { SITE } from "@/lib/config";

export default function Header2() {
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
    // Offcanvas sidebar
    const [isSidebar, setIsSidebar] = useState<boolean>(false);
    const handleSidebar = () => {
        setIsSidebar(!isSidebar);
    };
    useBodyClass("canvas-opened", isSidebar);

    // Search form
    const [isSearch, setIsSearch] = useState<boolean>(false);
    const handleSearch = () => {
        setIsSearch(!isSearch);
    };
    useBodyClass("open-search-form", isSearch);

    const { addClass, removeClass } = useBodyClass();

    const handleCanvasToggle = () => {
        addClass("canvas-opened");
    };

    const handleSearchToggle = () => {
        addClass("open-search-form");
    };

    return (
        <>
            <OffcanvasSidebar handleSidebar={handleSidebar} leftSidebar={true} />
            <header className={`main-header header-style-2 header-sticky ${scroll ? "sticky-bar" : ""}`}>
                <MobileMenu />
                <div className="container pt-30 pb-30 position-relative text-center header-top">
                    {/*Header tools*/}
                    <div className="header-tools position-absolute position-absolute-center">
                        <ul className="header-social-network d-inline-block list-inline mr-10">
                            <li className="list-inline-item">
                                <a className="social-icon facebook-icon text-xs-center color-grey" target="_blank" href="#">
                                    <i className="ti-facebook" />
                                </a>
                            </li>
                            <li className="list-inline-item">
                                <a className="social-icon twitter-icon text-xs-center color-grey" target="_blank" href="#">
                                    <i className="ti-twitter" />
                                </a>
                            </li>
                        </ul>
                        <button type="submit" className="search search-icon search-btn mr-15" onClick={handleSearch}>
                            <i className="ti-close" />
                            <i className="ti-search" />
                        </button>
                        <div className="off-canvas-toggle-cover d-inline-block">
                            <div className="off-canvas-toggle hidden d-inline-block" id="off-canvas-toggle" onClick={handleSidebar}>
                                <span />
                                <p className="font-small d-none d-lg-inline font-weight-bold offcanvas-more-text">MORE</p>
                            </div>
                        </div>
                    </div>
                    {/*Header logo*/}
                    <div className="logo-text">
                        <h1 className="logo text-uppercase d-md-inline d-none">
                            <Link href="/">{SITE.name}.</Link>
                        </h1>
                        <h1 className="logo logo-mobile text-uppercase d-inline d-md-none">
                            <Link href="/">{SITE.initials}.</Link>
                        </h1>
                        <p className="head-line font-heading text-muted d-none d-lg-block">{SITE.tagline}</p>
                    </div>
                    {/*Header right*/}
                    <div className="position-absolute-center font-small d-none d-lg-block position-absolute position-right mr-10">
                        <ul className="list-inline text-end">
                            <li className="list-inline-item mr-15">
                                <Link href="/login">
                                    <i className="ti-user font-x-small mr-5" />
                                    Login / Register
                                </Link>
                            </li>
                            <li className="list-inline-item dropdown">
                                <a className="dropdown-toggle" data-bs-toggle="dropdown" href="#">
                                    <i className="ti-world font-x-small mr-5" />
                                    Lang <span className="caret" />
                                </a>
                                <ul className="dropdown-menu dropdown-menu-language dropdown-menu-right border-0 font-small text-end">
                                    <li>
                                        <a href="#">English</a>
                                    </li>
                                    <li>
                                        <a href="#">Français</a>
                                    </li>
                                    <li>
                                        <a href="#">Deutsch</a>
                                    </li>
                                    <li>
                                        <a href="#">РУССКИЙ</a>
                                    </li>
                                    <li>
                                        <a href="#">中文</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="main-navigation text-center text-uppercase font-heading">
                    <div className="container">
                        <div className="horizontal-divider-black" />
                    </div>
                    <div className="main-nav d-none d-lg-block">
                        <nav>
                            <MainMenu2 />
                        </nav>
                    </div>
                </div>
                <>
                    <div className="container">
                        <div className="horizontal-divider-black mb-1px" />
                    </div>
                    <div className="container">
                        <div className="horizontal-divider-black" />
                    </div>
                </>
            </header>
            <SearchForm />
        </>
    );
}
