import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { SITE, SOCIAL } from "@/data/site";
import locationData from "@/data/locations.json";
import { locationPath } from "@/lib/locationSeo.mjs";

const siteLinks = [
  { to: "/work", label: "Work" },
  { to: "/packages", label: "Pricing" },
  { to: "/how-it-works", label: "Process" },
  { to: "/guides", label: "Guides" },
  { to: "/faq", label: "FAQ" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const Footer = forwardRef<HTMLElement>((_, ref) => {
  return (
    <footer ref={ref} className="oss-foot" data-tone="dark">
      <div className="oss-foot__a">
        <div className="oss-foot__lead">
          <p>Web design and development for businesses across the UK.</p>
          <a className="oss-foot__mail" href={`mailto:${SITE.email}`}>
            {SITE.email}
          </a>
        </div>
        <nav aria-label="Site">
          <h2>Site</h2>
          <ul>
            {siteLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Web design by area">
          <h2>Areas</h2>
          <ul className="oss-foot__areas">
            {locationData.locations.map((l) => (
              <li key={l.slug}>
                <Link to={locationPath(l.slug)}>{l.name}</Link>
              </li>
            ))}
          </ul>
          <p className="oss-foot__all">
            <Link to="/web-design">Web design near you</Link>
          </p>
        </nav>
        <nav aria-label="OneSimpleSite on social media">
          <h2>Social</h2>
          <ul>
            {SOCIAL.map((n) => (
              <li key={n.id}>
                <a href={n.url} target="_blank" rel="noopener noreferrer me">
                  {n.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="oss-foot__bigwrap" aria-hidden="true">
        <div className="oss-foot__big">
          one<b>simple</b>site
        </div>
      </div>
      <div className="oss-foot__legal">
        <span>&copy; {new Date().getFullYear()} OneSimpleSite</span>
        <ul>
          <li><Link to="/privacy">Privacy</Link></li>
          <li><Link to="/terms">Terms</Link></li>
          <li><Link to="/cookies">Cookies</Link></li>
          <li><Link to="/accessibility">Accessibility</Link></li>
        </ul>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
