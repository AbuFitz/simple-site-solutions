/** Client side of the Stripe Checkout foundation. Prices and redirect URLs are decided by the server. */
export interface CheckoutStatus {
  enabled: boolean;
  packages: string[];
}

export async function fetchCheckoutStatus(signal?: AbortSignal): Promise<CheckoutStatus> {
  try {
    const r = await fetch("/api/checkout-status", { signal });
    if (!r.ok) return { enabled: false, packages: [] };
    const j = (await r.json()) as Partial<CheckoutStatus>;
    return { enabled: j.enabled === true, packages: Array.isArray(j.packages) ? j.packages : [] };
  } catch {
    return { enabled: false, packages: [] };
  }
}

/** Only Stripe's own hosted checkout domain is accepted as a redirect target. */
export function isStripeCheckoutUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname === "checkout.stripe.com";
  } catch {
    return false;
  }
}

export async function startCheckout(packageId: string, email?: string): Promise<string> {
  const r = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ package: packageId, email: email || undefined }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || "We couldn't start payment. Please try again.");
  if (!isStripeCheckoutUrl(j.url)) throw new Error("We couldn't start payment. Please try again.");
  return j.url;
}
