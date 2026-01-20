import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight } from "lucide-react";

export function FloatingNudge() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session
    const dismissed = sessionStorage.getItem("nudge-dismissed");
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Show after 3 seconds of page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem("nudge-dismissed", "true");
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-sm"
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20 
          }}
        >
          <div className="relative bg-card border-2 border-primary rounded-2xl p-4 sm:p-5 shadow-2xl">
            {/* Decorative corner dots */}
            <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-primary/40" />
            <div className="absolute top-2 right-8 w-1.5 h-1.5 rounded-full bg-primary/40" />
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-primary/40" />
            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-primary/40" />
            
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="flex items-start gap-3 sm:gap-4">
              <motion.div 
                className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center"
                animate={{ 
                  rotate: [0, -10, 10, -10, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </motion.div>
              
              <div className="flex-1 min-w-0 pr-4">
                <h4 className="font-bold text-sm sm:text-base mb-1">
                  Limited Slots Available
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
                  We only take on <span className="text-primary font-medium">3 projects</span> per week to ensure quality.
                </p>
                <Link
                  to="/start"
                  onClick={handleDismiss}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline group"
                >
                  Secure your spot
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Animated border pulse */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-primary pointer-events-none"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
