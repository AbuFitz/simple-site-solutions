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
          className="fixed left-3 right-3 sm:left-auto sm:right-6 bottom-20 sm:bottom-6 z-[60] sm:max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-live="polite"
          aria-label="Cookie notice"
        >
          <div className="border-2 border-border rounded-2xl sm:rounded-3xl bg-background/85 backdrop-blur-lg p-4 sm:p-5 shadow-2xl relative overflow-hidden">
            <DottedGrid className="opacity-15" spacing={18} />
            
            <AnimatePresence mode="wait">
              {!showSettings ? (
                <motion.div
                  key="main"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10"
                >
                  <div className="flex items-start gap-3">
                    {/* Cookie emoji - no background/border */}
                    <span className="text-2xl sm:text-3xl mt-0.5 shrink-0" role="img" aria-label="cookie">
                      🍪
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm sm:text-base font-bold leading-snug">We use cookies</p>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1">
                        Essential cookies only — no tracking or ads.
                      </p>

                      <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setConsent("accepted")}
                          className="grid place-items-center rounded-full px-4 h-8 text-xs sm:text-sm font-semibold bg-primary text-primary-foreground hover:brightness-110 transition-all"
                        >
                          <span className="translate-y-px">Accept</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setConsent("rejected")}
                          className="grid place-items-center rounded-full px-4 h-8 text-xs sm:text-sm font-semibold bg-secondary text-foreground hover:bg-secondary/80 transition-all"
                        >
                          <span className="translate-y-px">Reject</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowSettings(true)}
                          className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Cookie settings"
                        >
                          <Settings2 className="w-3 h-3" />
                          Settings
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg" role="img" aria-label="cookie">🍪</span>
                    <p className="text-sm sm:text-base font-bold">Cookie Settings</p>
                  </div>

                  <div className="space-y-3 mb-4">
                    {/* Essential cookies - always on */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border">
                      <div>
                        <p className="text-xs sm:text-sm font-semibold">Essential</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Required for site functionality</p>
                      </div>
                      <div className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                        Always on
                      </div>
                    </div>

                    {/* Analytics - we don't use */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Analytics</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground/70">We don't use analytics cookies</p>
                      </div>
                      <div className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-[10px] font-medium">
                        Not used
                      </div>
                    </div>

                    {/* Marketing - we don't use */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Marketing</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground/70">We don't use marketing cookies</p>
                      </div>
                      <div className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-[10px] font-medium">
                        Not used
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setConsent("accepted")}
                      className="flex-1 inline-flex items-center justify-center rounded-full px-4 py-2 text-xs sm:text-sm font-semibold bg-primary text-primary-foreground hover:brightness-110 transition-all"
                    >
                      Accept essentials
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSettings(false)}
                      className="inline-flex items-center justify-center rounded-full px-3 py-2 text-xs sm:text-sm font-semibold bg-secondary text-foreground hover:bg-secondary/80 transition-all"
                    >
                      Back
                    </button>
                  </div>

                  <Link
                    to="/privacy"
                    className="block text-center mt-3 text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
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
