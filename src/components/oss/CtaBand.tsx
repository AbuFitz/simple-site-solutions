import { Link } from "react-router-dom";
import { SITE } from "@/data/site";

/** The green closing call to action shared by the home page, Work and the case studies. */
export function CtaBand() {
  return (
    <section className="cta" data-tone="light" aria-labelledby="cta-title">
      <h2 id="cta-title" className="oss-disp">Have a business that deserves a better site?</h2>
      <div className="row">
        <Link className="oss-btn oss-btn--ink" to="/start">
          <span>Start a project</span>
          <span aria-hidden="true">&#8599;</span>
        </Link>
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
      </div>
    </section>
  );
}
