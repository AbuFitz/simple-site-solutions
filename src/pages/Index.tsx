import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { Hero } from "@/components/sections/Hero";
import { WorkShowcase } from "@/components/sections/WorkShowcase";
import { WhyUs } from "@/components/sections/WhyUs";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { FitSection } from "@/components/sections/FitSection";
import { Finale } from "@/components/sections/Finale";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";

export default function Index() {
  return (
    <Layout>
      <Helmet>
        <link rel="canonical" href="https://onesimplesite.co.uk/" />
      </Helmet>
      <Hero />
      <WorkShowcase />
      <WhyUs />
      <ProcessSection />
      <PricingSection />
      <FitSection />
      <Finale />
      <StickyMobileCTA />
    </Layout>
  );
}
