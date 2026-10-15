import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Cookies() {
  return (
    <Layout>
      <Seo path="/cookies" />
      <section className="pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20 relative">
        <DottedGrid className="opacity-30" spacing={32} />
        <div className="content-width relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-headline mb-6 sm:mb-8">
              Cookie <span className="text-primary">Policy</span>
            </h1>
            <p className="text-body-lg mb-8 sm:mb-12 max-w-2xl">
              How we use cookies to improve your experience on our website.
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
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">1. What Are Cookies?</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Cookies are small text files that are placed on your device when you visit a website.
                  They are widely used to make websites work more efficiently and to provide information
                  to website owners. Cookies help us remember your preferences, understand how you use
                  our site, and improve your overall experience.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">2. How We Use Cookies</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                  OneSimpleSite uses cookies for the following purposes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li><strong>Essential functionality:</strong> To remember your cookie consent preferences</li>
                  <li><strong>Site performance:</strong> To ensure the website operates correctly</li>
                  <li><strong>User experience:</strong> To remember your preferences during your visit</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">3. Types of Cookies We Use</h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm sm:text-base font-semibold">Essential Cookies</h3>
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        Required
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-2">
                      These cookies are necessary for the website to function and cannot be switched off in our systems.
                    </p>
                    <div role="region" aria-label="Cookies and browser storage we use" tabIndex={0} className="relative overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 pr-4 font-medium">Cookie Name</th>
                            <th className="text-left py-2 pr-4 font-medium">Purpose</th>
                            <th className="text-left py-2 font-medium">Duration</th>
                          </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                          <tr className="border-b border-border/50">
                            <td className="py-2 pr-4 font-mono text-xs">oss_cookie_consent</td>
                            <td className="py-2 pr-4">Stores your cookie consent preference</td>
                            <td className="py-2">Persistent (localStorage)</td>
                          </tr>
                          <tr className="border-b border-border/50">
                            <td className="py-2 pr-4 font-mono text-xs">oss_brief_draft_v1</td>
                            <td className="py-2 pr-4">Keeps your project brief draft in this browser until you submit it</td>
                            <td className="py-2">Up to 7 days (localStorage)</td>
                          </tr>
                          <tr className="border-b border-border/50">
                            <td className="py-2 pr-4 font-mono text-xs">oss_preview_input</td>
                            <td className="py-2 pr-4">Carries your website preview details into the project brief</td>
                            <td className="py-2">Until you close the tab (sessionStorage)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm sm:text-base font-semibold">Analytics Cookies</h3>
                      <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-xs font-medium">
                        Not Currently Used
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      We do not currently use analytics cookies. If we implement analytics in the future,
                      we will update this policy and request your consent before setting any analytics cookies.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm sm:text-base font-semibold">Marketing Cookies</h3>
                      <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-xs font-medium">
                        Not Currently Used
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      We do not use marketing or advertising cookies. We do not track you across other
                      websites or share your data with advertisers.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">4. Third-Party Cookies</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Our website does not set third-party cookies. We do not embed content from social
                  media platforms or advertising networks that would place tracking cookies on your device.
                </p>
                <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  One exception to be aware of: our local area pages show a map loaded from openstreetmap.org (a community mapping project, not an advertising network), and if you use the website preview and enter a town or postcode, your browser looks it up with OpenStreetMap (nominatim.openstreetmap.org) or postcodes.io. Those services receive your IP address and, for the preview, the town or postcode you typed. We do not add any cookies for them.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">5. Managing Your Cookie Preferences</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                  You can manage your cookie preferences in the following ways:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li><strong>Cookie banner:</strong> Use our cookie consent banner to accept or reject optional cookies</li>
                  <li><strong>Browser settings:</strong> Configure your browser to block or delete cookies</li>
                  <li><strong>Clear storage:</strong> Clear your browser's localStorage to reset cookie preferences</li>
                </ul>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-3">
                  Please note that blocking essential cookies may affect the functionality of our website.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">6. Browser Cookie Settings</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                  You can control cookies through your browser settings. Here are links to instructions for common browsers:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li>
                    <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Google Chrome
                    </a>
                  </li>
                  <li>
                    <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Mozilla Firefox
                    </a>
                  </li>
                  <li>
                    <a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Safari
                    </a>
                  </li>
                  <li>
                    <a href="https://support.microsoft.com/en-gb/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Microsoft Edge
                    </a>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">7. Updates to This Policy</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect changes in our practices
                  or for legal, regulatory, or operational reasons. We encourage you to review this page
                  periodically for the latest information about our cookie practices.
                </p>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">8. More Information</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                  For more information about how we handle your personal data, please see our{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  If you have any questions about our use of cookies, please contact us at{" "}
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
