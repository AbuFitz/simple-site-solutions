import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Lock } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { useCart } from "@/components/shop/CartProvider";
import { NotifyForm } from "@/components/shop/NotifyForm";
import { SHIPPING, getProduct, getVariant, pounds } from "@/data/shop";
import { describeLine } from "@/lib/cart";
import { isStripeCheckoutUrl } from "@/lib/checkout";
import { statusOf, useShopStatus } from "@/lib/shop-status";

export default function ShopCheckout() {
  const { lines, totals } = useCart();
  const status = useShopStatus();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [terms, setTerms] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState("");

  const lineStatus = lines.map((l) => statusOf(status, l.slug, l.variantId));
  const blocked = status.state === "ready" && !status.open ? true : lineStatus.some((s) => s === "unavailable" || s === "sold-out");
  const checking = status.state === "loading";
  const unreachable = status.state === "error";
  const canPay = !blocked && !checking && !unreachable && lines.length > 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProblem("");
    let ok = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Enter an email address like name@example.com");
      ok = false;
    } else setEmailError("");
    if (!terms) {
      setTermsError("Tick the box to confirm you've checked your details and agree to the terms.");
      ok = false;
    } else setTermsError("");
    if (!ok || !canPay) return;

    setBusy(true);
    try {
      const r = await fetch("/api/shop-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          acceptTerms: true,
          items: lines.map((l) => ({ slug: l.slug, variantId: l.variantId, qty: l.qty, personalisation: l.personalisation })),
        }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        if (r.status === 429) setProblem("Too many attempts. Please wait a few minutes and try again.");
        else if (j.code === "unavailable") setProblem("Ordering isn't open for part of your basket right now. Nothing was charged.");
        else if (j.code === "insufficient-stock") setProblem("There isn't enough stock for part of your basket. Reduce the quantity or remove the item.");
        else if (j.code === "personalisation") setProblem("Some of your details need fixing. Remove the item and add it again with corrected details.");
        else setProblem(j.error || "We couldn't start payment. Your basket is saved; please try again.");
        return;
      }
      if (!isStripeCheckoutUrl(j.url)) {
        setProblem("We couldn't start payment. Your basket is saved; please try again.");
        return;
      }
      window.location.assign(j.url);
    } catch {
      setProblem("We couldn't reach the server. Check your connection and try again. Your basket is saved.");
    } finally {
      setBusy(false);
    }
  };

  if (lines.length === 0)
    return (
      <Layout>
        <Seo path="/shop/checkout" />
        <section className="content-width max-w-xl pt-28 pb-20 sm:pt-36">
          <h1 className="text-headline">Nothing to check out</h1>
          <p className="text-body-lg mt-4">Your basket is empty.</p>
          <Link to="/shop" className="btn-primary btn-lg mt-6 min-h-[44px] justify-center !text-background">Browse the shop</Link>
        </section>
      </Layout>
    );

  return (
    <Layout>
      <Seo path="/shop/checkout" />
      <section className="content-width pt-24 pb-16 sm:pt-32 sm:pb-24">
        <Link to="/shop/cart" className="inline-flex min-h-[44px] items-center text-sm text-muted-foreground hover:text-foreground">Back to basket</Link>
        <h1 className="text-headline mt-2">Review your order</h1>
        <p className="text-body-lg mt-3 max-w-2xl">Check every detail. We make each product exactly as entered. Payment is taken on Stripe's secure page, and we never see your card details.</p>

        {(blocked || unreachable) && (
          <div role="alert" className="mt-6 rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold">{unreachable ? "We can't check availability right now" : "You can't pay yet"}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {unreachable
                ? "We couldn't confirm that ordering is open, so payment is switched off. Your basket is saved. Try again in a few minutes."
                : status.state === "ready" && !status.open
                  ? "Ordering isn't open yet. Your basket is saved in this browser. Leave your email and we'll tell you once when it opens."
                  : "Some items in your basket can't be ordered right now. Remove them, or leave your email and we'll tell you when they're back."}
            </p>
            {!unreachable && <div className="relative mt-4 max-w-md"><NotifyForm slugs={lines.map((l) => l.slug)} /></div>}
          </div>
        )}

        <form onSubmit={submit} noValidate className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section aria-labelledby="items-h">
              <h2 id="items-h" className="text-lg font-semibold">Items</h2>
              <ul className="mt-3 space-y-3">
                {lines.map((l, i) => {
                  const p = getProduct(l.slug)!;
                  const v = getVariant(p, l.variantId)!;
                  return (
                    <li key={l.id} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex justify-between gap-3">
                        <div>
                          <p className="font-semibold">{p.name}</p>
                          <p className="text-sm text-muted-foreground">{v.label} x {l.qty}</p>
                          {lineStatus[i] === "sold-out" && <p className="text-sm text-destructive">Sold out</p>}
                          {lineStatus[i] === "unavailable" && <p className="text-sm text-muted-foreground">Not available to order yet</p>}
                        </div>
                        <p className="nums font-bold">{pounds(v.pricePence * l.qty)}</p>
                      </div>
                      <dl className="mt-3 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
                        {describeLine(l).map((d) => (
                          <div key={d.label} className="contents">
                            <dt className="text-muted-foreground">{d.label}</dt>
                            <dd className="break-words">{d.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section aria-labelledby="contact-h">
              <h2 id="contact-h" className="text-lg font-semibold">Where to send your confirmation</h2>
              <div className="mt-3 max-w-md">
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email address <span className="font-normal text-muted-foreground">(required)</span></label>
                <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={Boolean(emailError)} aria-describedby={emailError ? "email-err" : "email-hint"} aria-required className="input-base text-base" placeholder="name@example.com" />
                <p id="email-hint" className="mt-1 text-xs text-muted-foreground">We email your confirmation and order reference here{totals.hasPhysical ? "; you'll give your delivery address on the next page" : ", and your files if you ordered the digital pack"}.</p>
                {emailError && <p id="email-err" role="alert" className="mt-1.5 text-sm text-destructive">{emailError}</p>}
              </div>
            </section>

            <section aria-labelledby="terms-h">
              <h2 id="terms-h" className="sr-only">Confirm</h2>
              <label className="flex min-h-[44px] cursor-pointer items-start gap-3 text-sm">
                <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} aria-invalid={Boolean(termsError)} aria-describedby={termsError ? "terms-err" : undefined} className="mt-0.5 h-5 w-5 accent-[hsl(var(--primary))]" />
                <span>
                  I've checked my details above. I understand personalised items are made for me, so the 14-day cancellation right doesn't apply to them, and I agree to the <Link className="underline underline-offset-4" to="/terms">terms</Link> and <Link className="underline underline-offset-4" to="/shop/help#returns">returns information</Link>.
                </span>
              </label>
              {termsError && <p id="terms-err" role="alert" className="mt-1.5 text-sm text-destructive">{termsError}</p>}
            </section>
          </div>

          <aside aria-labelledby="pay-h" className="bordered-section h-fit bg-card p-5 lg:sticky lg:top-28">
            <h2 id="pay-h" className="text-lg font-semibold">Total</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Items</dt><dd className="nums">{pounds(totals.subtotalPence)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">{totals.hasPhysical ? SHIPPING.label : "Delivery"}</dt><dd className="nums">{totals.hasPhysical ? (totals.shippingPence === 0 ? "Free" : pounds(totals.shippingPence)) : "Emailed"}</dd></div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-bold"><dt>Total to pay</dt><dd className="nums">{pounds(totals.totalPence)}</dd></div>
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">GBP. VAT is still to be confirmed, so no separate VAT line is shown. The amount charged is calculated again on our server.</p>
            {problem && <p role="alert" className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{problem}</p>}
            <button type="submit" disabled={busy || !canPay} aria-busy={busy} className="btn-primary btn-lg mt-5 min-h-[44px] w-full justify-center disabled:opacity-60">
              {busy ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Opening Stripe…
                </>
              ) : checking ? (
                "Checking availability…"
              ) : canPay ? (
                <>
                  <Lock className="mr-2 h-4 w-4" aria-hidden="true" /> Pay {pounds(totals.totalPence)} securely
                </>
              ) : (
                "Ordering isn't open yet"
              )}
            </button>
          </aside>
        </form>
      </section>
    </Layout>
  );
}
