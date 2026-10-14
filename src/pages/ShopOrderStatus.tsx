import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { pounds } from "@/data/shop";

interface Summary {
  ref: string;
  status: "pending" | "paid" | "expired";
  createdAt: string;
  paidAt?: string;
  hasPhysical: boolean;
  totalPence: number;
  lines: { name: string; variant: string; qty: number }[];
}

const STATUS_TEXT: Record<Summary["status"], { title: string; text: (o: Summary) => string }> = {
  pending: { title: "Awaiting payment", text: () => "We haven't received payment for this order. If you've just paid, wait a minute and check again. If you didn't finish paying, nothing was charged." },
  paid: { title: "Paid: being prepared", text: (o) => (o.hasPhysical ? "We have your payment and your details. We're making your items to order and will email you a dispatch date." : "We have your payment. Your files are emailed to the address you used. Check your spam folder, or contact us.") },
  expired: { title: "Expired", text: () => "This checkout expired before payment, so nothing was charged. You can order again from your basket." },
};

export default function ShopOrderStatus() {
  const [ref, setRef] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<Summary | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    if (!ref.trim() || !email.trim()) {
      setError("Enter your order reference and the email address you used.");
      return;
    }
    setBusy(true);
    try {
      const r = await fetch(`/api/shop-order?ref=${encodeURIComponent(ref.trim())}&email=${encodeURIComponent(email.trim())}`);
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || "We couldn't check that order. Please try again.");
      setOrder(j.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't check that order. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Layout>
      <Seo path="/shop/order-status" />
      <section className="content-width max-w-xl pt-28 pb-16 sm:pt-36">
        <h1 className="text-headline">Check your order</h1>
        <p className="text-body-lg mt-3">Enter the reference from your confirmation email, and the email address you ordered with.</p>
        <form onSubmit={submit} noValidate className="mt-8 space-y-4">
          <div>
            <label htmlFor="ref" className="mb-1.5 block text-sm font-medium">Order reference <span className="font-normal text-muted-foreground">(required)</span></label>
            <input id="ref" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="OSS-XXXXXXXX" autoComplete="off" autoCapitalize="characters" className="input-base text-base" aria-required />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email address <span className="font-normal text-muted-foreground">(required)</span></label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="input-base text-base" aria-required />
          </div>
          {error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <button type="submit" disabled={busy} aria-busy={busy} className="btn-primary btn-lg min-h-[44px] justify-center disabled:opacity-70">
            {busy ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Checking…</>) : "Check order"}
          </button>
        </form>

        {order && (
          <div role="status" className="mt-8 rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Order <span className="nums">{order.ref}</span></p>
            <h2 className="mt-1 text-xl font-bold">{STATUS_TEXT[order.status].title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{STATUS_TEXT[order.status].text(order)}</p>
            <ul className="mt-4 divide-y divide-border text-sm">
              {order.lines.map((l, i) => (
                <li key={i} className="flex justify-between gap-3 py-2"><span>{l.name} <span className="text-muted-foreground">({l.variant})</span></span><span className="nums">x {l.qty}</span></li>
              ))}
              <li className="flex justify-between py-2 font-bold"><span>Total</span><span className="nums">{pounds(order.totalPence)}</span></li>
            </ul>
          </div>
        )}
        <p className="mt-8 text-sm text-muted-foreground">Can't find your reference? <Link className="underline underline-offset-4" to="/contact">Contact us</Link>.</p>
      </section>
    </Layout>
  );
}
