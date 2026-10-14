import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CookieConsent } from "@/components/CookieConsent";

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
    <div className="page-container overflow-x-hidden">
      <a href="#main" className="skip-link">Skip to main content</a>
      <Navbar />
      <main id="main" tabIndex={-1}>{children}</main>
      <CookieConsent />
      <Footer />
    </div>
  );
}
