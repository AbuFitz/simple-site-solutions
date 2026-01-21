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
          className="fixed left-3 right-3 sm:left-auto sm:right-6 bottom-20 sm:bottom-6 z-[60] sm:max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-live="polite"
          aria-label="Cookie notice"
        >
          <div className="border-2 border-border rounded-2xl sm:rounded-3xl bg-background/80 backdrop-blur-md p-4 sm:p-5 shadow-xl relative overflow-hidden">
            <DottedGrid className="opacity-20" spacing={20} />
            <div className="relative z-10 flex items-start gap-3 sm:gap-4">
              {/* Cookie emoji icon */}
              <div className="mt-0.5 shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-secondary/70 border border-border flex items-center justify-center">
                <span className="text-xl sm:text-2xl leading-none" role="img" aria-label="cookie">
                  🍪
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm sm:text-base font-semibold leading-snug">Cookies</p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1">
                  We use essential cookies only.{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </p>

                <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2">
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
                  <Link
                    to="/privacy#cookies"
                    className="text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                  >
                    Cookie settings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
