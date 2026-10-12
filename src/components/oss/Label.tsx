import { ReactNode } from "react";

export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`t-label ${className}`}>{children}</p>;
}
