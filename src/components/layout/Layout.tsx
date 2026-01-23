import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { DottedGrid } from "@/components/ui/DottedGrid";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="page-container overflow-x-hidden relative">
      {/* Global grid background */}
      <DottedGrid className="fixed inset-0 opacity-40 pointer-events-none" spacing={24} />

      <div className="relative z-10">
        <Navbar />
        <main>{children}</main>
        <CookieConsent />
        <Footer />
      </div>
    </div>
  );
}
