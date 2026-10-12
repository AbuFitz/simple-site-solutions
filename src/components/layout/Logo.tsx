import { cn } from "@/lib/utils";

/** Three stacked slabs: the page being assembled. Top slab is the lit one. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("shrink-0", className)}>
      <rect x="3" y="20" width="26" height="7" rx="2.4" fill="currentColor" opacity="0.28" />
      <rect x="3" y="12.5" width="26" height="7" rx="2.4" fill="currentColor" opacity="0.55" />
      <rect x="3" y="5" width="26" height="7" rx="2.4" fill="hsl(var(--primary))" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-bold tracking-tight", className)}>
      one<span className="text-primary">simple</span>site
    </span>
  );
}
