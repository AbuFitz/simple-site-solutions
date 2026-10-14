import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { LegalNotice } from "@/components/LegalNotice";
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-headline mb-6 sm:mb-8">
              Terms of <span className="text-primary">Service</span>
            </h1>
            <p className="text-body-lg mb-8 sm:mb-12 max-w-2xl">
              The terms and conditions governing our web design services.
            </p>
          </motion.div>

          <LegalNotice />

          <motion.div
            className="bordered-section p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
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
                  We provide web design and development services as outlined in your selected package. All packages include local SEO foundations and speed optimisation:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li><strong>The Starter (£199):</strong> Complete website, mobile-first design, local SEO, contact setup</li>
                  <li><strong>The Sorted (£399):</strong> Everything in The Starter, plus conversion-focused layout, trust positioning, refined messaging</li>
                  <li><strong>The Works (£649):</strong> Everything in The Sorted, plus deeper positioning, SEO-led structure, analytics</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">3. Payment Terms</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                  Payment terms vary by package:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li><strong>The Starter:</strong> Full payment upfront before work begins</li>
                  <li><strong>The Sorted & The Works:</strong> 50% deposit upfront, 50% before launch</li>
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
                  We estimate delivery at 5–7 days (The Starter), 7–10 days (The Sorted) and 10–14 days (The Works), counted from receiving all required content and approval to proceed. These are estimates, not guarantees. 
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
                  We offer one optional hosting plan:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li><strong>Keep It Running (£19/month):</strong> Hosting and domain, SSL, weekly backups, security monitoring and up to 5 content updates a month</li>
                </ul>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-3">
                  Either party may terminate with 30 days' notice.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">9. Updates & Changes</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                  Post-launch support:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li><strong>With Keep It Running:</strong> Up to 5 content updates a month, security monitoring and support</li>
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
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">13. Shop Orders</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                  These points apply to products bought from our <Link to="/shop" className="text-primary hover:underline">shop</Link>, in addition to the rest of these Terms.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li><strong>Made to your details:</strong> products are made with the business name, links and other details you enter. You are responsible for checking them before you pay. We make each product exactly as entered.</li>
                  <li><strong>Links and content:</strong> you must have the right to use any name, link or Wi-Fi network you give us. We check that a review link looks like a Google review link, but we do not check what a link leads to and are not responsible for it. Do not use our products to offer rewards for reviews or to discourage honest reviews.</li>
                  <li><strong>Delivery:</strong> UK mainland only. Posted products are made to order and we email a dispatch date after you order. We deliver within 30 days unless we agree otherwise with you.</li>
                  <li><strong>Cancellation and returns:</strong> goods made to your specification or clearly personalised are exempt from the 14-day cancellation right for consumers. This does not affect your legal rights if goods are faulty, damaged or not as described or ordered. Digital files are supplied by email once payment is confirmed.</li>
                  <li><strong>Prices and VAT:</strong> prices are in pounds sterling. VAT treatment is to be confirmed.</li>
                  <li><strong>Payment:</strong> online payment is taken by Stripe on its hosted page. We never see your card details. An order is accepted only when payment is confirmed.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">14. Privacy & Cookies</h2>
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
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">15. Contact</h2>
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
