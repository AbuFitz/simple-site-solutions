import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { DottedGrid } from "@/components/ui/DottedGrid";

interface CTASectionProps {
  title: string;
  highlightedText: string;
  description: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

export function CTASection({
  title,
  highlightedText,
  description,
  primaryButtonText = "Get Started",
  primaryButtonLink = "/start",
  secondaryButtonText,
  secondaryButtonLink,
}: CTASectionProps) {
  return (
    <section className="section-sm">
      <div className="content-width">
        <motion.div
          className="bordered-highlight text-center px-4 sm:px-8 py-12 sm:py-16 md:py-20 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <DottedGrid className="opacity-20" spacing={24} />
          <div className="relative z-10">
            <h2 className="text-title mb-3 sm:mb-4">
              {title} <span className="text-primary">{highlightedText}</span>
            </h2>
            <p className="text-body-lg mb-6 sm:mb-8 max-w-lg mx-auto">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
              <Link
                to={primaryButtonLink}
                className="btn-primary btn-lg justify-center"
              >
                {primaryButtonText}
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Link>
              {secondaryButtonText && secondaryButtonLink && (
                <Link
                  to={secondaryButtonLink}
                  className="btn-outline btn-lg justify-center"
                >
                  {secondaryButtonText}
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
