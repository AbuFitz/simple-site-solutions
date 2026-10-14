import { beforeEach, describe, expect, it } from "vitest";
import { clearDraft, loadDraft, saveDraft } from "./draft";

const draft = { step: 3, selectedPackage: "sorted", selectedAddons: ["logo"], fields: { name: "Sam", email: "a@b.co" } };

describe("brief draft", () => {
  beforeEach(() => localStorage.clear());

  it("round-trips a draft", () => {
    saveDraft(draft);
    expect(loadDraft()).toEqual(draft);
  });

  it("expires after seven days", () => {
    saveDraft(draft, 1000);
    expect(loadDraft(1000 + 8 * 24 * 60 * 60 * 1000)).toBeNull();
    expect(localStorage.length).toBe(0);
  });

  it("clears", () => {
    saveDraft(draft);
    clearDraft();
    expect(loadDraft()).toBeNull();
  });

  it("ignores corrupt storage", () => {
    localStorage.setItem("oss_brief_draft_v1", "{not json");
    expect(loadDraft()).toBeNull();
  });
});
