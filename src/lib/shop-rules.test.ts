import { describe, expect, it } from "vitest";
import { cleanText, isGoogleReviewUrl, isHttpsUrl, normaliseUrl, validatePersonalisation, wifiPayload } from "./shop-rules";
import { getProduct } from "../data/shop";

describe("urls", () => {
  it("accepts only Google-issued review links", () => {
    expect(isGoogleReviewUrl("https://g.page/r/CabcDEF123/review")).toBe(true);
    expect(isGoogleReviewUrl("https://search.google.com/local/writereview?placeid=ChIJ123")).toBe(true);
    expect(isGoogleReviewUrl("https://g.page/evil")).toBe(false);
    expect(isGoogleReviewUrl("https://search.google.com/local/writereview")).toBe(false);
    expect(isGoogleReviewUrl("https://g.page.evil.example/r/x")).toBe(false);
    expect(isGoogleReviewUrl("http://g.page/r/x")).toBe(false);
    expect(isGoogleReviewUrl("https://user:pw@g.page/r/x")).toBe(false);
    expect(isGoogleReviewUrl("javascript:alert(1)")).toBe(false);
  });
  it("normalises bare domains and rejects non-https", () => {
    expect(normaliseUrl("www.example.co.uk")).toBe("https://www.example.co.uk");
    expect(isHttpsUrl("www.example.co.uk")).toBe(true);
    expect(isHttpsUrl("http://example.co.uk")).toBe(false);
    expect(isHttpsUrl("ftp://example.co.uk")).toBe(false);
    expect(isHttpsUrl("https://localhost")).toBe(false);
  });
});

describe("personalisation", () => {
  const card = getProduct("review-card")!;
  it("requires name and a valid review link and strips control characters", () => {
    const bad = validatePersonalisation(card, { businessName: "", reviewLink: "https://example.com" });
    expect(bad.ok).toBe(false);
    expect(Object.keys(bad.errors).sort()).toEqual(["businessName", "reviewLink"]);
    const ok = validatePersonalisation(card, { businessName: "Smith\u0000 \r\nPlumbing", reviewLink: "g.page/r/Cabc/review", extra: "x" });
    expect(ok.ok).toBe(true);
    expect(ok.clean).toEqual({ businessName: "Smith Plumbing", reviewLink: "https://g.page/r/Cabc/review" });
  });
  it("enforces max length and select options", () => {
    expect(validatePersonalisation(card, { businessName: "x".repeat(41), reviewLink: "https://g.page/r/Cabc/review" }).errors.businessName).toBeTruthy();
    const kit = getProduct("review-kit")!;
    expect(validatePersonalisation(kit, { businessName: "Cafe", reviewLink: "https://example.co.uk" }).errors.reviewLink).toBeTruthy();
  });
  it("table sign: fields depend on the purpose, hidden fields are ignored", () => {
    const t = getProduct("qr-table-sign")!;
    expect(validatePersonalisation(t, { purpose: "menu", businessName: "Cafe", link: "cafe.co.uk" }).clean).toEqual({ purpose: "menu", businessName: "Cafe", link: "https://cafe.co.uk" });
    const noLink = validatePersonalisation(t, { purpose: "menu", businessName: "Cafe" });
    expect(noLink.errors.link).toBeTruthy();
    const wifiOk = validatePersonalisation(t, { purpose: "wifi", businessName: "Cafe", ssid: "Guest", security: "WPA", password: "pass", link: "https://ignored.example" });
    expect(wifiOk.ok).toBe(true);
    expect(wifiOk.clean.link).toBeUndefined();
    expect(validatePersonalisation(t, { purpose: "wifi", businessName: "Cafe", ssid: "Guest", security: "WPA" }).errors.password).toBeTruthy();
    expect(validatePersonalisation(t, { purpose: "wifi", businessName: "Cafe", ssid: "Guest", security: "nopass", password: "x" }).errors.password).toBeTruthy();
    expect(validatePersonalisation(t, { purpose: "wifi", businessName: "Cafe", ssid: "Guest", security: "nopass" }).ok).toBe(true);
    expect(validatePersonalisation(t, { purpose: "wifi", businessName: "Cafe" }).errors.ssid).toBeTruthy();
    expect(validatePersonalisation(t, { purpose: "hack", businessName: "Cafe" }).errors.purpose).toBeTruthy();
  });
});

describe("wifi payload", () => {
  it("escapes special characters", () => {
    expect(wifiPayload("My;Net", "WPA", 'p:a"ss,\\')).toBe(String.raw`WIFI:T:WPA;S:My\;Net;P:p\:a\"ss\,\\;;`);
    expect(wifiPayload("Open", "nopass", "")).toBe("WIFI:T:nopass;S:Open;;");
  });
  it("cleanText", () => expect(cleanText("a\u0007b\nc")).toBe("ab c"));
});
