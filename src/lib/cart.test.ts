import { beforeEach, describe, expect, it } from "vitest";
import { CART_KEY, MAX_LINES, addLine, cartTotals, countItems, describeLine, loadCart, removeLine, sanitiseCart, saveCart, setQty } from "./cart";

const pers = { businessName: "Smith Plumbing", reviewLink: "https://g.page/r/Cabc/review" };
const card = (qty = 1, variantId = "x1", personalisation = pers) => ({ slug: "review-card", variantId, qty, personalisation });

describe("cart", () => {
  beforeEach(() => localStorage.clear());

  it("merges identical lines and keeps different personalisation apart", () => {
    let l = addLine([], card());
    l = addLine(l, card(2));
    expect(l).toHaveLength(1);
    expect(l[0].qty).toBe(3);
    l = addLine(l, card(1, "x1", { ...pers, businessName: "Other Co" }));
    expect(l).toHaveLength(2);
    l = addLine(l, card(1, "x5"));
    expect(l).toHaveLength(3);
  });

  it("clamps quantity to the product maximum and ignores unknown items", () => {
    let l = addLine([], card(99));
    expect(l[0].qty).toBe(10);
    l = setQty(l, l[0].id, 0);
    expect(l[0].qty).toBe(1);
    l = setQty(l, l[0].id, 500);
    expect(l[0].qty).toBe(10);
    expect(addLine([], { slug: "nope", variantId: "x", qty: 1, personalisation: {} })).toEqual([]);
    expect(addLine([], card(1, "x999"))).toEqual([]);
  });

  it("caps the number of lines", () => {
    let l: ReturnType<typeof addLine> = [];
    for (let i = 0; i < MAX_LINES + 3; i++) l = addLine(l, card(1, "x1", { ...pers, businessName: `Co ${i}` }));
    expect(l).toHaveLength(MAX_LINES);
  });

  it("totals come from the catalogue, count items, and removal works", () => {
    let l = addLine([], card(2, "x5"));
    l = addLine(l, { slug: "digital-qr-pack", variantId: "pack", qty: 1, personalisation: { url1: "https://example.co.uk" } });
    expect(countItems(l)).toBe(3);
    const t = cartTotals(l);
    expect(t.subtotalPence).toBe(2 * 5900 + 999);
    expect(t.shippingPence).toBe(0);
    l = removeLine(l, l[0].id);
    expect(l).toHaveLength(1);
    expect(cartTotals([]).totalPence).toBe(0);
  });

  it("persists and reloads, and survives corrupt or tampered storage", () => {
    const l = addLine([], card(2));
    saveCart(l);
    expect(loadCart()).toEqual(l);
    saveCart([]);
    expect(localStorage.getItem(CART_KEY)).toBeNull();
    localStorage.setItem(CART_KEY, "{not json");
    expect(loadCart()).toEqual([]);
    localStorage.setItem(CART_KEY, JSON.stringify([{ id: "a", slug: "review-card", variantId: "x1", qty: -5, personalisation: { businessName: "A", reviewLink: "https://evil.example" } }, { slug: "gone", variantId: "x", qty: 1 }, { id: "b", slug: "review-card", variantId: "x1", qty: 999999, price: 1, personalisation: pers }]));
    const clean = loadCart();
    expect(clean).toHaveLength(1);
    expect(clean[0].qty).toBe(10);
    expect("price" in clean[0]).toBe(false);
  });

  it("sanitiseCart rejects non-arrays", () => {
    expect(sanitiseCart({})).toEqual([]);
    expect(sanitiseCart(null)).toEqual([]);
  });

  it("masks passwords when describing a line", () => {
    const l = addLine([], { slug: "qr-table-sign", variantId: "a6", qty: 1, personalisation: { purpose: "wifi", businessName: "Cafe", ssid: "Guest", security: "WPA", password: "hunter22" } });
    const d = describeLine(l[0]);
    expect(d.find((x) => x.label === "Wi-Fi password")?.value).toBe("••••••••");
    expect(JSON.stringify(d)).not.toContain("hunter22");
    expect(d.find((x) => x.label === "What should the sign do?")?.value).toBe("Join our Wi-Fi");
  });
});
