import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { useCart } from "@/components/shop/CartProvider";
import { ProductVisual } from "@/components/shop/ProductVisual";
import { ShopCrossSell } from "@/components/shop/ShopCrossSell";
import { SHIPPING, getProduct, getVariant, pounds } from "@/data/shop";
import { describeLine } from "@/lib/cart";

export default function ShopCart() {
  const { lines, totals, setQty, remove } = useCart();
  const physicalSubtotal = lines.reduce((n, l) => {
    const p = getProduct(l.slug);
    const v = p && getVariant(p, l.variantId);
    return p?.fulfilment === "physical" && v ? n + v.pricePence * l.qty : n;
  }, 0);
  const toFree = totals.hasPhysical && totals.shippingPence > 0 ? SHIPPING.freeOverPence - physicalSubtotal : 0;

  return (
    <Layout>
      <Seo path="/shop/cart" />
      <section className="content-width pt-24 pb-16 sm:pt-32 sm:pb-24">
        <h1 className="text-headline">Your basket</h1>

        {lines.length === 0 ? (
          <div className="mt-8 space-y-8">
            <div className="bordered-section bg-card p-6">
              <h2 className="text-title">Your basket is empty</h2>
              <p className="mt-2 text-muted-foreground">Nothing's been added yet. Your basket is kept in this browser, so it'll be here if you come back.</p>
              <Link to="/shop" className="btn-primary btn-md mt-4 min-h-[44px] justify-center !text-background">Browse the shop</Link>
            </div>
            <ShopCrossSell context="product" slugs={["review-card", "qr-table-sign", "digital-qr-pack"]} />
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <ul aria-label="Items in your basket" className="space-y-4">
              {lines.map((l) => {
                const p = getProduct(l.slug)!;
                const v = getVariant(p, l.variantId)!;
                const detail = describeLine(l);
                return (
                  <li key={l.id} className="bordered-section grid gap-4 bg-card p-4 sm:grid-cols-[140px_1fr]">
                    <div className="self-start overflow-hidden rounded-lg"><ProductVisual kind={p.visual} className="aspect-[4/3] w-full" /></div>
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="font-semibold">
                            <Link className="hover:text-primary" to={`/shop/${p.slug}`}>{p.name}</Link>
                          </h2>
                          <p className="text-sm text-muted-foreground">{v.label}</p>
                        </div>
                        <p className="nums font-bold">{pounds(v.pricePence * l.qty)}</p>
                      </div>
                      <dl className="mt-3 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
                        {detail.map((d) => (
                          <div key={d.label} className="contents">
                            <dt className="text-muted-foreground">{d.label}</dt>
                            <dd className="break-words">{d.value}</dd>
                          </div>
                        ))}
                      </dl>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2" role="group" aria-label={`Quantity for ${p.name}, ${v.label}`}>
                          <button type="button" aria-label="Decrease quantity" disabled={l.qty <= 1} onClick={() => setQty(l.id, l.qty - 1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border hover:bg-secondary disabled:opacity-40">
                            <Minus className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <span className="nums w-8 text-center" aria-live="polite">{l.qty}</span>
                          <button type="button" aria-label="Increase quantity" disabled={l.qty >= p.maxQty} onClick={() => setQty(l.id, l.qty + 1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border hover:bg-secondary disabled:opacity-40">
                            <Plus className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                        <button type="button" onClick={() => remove(l.id)} aria-label={`Remove ${p.name}, ${v.label}`} className="inline-flex min-h-[44px] items-center gap-2 px-2 text-sm text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" aria-hidden="true" /> Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <aside aria-labelledby="summary" className="bordered-section h-fit bg-card p-5 lg:sticky lg:top-28">
              <h2 id="summary" className="text-lg font-semibold">Order summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Items</dt><dd className="nums">{pounds(totals.subtotalPence)}</dd></div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{totals.hasPhysical ? SHIPPING.label : "Delivery"}</dt>
                  <dd className="nums">{totals.hasPhysical ? (totals.shippingPence === 0 ? "Free" : pounds(totals.shippingPence)) : "Emailed, no charge"}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base font-bold"><dt>Total</dt><dd className="nums">{pounds(totals.totalPence)}</dd></div>
              </dl>
              {toFree > 0 && <p className="mt-3 text-xs text-muted-foreground">Add {pounds(toFree)} more of posted items for free delivery.</p>}
              <p className="mt-3 text-xs text-muted-foreground">UK mainland delivery only. Prices are what you pay; VAT is still to be confirmed. You'll check everything again before you pay.</p>
              <Link to="/shop/checkout" className="btn-primary btn-lg mt-5 min-h-[44px] w-full justify-center !text-background">Review and pay</Link>
              <Link to="/shop" className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center text-sm underline underline-offset-4">Keep shopping</Link>
            </aside>
          </div>
        )}

        {lines.length > 0 && (
          <div className="mt-12">
            <ShopCrossSell context="cart" slugs={[...new Set(lines.flatMap((l) => getProduct(l.slug)?.related ?? []))]} exclude={lines.map((l) => l.slug)} />
          </div>
        )}
      </section>
    </Layout>
  );
}
