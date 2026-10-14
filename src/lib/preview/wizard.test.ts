import { describe, expect, it } from "vitest";
import { defaultInput } from "./generate";
import { firstIncomplete, isComplete, stepProblem, suggestedServices } from "./wizard";

const base = { ...defaultInput(), name: "Smith & Sons", category: "plumbing" as const, town: "Watford", phone: "07123456789" };
const chosen = { categoryChosen: true };

describe("guided steps", () => {
  it("starts at the name and walks forward as answers arrive", () => {
    expect(firstIncomplete(defaultInput(), { categoryChosen: false })).toBe("name");
    expect(firstIncomplete({ ...defaultInput(), name: "Smith" }, { categoryChosen: false })).toBe("trade");
    expect(firstIncomplete({ ...defaultInput(), name: "Smith" }, chosen)).toBe("place");
    expect(firstIncomplete({ ...defaultInput(), name: "Smith", town: "Watford" }, chosen)).toBe("contact");
    expect(firstIncomplete(base, chosen)).toBe("review");
  });

  it("a default trade isn't an answer", () => {
    expect(stepProblem("trade", base, { categoryChosen: false })).toBeTruthy();
    expect(stepProblem("trade", base, chosen)).toBeNull();
  });

  it("place needs a town or a valid postcode, and rejects a bad postcode even with a town", () => {
    expect(stepProblem("place", { ...base, town: "" }, chosen)).toBeTruthy();
    expect(stepProblem("place", { ...base, town: "", postcode: "WD17 1AA" }, chosen)).toBeNull();
    expect(stepProblem("place", { ...base, postcode: "nonsense" }, chosen)).toMatch(/postcode/);
  });

  it("contact depends on the chosen action and validates both fields", () => {
    expect(stepProblem("contact", { ...base, phone: "" }, chosen)).toMatch(/phone/i);
    expect(stepProblem("contact", { ...base, phone: "", email: "a@b.co", action: "quote" }, chosen)).toBeNull();
    expect(stepProblem("contact", { ...base, phone: "", email: "a@b.co", action: "call" }, chosen)).toBeTruthy();
    expect(stepProblem("contact", { ...base, phone: "12" }, chosen)).toMatch(/UK phone/);
    expect(stepProblem("contact", { ...base, email: "nope" }, chosen)).toMatch(/email/);
    expect(stepProblem("contact", { ...base, phone: "", email: "", action: "visit" }, chosen)).toBeTruthy();
  });

  it("services are optional, and completeness needs everything else", () => {
    expect(stepProblem("services", defaultInput(), chosen)).toBeNull();
    expect(isComplete(base, chosen)).toBe(true);
    expect(isComplete({ ...base, name: "  " }, chosen)).toBe(false);
    expect(isComplete(base, { categoryChosen: false })).toBe(false);
  });

  it("suggests six trade-specific services", () => {
    expect(suggestedServices(base)).toHaveLength(6);
    expect(suggestedServices({ ...base, category: "barber" })[0]).not.toBe(suggestedServices(base)[0]);
  });
});
