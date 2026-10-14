import { Suspense } from "react";
import type { PreviewModel } from "@/lib/preview/types";
import { templates } from "./templates";

/**
 * Renders a generated PreviewModel as a complete one-page website, using the template designed for the trade.
 * It is laid out for a fixed design width (see DeviceFrame), so `compact` selects the phone composition
 * instead of relying on the visitor's viewport.
 */
export function SitePreview({ model, compact }: { model: PreviewModel; compact: boolean }) {
  const T = templates[model.category.id];
  return (
    <Suspense fallback={<div style={{ background: model.palette.bg, minHeight: 640 }} aria-hidden="true" />}>
      <T model={model} compact={compact} />
    </Suspense>
  );
}
