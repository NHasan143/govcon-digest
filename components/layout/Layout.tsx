"use client";
import dynamic from "next/dynamic";
import type { FC } from "react";
import BackToTop from "@/components/elements/BackToTop";
import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import ScrollProgress from "@/components/elements/ScrollProgress";
import PerformanceMonitor from "@/components/elements/PerformanceMonitor";

interface BootstrapComponentsProps { }

const BootstrapComponents = dynamic<BootstrapComponentsProps>(() => import("@/util/useBootstrap"), {
  ssr: false,
  loading: () => null,
}) as FC<BootstrapComponentsProps>;

interface LayoutProps {
  children?: React.ReactNode;
  margin?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  showScrollProgress?: boolean;
  showBackToTop?: boolean;
  className?: string;
}

export default function Layout({
  children,
  margin = "",
  showHeader = true,
  showFooter = true,
  showScrollProgress = true,
  showBackToTop = true,
  className = ""
}: LayoutProps) {
  // No mounted guard here: returning null on the server would ship an empty
  // <body> (SEO disaster) and the deferred render breaks notFound()'s 404
  // status for every page in this tree.
  return (
    <>
      <div id="top" />
      {showScrollProgress && <ScrollProgress />}
      <BootstrapComponents />
      {showHeader && <Header />}
      <main className={`${margin} ${className}`}>
        <div className="container">{children}</div>
      </main>
      {showFooter && <Footer />}
      {showBackToTop && <BackToTop />}
      <PerformanceMonitor />
    </>
  );
}
