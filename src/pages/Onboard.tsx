import { addons as addonCatalogue, hosting as hostingCare, pricedPackages } from "@/data/packages";
import { Seo } from "@/components/seo/Seo";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, Send, Loader2 } from "lucide-react";

interface FormData {
  // Step 1: Your Details
  contactName: string;
  email: string;
  phone: string;
  businessName: string;
  tradingName: string;
  businessType: string;

  // Step 2: Location & Contact
  businessAddress: string;
  isLocationBased: string;
  serviceAreas: string;
  showAddressPublicly: boolean;
  publicPhone: string;
  publicEmail: string;
  whatsappNumber: string;
  preferredContact: string;
  // Social media
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
  otherSocialUrl: string;

  // Step 3: About Your Business
  whatYouDo: string;
  idealCustomers: string;
  whyChooseYou: string;
  tonePreference: string;

  // Step 4: Services
  services: string;
  showPricing: string;
  pricingInfo: string;

  // Step 5: Branding & Images
  hasLogo: string;
  wantsLogoDesign: string;
  logoStyle: string;
  logoInspiration: string;
  logoColours: string;
  brandColors: string;
  stylePreference: string;
  hasPhotos: string;
  useStockImages: boolean;

  // Step 6: Trust & Proof
  hasGoogleBusiness: string;
  wantsGoogleBusinessSetup: string;
  googleBusinessLink: string;
  testimonials: string;
  certifications: string;

  // Step 7: Website Preferences
  mainCTA: string[];
  primaryLocation: string;
  keyServices: string;
  extraPages: string;
  needsBookingSystem: string;
  bookingDetails: string;

  // Step 8: Final Details
  mustInclude: string;
  mustNotInclude: string;
  additionalNotes: string;
  confirmedPackage: string;
  selectedAddons: string[];
  hasDomain: string;
  domainName: string;
  wantsDomain: string;
  hasEmail: string;
  wantsEmail: string;
  hostingPlan: string;
}

const initialFormData: FormData = {
  contactName: "",
  email: "",
  phone: "",
  businessName: "",
  tradingName: "",
  businessType: "",
  businessAddress: "",
  isLocationBased: "",
  serviceAreas: "",
  showAddressPublicly: true,
  publicPhone: "",
  publicEmail: "",
  whatsappNumber: "",
  preferredContact: "",
  facebookUrl: "",
  instagramUrl: "",
  tiktokUrl: "",
  linkedinUrl: "",
  youtubeUrl: "",
  twitterUrl: "",
  otherSocialUrl: "",
  whatYouDo: "",
  idealCustomers: "",
  whyChooseYou: "",
  tonePreference: "",
  services: "",
  showPricing: "",
  pricingInfo: "",
  hasLogo: "",
  wantsLogoDesign: "",
  logoStyle: "",
  logoInspiration: "",
  logoColours: "",
  brandColors: "",
  stylePreference: "",
  hasPhotos: "",
  useStockImages: true,
  hasGoogleBusiness: "",
  wantsGoogleBusinessSetup: "",
  googleBusinessLink: "",
  testimonials: "",
  certifications: "",
  mainCTA: [],
  primaryLocation: "",
  keyServices: "",
  extraPages: "",
  needsBookingSystem: "",
  bookingDetails: "",
  mustInclude: "",
  mustNotInclude: "",
  additionalNotes: "",
  confirmedPackage: "",
  selectedAddons: [],
  hasDomain: "",
  domainName: "",
  wantsDomain: "",
  hasEmail: "",
  wantsEmail: "",
  hostingPlan: "",
};

const businessTypes = [
  "Sole Trader",
  "Limited Company",
  "Partnership",
  "Other",
];

const toneOptions = [
  { id: "professional", label: "Professional" },
  { id: "friendly", label: "Friendly & Approachable" },
  { id: "premium", label: "Premium & High-End" },
  { id: "straightforward", label: "Straightforward & Direct" },
];

const styleOptions = [
  { id: "modern", label: "Modern & Clean" },
  { id: "minimal", label: "Minimal" },
  { id: "bold", label: "Bold & Eye-catching" },
  { id: "classic", label: "Classic & Traditional" },
  { id: "no-preference", label: "No Preference" },
];

const ctaOptions = [
  { id: "call", label: "Call Now" },
  { id: "quote", label: "Request a Quote" },
  { id: "book", label: "Book an Appointment" },
  { id: "whatsapp", label: "Message on WhatsApp" },
  { id: "contact-form", label: "Contact Form" },
];

const packages = pricedPackages.map((p) => ({ id: p.id as string, name: p.name, price: `£${p.price}`, recommended: p.recommended }));

const addons = addonCatalogue.map((a) => ({ id: a.id, name: a.name, price: `£${a.price}` }));

const hostingPlan = {
  id: hostingCare.id,
  name: hostingCare.name,
  price: `£${hostingCare.price}/month`,
  description: "Hosting, SSL and a standard domain, weekly backups, security monitoring and up to 3 small content changes a month. Cancel with 30 days' notice.",
};

const logoStyleOptions = [
  { id: "modern", label: "Modern & Minimal" },
  { id: "classic", label: "Classic & Traditional" },
  { id: "bold", label: "Bold & Eye-catching" },
  { id: "playful", label: "Playful & Friendly" },
  { id: "no-preference", label: "No Preference" },
];

// Shared input classes for consistent styling
const inputClasses = "w-full px-4 py-3.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all";
const textareaClasses = "w-full px-4 py-3.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none";
const selectClasses = "w-full px-4 py-3.5 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer";

export default function Onboard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const totalSteps = 8;

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCTA = (ctaId: string) => {
    const current = formData.mainCTA;
    if (current.includes(ctaId)) {
      updateField("mainCTA", current.filter((id) => id !== ctaId));
    } else {
      updateField("mainCTA", [...current, ctaId]);
    }
  };

  const toggleAddon = (addonId: string) => {
    const current = formData.selectedAddons;
    if (current.includes(addonId)) {
      updateField("selectedAddons", current.filter((id) => id !== addonId));
    } else {
      updateField("selectedAddons", [...current, addonId]);
    }
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/onboard-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit");
      setIsSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please try again or email us at hello@onesimplesite.co.uk");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (step / totalSteps) * 100;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Seo path="/onboard" />
        <motion.div
          className="max-w-md w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-3">All done, thank you!</h1>
          <p className="text-muted-foreground mb-6">
            We've received everything we need and sent you a confirmation email.
            We'll email you with next steps to get your project started.
          </p>
          <p className="text-sm text-muted-foreground">
            Questions? Email{" "}
            <a href="mailto:hello@onesimplesite.co.uk" className="text-primary hover:underline">
              hello@onesimplesite.co.uk
            </a>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Seo path="/onboard" />
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">
            one<span className="text-primary">simple</span>site
          </span>
          <span className="text-xs text-muted-foreground">Client Onboarding</span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="sticky top-[57px] z-40 bg-background border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Step {step} of {totalSteps}</span>
            <span className="text-xs font-medium">{Math.round(progress)}% complete</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Your Details */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold mb-1">Your Details</h2>
                <p className="text-sm text-muted-foreground">Let's start with the basics.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name *</label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => updateField("contactName", e.target.value)}
                    className={inputClasses}
                    placeholder="John Smith"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className={inputClasses}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className={inputClasses}
                      placeholder="07123 456789"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Business Name *</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => updateField("businessName", e.target.value)}
                    className={inputClasses}
                    placeholder="Smith Plumbing Ltd"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Trading Name (if different)</label>
                  <input
                    type="text"
                    value={formData.tradingName}
                    onChange={(e) => updateField("tradingName", e.target.value)}
                    className={inputClasses}
                    placeholder="Leave blank if same as above"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Business Type</label>
                  <div className="relative">
                    <select
                      value={formData.businessType}
                      onChange={(e) => updateField("businessType", e.target.value)}
                      className={selectClasses}
                    >
                      <option value="">Select...</option>
                      {businessTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Location & Contact */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold mb-1">Location & Contact</h2>
                <p className="text-sm text-muted-foreground">Where you're based and how customers can reach you.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Business Address</label>
                  <textarea
                    value={formData.businessAddress}
                    onChange={(e) => updateField("businessAddress", e.target.value)}
                    className={`${textareaClasses} min-h-[100px]`}
                    placeholder="123 High Street, Hemel Hempstead, HP1 1AA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Is your business location-based or mobile?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Location-based", "Mobile/Travel to customers", "Both"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => updateField("isLocationBased", opt)}
                        className={`py-3 px-3 rounded-xl border text-sm font-medium transition-all ${
                          formData.isLocationBased === opt
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary hover:border-muted-foreground"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Service Areas *</label>
                  <input
                    type="text"
                    value={formData.serviceAreas}
                    onChange={(e) => updateField("serviceAreas", e.target.value)}
                    className={inputClasses}
                    placeholder="e.g., Hemel Hempstead, St Albans, Watford, and surrounding areas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Show full address on website?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => updateField("showAddressPublicly", true)}
                      className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                        formData.showAddressPublicly
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-secondary hover:border-muted-foreground"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField("showAddressPublicly", false)}
                      className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                        !formData.showAddressPublicly
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-secondary hover:border-muted-foreground"
                      }`}
                    >
                      No, just show area
                    </button>
                  </div>
                </div>

                <div className="pt-5 border-t border-border">
                  <p className="text-sm font-medium mb-4">Contact details for your website</p>

                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Public Phone Number *</label>
                        <input
                          type="tel"
                          value={formData.publicPhone}
                          onChange={(e) => updateField("publicPhone", e.target.value)}
                          className={inputClasses}
                          placeholder="01234 567890"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">WhatsApp Number</label>
                        <input
                          type="tel"
                          value={formData.whatsappNumber}
                          onChange={(e) => updateField("whatsappNumber", e.target.value)}
                          className={inputClasses}
                          placeholder="Leave blank if not using"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Public Email Address *</label>
                      <input
                        type="email"
                        value={formData.publicEmail}
                        onChange={(e) => updateField("publicEmail", e.target.value)}
                        className={inputClasses}
                        placeholder="info@yourbusiness.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Preferred contact method for enquiries</label>
                      <div className="relative">
                        <select
                          value={formData.preferredContact}
                          onChange={(e) => updateField("preferredContact", e.target.value)}
                          className={selectClasses}
                        >
                          <option value="">Select...</option>
                          <option value="phone">Phone Call</option>
                          <option value="email">Email</option>
                          <option value="whatsapp">WhatsApp</option>
                          <option value="form">Contact Form</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-border">
                  <p className="text-sm font-medium mb-2">Social Media Links</p>
                  <p className="text-xs text-muted-foreground mb-4">Add any social profiles you want linked on your website.</p>

                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Facebook</label>
                        <input
                          type="url"
                          value={formData.facebookUrl}
                          onChange={(e) => updateField("facebookUrl", e.target.value)}
                          className={inputClasses}
                          placeholder="https://facebook.com/yourbusiness"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Instagram</label>
                        <input
                          type="url"
                          value={formData.instagramUrl}
                          onChange={(e) => updateField("instagramUrl", e.target.value)}
                          className={inputClasses}
                          placeholder="https://instagram.com/yourbusiness"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">TikTok</label>
                        <input
                          type="url"
                          value={formData.tiktokUrl}
                          onChange={(e) => updateField("tiktokUrl", e.target.value)}
                          className={inputClasses}
                          placeholder="https://tiktok.com/@yourbusiness"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">LinkedIn</label>
                        <input
                          type="url"
                          value={formData.linkedinUrl}
                          onChange={(e) => updateField("linkedinUrl", e.target.value)}
                          className={inputClasses}
                          placeholder="https://linkedin.com/company/yourbusiness"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">YouTube</label>
                        <input
                          type="url"
                          value={formData.youtubeUrl}
                          onChange={(e) => updateField("youtubeUrl", e.target.value)}
                          className={inputClasses}
                          placeholder="https://youtube.com/@yourbusiness"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">X (Twitter)</label>
                        <input
                          type="url"
                          value={formData.twitterUrl}
                          onChange={(e) => updateField("twitterUrl", e.target.value)}
                          className={inputClasses}
                          placeholder="https://x.com/yourbusiness"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Other Social Media</label>
                      <input
                        type="url"
                        value={formData.otherSocialUrl}
                        onChange={(e) => updateField("otherSocialUrl", e.target.value)}
                        className={inputClasses}
                        placeholder="Any other social profile URL"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: About Your Business */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold mb-1">About Your Business</h2>
                <p className="text-sm text-muted-foreground">This helps us write great content for your site.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">What does your business do? *</label>
                  <p className="text-xs text-muted-foreground mb-3">Explain as if to a new customer who's never heard of you.</p>
                  <textarea
                    value={formData.whatYouDo}
                    onChange={(e) => updateField("whatYouDo", e.target.value)}
                    className={`${textareaClasses} min-h-[120px]`}
                    placeholder="e.g., We provide emergency and scheduled plumbing services for homes across Hertfordshire. From leaky taps to full bathroom installations, we handle it all..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Who are your ideal customers? *</label>
                  <textarea
                    value={formData.idealCustomers}
                    onChange={(e) => updateField("idealCustomers", e.target.value)}
                    className={`${textareaClasses} min-h-[100px]`}
                    placeholder="e.g., Homeowners, landlords, letting agents, small businesses..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Why should someone choose you over competitors?</label>
                  <p className="text-xs text-muted-foreground mb-3">Your unique selling points, guarantees, experience, etc.</p>
                  <textarea
                    value={formData.whyChooseYou}
                    onChange={(e) => updateField("whyChooseYou", e.target.value)}
                    className={`${textareaClasses} min-h-[120px]`}
                    placeholder="e.g., 20 years experience, same-day emergency callouts, no call-out charge, fully insured, 5-star Google reviews..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">What tone should your website have?</label>
                  <div className="grid grid-cols-2 gap-3">
                    {toneOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => updateField("tonePreference", opt.id)}
                        className={`py-3.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                          formData.tonePreference === opt.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary hover:border-muted-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Services */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold mb-1">Your Services</h2>
                <p className="text-sm text-muted-foreground">What do you offer to customers?</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">List all your services *</label>
                  <p className="text-xs text-muted-foreground mb-3">Include a brief description for each if possible.</p>
                  <textarea
                    value={formData.services}
                    onChange={(e) => updateField("services", e.target.value)}
                    className={`${textareaClasses} min-h-[200px]`}
                    placeholder={`e.g.,
• Boiler Installation & Replacement - New boiler fitting with up to 10 year warranty
• Boiler Servicing - Annual servicing to keep your boiler running efficiently
• Emergency Repairs - 24/7 callout for urgent plumbing issues
• Bathroom Installation - Full bathroom design and fitting
• General Plumbing - Taps, toilets, pipes, and all general repairs`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Do you want pricing shown on your website?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Yes", "No, enquiry-based", "Some services only"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => updateField("showPricing", opt)}
                        className={`py-3 px-3 rounded-xl border text-sm font-medium transition-all ${
                          formData.showPricing === opt
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary hover:border-muted-foreground"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {(formData.showPricing === "Yes" || formData.showPricing === "Some services only") && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    <label className="block text-sm font-medium mb-2">Pricing Information</label>
                    <textarea
                      value={formData.pricingInfo}
                      onChange={(e) => updateField("pricingInfo", e.target.value)}
                      className={`${textareaClasses} min-h-[120px]`}
                      placeholder={`e.g.,
• Boiler Service: £79
• Call-out fee: Free
• Bathroom Installation: From £2,500`}
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 5: Branding & Images */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold mb-1">Branding & Images</h2>
                <p className="text-sm text-muted-foreground">Visual elements for your website.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-3">Do you have a logo?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Yes, I'll send it", "No, I need one", "No, just use text"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => updateField("hasLogo", opt)}
                        className={`py-3 px-3 rounded-xl border text-sm font-medium transition-all ${
                          formData.hasLogo === opt
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary hover:border-muted-foreground"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.hasLogo === "No, I need one" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-5 p-5 rounded-xl bg-card border border-border"
                  >
                    <div>
                      <label className="block text-sm font-medium mb-3">Would you like us to design a logo for you?</label>
                      <p className="text-xs text-muted-foreground mb-3">Logo Design add-on: £49</p>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => updateField("wantsLogoDesign", "Yes")}
                          className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                            formData.wantsLogoDesign === "Yes"
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-secondary hover:border-muted-foreground"
                          }`}
                        >
                          Yes please
                        </button>
                        <button
                          type="button"
                          onClick={() => updateField("wantsLogoDesign", "No")}
                          className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                            formData.wantsLogoDesign === "No"
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-secondary hover:border-muted-foreground"
                          }`}
                        >
                          No, just use text
                        </button>
                      </div>
                    </div>

                    {formData.wantsLogoDesign === "Yes" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium mb-3">What style of logo do you prefer?</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {logoStyleOptions.map((opt) => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => updateField("logoStyle", opt.id)}
                                className={`py-3.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                                  formData.logoStyle === opt.id
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border bg-secondary hover:border-muted-foreground"
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Any logos you like for inspiration?</label>
                          <textarea
                            value={formData.logoInspiration}
                            onChange={(e) => updateField("logoInspiration", e.target.value)}
                            className={`${textareaClasses} min-h-[80px]`}
                            placeholder="e.g., I like the Apple logo because it's simple, or Coca-Cola because it's classic..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">What colours should the logo use?</label>
                          <input
                            type="text"
                            value={formData.logoColours}
                            onChange={(e) => updateField("logoColours", e.target.value)}
                            className={inputClasses}
                            placeholder="e.g., Blue and gold, or match my brand colours"
                          />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Brand Colours (if you have them)</label>
                  <input
                    type="text"
                    value={formData.brandColors}
                    onChange={(e) => updateField("brandColors", e.target.value)}
                    className={inputClasses}
                    placeholder="e.g., Blue and white, or #1E40AF"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">What style do you prefer?</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {styleOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => updateField("stylePreference", opt.id)}
                        className={`py-3.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                          formData.stylePreference === opt.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary hover:border-muted-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-5 border-t border-border">
                  <div>
                    <label className="block text-sm font-medium mb-3">Do you have professional photos of your work?</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Yes, I'll send them", "Some, not many", "No"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => updateField("hasPhotos", opt)}
                          className={`py-3 px-3 rounded-xl border text-sm font-medium transition-all ${
                            formData.hasPhotos === opt
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-secondary hover:border-muted-foreground"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="block text-sm font-medium mb-3">Can we use high-quality stock images if needed?</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => updateField("useStockImages", true)}
                        className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                          formData.useStockImages
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary hover:border-muted-foreground"
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField("useStockImages", false)}
                        className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                          !formData.useStockImages
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary hover:border-muted-foreground"
                        }`}
                      >
                        No, only my photos
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 6: Trust & Proof */}
          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold mb-1">Trust & Proof</h2>
                <p className="text-sm text-muted-foreground">Reviews and credentials that build customer confidence.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-3">Do you have a Google Business Profile?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Yes", "No", "Not sure"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => updateField("hasGoogleBusiness", opt)}
                        className={`py-3 px-3 rounded-xl border text-sm font-medium transition-all ${
                          formData.hasGoogleBusiness === opt
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary hover:border-muted-foreground"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.hasGoogleBusiness === "Yes" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    <label className="block text-sm font-medium mb-2">Google Business Profile Link</label>
                    <p className="text-xs text-muted-foreground mb-3">We can pull in your reviews to display on your website.</p>
                    <input
                      type="url"
                      value={formData.googleBusinessLink}
                      onChange={(e) => updateField("googleBusinessLink", e.target.value)}
                      className={inputClasses}
                      placeholder="https://g.page/yourbusiness or search link"
                    />
                  </motion.div>
                )}

                {(formData.hasGoogleBusiness === "No" || formData.hasGoogleBusiness === "Not sure") && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-5 rounded-xl bg-card border border-border"
                  >
                    <label className="block text-sm font-medium mb-2">Would you like us to set one up for you?</label>
                    <p className="text-xs text-muted-foreground mb-3">Google Business Profile Setup add-on: £39. Helps local customers find you on Google Maps and Search.</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => updateField("wantsGoogleBusinessSetup", "Yes")}
                        className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                          formData.wantsGoogleBusinessSetup === "Yes"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary hover:border-muted-foreground"
                        }`}
                      >
                        Yes please
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField("wantsGoogleBusinessSetup", "No")}
                        className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                          formData.wantsGoogleBusinessSetup === "No"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary hover:border-muted-foreground"
                        }`}
                      >
                        No thanks
                      </button>
                    </div>
                  </motion.div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Testimonials to Include</label>
                  <p className="text-xs text-muted-foreground mb-3">Paste any specific reviews or testimonials you want featured.</p>
                  <textarea
                    value={formData.testimonials}
                    onChange={(e) => updateField("testimonials", e.target.value)}
                    className={`${textareaClasses} min-h-[140px]`}
                    placeholder={`e.g.,
"Fantastic service, arrived within an hour and fixed the leak quickly. Would definitely recommend!" - Sarah, Hemel Hempstead

"Used them for our bathroom renovation. Great quality work and very professional." - Mike, St Albans`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Certifications & Accreditations</label>
                  <p className="text-xs text-muted-foreground mb-3">Any qualifications, memberships, or guarantees to display.</p>
                  <textarea
                    value={formData.certifications}
                    onChange={(e) => updateField("certifications", e.target.value)}
                    className={`${textareaClasses} min-h-[100px]`}
                    placeholder="e.g., Gas Safe Registered, NICEIC Approved, Checkatrade Member, Public Liability Insured..."
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 7: Website Preferences */}
          {step === 7 && (
            <motion.div
              key="step7"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold mb-1">Website Preferences</h2>
                <p className="text-sm text-muted-foreground">How your website should work and what it should rank for.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-3">What should visitors be encouraged to do? *</label>
                  <p className="text-xs text-muted-foreground mb-3">Select all that apply.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {ctaOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleCTA(opt.id)}
                        className={`py-3.5 px-4 rounded-xl border text-sm font-medium transition-all text-left flex items-center gap-3 ${
                          formData.mainCTA.includes(opt.id)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary hover:border-muted-foreground"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                          formData.mainCTA.includes(opt.id) ? "border-primary bg-primary" : "border-border bg-muted"
                        }`}>
                          {formData.mainCTA.includes(opt.id) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Primary Location for Google Searches *</label>
                  <p className="text-xs text-muted-foreground mb-3">The main area you want to rank for.</p>
                  <input
                    type="text"
                    value={formData.primaryLocation}
                    onChange={(e) => updateField("primaryLocation", e.target.value)}
                    className={inputClasses}
                    placeholder="e.g., Hemel Hempstead"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Key Services to Rank For</label>
                  <p className="text-xs text-muted-foreground mb-3">What searches should find your website?</p>
                  <input
                    type="text"
                    value={formData.keyServices}
                    onChange={(e) => updateField("keyServices", e.target.value)}
                    className={inputClasses}
                    placeholder="e.g., emergency plumber, boiler installation, bathroom fitter"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Any Extra Pages Needed?</label>
                  <p className="text-xs text-muted-foreground mb-3">We include Home, About, Services, Contact by default.</p>
                  <input
                    type="text"
                    value={formData.extraPages}
                    onChange={(e) => updateField("extraPages", e.target.value)}
                    className={inputClasses}
                    placeholder="e.g., Gallery, FAQ, Areas We Cover, Testimonials"
                  />
                </div>

                <div className="pt-5 border-t border-border">
                  <label className="block text-sm font-medium mb-3">Do you need customers to book appointments online?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Yes", "No", "Maybe later"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => updateField("needsBookingSystem", opt)}
                        className={`py-3 px-3 rounded-xl border text-sm font-medium transition-all ${
                          formData.needsBookingSystem === opt
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary hover:border-muted-foreground"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.needsBookingSystem === "Yes" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-5 rounded-xl bg-card border border-border"
                  >
                    <p className="text-sm font-medium mb-2">Booking System Setup: £39 add-on</p>
                    <label className="block text-sm font-medium mb-2">Tell us about your booking needs</label>
                    <textarea
                      value={formData.bookingDetails}
                      onChange={(e) => updateField("bookingDetails", e.target.value)}
                      className={`${textareaClasses} min-h-[100px]`}
                      placeholder="e.g., 30-minute consultations, available weekdays 9am-5pm, need to collect deposit..."
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 8: Final Details */}
          {step === 8 && (
            <motion.div
              key="step8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold mb-1">Final Details</h2>
                <p className="text-sm text-muted-foreground">Almost done! Just a few more things.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-3">Confirmed Package *</label>
                  <div className="space-y-3">
                    {packages.map((pkg) => (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => updateField("confirmedPackage", pkg.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                          formData.confirmedPackage === pkg.id
                            ? "border-primary bg-primary/10"
                            : "border-border bg-secondary hover:border-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            formData.confirmedPackage === pkg.id ? "border-primary bg-primary" : "border-border bg-muted"
                          }`}>
                            {formData.confirmedPackage === pkg.id && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{pkg.name}</span>
                            {pkg.recommended && (
                              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                                Recommended
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-primary font-semibold">{pkg.price}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Any Add-ons?</label>
                  <p className="text-xs text-muted-foreground mb-3">Select any extras you'd like.</p>
                  <div className="space-y-2">
                    {addons.map((addon) => (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => toggleAddon(addon.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                          formData.selectedAddons.includes(addon.id)
                            ? "border-primary bg-primary/10"
                            : "border-border bg-secondary hover:border-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                            formData.selectedAddons.includes(addon.id) ? "border-primary bg-primary" : "border-border bg-muted"
                          }`}>
                            {formData.selectedAddons.includes(addon.id) && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-sm">{addon.name}</span>
                        </div>
                        <span className="text-primary font-medium text-sm">{addon.price}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-5 border-t border-border">
                  <p className="text-sm font-medium mb-4">Domain & Email</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-3">Do you have a domain name?</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => updateField("hasDomain", "Yes")}
                          className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                            formData.hasDomain === "Yes"
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-secondary hover:border-muted-foreground"
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => updateField("hasDomain", "No")}
                          className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                            formData.hasDomain === "No"
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-secondary hover:border-muted-foreground"
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {formData.hasDomain === "Yes" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                      >
                        <label className="block text-sm font-medium mb-2">What is your domain name?</label>
                        <input
                          type="text"
                          value={formData.domainName}
                          onChange={(e) => updateField("domainName", e.target.value)}
                          className={inputClasses}
                          placeholder="e.g., yourbusiness.co.uk"
                        />
                      </motion.div>
                    )}

                    {formData.hasDomain === "No" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                      >
                        <label className="block text-sm font-medium mb-3">Would you like us to help you get one?</label>
                        <p className="text-xs text-muted-foreground mb-3">Domain registration is included in our hosting plans.</p>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => updateField("wantsDomain", "Yes")}
                            className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                              formData.wantsDomain === "Yes"
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-secondary hover:border-muted-foreground"
                            }`}
                          >
                            Yes please
                          </button>
                          <button
                            type="button"
                            onClick={() => updateField("wantsDomain", "No")}
                            className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                              formData.wantsDomain === "No"
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-secondary hover:border-muted-foreground"
                            }`}
                          >
                            I'll sort it myself
                          </button>
                        </div>
                      </motion.div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-3">Do you have a professional email address?</label>
                      <p className="text-xs text-muted-foreground mb-3">e.g., info@yourbusiness.co.uk</p>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => updateField("hasEmail", "Yes")}
                          className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                            formData.hasEmail === "Yes"
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-secondary hover:border-muted-foreground"
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => updateField("hasEmail", "No")}
                          className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                            formData.hasEmail === "No"
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-secondary hover:border-muted-foreground"
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {formData.hasEmail === "No" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                      >
                        <label className="block text-sm font-medium mb-3">Would you like us to set one up?</label>
                        <p className="text-xs text-muted-foreground mb-3">Basic email setup is included in hosting plans. Google Workspace available for an extra cost.</p>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => updateField("wantsEmail", "Yes")}
                            className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                              formData.wantsEmail === "Yes"
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-secondary hover:border-muted-foreground"
                            }`}
                          >
                            Yes please
                          </button>
                          <button
                            type="button"
                            onClick={() => updateField("wantsEmail", "No")}
                            className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                              formData.wantsEmail === "No"
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-secondary hover:border-muted-foreground"
                            }`}
                          >
                            No thanks
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="pt-5 border-t border-border">
                  <label className="block text-sm font-medium mb-3">Monthly Hosting & Care</label>
                  <p className="text-xs text-muted-foreground mb-4">Would you like us to look after your website?</p>

                  <div className="p-4 rounded-xl bg-card border border-border mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{hostingPlan.name}</span>
                      <span className="text-primary font-semibold">{hostingPlan.price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{hostingPlan.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => updateField("hostingPlan", hostingPlan.id)}
                      className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                        formData.hostingPlan === hostingPlan.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-secondary hover:border-muted-foreground"
                      }`}
                    >
                      Yes please
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField("hostingPlan", "none")}
                      className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                        formData.hostingPlan === "none"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-secondary hover:border-muted-foreground"
                      }`}
                    >
                      No monthly plan for now
                    </button>
                  </div>
                </div>

                <div className="pt-5 border-t border-border">
                  <label className="block text-sm font-medium mb-2">Anything that MUST be included?</label>
                  <textarea
                    value={formData.mustInclude}
                    onChange={(e) => updateField("mustInclude", e.target.value)}
                    className={`${textareaClasses} min-h-[100px]`}
                    placeholder="e.g., Must mention 24/7 availability, must show Gas Safe registration number..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Anything that must NOT be included?</label>
                  <textarea
                    value={formData.mustNotInclude}
                    onChange={(e) => updateField("mustNotInclude", e.target.value)}
                    className={`${textareaClasses} min-h-[100px]`}
                    placeholder="e.g., Don't show my home address, don't mention old business name..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Any other notes or special requests?</label>
                  <textarea
                    value={formData.additionalNotes}
                    onChange={(e) => updateField("additionalNotes", e.target.value)}
                    className={`${textareaClasses} min-h-[120px]`}
                    placeholder="Anything else we should know..."
                  />
                </div>

                {submitError && (
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                    {submitError}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:brightness-110 transition-all"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.confirmedPackage}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:brightness-110 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </main>

      {/* Help Footer */}
      <footer className="border-t border-border mt-8">
        <div className="max-w-2xl mx-auto px-4 py-4 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Email{" "}
            <a href="mailto:hello@onesimplesite.co.uk" className="text-primary hover:underline">
              hello@onesimplesite.co.uk
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
