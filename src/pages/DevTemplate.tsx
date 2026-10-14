import { useSearchParams } from "react-router-dom";
import { SitePreview } from "@/components/preview/SitePreview";
import { buildPreview } from "@/lib/preview/generate";
import type { ActionKind, CategoryId } from "@/lib/preview/types";

/** Development-only harness (not routed in production builds): renders one template at its design width for visual QA. */
export default function DevTemplate() {
  const [q] = useSearchParams();
  const compact = q.get("compact") === "1";
  const model = buildPreview({
    name: q.get("n") ?? "Smith & Sons",
    category: (q.get("c") ?? "plumbing") as CategoryId,
    town: q.get("t") ?? "Watford",
    phone: q.get("p") ?? "07700900123",
    email: q.get("e") ?? "",
    action: ((q.get("a") ?? "call") as ActionKind),
    services: (q.get("s") ?? "").split(",").filter(Boolean),
    multiArea: false,
    seed: Number(q.get("v") ?? 0),
  });
  return (
    <div id="tpl" style={{ width: compact ? 390 : 1200 }}>
      <SitePreview model={model} compact={compact} />
    </div>
  );
}
