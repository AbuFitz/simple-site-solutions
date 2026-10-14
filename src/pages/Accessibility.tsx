import { Layout } from "@/components/layout/Layout";
import { Seo, breadcrumb } from "@/components/seo/Seo";
import { SITE } from "@/data/site";

export default function Accessibility() {
  return (
    <Layout>
      <Seo path="/accessibility"
        jsonLd={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Accessibility", path: "/accessibility" },
        ])}
      />
      <section className="content-width max-w-3xl pt-24 pb-16 sm:pt-32 sm:pb-24">
        <h1 className="text-headline">Accessibility statement</h1>
        <p className="text-body-lg mt-4">We want everyone to be able to use this website. This statement is a working draft and has not been through a formal audit.</p>

        <h2 className="text-title mt-10">What we aim for</h2>
        <p className="text-body mt-3">We aim to meet WCAG 2.2 level AA. We design for keyboard use, visible focus, clear headings and landmarks, labelled form fields with error messages, readable colour contrast, text that resizes to 200%, and reduced motion.</p>

        <h2 className="text-title mt-10">What we test</h2>
        <p className="text-body mt-3">We run automated checks (axe) on each page, and check by hand with a keyboard, at phone and desktop widths, with reduced motion turned on, and with 3D turned off. Automated checks don't catch everything.</p>

        <h2 className="text-title mt-10">3D and motion</h2>
        <p className="text-body mt-3">The Our Work section on the home page uses an optional 3D view. Every project in it is also reachable as plain pages under Our Work. If your device asks for reduced motion, or 3D isn't available, you get a still version. Add <code>?3d=0</code> to the address to switch 3D off.</p>

        <h2 className="text-title mt-10">The shop</h2>
        <p className="text-body mt-3">The shop's filters, product options, basket, quantity controls and checkout review are built as labelled form controls that work with a keyboard, with errors announced next to the field and basket changes announced by a status message. Product pictures are illustrations with a text alternative and the product information is in text.</p>

        <h2 className="text-title mt-10">Known limits</h2>
        <p className="text-body mt-3">The 3D view can't be read by screen readers, so the same information is provided as text on the page and on each project's page. Some screenshots of other sites show those sites as they were when captured.</p>

        <h2 className="text-title mt-10">Report a problem</h2>
        <p className="text-body mt-3">
          If something is hard to use, email <a className="underline underline-offset-4" href={`mailto:${SITE.email}`}>{SITE.email}</a> and tell us the page and what happened. We'll reply by email.
        </p>
      </section>
    </Layout>
  );
}
