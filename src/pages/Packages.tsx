import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { CTASection } from "@/components/CTASection";
import { motion } from "framer-motion";
import { Check, X, ArrowUpRight, Globe, Mail, Server, Sparkles } from "lucide-react";

const packages = [
  {
    id: "starter",
    name: "The Starter",
    price: "£199",
    description: "Everything you need to get online properly. Clean, professional, done.",
    features: [
      "Up to 3 pages (or 1 scrollable landing page)",
      "Professional copywriting for all pages",
      "Mobile-first responsive design",
      "Contact form with email notifications",
      "Click-to-call & WhatsApp buttons",
      "Social media links (header & footer)",
      "Google Maps embed",
      "Basic SEO (titles, meta, headings)",
      "Cookie notice + privacy policy page",
      "SSL certificate included",
      "Speed optimised",
      "1 round of revisions",
    ],
    delivery: "5–7 working days",
    payment: "Full amount upfront",
    popular: false,
  },
  {
    id: "sorted",
    name: "The Sorted",
    price: "£399",
    description: "Our most popular. Built for businesses that want to look established and win trust.",
    features: [
      "Everything in The Starter, plus:",
      "Up to 6 pages",
      "Conversion-focused layout with clear CTAs",
      "Reviews/testimonials section",
      "Trust signals (accreditations, guarantees)",
      "Service hierarchy (organised service pages)",
      "Branded email templates (500/month)",
      "Booking system (1 type via Cal.com)",
      "Full on-page SEO (keywords, internal links)",
      "Custom email signature design",
      "Free domain (first year)",
      "Business email setup included",
      "2 rounds of revisions",
    ],
    delivery: "7–10 working days",
    payment: "50% upfront, 50% on completion",
    popular: true,
  },
  {
    id: "works",
    name: "The Works",
    price: "£649",
    description: "For businesses investing seriously in standing out and scaling.",
    features: [
      "Everything in The Sorted, plus:",
      "Up to 10 pages",
      "SEO-led site architecture",
      "Location/area pages for local SEO",
      "Blog section (styled + 1 starter post)",
      "Google Analytics & Search Console setup",
      "Full email template suite (3,000/month)",
      "Advanced booking (multiple types)",
      "Full legal pages (T&Cs, GDPR, cookies)",
      "Automated appointment reminders",
      "Free domain (first year)",
      "3 rounds of revisions",
    ],
    delivery: "10–14 working days",
    payment: "50% upfront, 50% on completion",
    popular: false,
  },
];

const comparisonFeatures = [
  { name: "Pages", starter: "Up to 3", sorted: "Up to 6", works: "Up to 10" },
  { name: "Professional Copywriting", starter: true, sorted: true, works: true },
  { name: "Mobile-First Design", starter: true, sorted: true, works: true },
  { name: "Contact Form", starter: true, sorted: true, works: true },
  { name: "Click-to-Call & WhatsApp", starter: true, sorted: true, works: true },
  { name: "Social Media Links", starter: true, sorted: true, works: true },
  { name: "Google Maps", starter: true, sorted: true, works: true },
  { name: "Cookie Notice & Privacy Policy", starter: true, sorted: true, works: true },
  { name: "SSL & Speed Optimised", starter: true, sorted: true, works: true },
  { name: "Reviews/Testimonials Section", starter: false, sorted: true, works: true },
  { name: "Trust Signals", starter: false, sorted: true, works: true },
  { name: "Branded Email Templates", starter: false, sorted: "500/month", works: "3,000/month" },
  { name: "Booking System", starter: false, sorted: "1 type", works: "Multiple types" },
  { name: "SEO", starter: "Basic", sorted: "Full on-page", works: "SEO-led architecture" },
  { name: "Email Signature Design", starter: false, sorted: true, works: true },
  { name: "Free Domain (1st year)", starter: false, sorted: true, works: true },
  { name: "Business Email Setup", starter: false, sorted: true, works: true },
  { name: "Location/Area Pages", starter: false, sorted: false, works: true },
  { name: "Blog Setup", starter: false, sorted: false, works: true },
  { name: "Google Analytics & Search Console", starter: false, sorted: false, works: true },
  { name: "Full Legal Pages (T&Cs, GDPR)", starter: false, sorted: false, works: true },
  { name: "Appointment Reminders", starter: false, sorted: false, works: true },
  { name: "Revision Rounds", starter: "1", sorted: "2", works: "3" },
  { name: "Delivery Time", starter: "5–7 days", sorted: "7–10 days", works: "10–14 days" },
  { name: "Payment", starter: "Upfront", sorted: "50/50", works: "50/50" },
];

const addons = [
  {
    name: "Logo Design",
    price: "£49",
    description: "2 logo concepts, 1 round of revisions. Delivered as PNG, SVG + social media sizes.",
    availableFor: "All packages",
  },
  {
    name: "Google Business Profile Setup",
    price: "£39",
    description: "Full profile creation & optimisation, 3 initial posts, review response templates, and a quick management guide.",
    availableFor: "All packages",
  },
  {
    name: "Booking System Setup",
    price: "£39",
    description: "Cal.com booking widget embedded on your site with calendar sync and confirmation emails.",
    availableFor: "Starter only",
  },
  {
    name: "Extra Email Templates (×3)",
    price: "£29",
    description: "3 additional branded HTML email templates (e.g. quote follow-up, thank you, promotional) uploaded to Resend.",
    availableFor: "All packages",
  },
  {
    name: "SEO Audit Report",
    price: "£59",
    description: "Full technical, on-page, local SEO and competitor audit. Delivered as a branded PDF with a prioritised action plan.",
    availableFor: "All packages",
  },
  {
    name: "Legal Pages Pack",
    price: "£19",
    description: "Terms & Conditions, detailed cookie policy, and GDPR compliance check.",
    availableFor: "Starter & Sorted",
  },
];

const hostingPlans = [
  {
    name: "Keep It Live",
    price: "£9",
    period: "/month",
    features: [
      "Website hosting",
      "SSL certificate maintained",
      "Weekly backups",
      "Security monitoring",
      "Up to 2 small content changes/month",
      "Email support",
    ],
  },
  {
    name: "Keep It Fresh",
    price: "£19",
    period: "/month",
    popular: true,
    features: [
      "Everything in Keep It Live, plus:",
      "Up to 5 content changes/month",
      "Quarterly website health check",
      "Priority email & WhatsApp support",
      "Minor design tweaks included",
    ],
  },
];

const everyPackageIncludes = [
  "Mobile-first responsive design",
  "Professional copywriting",
  "Contact form with email notifications",
  "Click-to-call button",
  "WhatsApp button",
  "Social media links",
  "Google Maps embed",
  "Cookie notice & privacy policy",
  "SSL certificate",
  "Speed optimised",
  "Basic SEO",
];

const whatWeDontDo = [
  "Social media management or posting",
  "Ongoing content writing or blog management",
  "Google Ads or Facebook Ads",
  "Photography or videography",
  "Print design",
  "App development",
];

function ComparisonCell({ value }: { value: boolean | string }) {
  if (value === true) {
    return <Check className="w-5 h-5 text-primary mx-auto" />;
  }
  if (value === false) {
    return <X className="w-5 h-5 text-muted-foreground/50 mx-auto" />;
  }
  return <span className="text-sm">{value}</span>;
}

export default function Packages() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-24 pb-12 sm:pt-32 sm:pb-16 md:pt-40 md:pb-24 relative">
        <DottedGrid className="opacity-40" spacing={36} />
        <div className="content-width relative z-10">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bordered-section inline-block px-4 py-2 mb-4 sm:mb-6">
              <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Pricing
              </span>
            </div>
            <h1 className="text-display mb-6 sm:mb-8">
              Simple pricing. <span className="text-primary">No surprises.</span>
            </h1>
            <p className="text-body-lg max-w-2xl">
              Pick a package. Get your site. Everything you need included — no hidden fees, no upsell traps.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="section-sm">
        <div className="content-width">
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                className={`relative rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col border-2 bg-card ${
                  pkg.popular
                    ? "border-primary lg:scale-105 lg:-my-4"
                    : "border-border"
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Popular badge */}
                {pkg.popular && (
                  <div className="absolute -top-3 left-4 sm:left-6">
                    <span className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1 rounded-full bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold uppercase tracking-wider border-2 border-primary">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6 sm:mb-8 pt-2">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3">{pkg.name}</h3>
                  <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
                    <span className="text-3xl sm:text-4xl font-bold text-primary">
                      {pkg.price}
                    </span>
                    <span className="text-muted-foreground text-xs sm:text-sm">one-time</span>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground">{pkg.description}</p>
                </div>

                <ul className="space-y-2.5 sm:space-y-3 flex-1 mb-6">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 sm:gap-3">
                      <div className="check-icon w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </div>
                      <span className="text-xs sm:text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Delivery & Payment */}
                <div className="mb-6 p-3 sm:p-4 rounded-xl bg-secondary/50 border border-border space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-medium">{pkg.delivery}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Payment</span>
                    <span className="font-medium">{pkg.payment}</span>
                  </div>
                </div>

                <Link
                  to="/start"
                  className={`w-full flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-4 rounded-full text-sm sm:text-base font-semibold transition-all border-2 ${
                    pkg.popular
                      ? "bg-primary text-primary-foreground border-primary hover:brightness-110"
                      : "bg-card text-foreground border-border hover:bg-muted"
                  }`}
                >
                  Get Started
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Every Package Includes */}
      <section className="section-sm">
        <div className="content-width">
          <motion.div
            className="bordered-section p-6 sm:p-8 md:p-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg sm:text-xl font-bold mb-6 text-center">Every package includes</h3>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {everyPackageIncludes.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-secondary border border-border text-xs sm:text-sm"
                >
                  <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section relative">
        <DottedGrid className="opacity-30" spacing={40} />
        <div className="content-width relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-headline mb-4 text-center">
              Compare <span className="text-primary">packages</span>
            </h2>
            <p className="text-body-lg text-center mb-10 sm:mb-12 max-w-2xl mx-auto">
              See exactly what's included in each package.
            </p>

            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left py-4 pr-4 font-semibold text-sm sm:text-base">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold text-sm sm:text-base">
                      <div>The Starter</div>
                      <div className="text-primary font-bold">£199</div>
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-sm sm:text-base bg-primary/5 rounded-t-xl">
                      <div className="flex items-center justify-center gap-2">
                        The Sorted
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground uppercase font-bold">Popular</span>
                      </div>
                      <div className="text-primary font-bold">£399</div>
                    </th>
                    <th className="text-center py-4 pl-4 font-semibold text-sm sm:text-base">
                      <div>The Works</div>
                      <div className="text-primary font-bold">£649</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr
                      key={feature.name}
                      className={`border-b border-border ${index % 2 === 0 ? "bg-secondary/30" : ""}`}
                    >
                      <td className="py-3 pr-4 text-sm">{feature.name}</td>
                      <td className="py-3 px-4 text-center">
                        <ComparisonCell value={feature.starter} />
                      </td>
                      <td className="py-3 px-4 text-center bg-primary/5">
                        <ComparisonCell value={feature.sorted} />
                      </td>
                      <td className="py-3 pl-4 text-center">
                        <ComparisonCell value={feature.works} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="section relative">
        <div className="content-width">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-headline">
                Make it even <span className="text-primary">better</span>
              </h2>
            </div>
            <p className="text-body-lg mb-10 sm:mb-12 max-w-2xl">
              Optional extras to enhance your website. Only add what you need.
            </p>

            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {addons.map((addon, index) => (
                <motion.div
                  key={addon.name}
                  className="p-5 sm:p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-base sm:text-lg">{addon.name}</h4>
                    <span className="text-primary font-bold text-lg">{addon.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{addon.description}</p>
                  <div className="text-xs text-muted-foreground border-t border-border pt-3">
                    Available for: <span className="text-foreground">{addon.availableFor}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hosting Section */}
      <section className="section relative">
        <DottedGrid className="opacity-30" spacing={40} />
        <div className="content-width relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Server className="w-6 h-6 text-primary" />
              <h2 className="text-headline">
                Keep it <span className="text-primary">running</span>
              </h2>
            </div>
            <p className="text-body-lg mb-10 sm:mb-12 max-w-2xl">
              Monthly hosting & care plans to keep your site secure, fast, and up-to-date.
            </p>

            <div className="grid gap-6 md:grid-cols-2 max-w-3xl">
              {hostingPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  className={`p-6 sm:p-8 rounded-xl border-2 ${
                    plan.popular ? "border-primary bg-primary/5" : "border-border bg-card"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-lg sm:text-xl">{plan.name}</h4>
                    {plan.popular && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground uppercase font-bold">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl sm:text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground mt-6 text-center max-w-3xl mx-auto">
              No contract. Cancel anytime. <span className="text-primary font-medium">First month free with any website package.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Domain & Email Section */}
      <section className="section-sm">
        <div className="content-width">
          <motion.div
            className="bordered-section p-6 sm:p-8 md:p-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Domain Registration</h4>
                  <p className="text-sm text-muted-foreground">
                    £12/year (.co.uk or .com) — <span className="text-primary font-medium">free first year on The Sorted & The Works</span>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Business Email Setup</h4>
                  <p className="text-sm text-muted-foreground">
                    Included on The Sorted & The Works (Zoho Mail free tier — up to 5 users)
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Don't Do */}
      <section className="section-sm">
        <div className="content-width">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-headline mb-4">
              We build websites. <span className="text-primary">That's it.</span>
            </h2>
            <p className="text-body-lg text-muted-foreground mb-6">
              And we do it really well. But there are some things we don't do:
            </p>
            <ul className="space-y-2 mb-8">
              {whatWeDontDo.map((item) => (
                <li key={item} className="flex items-center gap-3 text-muted-foreground">
                  <X className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                  <span className="text-sm sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-body text-muted-foreground">
              If you want a professional site that makes you look established, ranks locally, and actually converts visitors into enquiries — that's exactly what we do.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Ready to get"
        highlightedText="started?"
        description="Most businesses go with The Sorted — it's everything you need to look established and win trust. But if you just need to get online, The Starter does the job."
        primaryButtonText="Get Started"
        primaryButtonLink="/start"
        showPhone={true}
      />
    </Layout>
  );
}
