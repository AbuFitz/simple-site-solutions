import { describe, expect, it } from "vitest";
import { defaultInput } from "./generate";
import { firstIncomplete, isComplete, stepEmpty, stepHint, suggestedServices } from "./wizard";

const base = { ...defaultInput(), name: "Smith & Sons", category: "plumbing" as const, town: "Watford", phone: "07123456789" };
const chosen = { categoryChosen: true };

describe("guided steps", () => {
  it("starts at the first unanswered step and walks forward as answers arrive", () => {
    expect(firstIncomplete(defaultInput(), { categoryChosen: false })).toBe("name");
    expect(firstIncomplete({ ...defaultInput(), name: "Smith" }, { categoryChosen: false })).toBe("trade");
    expect(firstIncomplete({ ...defaultInput(), name: "Smith" }, chosen)).toBe("place");
    expect(firstIncomplete({ ...defaultInput(), name: "Smith", town: "Watford" }, chosen)).toBe("contact");
    expect(firstIncomplete(base, chosen)).toBe("review");
  });

  it("a default trade isn't an answer, but nothing is mandatory", () => {
    expect(stepEmpty("trade", base, { categoryChosen: false })).toBe(true);
    expect(stepEmpty("trade", base, chosen)).toBe(false);
  });

  it("place counts a town or a valid postcode", () => {
    expect(stepEmpty("place", { ...base, town: "" }, chosen)).toBe(true);
    expect(stepEmpty("place", { ...base, town: "", postcode: "WD17 1AA" }, chosen)).toBe(false);
    expect(stepEmpty("place", { ...base, town: "", postcode: "nonsense" }, chosen)).toBe(true);
  });

  it("malformed entries get a hint, never a block", () => {
    expect(stepHint("place", { ...base, postcode: "nonsense" })).toMatch(/postcode/);
    expect(stepHint("place", { ...base, postcode: "" })).toBeNull();
    expect(stepHint("contact", { ...base, phone: "12" })).toMatch(/UK phone/);
    expect(stepHint("contact", { ...base, email: "nope" })).toMatch(/email/);
    expect(stepHint("contact", { ...base, phone: "", email: "" })).toBeNull();
  });

  it("contact is answered by a valid phone or email", () => {
    expect(stepEmpty("contact", { ...base, phone: "" }, chosen)).toBe(true);
    expect(stepEmpty("contact", { ...base, phone: "", email: "a@b.co" }, chosen)).toBe(false);
  });

  it("completeness ignores services", () => {
    expect(isComplete(base, chosen)).toBe(true);
    expect(isComplete({ ...base, name: "  " }, chosen)).toBe(false);
    expect(isComplete(base, { categoryChosen: false })).toBe(false);
  });

  it("suggests six trade-specific services", () => {
    expect(suggestedServices(base)).toHaveLength(6);
    expect(suggestedServices({ ...base, category: "barber" })[0]).not.toBe(suggestedServices(base)[0]);
  });
});
