import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="page-container">
      <Navbar />
      <main className="pt-20 md:pt-24">{children}</main>
      <Footer />
    </div>
  );
}
