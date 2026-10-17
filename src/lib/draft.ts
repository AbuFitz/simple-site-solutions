/**
 * Brief draft persistence. Stored in this browser only (localStorage), never sent anywhere until the
 * visitor submits the form. Expires after 7 days and is cleared on a successful submit.
 */
const KEY = "oss_brief_draft_v1";
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

export interface BriefDraft {
  step: number;
  selectedPackage: string | null;
  selectedAddons: string[];
  monthlyPlan?: string | null;
  fields: Record<string, string>;
}

type Stored = { at: number; draft: BriefDraft };

export function saveDraft(draft: BriefDraft, now = Date.now()): void {
  try {
    const stored: Stored = { at: now, draft };
    localStorage.setItem(KEY, JSON.stringify(stored));
  } catch {
    /* storage unavailable: the form still works, it just won't be remembered */
  }
}

export function loadDraft(now = Date.now()): BriefDraft | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as Stored;
    if (!stored || typeof stored.at !== "number" || now - stored.at > TTL_MS) {
      localStorage.removeItem(KEY);
      return null;
    }
    const d = stored.draft;
    if (!d || typeof d !== "object" || typeof d.fields !== "object") return null;
    return {
      step: [1, 2, 3, 4].includes(d.step) ? d.step : 1,
      selectedPackage: typeof d.selectedPackage === "string" ? d.selectedPackage : null,
      selectedAddons: Array.isArray(d.selectedAddons) ? d.selectedAddons.filter((x) => typeof x === "string") : [],
      monthlyPlan: typeof d.monthlyPlan === "string" ? d.monthlyPlan : null,
      fields: Object.fromEntries(
        Object.entries(d.fields ?? {}).filter(([, v]) => typeof v === "string")
      ) as Record<string, string>,
    };
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
