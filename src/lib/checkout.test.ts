import { describe, expect, it } from "vitest";
import { isStripeCheckoutUrl } from "./checkout";

describe("isStripeCheckoutUrl", () => {
  it("accepts only Stripe's hosted checkout", () => {
    expect(isStripeCheckoutUrl("https://checkout.stripe.com/c/pay/cs_test_1")).toBe(true);
    expect(isStripeCheckoutUrl("http://checkout.stripe.com/x")).toBe(false);
    expect(isStripeCheckoutUrl("https://checkout.stripe.com.evil.example/x")).toBe(false);
    expect(isStripeCheckoutUrl("javascript:alert(1)")).toBe(false);
    expect(isStripeCheckoutUrl(undefined)).toBe(false);
  });
});
