import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { Pill } from "@/components/oss/Pill";
import { FaqList } from "@/components/oss/Accordion";
import { faqs } from "@/data/faq";

export default function FAQ() {
  return (
    <Layout>
      <Helmet>
        <title>FAQ | Web Design for Local UK Businesses | OneSimpleSite</title>
        <link rel="canonical" href="https://onesimplesite.co.uk/faq" />
      </Helmet>

      <section className="pb-14 pt-12 md:pb-20 md:pt-20">
        <div className="content-width grid gap-10 lg:grid-cols-12">
          <p className="t-label lg:col-span-3">FAQ</p>
          <div className="lg:col-span-9">
            <h1 className="t-display" style={{ fontSize: "clamp(2.7rem, 7vw, 6.25rem)" }}>
              Straight
              <span className="block md:pl-[16%]">answers.</span>
            </h1>
            <p className="t-lead mt-8 max-w-md md:ml-[16%]">No jargon. No runaround. Everything you need to know before getting started.</p>
          </div>
        </div>
      </section>

      <section className="pb-28 md:pb-40">
        <div className="content-width grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 lg:col-start-4"><FaqList items={faqs} /></div>
          <aside className="lg:col-span-2 lg:col-start-11 lg:sticky lg:top-28 lg:self-start">
            <p className="text-body">Still unsure?</p>
            <div className="mt-4"><Pill to="/start">Get started</Pill></div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
