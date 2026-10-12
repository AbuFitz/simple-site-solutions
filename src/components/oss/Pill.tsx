import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

interface PillProps {
  children: ReactNode;
  to?: string;
  href?: string;
  variant?: "ink" | "light" | "outline";
  className?: string;
  external?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}

/** Compact pill with a connected arrow circle. */
export function Pill({ children, to, href, variant = "ink", className = "", external, type, onClick, disabled }: PillProps) {
  const cls = `pill ${variant === "light" ? "pill-light" : variant === "outline" ? "pill-outline" : ""} ${className}`;
  const inner = (
    <>
      <span className="pill-label">{children}</span>
      <span className="pill-dot" aria-hidden="true">
        <ArrowUpRight className="h-5 w-5" strokeWidth={2.25} />
      </span>
    </>
  );
  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  if (href)
    return (
      <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {inner}
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  return (
    <button type={type ?? "button"} className={cls} onClick={onClick} disabled={disabled}>
      {inner}
    </button>
  );
}
