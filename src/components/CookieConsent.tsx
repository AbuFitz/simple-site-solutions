import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CONSENT_KEY = "oss_cookie_consent";

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(CONSENT_KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const accept = () => {
    try {
      window.localStorage.setItem(CONSENT_KEY, "accepted");
    } catch {
      /* storage unavailable: the notice simply closes for this visit */
    }
    setOpen(false);
  };

  if (!open) return null;
  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-xl rounded-3xl border border-border bg-card p-5 shadow-[0_20px_60px_-20px_rgb(0_0_0/0.35)] sm:inset-x-auto sm:bottom-5 sm:right-5 sm:mx-0"
    >
      <p className="font-display text-lg font-bold" style={{ letterSpacing: "-0.03em" }}>
        Cookie notice
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        We only use essential cookies to make our site work properly. We don&rsquo;t use any tracking, analytics, or marketing cookies.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button type="button" onClick={accept} className="btn-primary btn-md">
          Got it
        </button>
        <Link to="/cookies" className="link-line text-sm">
          Learn more
        </Link>
      </div>
    </div>
  );
}
