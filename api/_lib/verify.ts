import type Stripe from "stripe";
import { expectedPence, isPackageId } from "./checkout-config.js";
import type { PaidSession } from "./fulfilment.js";

export type SessionVerdict =
  | { status: "paid"; paid: PaidSession }
  | { status: "unpaid" | "expired" | "invalid" };

/** Never trust the redirect: a session counts as paid only if Stripe says so and the amount is what we expect. */
export function verifySession(s: Stripe.Checkout.Session): SessionVerdict {
  const pkg = s.metadata?.package;
  if (s.mode !== "payment" || !isPackageId(pkg)) return { status: "invalid" };
  if (s.status === "expired") return { status: "expired" };
  if (s.payment_status !== "paid") return { status: "unpaid" };
  if (s.currency !== "gbp" || s.amount_total !== expectedPence(pkg)) return { status: "invalid" };
  return {
    status: "paid",
    paid: { id: s.id, packageId: pkg, amountTotal: s.amount_total, currency: s.currency, email: s.customer_details?.email ?? s.customer_email },
  };
}
