import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo, breadcrumb } from "@/components/seo/Seo";
import { DottedGrid } from "@/components/ui/DottedGrid";

const principles = [
  { title: "Fixed prices", text: "Three packages with the price, page count and inclusions written down before you start." },
  { title: "Planned layouts", text: "We start from a layout planned for your kind of business and build it around your details, instead of designing from a blank page." },
  { title: "Plain English", text: "No jargon. We tell you what we need from you, and what happens next." },
  { title: "Nothing invented", text: "No made-up reviews, client logos or results on this site. If we can't show it, we don't say it." },
];

export default function About() {
  return (
    <Layout>
      <Seo path="/about"
        jsonLd={breadcrumb([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <section className="relative pt-24 pb-10 sm:pt-32 sm:pb-14">
        <DottedGrid className="opacity-30" spacing={32} />
        <div className="content-width relative z-10 max-w-3xl">
          <h1 className="text-headline">
            About <span className="text-primary">OneSimpleSite</span>
          </h1>
          <p className="text-body-lg mt-4">
            We build websites for UK local businesses: trades, mechanics, cleaners, barbers, tutors, small shops and similar. The idea is simple: a clear fixed price, a layout planned for your kind of business, and a short process.
          </p>
          <p className="text-body-lg mt-4">
            It suits you if you want a clean, working site without managing a design project. It doesn't suit you if you want full creative control or a custom web app; the <Link className="underline underline-offset-4 hover:text-foreground" to="/faq">FAQ</Link> explains the trade-off.
          </p>
        </div>
      </section>

      <section className="pb-12">
        <div className="content-width">
          <h2 className="text-title mb-6">How we work</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {principles.map((p) => (
              <li key={p.title} className="bordered-section bg-card p-5">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="content-width">
          <div className="bordered-section flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-title">See what we've built</h2>
              <p className="mt-1 text-muted-foreground">Real projects, with what was built for each.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/work" className="btn-outline btn-md min-h-[44px] justify-center">Our work</Link>
              <Link to="/start" className="btn-primary btn-md min-h-[44px] justify-center !text-background">Start a project</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
