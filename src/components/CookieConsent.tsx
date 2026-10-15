import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const CONSENT_KEY = "oss_cookie_consent";

/** One quiet line at the bottom edge. We only use essential storage, so this is a notice, not a choice. */
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
      // ignore
    }
    setOpen(false);
    window.dispatchEvent(new Event("oss-cookie-consent"));
  };

  useEffect(() => {
    document.body.classList.toggle("has-cookie", open);
    return () => document.body.classList.remove("has-cookie");
  }, [open]);

  if (!open) return null;
  return (
    <div className="oss-cookie" role="dialog" aria-live="polite" aria-label="Cookie notice">
      <p>
        Essential cookies only. No tracking, analytics or marketing. <Link to="/cookies">Details</Link>
      </p>
      <button type="button" onClick={accept} aria-label="Close cookie notice">
        Got it
      </button>
    </div>
  );
}
