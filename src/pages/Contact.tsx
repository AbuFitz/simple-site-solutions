import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowUpRight, Mail } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

export default function Contact() {
  return (
    <Layout>
      <Helmet>
        <title>Contact | OneSimpleSite</title>
        <link rel="canonical" href="https://onesimplesite.co.uk/contact" />
      </Helmet>
      <section className="pb-24 pt-32 sm:pt-40">
        <div className="content-width">
          <h1 className="text-display max-w-4xl">
            Let's build your <span className="text-signal">new website.</span>
          </h1>
          <p className="text-body-lg mt-6 max-w-xl">The quickest way to begin is the project form. Prefer email? That works too.</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link to="/start" className="btn-primary btn-lg gap-2">
              Start a project <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a href="mailto:hello@onesimplesite.co.uk" className="btn-outline btn-lg gap-2">
              <Mail className="h-4 w-4" /> hello@onesimplesite.co.uk
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
