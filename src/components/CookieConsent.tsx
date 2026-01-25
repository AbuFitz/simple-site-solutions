import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { Settings2 } from "lucide-react";

const CONSENT_KEY = "oss_cookie_consent";
type ConsentValue = "accepted" | "rejected";

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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
    setShowSettings(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed left-0 right-0 bottom-0 sm:left-6 sm:right-6 sm:bottom-6 z-[60] sm:max-w-4xl sm:mx-auto"
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
            
            <AnimatePresence mode="wait">
              {!showSettings ? (
                <motion.div
                  key="main"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10 p-5 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                      {/* Cookie icon */}
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xl sm:text-2xl" role="img" aria-label="cookie">🍪</span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-base sm:text-lg font-bold leading-tight text-black mb-1">
                          This website uses cookies
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                          We use essential cookies to make our site work. We'd also like to set optional cookies for analytics.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto sm:flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setConsent("accepted")}
                        className="inline-flex items-center justify-center rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-semibold bg-primary text-white hover:brightness-110 transition-all shadow-sm"
                      >
                        Accept and continue
                      </button>
                      <button
                        type="button"
                        onClick={() => setConsent("rejected")}
                        className="inline-flex items-center justify-center rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-semibold bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all"
                      >
                        Only necessary cookies
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowSettings(true)}
                        className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-gray-700 hover:text-black transition-colors underline underline-offset-2"
                        aria-label="Cookie settings"
                      >
                        <Settings2 className="w-4 h-4" />
                        Manage cookies
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10 p-5 sm:p-6"
                >
                  <div className="flex items-center gap-3 mb-4 sm:mb-5">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-xl sm:text-2xl" role="img" aria-label="cookie">🍪</span>
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-bold text-black">Cookie preferences</p>
                      <p className="text-xs sm:text-sm text-gray-600">Choose which cookies you want to accept</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-5 sm:mb-6">
                    {/* Essential cookies - always on */}
                    <div className="p-4 rounded-lg bg-gray-50 border-2 border-gray-200">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-bold text-black">Essential cookies</p>
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                              Always active
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            These cookies are necessary for the website to function and cannot be switched off.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Analytics - optional */}
                    <div className="p-4 rounded-lg bg-white border-2 border-gray-200">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-black mb-1">Analytics cookies</p>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            Help us understand how visitors interact with our website (currently not used).
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-xs font-medium">
                            Not used
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Marketing - optional */}
                    <div className="p-4 rounded-lg bg-white border-2 border-gray-200">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-black mb-1">Marketing cookies</p>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            Used to track visitors across websites for advertising purposes (currently not used).
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-xs font-medium">
                            Not used
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <button
                      type="button"
                      onClick={() => setConsent("accepted")}
                      className="flex-1 inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold bg-primary text-white hover:brightness-110 transition-all shadow-sm"
                    >
                      Accept all cookies
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsent("rejected")}
                      className="flex-1 inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all"
                    >
                      Only necessary
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSettings(false)}
                      className="sm:flex-initial inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold border-2 border-gray-300 text-gray-900 hover:bg-gray-50 transition-all"
                    >
                      Back
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-3">
                    <Link
                      to="/cookies"
                      className="text-xs sm:text-sm text-gray-600 hover:text-black transition-colors underline underline-offset-2"
                    >
                      Cookie Policy
                    </Link>
                    <Link
                      to="/privacy"
                      className="text-xs sm:text-sm text-gray-600 hover:text-black transition-colors underline underline-offset-2"
                    >
                      Privacy Policy
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
