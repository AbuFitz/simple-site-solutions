import { describe, expect, it } from "vitest";
import { briefSchema } from "./brief-schema";

const ok = {
  businessName: "Smith Plumbing",
  name: "Sam Smith",
  email: "sam@example.co.uk",
  phone: "07700 900123",
  businessDescription: "Plumber in Watford",
  websiteUrl: "",
  details: "",
  selectedPackage: "growth",
  selectedAddons: ["logo"],
};

describe("briefSchema", () => {
  it("accepts a valid brief", () => {
    expect(briefSchema.safeParse(ok).success).toBe(true);
  });
  it("rejects an unknown package and add-on", () => {
    expect(briefSchema.safeParse({ ...ok, selectedPackage: "free" }).success).toBe(false);
    expect(briefSchema.safeParse({ ...ok, selectedAddons: ["hack"] }).success).toBe(false);
  });
  it("rejects a bad email and a filled honeypot", () => {
    expect(briefSchema.safeParse({ ...ok, email: "nope" }).success).toBe(false);
    expect(briefSchema.safeParse({ ...ok, company_site: "x" }).success).toBe(false);
  });
  it("limits long input", () => {
    expect(briefSchema.safeParse({ ...ok, details: "x".repeat(2001) }).success).toBe(false);
  });
  it("allows blank optional fields", () => {
    expect(briefSchema.safeParse({ ...ok, phone: "", websiteUrl: "", details: "" }).success).toBe(true);
  });
});
