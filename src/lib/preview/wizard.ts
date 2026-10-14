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

/** Whether a step still has no answer. Nothing is mandatory: this only decides where the guide starts. */
export function stepEmpty(step: StepId, input: PreviewInput, flags: Flags): boolean {
  switch (step) {
    case "name":
      return !cleanName(input.name);
    case "trade":
      return !flags.categoryChosen;
    case "place":
      return !cleanTown(input.town) && !normalisePostcode(input.postcode);
    case "services":
      return input.services.length === 0;
    case "contact":
      return !normaliseUkPhone(input.phone) && !validEmail(input.email);
    case "review":
      return false;
  }
}

/** A gentle, non-blocking note when something was typed but can't be used as it is. Never stops the visitor continuing. */
export function stepHint(step: StepId, input: PreviewInput): string | null {
  if (step === "place" && input.postcode.trim() && !normalisePostcode(input.postcode)) return "That postcode doesn't look right, so we'll leave it out for now.";
  if (step === "contact") {
    if (input.phone.trim() && !normaliseUkPhone(input.phone)) return "That doesn't look like a UK phone number, so we'll leave it out for now.";
    if (input.email.trim() && !validEmail(input.email)) return "That email address doesn't look right, so we'll leave it out for now.";
  }
  return null;
}

/** True when every question has an answer (a shared, finished link opens straight on the preview). */
export const isComplete = (input: PreviewInput, flags: Flags) => STEPS.every((s) => s === "services" || !stepEmpty(s, input, flags));

/** The first unanswered step, or "review". Services are always optional and never hold the guide back. */
export function firstIncomplete(input: PreviewInput, flags: Flags): StepId {
  return STEPS.find((s) => s !== "review" && s !== "services" && stepEmpty(s, input, flags)) ?? "review";
}

/** Example services for the chosen trade, used as suggestions in the services step. */
export const suggestedServices = (input: PreviewInput) => categoryById(input.category).services.map((s) => s.title);
