import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { X } from "lucide-react";

const CONSENT_KEY = "oss_cookie_consent";

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const existing = window.localStorage.getItem(CONSENT_KEY);
      if (!existing) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const acceptCookies = () => {
    try {
      window.localStorage.setItem(CONSENT_KEY, "accepted");
    } catch {
      // ignore
    }
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed left-0 right-0 bottom-0 sm:left-6 sm:right-6 sm:bottom-6 z-[60] sm:max-w-lg sm:mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-live="polite"
          aria-label="Cookie notice"
        >
          <div className="border-0 sm:border-2 border-border rounded-none sm:rounded-2xl bg-white shadow-2xl relative overflow-hidden">
            <DottedGrid className="opacity-5" spacing={18} />

            <div className="relative z-10 p-5 sm:p-6">
              {/* Close button */}
              <button
                type="button"
                onClick={acceptCookies}
                className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close cookie notice"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>

              <div className="flex items-start gap-3 sm:gap-4 pr-6">
                {/* Cookie icon */}
                <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-xl sm:text-2xl" role="img" aria-label="cookie">🍪</span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-base sm:text-lg font-bold leading-tight text-black mb-1">
                    Cookie notice
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                    We only use essential cookies to make our site work properly. We don't use any tracking, analytics, or marketing cookies.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <button
                      type="button"
                      onClick={acceptCookies}
                      className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold bg-primary text-white hover:brightness-110 transition-all shadow-sm"
                    >
                      Got it
                    </button>
                    <Link
                      to="/cookies"
                      className="inline-flex items-center justify-center text-xs sm:text-sm font-medium text-gray-600 hover:text-black transition-colors underline underline-offset-2"
                    >
                      Learn more
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
