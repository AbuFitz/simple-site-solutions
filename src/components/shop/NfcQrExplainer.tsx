import { Link } from "react-router-dom";

/** Plain-English, honest explanation of NFC and QR. Keep claims modest and sourced (docs/shop-research.md). */
export function NfcQrExplainer({ showLink = true }: { showLink?: boolean }) {
  const items = [
    {
      title: "QR code",
      text: "A square code. Point a phone camera at it and the phone offers to open the link. It works on virtually every current phone and needs no app.",
    },
    {
      title: "NFC tap",
      text: "A small chip inside the product. Hold a phone close to it and the phone offers to open the link. The chip has no battery. Most recent phones can read it; some older or budget phones can't, and some Android phones need NFC switched on. That's why we always print a QR code too.",
    },
    {
      title: "Fixed once made",
      text: "The link is set when we make your product. If it needs to point somewhere new, you need a new one, or a link on a page you control, such as your own website. We don't offer tracking or scan statistics.",
    },
  ];
  return (
    <section aria-labelledby="nfc-explainer" className="bordered-section bg-card p-5 sm:p-6">
      <h2 id="nfc-explainer" className="text-xl font-bold tracking-tight">
        NFC and QR, plainly
      </h2>
      <dl className="mt-4 grid gap-5 md:grid-cols-3">
        {items.map((i) => (
          <div key={i.title}>
            <dt className="font-semibold">{i.title}</dt>
            <dd className="mt-1 text-sm text-muted-foreground">{i.text}</dd>
          </div>
        ))}
      </dl>
      {showLink && (
        <Link to="/shop/help" className="mt-4 inline-flex min-h-[44px] items-center text-sm font-semibold text-primary underline-offset-4 hover:underline">
          Delivery, returns and more questions
        </Link>
      )}
    </section>
  );
}
