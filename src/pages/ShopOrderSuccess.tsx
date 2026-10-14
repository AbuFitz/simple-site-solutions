import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { useCart } from "@/components/shop/CartProvider";
import { pounds } from "@/data/shop";
import { SITE } from "@/data/site";

interface Summary {
  ref: string;
  hasPhysical: boolean;
  totalPence: number;
  lines: { name: string; variant: string; qty: number }[];
}
type State = { kind: "checking" } | { kind: "paid"; order: Summary } | { kind: "unpaid" } | { kind: "problem" };

export default function ShopOrderSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id") ?? "";
  const [state, setState] = useState<State>({ kind: "checking" });
  const { clear } = useCart();
  const cleared = useRef(false);

  useEffect(() => {
    if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
      setState({ kind: "problem" });
      return;
    }
    const ctrl = new AbortController();
    fetch(`/api/shop-order?session_id=${encodeURIComponent(sessionId)}`, { signal: ctrl.signal })
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (r.ok && j.verdict === "paid" && j.order) setState({ kind: "paid", order: j.order });
        else if (r.ok && j.verdict === "unpaid") setState({ kind: "unpaid" });
        else setState({ kind: "problem" });
      })
      .catch((e) => {
        if (e?.name !== "AbortError") setState({ kind: "problem" });
      });
    return () => ctrl.abort();
  }, [sessionId]);

  // The basket is emptied only once the server has confirmed payment.
  useEffect(() => {
    if (state.kind === "paid" && !cleared.current) {
      cleared.current = true;
      clear();
    }
  }, [state, clear]);

  return (
    <Layout>
      <Seo path="/shop/order/success" />
      <section className="content-width max-w-2xl pt-28 pb-16 sm:pt-36" aria-live="polite">
        {state.kind === "checking" && <h1 className="text-headline">Checking your payment…</h1>}
        {state.kind === "paid" && (
          <>
            <h1 className="text-headline">
              Order <span className="text-primary">received</span>
            </h1>
            <p className="text-body-lg mt-4">
              Thank you. Your reference is <strong className="nums text-foreground">{state.order.ref}</strong>. We've emailed a confirmation{state.order.hasPhysical ? " and we'll email you a dispatch date once your items are in production" : ""}.
            </p>
            <ul className="mt-6 divide-y divide-border rounded-xl border border-border bg-card">
              {state.order.lines.map((l, i) => (
                <li key={i} className="flex justify-between gap-3 p-4 text-sm">
                  <span>{l.name} <span className="text-muted-foreground">({l.variant})</span></span>
                  <span className="nums">x {l.qty}</span>
                </li>
              ))}
              <li className="flex justify-between p-4 font-bold"><span>Total paid</span><span className="nums">{pounds(state.order.totalPence)}</span></li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">Keep your reference. You can check your order any time on the <Link className="underline underline-offset-4" to="/shop/order-status">order status page</Link> with your email address.</p>
          </>
        )}
        {state.kind === "unpaid" && (
          <>
            <h1 className="text-headline">Payment not completed</h1>
            <p className="text-body-lg mt-4">Stripe hasn't confirmed this payment, so nothing is shown as paid and your basket is still saved. If you were charged, email {SITE.email} with the time and we'll check.</p>
          </>
        )}
        {state.kind === "problem" && (
          <>
            <h1 className="text-headline">We couldn't confirm your order</h1>
            <p className="text-body-lg mt-4">Nothing is shown as paid here, and your basket hasn't been emptied. If you were charged, email {SITE.email} and we'll sort it out.</p>
          </>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/shop" className="btn-primary btn-lg min-h-[44px] justify-center !text-background">Back to the shop</Link>
          <Link to="/contact" className="btn-outline btn-lg min-h-[44px] justify-center">Contact us</Link>
        </div>
      </section>
    </Layout>
  );
}
