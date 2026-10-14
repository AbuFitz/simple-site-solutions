import Stripe from "stripe";

let client: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
  client ??= new Stripe(key, { maxNetworkRetries: 2 });
  return client;
}

export const _resetStripe = () => {
  client = null;
};
