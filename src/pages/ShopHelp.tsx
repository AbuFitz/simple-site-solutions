import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo, breadcrumb } from "@/components/seo/Seo";
import { NfcQrExplainer } from "@/components/shop/NfcQrExplainer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SHIPPING, VAT_NOTE, pounds } from "@/data/shop";
import { SITE } from "@/data/site";

export const shopFaqs = [
  { q: "What exactly do I get?", a: "A product made with your business name and a link you choose. People scan the QR code, or tap the NFC chip where the product has one, and their phone opens that link." },
  { q: "Do I need an app?", a: "No. Phone cameras read QR codes, and phones that support NFC read the chip without an app. Some older or budget phones can't read NFC, which is why every NFC product also has a QR code." },
  { q: "Can I change where it points later?", a: "No: the link is set when we make the product. If you want flexibility, point it at a page on a site you control (for example your OneSimpleSite website) and change that page instead." },
  { q: "Can you get me more Google reviews?", a: "We make it easier for happy customers to open your review form. We don't write reviews, ask only happy customers, offer rewards or hide bad reviews: Google's rules forbid all of that, and so do we." },
  { q: "Where do I find my Google review link?", a: "In Google Business Profile, open your profile, choose 'Ask for reviews' (or 'Get more reviews') and copy the link. It starts with https://g.page/r/. We check that the link you give us looks like one of these before we make anything." },
  { q: "How long will it take?", a: "Everything is made to order. After you pay, we email you a dispatch date. By law we have to deliver within 30 days unless we agree otherwise. Digital QR files are emailed once your payment is confirmed." },
  { q: "Where do you deliver?", a: `The UK mainland only for now. Delivery is ${pounds(SHIPPING.flatPence)}, or free when your posted items come to ${pounds(SHIPPING.freeOverPence)} or more. Digital products have no delivery charge.` },
  { q: "Can I return a personalised item?", a: "Items made to your details are exempt from the 14-day cancellation right, so we can't take them back just because you changed your mind. If something arrives faulty, damaged or not as you ordered, your legal rights apply and we'll put it right." },
  { q: "What happens to my Wi-Fi password?", a: "It's used only to make your sign. We email it to the owner for production and remove it from our order record once the order has been handed off. Use a guest network: the password is printed in the QR code, so anyone who sees the sign can read it." },
  { q: "Is VAT included?", a: VAT_NOTE },
  { q: "Why can't I pay yet?", a: "The shop opens only when prices, production and payment have all been confirmed. Until the site says ordering is open, you can build a basket and ask to be emailed once when it opens." },
];

export default function ShopHelp() {
  return (
    <Layout>
      <Seo
        path="/shop/help"
        jsonLd={[
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            { name: "Delivery, returns & FAQs", path: "/shop/help" },
          ]),
          { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: shopFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
        ]}
      />
      <section className="content-width max-w-3xl pt-24 pb-10 sm:pt-32">
        <h1 className="text-headline">Delivery, returns and shop FAQs</h1>
        <p className="text-body-lg mt-4">Plain answers before you order. Anything missing? <Link className="underline underline-offset-4" to="/contact">Ask us</Link>.</p>

        <h2 className="text-title mt-10" id="delivery">Delivery and lead times</h2>
        <ul className="text-body mt-3 list-disc space-y-2 pl-5">
          <li>Posted products are made to order, so there's no fixed lead time. We email you a dispatch date after you order.</li>
          <li>We must deliver within 30 days unless we agree otherwise with you.</li>
          <li>UK mainland only. {SHIPPING.label}: {pounds(SHIPPING.flatPence)}, free when posted items total {pounds(SHIPPING.freeOverPence)} or more.</li>
          <li>Digital products are emailed after payment is confirmed. There is no delivery charge.</li>
        </ul>

        <h2 className="text-title mt-10" id="returns">Returns, refunds and faults</h2>
        <ul className="text-body mt-3 list-disc space-y-2 pl-5">
          <li>Personalised items are made to your details, so the 14-day change-of-mind cancellation right doesn't apply to them. Check your details before you pay.</li>
          <li>If an item is faulty, damaged or not as described or ordered, you have your statutory rights, and we'll repair, replace or refund as the law requires.</li>
          <li>If we make a mistake with your details, we'll remake it. If you gave us the wrong link, you can order a new one.</li>
          <li>Digital files can't be returned once delivered, but if they don't work, tell us and we'll fix them.</li>
          <li>This page is a working draft pending review by the owner and a legal adviser. See also our <Link className="underline underline-offset-4" to="/terms">terms</Link>.</li>
        </ul>

        <h2 className="text-title mt-10" id="prices">Prices and VAT</h2>
        <p className="text-body mt-3">{VAT_NOTE}</p>

        <h2 className="text-title mt-10" id="data">Your details</h2>
        <p className="text-body mt-3">
          The details you personalise a product with (business name, links, and for Wi-Fi signs the network name and password) are used only to make your order. Delivery details are collected by Stripe and shared with us to post your order. See the <Link className="underline underline-offset-4" to="/privacy">privacy policy</Link>. Questions: {SITE.email}.
        </p>
      </section>

      <section className="content-width max-w-3xl pb-10">
        <NfcQrExplainer showLink={false} />
      </section>

      <section className="content-width max-w-3xl pb-16 sm:pb-24" aria-labelledby="faq-h">
        <h2 id="faq-h" className="text-title">Shop FAQs</h2>
        <Accordion type="single" collapsible className="mt-4">
          {shopFaqs.map((f, i) => (
            <AccordionItem key={f.q} value={`q${i}`}>
              <AccordionTrigger className="min-h-[44px] text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Link to="/shop" className="btn-primary btn-lg mt-8 min-h-[44px] justify-center !text-background">Back to the shop</Link>
      </section>
    </Layout>
  );
}
