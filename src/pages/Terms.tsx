import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <Layout>
      <Seo path="/terms" />
      <section className="pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20 relative">
        <DottedGrid className="opacity-30" spacing={32} />
        <div className="content-width relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-headline mb-6 sm:mb-8">
              Terms of <span className="text-primary">Service</span>
            </h1>
            <p className="text-body-lg mb-8 sm:mb-12 max-w-2xl">
              The terms and conditions governing our web design services.
            </p>
          </motion.div>


          <motion.div
            className="bordered-section p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <DottedGrid className="opacity-10" spacing={24} />
            <div className="relative z-10 space-y-6 sm:space-y-8">
              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">1. Agreement to Terms</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  By engaging OneSimpleSite for web design services, you agree to these Terms of Service. 
                  These terms constitute a legally binding agreement between you ("Client") and OneSimpleSite ("we", "us", "our").
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">2. Services</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                  We provide web design and development services as outlined in your selected package. Both fixed packages include design around your business, mobile-friendly layouts, website copywriting, an enquiry form, contact links, essential SEO, speed optimisation and cookie controls:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li><strong>Launch (£189):</strong> Up to 3 main website pages and 1 revision round before launch</li>
                  <li><strong>Growth (£489):</strong> Up to 10 main website pages (location pages count towards the allowance), content planning and navigation, one-off advanced on-page SEO, business email setup, basic analytics setup and 3 revision rounds before launch</li>
                  <li><strong>Enterprise (tailored quotation):</strong> Online shops, customer accounts, portals, advanced booking, CRM connections, payment integrations and larger websites. We agree the functionality, deliverables, ongoing costs and support arrangements before work starts</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">3. Payment Terms</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                  Payment terms vary by package:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li><strong>Launch:</strong> £189 before work begins</li>
                  <li><strong>Growth:</strong> £244.50 to begin and £244.50 before launch</li>
                  <li><strong>Enterprise:</strong> As set out in the quotation</li>
                </ul>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-3">
                  All prices are in GBP and inclusive of VAT where applicable.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">4. Changes & Support</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                  We're committed to making sure you're happy with your website. During the project, we welcome feedback and will work with you on:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li>Text changes and updates</li>
                  <li>Image adjustments</li>
                  <li>Layout tweaks</li>
                </ul>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-3">
                  Major changes such as complete redesigns or adding significant new features may be quoted separately.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">5. Timeline</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  We estimate delivery at 5 to 7 working days (Launch) and 10 to 14 working days (Growth), counted from receiving the agreed information, assets, account access and initial payment. Enterprise timings are agreed in the quotation. These are estimates, not guarantees. 
                  Delays caused by the Client (e.g., late content delivery, delayed feedback) may extend this timeline.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">6. Client Responsibilities</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                  The Client agrees to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li>Provide accurate business information and content</li>
                  <li>Respond to queries and provide feedback within reasonable timeframes</li>
                  <li>Ensure they have rights to any images, logos, or content provided</li>
                  <li>Complete payment as agreed</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">7. Intellectual Property</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Upon full payment, the Client receives ownership of the final website design and code. 
                  We retain the right to display the work in our portfolio unless otherwise agreed in writing.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">8. Hosting Plans (Optional)</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                  We offer one optional monthly plan alongside Launch and Growth:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li><strong>Hosting & Care (£29/month):</strong> Website hosting, SSL and one standard-priced domain; weekly backups and security monitoring; up to 3 small content changes a month (supplied text, images and contact details) within 30 minutes combined; support for the existing website; and Google Search Console setup, ownership verification and sitemap submission</li>
                </ul>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-3">
                  Either party may cancel with 30 days' notice. New pages, redesigns and additional functionality are quoted separately. Enterprise hosting and support are scoped with the quotation.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">9. Updates & Changes</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                  Post-launch support:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li><strong>With Hosting & Care:</strong> Up to 3 small content changes a month (up to 30 minutes combined), security monitoring and support</li>
                  <li><strong>One-off changes:</strong> Quoted individually based on scope</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">10. Limitation of Liability</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  To the maximum extent permitted by law, OneSimpleSite shall not be liable for any indirect, 
                  incidental, or consequential damages arising from the use of our services. 
                  Our total liability shall not exceed the amount paid for the services.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">11. Cancellation</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Deposits are non-refundable once work has commenced. 
                  If you need to cancel, please contact us as soon as possible. 
                  Refunds for work not yet started may be considered at our discretion.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">12. Governing Law</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of England and Wales. 
                  Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">13. Privacy & Cookies</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Your use of our website and services is also governed by our{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link to="/cookies" className="text-primary hover:underline">
                    Cookie Policy
                  </Link>
                  , which explain how we collect, use, and protect your personal information.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">14. Contact</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  For any questions regarding these Terms, please contact us at{" "}
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
