import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { Pill } from "@/components/oss/Pill";

export default function Contact() {
  return (
    <Layout>
      <Helmet>
        <title>Contact | OneSimpleSite</title>
        <meta name="description" content="Start a website project with OneSimpleSite, or get in touch by email." />
        <link rel="canonical" href="https://onesimplesite.co.uk/contact" />
      </Helmet>

      <section className="pb-28 pt-12 md:pb-44 md:pt-20">
        <div className="content-width grid gap-10 lg:grid-cols-12">
          <p className="t-label lg:col-span-3">Contact</p>
          <div className="lg:col-span-9">
            <h1 className="t-display" style={{ fontSize: "clamp(2.7rem, 7vw, 6.25rem)" }}>
              Let&rsquo;s talk about
              <span className="block md:pl-[12%]">your website.</span>
            </h1>
            <div className="mt-12 grid gap-12 md:ml-[12%] md:grid-cols-2">
              <div>
                <p className="font-display text-2xl font-semibold" style={{ letterSpacing: "-0.03em" }}>The quickest way</p>
                <p className="mt-3 max-w-sm text-body">Choose a package and send your details through the project form. It takes a few minutes and tells us everything we need to start.</p>
                <div className="mt-6"><Pill to="/start">Start a project</Pill></div>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold" style={{ letterSpacing: "-0.03em" }}>Prefer email?</p>
                <p className="mt-3 max-w-sm text-body">Tell us about your business and what you need.</p>
                <p className="mt-6"><a href="mailto:hello@onesimplesite.co.uk" className="link-line text-lg">hello@onesimplesite.co.uk</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
