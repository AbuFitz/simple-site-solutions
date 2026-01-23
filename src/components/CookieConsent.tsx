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
                  className="relative z-10 p-4 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Cookie emoji */}
                      <span className="text-2xl sm:text-3xl mt-0.5 shrink-0" role="img" aria-label="cookie">
                        🍪
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm sm:text-base font-bold leading-snug text-black">We use cookies</p>
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mt-1">
                          Essential cookies only — no tracking or ads.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto sm:flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setConsent("accepted")}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center rounded-full px-5 sm:px-6 h-10 sm:h-11 text-sm font-semibold leading-none bg-primary text-white hover:brightness-110 transition-all"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => setConsent("rejected")}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center rounded-full px-5 sm:px-6 h-10 sm:h-11 text-sm font-semibold leading-none bg-black text-white hover:bg-gray-800 transition-all"
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowSettings(true)}
                        className="hidden sm:inline-flex items-center gap-1 text-xs text-gray-600 hover:text-black transition-colors px-2"
                        aria-label="Cookie settings"
                      >
                        <Settings2 className="w-3 h-3" />
                        Settings
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
                  className="relative z-10 p-4 sm:p-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg" role="img" aria-label="cookie">🍪</span>
                    <p className="text-sm sm:text-base font-bold text-black">Cookie Settings</p>
                  </div>

                  <div className="space-y-3 mb-4">
                    {/* Essential cookies - always on */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-black">Essential</p>
                        <p className="text-[10px] sm:text-xs text-gray-600">Required for site functionality</p>
                      </div>
                      <div className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                        Always on
                      </div>
                    </div>

                    {/* Analytics - we don't use */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-gray-200">
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-600">Analytics</p>
                        <p className="text-[10px] sm:text-xs text-gray-500">We don't use analytics cookies</p>
                      </div>
                      <div className="px-2 py-1 rounded-full bg-gray-200 text-gray-600 text-[10px] font-medium">
                        Not used
                      </div>
                    </div>

                    {/* Marketing - we don't use */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-gray-200">
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-600">Marketing</p>
                        <p className="text-[10px] sm:text-xs text-gray-500">We don't use marketing cookies</p>
                      </div>
                      <div className="px-2 py-1 rounded-full bg-gray-200 text-gray-600 text-[10px] font-medium">
                        Not used
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setConsent("accepted")}
                      className="flex-1 inline-flex items-center justify-center rounded-full px-5 sm:px-6 h-10 sm:h-11 text-sm font-semibold bg-primary text-white hover:brightness-110 transition-all"
                    >
                      Accept essentials
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSettings(false)}
                      className="inline-flex items-center justify-center rounded-full px-5 sm:px-6 h-10 sm:h-11 text-sm font-semibold bg-black text-white hover:bg-gray-800 transition-all"
                    >
                      Back
                    </button>
                  </div>

                  <Link
                    to="/privacy"
                    className="block text-center mt-3 text-[10px] sm:text-xs text-gray-600 hover:text-black transition-colors underline underline-offset-2"
                  >
                    Read our Privacy Policy
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
