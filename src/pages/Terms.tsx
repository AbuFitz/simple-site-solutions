import { Layout } from "@/components/layout/Layout";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { motion } from "framer-motion";

export default function Terms() {
  return (
    <Layout>
      <section className="pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20 relative">
        <DottedGrid className="opacity-30" spacing={32} />
        <div className="content-width relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bordered-section inline-block px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6">
              <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Legal
              </span>
            </div>
            <h1 className="text-headline mb-6 sm:mb-8">
              Terms of <span className="text-primary">Service</span>
            </h1>
            <p className="text-body-lg mb-8 sm:mb-12 max-w-2xl">
              The terms and conditions governing our web design services.
            </p>
          </motion.div>

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
                  We provide web design and development services as outlined in your selected package:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li><strong>Starter (£349):</strong> Up to 3 pages, 1 refinement round</li>
                  <li><strong>Core (£599):</strong> Up to 5 pages, 1-2 refinement rounds</li>
                  <li><strong>Growth (£899):</strong> Up to 6 pages, 2 refinement rounds</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">3. Payment Terms</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                  Payment terms vary by package:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li><strong>Starter:</strong> Full payment upfront before work begins</li>
                  <li><strong>Core & Growth:</strong> 50% deposit upfront, 50% before launch</li>
                </ul>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-3">
                  All prices are in GBP and inclusive of VAT where applicable.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">4. Refinements</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                  Included refinement rounds cover:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li>Text changes</li>
                  <li>Image swaps</li>
                  <li>Small layout tweaks</li>
                </ul>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-3">
                  Refinements do not include redesigns, changing project direction, or adding new pages/features. 
                  Additional refinement rounds are available at £95 per round.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">5. Timeline</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  We aim to deliver websites within 5-10 business days from receiving all required content and approval to proceed. 
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
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">8. Hosting (Optional)</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  If you opt for our hosting service (£15/month), we will host, secure, back up, and maintain your website. 
                  This includes SSL, updates, and minor fixes. Either party may terminate hosting with 30 days' notice.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">9. Updates & Changes</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                  Post-launch changes are available at the following rates:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li>Small text/image update: £30</li>
                  <li>New page: £85</li>
                  <li>Bigger changes: Quoted individually</li>
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
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">13. Contact</h2>
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
