import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Monitor, Smartphone } from "lucide-react";
import { buildPreview, encodeInput } from "@/lib/preview/generate";
import type { PreviewInput } from "@/lib/preview/types";
import { DeviceFrame } from "./DeviceFrame";
import { SitePreview } from "./SitePreview";

/**
 * A live preview that sits beside the project form and updates as the owner types.
 * On wide screens it stays in view; on phones it is a closed-by-default panel above the form.
 */
export function FlowPreview({ input }: { input: PreviewInput }) {
  const deferred = useDeferredValue(input);
  const model = useMemo(() => buildPreview(deferred), [deferred]);
  const [device, setDevice] = useState<"desktop" | "phone">("desktop");
  const [open, setOpen] = useState(false);
  const [wide, setWide] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => {
      setWide(mq.matches);
      if (!mq.matches) setDevice("phone");
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const shown = wide || open;
  const domain = `${model.name === "Your Business Name" ? "yourbusiness" : model.name.toLowerCase().replace(/[^a-z0-9]+/g, "") || "yourbusiness"}.co.uk`;

  return (
    <aside aria-label="Live preview of your website" className="bordered-section p-3 sm:p-4 lg:sticky lg:top-28">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold sm:text-lg">Your site so far</h2>
          <p className="text-xs text-muted-foreground">Updates as you type. Sample wording and placeholders where we need your details.</p>
        </div>
        {!wide && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="flow-preview-body"
            className="btn-secondary btn-sm shrink-0 gap-1.5"
          >
            {open ? "Hide" : "Show"}
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>
        )}
      </div>

      {shown && (
        <div id="flow-preview-body" className="mt-3">
          {wide && (
            <div role="tablist" aria-label="Preview size" className="mb-3 inline-flex rounded-full border border-border bg-secondary p-1">
              {([
                ["desktop", "Desktop", Monitor],
                ["phone", "Phone", Smartphone],
              ] as const).map(([id, text, Icon]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={device === id}
                  onClick={() => setDevice(id)}
                  className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors ${device === id ? "bg-primary !text-background" : "text-foreground/80 hover:text-foreground"}`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {text}
                </button>
              ))}
            </div>
          )}
          <DeviceFrame device={device} domain={domain}>
            <SitePreview model={model} compact={device === "phone"} />
          </DeviceFrame>
          <p className="mt-3 text-xs text-muted-foreground">
            Not the right look?{" "}
            <Link to={`/preview?${encodeInput(input)}`} className="font-medium text-foreground underline underline-offset-4 hover:text-primary">
              Open the full preview
            </Link>{" "}
            to change the style or details.
          </p>
        </div>
      )}
    </aside>
  );
}
