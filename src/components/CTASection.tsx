import { Link } from "react-router-dom";

interface CTASectionProps {
  title: string;
  highlightedText: string;
  description: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

/** Closing call to action for inner pages: the green band from the redesign, with page-specific wording. */
export function CTASection({
  title,
  highlightedText,
  description,
  primaryButtonText = "Start a project",
  primaryButtonLink = "/start",
  secondaryButtonText,
  secondaryButtonLink,
}: CTASectionProps) {
  return (
    <section className="oss-cta" data-tone="light">
      <h2 className="oss-disp">
        {title} {highlightedText}
      </h2>
      <p>{description}</p>
      <div className="row">
        <Link to={primaryButtonLink} className="oss-btn oss-btn--ink">
          <span>{primaryButtonText}</span>
          <span aria-hidden="true">&#8599;</span>
        </Link>
        {secondaryButtonText && secondaryButtonLink && (
          <Link to={secondaryButtonLink} className="oss-lnk">
            {secondaryButtonText}
          </Link>
        )}
      </div>
    </section>
  );
}
