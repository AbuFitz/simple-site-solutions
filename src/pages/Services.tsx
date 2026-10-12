import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Check } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Pill } from "@/components/oss/Pill";
import { Shot } from "@/components/oss/Shot";
import { FaqList } from "@/components/oss/Accordion";
import { getProject, WorkProject } from "@/data/work";
import { addons, hosting, packages } from "@/data/packages";
import { faqs } from "@/data/faq";

const P = (slug: string) => getProject(slug) as WorkProject;

function Ticks({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i} className="flex items-start gap-3">
          <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}

function Meta({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="mt-10 divide-y divide-border border-y border-border text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 py-3.5">
          <dt className="font-semibold">{k}</dt>
          <dd className="text-muted-foreground">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function Services() {
  return (
    <Layout>
      <Helmet>
        <title>Website Services for Local UK Businesses | OneSimpleSite</title>
        <meta
          name="description"
          content="Website build, local SEO, enquiry and booking forms, hosting and care for local UK businesses. Prices from £199, listed upfront."
        />
        <link rel="canonical" href="https://onesimplesite.co.uk/services" />
      </Helmet>

      {/* Opening */}
      <section className="pb-16 pt-12 md:pb-28 md:pt-20">
        <div className="content-width grid gap-10 lg:grid-cols-12">
          <p className="t-label lg:col-span-3">Services</p>
          <div className="lg:col-span-9">
            <h1 className="t-display" style={{ fontSize: "clamp(2.7rem, 7vw, 6.25rem)" }}>
              Everything your business needs online,
              <span className="block md:pl-[12%]">in one simple service.</span>
            </h1>
            <div className="mt-10 grid gap-10 md:ml-[12%] md:grid-cols-2">
              <p className="t-lead max-w-md">
                We are a productised service, not a custom agency: a fixed scope, fixed prices and layouts researched for local trades. That is what keeps it fast and affordable.
              </p>
              <ul className="space-y-2.5 text-sm" aria-label="What is included">
                {["Website build, from 3 to 10 pages", "Local SEO foundations in every package", "Contact forms, WhatsApp and click-to-call", "Optional hosting and care"].map((x) => (
                  <li key={x} className="flex items-center gap-3 border-b border-border pb-2.5">
                    <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 01 Website build: image-led, text beside */}
      <section id="website-build" className="scroll-mt-24 pb-24 md:pb-36" aria-labelledby="build-title">
        <div className="content-width grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6 lg:sticky lg:top-28">
            <Link to="/work/stonebridge" className="block" aria-label="Stonebridge Construction case study">
              <Shot project={P("stonebridge")} kind="t" contour="notch-br" ratio="5 / 4" radius={32} sizes="(min-width:1024px) 45vw, 95vw" alt="Stonebridge Construction homepage" />
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">Stonebridge Construction, a service site we built.</p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="t-label">01 · Website build</p>
            <h2 id="build-title" className="t-h2 mt-5">A complete site on a layout that already works.</h2>
            <p className="t-lead mt-6">
              Mobile-first design, professional copywriting help, speed and SSL, built from what converts in your industry.
            </p>
            <div className="mt-10 space-y-3">
              {packages.map((p) => (
                <div key={p.id} className="flex items-baseline justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-4">
                  <div>
                    <p className="font-display text-xl font-bold" style={{ letterSpacing: "-0.03em" }}>{p.name}</p>
                    <p className="text-sm text-muted-foreground">Up to {p.pages} pages · {p.delivery} · {p.ideal.toLowerCase()}</p>
                  </div>
                  <p className="font-display text-3xl font-bold nums" style={{ letterSpacing: "-0.04em" }}>£{p.price}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Pill to="/packages">Compare packages</Pill>
              <Link to="/start" className="link-line">Start a project</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 02 Local SEO: type-led, with an oversized number */}
      <section id="local-seo" className="scroll-mt-24 pb-24 md:pb-36" aria-labelledby="seo-title">
        <div className="content-width">
          <div className="grid gap-10 lg:grid-cols-12">
            <p className="font-display font-bold leading-none text-primary lg:col-span-3" style={{ fontSize: "clamp(5rem, 14vw, 12rem)", letterSpacing: "-0.06em" }} aria-hidden="true">02</p>
            <div className="lg:col-span-8 lg:col-start-5">
              <p className="t-label">Local SEO</p>
              <h2 id="seo-title" className="t-h2 mt-5">Found by the people searching near you.</h2>
              <div className="mt-10 grid gap-12 md:grid-cols-2">
                <div>
                  <p className="text-body">
                    Every site is built with proper structure, meta tags and local optimisation from day one. There is no separate SEO add-on to buy for the basics.
                  </p>
                  <Meta rows={[["Who for", "Any local business that wants to be found"], ["Included", "Every package"], ["Add-ons", "Google Business Profile setup £39 · SEO audit report £59"]]} />
                </div>
                <div>
                  <p className="mb-4 font-semibold">What you get</p>
                  <Ticks items={["Basic on-page SEO (The Starter)", "Full on-page SEO (The Sorted)", "SEO-led architecture and location pages (The Works)", "Google Analytics setup (The Works)"]} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 Enquiries and booking: black panel */}
      <section id="enquiries-and-booking" className="scroll-mt-24 px-3 pb-24 md:px-5 md:pb-36" aria-labelledby="enq-title">
        <div className="theme-ink overflow-hidden rounded-[28px] md:rounded-[48px]">
          <div className="content-width grid gap-12 py-16 md:py-28 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="t-label">03 · Enquiries &amp; booking</p>
              <h2 id="enq-title" className="t-h2 mt-5">Make it easy to get in touch.</h2>
              <p className="mt-6 max-w-md text-body">
                A visitor should be able to call, message or book in one tap. Contact forms, click-to-call and WhatsApp come with every package.
              </p>
              <div className="mt-10"><Ticks items={["Contact form with click-to-call and WhatsApp", "Google Maps", "Booking system included (The Sorted)", "Advanced booking (The Works)"]} /></div>
              <Meta rows={[["Who for", "Trades and services that take bookings or quote requests"], ["Add-on", "Booking system setup £39"]]} />
            </div>
            <div className="relative lg:col-span-5 lg:col-start-8">
              <Link to="/work/true-to-detail" className="block" aria-label="True To Detail case study">
                <Shot project={P("true-to-detail")} kind="t" contour="notch-tl" ratio="4 / 3" radius={30} sizes="(min-width:1024px) 40vw, 90vw" alt="True To Detail homepage" />
              </Link>
              <div className="absolute -bottom-6 right-4 w-[34%]">
                <Shot project={P("fixnow-mechanics")} kind="m" contour="leaf" ratio="9 / 17" sizes="15vw" alt="FixNow Mechanics on a phone" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 Hosting and care */}
      <section id="hosting-and-care" className="scroll-mt-24 pb-24 md:pb-36" aria-labelledby="host-title">
        <div className="content-width grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="t-label">04 · Hosting &amp; care</p>
            <h2 id="host-title" className="t-h2 mt-5">Keep it running.</h2>
            <p className="mt-6 max-w-md text-body">
              Optional monthly care so your site stays online, backed up and current. No contract, cancel anytime, first month free with any package.
            </p>
            <p className="mt-10 font-display font-bold" style={{ fontSize: "clamp(4rem, 8vw, 7rem)", letterSpacing: "-0.05em", lineHeight: 1 }}>
              £{hosting.price}<span className="text-2xl font-semibold text-muted-foreground">/month</span>
            </p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-10">
            <Ticks items={hosting.features} />
            <div className="mt-10 w-[46%]">
              <Shot project={P("brightlearn-tutoring")} kind="t" contour="pebble" ratio="1 / 1" sizes="30vw" decorative />
            </div>
          </div>
        </div>
      </section>

      {/* 05 Extras */}
      <section id="extras" className="scroll-mt-24 pb-24 md:pb-36" aria-labelledby="extras-title">
        <div className="content-width grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="t-label">05 · Extras</p>
            <h2 id="extras-title" className="t-h2 mt-5">Add what you need.</h2>
            <p className="mt-5 text-body">Skip what you do not.</p>
          </div>
          <ul className="border-t border-border lg:col-span-7 lg:col-start-6">
            {addons.map((a) => (
              <li key={a.name} className="flex items-baseline justify-between gap-6 border-b border-border py-5">
                <span className="font-display text-2xl font-semibold md:text-3xl" style={{ letterSpacing: "-0.03em" }}>{a.name}</span>
                <span className="nums text-xl font-semibold">£{a.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ and CTA */}
      <section className="pb-28 md:pb-40" aria-labelledby="svc-faq">
        <div className="content-width grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="svc-faq" className="t-h2">Common questions.</h2>
            <div className="mt-8"><Pill to="/start">Start your project</Pill></div>
          </div>
          <div className="lg:col-span-7 lg:col-start-6"><FaqList items={faqs.slice(0, 4)} /></div>
        </div>
      </section>
    </Layout>
  );
}
