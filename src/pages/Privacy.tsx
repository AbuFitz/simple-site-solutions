import { Layout } from "@/components/layout/Layout";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <Layout>
      <section className="pt-12 pb-24 md:pt-20 md:pb-36 relative">
        <DottedGrid className="opacity-30" spacing={32} />
        <div className="content-width relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="t-display mb-8" style={{ fontSize: "clamp(2.7rem, 7vw, 5.5rem)" }}>
              Privacy <span className="text-primary">Policy</span>
            </h1>
            <p className="text-body-lg mb-8 sm:mb-12 max-w-2xl">
              How we collect, use, and protect your personal information.
            </p>
          </motion.div>

          <motion.div
            className="max-w-3xl space-y-8 lg:ml-[25%]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <DottedGrid className="opacity-10" spacing={24} />
            <div className="relative z-10 space-y-6 sm:space-y-8">
              <section>
                <h2 className="font-display text-2xl font-bold mb-3">1. Who We Are</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  OneSimpleSite ("we", "our", "us") is a UK-based web design service for local businesses. 
                  We are committed to protecting your privacy and handling your data in an open and transparent manner.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold mb-3">2. Information We Collect</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                  We collect information you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li>Name and contact details (email, phone number)</li>
                  <li>Business name and industry</li>
                  <li>Existing website URL (if applicable)</li>
                  <li>Project requirements and preferences</li>
                  <li>Payment information (processed securely via third-party providers)</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold mb-3">3. How We Use Your Information</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Communicate with you about your project</li>
                  <li>Process payments and send invoices</li>
                  <li>Send you updates about our services (with your consent)</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold mb-3">4. Data Sharing</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  We do not sell, trade, or rent your personal information to third parties. 
                  We may share information with trusted service providers who assist us in operating our business 
                  (e.g., payment processors, hosting providers), subject to confidentiality agreements.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold mb-3">5. Data Retention</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  We retain your personal information for as long as necessary to fulfil the purposes for which 
                  it was collected, including to satisfy legal, accounting, or reporting requirements. 
                  Typically, we retain project data for 6 years after the completion of a project.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold mb-3">6. Your Rights</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                  Under UK GDPR, you have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li>Access the personal data we hold about you</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to processing of your data</li>
                  <li>Request restriction of processing</li>
                  <li>Data portability</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold mb-3">7. Cookies</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                  Our website uses essential cookies to ensure proper functionality.
                  We do not use tracking or advertising cookies.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  For detailed information about the cookies we use and how to manage them,
                  please see our{" "}
                  <Link to="/cookies" className="text-primary hover:underline">
                    Cookie Policy
                  </Link>
                  .
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold mb-3">8. Contact Us</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy or wish to exercise your rights,
                  please contact us at{" "}
                  <a href="mailto:hello@onesimplesite.co.uk" className="text-primary hover:underline">
                    hello@onesimplesite.co.uk
                  </a>
                </p>
              </section>

              <section className="pt-4 border-t border-border">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Last updated: January 2026
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
