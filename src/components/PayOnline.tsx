import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { fetchCheckoutStatus, startCheckout } from "@/lib/checkout";
import { getPackage } from "@/data/packages";

/**
 * Renders nothing unless the server reports that online payment is switched on for this package.
 * With no Stripe configuration (the default) this component is invisible.
 */
export function PayOnline({ packageId, email }: { packageId: string | null; email?: string }) {
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!packageId) return;
    const ctrl = new AbortController();
    fetchCheckoutStatus(ctrl.signal).then((s) => setEnabled(s.enabled && s.packages.includes(packageId)));
    return () => ctrl.abort();
  }, [packageId]);

  const pkg = packageId ? getPackage(packageId) : undefined;
  if (!enabled || !pkg) return null;

  const half = pkg.payment.startsWith("50%");
  const amount = half ? (Number(pkg.price) / 2).toFixed(2) : Number(pkg.price).toFixed(2);

  return (
    <div className="mx-auto mt-4 max-w-sm rounded-xl border border-border bg-card p-4 text-left sm:mt-6">
      <p className="text-sm font-semibold">Pay online</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {half ? `Pay the 50% deposit (£${amount})` : `Pay £${amount}`} for {pkg.name} on Stripe's secure page.
      </p>
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError(null);
          try {
            window.location.assign(await startCheckout(pkg.id, email));
          } catch (e) {
            setError(e instanceof Error ? e.message : "We couldn't start payment.");
            setBusy(false);
          }
        }}
        className="btn-primary btn-md mt-3 min-h-[44px] w-full justify-center disabled:opacity-70"
      >
        {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {busy ? "Opening Stripe…" : `Pay £${amount} now`}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
