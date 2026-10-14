import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";

export function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero (around 300px)
      const scrolled = window.scrollY > 300;
      setHasScrolled(scrolled);
      
      // Hide near the bottom of the page (near footer)
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      setIsVisible(scrolled && !nearBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      initial={{ y: 100 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="bg-background/95 backdrop-blur-md border-t-2 border-primary px-4 py-3 safe-area-bottom">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">From £199 • Fixed prices</p>
            <p className="text-sm font-semibold truncate">Get your website live</p>
          </div>
          <Link
            to="/start"
            className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold"
          >
            Start
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
