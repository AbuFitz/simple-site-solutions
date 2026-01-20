import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
  showFooterCTA?: boolean;
}

export function Layout({ children, showFooterCTA = true }: LayoutProps) {
  return (
    <div className="page-container">
      <Navbar />
      <main>{children}</main>
      <Footer showCTA={showFooterCTA} />
    </div>
  );
}
