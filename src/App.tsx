import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Packages = lazy(() => import("./pages/Packages"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Start = lazy(() => import("./pages/Start"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Cookies = lazy(() => import("./pages/Cookies"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Work = lazy(() => import("./pages/Work"));
const WorkDetail = lazy(() => import("./pages/WorkDetail"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const CheckoutCancel = lazy(() => import("./pages/CheckoutCancel"));
const Onboard = lazy(() => import("./pages/Onboard"));
const Preview = lazy(() => import("./pages/Preview"));
const DevTemplate = import.meta.env.DEV ? lazy(() => import("./pages/DevTemplate")) : null;
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen bg-background" aria-hidden="true" />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/start" element={<Start />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<WorkDetail />} />
          <Route path="/services" element={<Navigate to="/packages" replace />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/cancel" element={<CheckoutCancel />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          {/* Hidden onboarding page - not in navigation */}
          <Route path="/onboard" element={<Onboard />} />
          {DevTemplate && <Route path="/__tpl" element={<DevTemplate />} />}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
