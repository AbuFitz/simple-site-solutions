import { ReactNode } from "react";
import { SideNav } from "./SideNav";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen">
      {/* Background effects */}
      <div className="grid-overlay" />
      <div className="noise" />
      
      {/* Ambient orbs */}
      <div className="orb orb-electric w-[800px] h-[800px] -top-[400px] -right-[400px] animate-pulse-glow" />
      <div className="orb orb-violet w-[600px] h-[600px] top-1/2 -left-[300px] animate-pulse-glow delay-200" />
      <div className="orb orb-warm w-[500px] h-[500px] -bottom-[250px] right-1/4 animate-pulse-glow delay-400" />

      {/* Navigation */}
      <SideNav />

      {/* Main content */}
      <main className="relative z-10 lg:pl-20 pb-24 lg:pb-0">
        {children}
      </main>
    </div>
  );
}
