import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollProgress } from "./ScrollProgress";
import { CookieConsent } from "@/components/CookieConsent";

/** Persistent chrome around the routed page: nav, progress line, footer, consent. */
export function SiteChrome({ children, bare = false }: { children: ReactNode; bare?: boolean }) {
  if (bare) return <>{children}</>;
  return (
    <div className="page-container overflow-x-clip">
      <ScrollProgress />
      <Navbar />
      {children}
      <CookieConsent />
      <Footer />
    </div>
  );
}

/** Pages wrap their content in Layout; the chrome itself lives in SiteChrome (see App). */
export function Layout({ children }: { children: ReactNode }) {
  return <main id="main">{children}</main>;
}
