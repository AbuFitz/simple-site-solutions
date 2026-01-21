import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { DottedGrid } from "@/components/ui/DottedGrid";

const CONSENT_KEY = "oss_cookie_consent";
type ConsentValue = "accepted" | "rejected";

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const existing = window.localStorage.getItem(CONSENT_KEY) as ConsentValue | null;
      if (!existing) setOpen(true);
    } catch {
      // If storage is unavailable, still show the notice.
      setOpen(true);
    }
  }, []);

  const setConsent = (value: ConsentValue) => {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // ignore
    }
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed left-3 right-3 sm:left-auto sm:right-6 bottom-20 sm:bottom-6 z-[60] sm:max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-live="polite"
          aria-label="Cookie notice"
        >
          <div className="bordered-section bg-background/70 backdrop-blur p-4 sm:p-5 shadow-lg">
            <DottedGrid className="opacity-25" spacing={24} />
            <div className="relative z-10 flex items-start gap-3">
              <div className="mt-0.5 shrink-0 rounded-lg bg-secondary/60 border border-border px-2.5 py-2">
                <span className="text-lg leading-none" aria-hidden="true">
                  🍪
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-snug">Cookies</p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1">
                  We use essential cookies to make this site work. Learn more in our{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>

                <div className="mt-3 flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => setConsent("accepted")}
                    className="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs sm:text-sm font-semibold bg-primary text-primary-foreground border-2 border-primary hover:brightness-110 transition-all"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsent("rejected")}
                    className="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs sm:text-sm font-semibold bg-background text-foreground border-2 border-border hover:bg-secondary/60 transition-all"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
