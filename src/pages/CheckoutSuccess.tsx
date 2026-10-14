import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { getPackage } from "@/data/packages";
import { SITE } from "@/data/site";

type State =
  | { kind: "checking" }
  | { kind: "paid"; pkg: string; amountTotal: number }
  | { kind: "unpaid" }
  | { kind: "problem" };

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id") ?? "";
  const [state, setState] = useState<State>({ kind: "checking" });

  useEffect(() => {
    if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
      setState({ kind: "problem" });
      return;
    }
    const ctrl = new AbortController();
    fetch(`/api/checkout-session?session_id=${encodeURIComponent(sessionId)}`, { signal: ctrl.signal })
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (r.ok && j.status === "paid") setState({ kind: "paid", pkg: j.package, amountTotal: j.amountTotal });
        else if (r.ok && j.status === "unpaid") setState({ kind: "unpaid" });
        else setState({ kind: "problem" });
      })
      .catch((e) => {
        if (e?.name !== "AbortError") setState({ kind: "problem" });
      });
    return () => ctrl.abort();
  }, [sessionId]);

  const name = state.kind === "paid" ? getPackage(state.pkg)?.name : undefined;

  return (
    <Layout>
      <Seo path="/checkout/success" noindex />
      <section className="content-width mx-auto max-w-xl pt-28 pb-16 sm:pt-36" aria-live="polite">
        {state.kind === "checking" && <h1 className="text-headline">Checking your payment…</h1>}
        {state.kind === "paid" && (
          <>
            <h1 className="text-headline">
              Payment <span className="text-primary">received</span>
            </h1>
            <p className="text-body-lg mt-4">
              Thank you. We received £{(state.amountTotal / 100).toFixed(2)} for {name ?? "your package"}. Stripe emails the receipt. We'll email you to confirm scope and next steps.
            </p>
          </>
        )}
        {state.kind === "unpaid" && (
          <>
            <h1 className="text-headline">Payment not completed</h1>
            <p className="text-body-lg mt-4">Stripe hasn't confirmed this payment yet. If you were charged, email {SITE.email} with the time and we'll check.</p>
          </>
        )}
        {state.kind === "problem" && (
          <>
            <h1 className="text-headline">We couldn't confirm your payment</h1>
            <p className="text-body-lg mt-4">
              Nothing is shown as paid here. If you were charged, email {SITE.email} and we'll sort it out.
            </p>
          </>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/" className="btn-primary btn-lg min-h-[44px] justify-center !text-background">Back to home</Link>
          <Link to="/contact" className="btn-outline btn-lg min-h-[44px] justify-center">Contact us</Link>
        </div>
      </section>
    </Layout>
  );
}
