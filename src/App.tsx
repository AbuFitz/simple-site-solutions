import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SiteChrome } from "@/components/layout/Layout";
import Index from "./pages/Index";

const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Packages = lazy(() => import("./pages/Packages"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Start = lazy(() => import("./pages/Start"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Cookies = lazy(() => import("./pages/Cookies"));
const Contact = lazy(() => import("./pages/Contact"));
const Work = lazy(() => import("./pages/Work"));
const CaseStudy = lazy(() => import("./pages/CaseStudy"));
const Onboard = lazy(() => import("./pages/Onboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  // The hidden onboarding flow brings its own chrome
  const bare = location.pathname.startsWith("/onboard");

  return (
    <SiteChrome bare={bare}>
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <Suspense fallback={<div className="min-h-screen" aria-hidden="true" />}>
            <Routes location={location}>
              <Route path="/" element={<Index />} />
              <Route path="/work" element={<Work />} />
              <Route path="/work/:slug" element={<CaseStudy />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/start" element={<Start />} />
              <Route path="/about" element={<Navigate to="/work" replace />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services" element={<Navigate to="/packages" replace />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />
              {/* Hidden onboarding page - not in navigation */}
              <Route path="/onboard" element={<Onboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </SiteChrome>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
