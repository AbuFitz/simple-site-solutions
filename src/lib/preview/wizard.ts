import { categoryById } from "./categories";
import { cleanName, cleanTown, normaliseUkPhone } from "./generate";
import { normalisePostcode } from "./geo";
import type { PreviewInput } from "./types";

/** The guided steps, in order. The preview is only shown once every required step is complete. */
export const STEPS = ["name", "trade", "place", "services", "contact", "review"] as const;
export type StepId = (typeof STEPS)[number];

export const STEP_TITLES: Record<StepId, string> = {
  name: "Business name",
  trade: "Type of business",
  place: "Where you work",
  services: "What you offer",
  contact: "How people reach you",
  review: "Check and build",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const validEmail = (s: string) => EMAIL.test(s.trim());

export interface Flags {
  /** The visitor has actively chosen a trade (a default selection doesn't count). */
  categoryChosen: boolean;
}

/** Why a step is incomplete, or null if it's done. Messages are written to be shown to the visitor. */
export function stepProblem(step: StepId, input: PreviewInput, flags: Flags): string | null {
  switch (step) {
    case "name":
      return cleanName(input.name) ? null : "Tell us what your business is called.";
    case "trade":
      return flags.categoryChosen ? null : "Choose the type of business that fits best.";
    case "place": {
      if (input.postcode.trim() && !normalisePostcode(input.postcode)) return "That postcode doesn't look right. Check it, or leave it out.";
      return cleanTown(input.town) || normalisePostcode(input.postcode) ? null : "Add your town, or a postcode, so we can show where you work.";
    }
    case "services":
      return null;
    case "contact": {
      const phone = normaliseUkPhone(input.phone);
      if (input.phone.trim() && !phone) return "Enter a UK phone number, like 07123 456789 or 01923 456789.";
      if (input.email.trim() && !validEmail(input.email)) return "That email address doesn't look right.";
      if (input.action === "call") return phone ? null : "You chose phone calls, so add the number customers should ring.";
      return phone || validEmail(input.email) ? null : "Add a phone number or an email address so customers can reach you.";
    }
    case "review":
      return null;
  }
}

export const isComplete = (input: PreviewInput, flags: Flags) => STEPS.every((s) => stepProblem(s, input, flags) === null);

/** The first step still needing an answer, or "review" when everything required is filled in. */
export function firstIncomplete(input: PreviewInput, flags: Flags): StepId {
  return STEPS.find((s) => s !== "review" && stepProblem(s, input, flags) !== null) ?? "review";
}

/** Example services for the chosen trade, used as suggestions in the services step. */
export const suggestedServices = (input: PreviewInput) => categoryById(input.category).services.map((s) => s.title);
