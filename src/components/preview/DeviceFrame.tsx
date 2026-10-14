import { ReactNode, useEffect, useRef, useState } from "react";

const DESKTOP_W = 1200;
const PHONE_W = 390;

/**
 * Shows children at a fixed design width inside a browser or phone frame, scaled to fit the available space.
 * The content scrolls inside the frame like a real page.
 */
export function DeviceFrame({ device, domain, children }: { device: "desktop" | "phone"; domain: string; children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [innerH, setInnerH] = useState(1200);
  const designW = device === "desktop" ? DESKTOP_W : PHONE_W;

  useEffect(() => {
    const el = outer.current;
    if (!el) return;
    const measure = () => setScale(Math.min(1, el.clientWidth / designW));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [designW]);

  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setInnerH(el.offsetHeight));
    ro.observe(el);
    setInnerH(el.offsetHeight);
    return () => ro.disconnect();
  }, [device, children]);

  const viewportH = device === "desktop" ? 560 : 640;

  const screen = (
    <div
      ref={outer}
      className="overflow-y-auto overflow-x-hidden bg-white"
      style={{ height: viewportH }}
      tabIndex={0}
      role="region"
      aria-label={`Scrollable ${device === "desktop" ? "desktop" : "phone"} preview of the website`}
    >
      <div style={{ height: innerH * scale, width: designW * scale }}>
        <div ref={inner} style={{ width: designW, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          {children}
        </div>
      </div>
    </div>
  );

  if (device === "desktop") {
    return (
      <div className="overflow-hidden rounded-xl border-2 border-border bg-card sm:rounded-2xl">
        <div className="flex items-center gap-2 border-b border-border bg-secondary px-3 py-2 sm:px-4 sm:py-3">
          <div className="flex gap-1 sm:gap-1.5" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-2 w-2 rounded-full bg-muted-foreground/30 sm:h-3 sm:w-3" />
            ))}
          </div>
          <div className="mx-2 flex h-5 flex-1 items-center rounded-md border border-border bg-background px-2 sm:mx-4 sm:h-6 sm:rounded-lg sm:px-3">
            <span className="truncate text-[10px] text-muted-foreground sm:text-xs">{domain}</span>
          </div>
        </div>
        {screen}
      </div>
    );
  }
  return (
    <div className="mx-auto w-full max-w-[340px] rounded-[2.4rem] border-2 border-border bg-card p-2.5">
      <div className="overflow-hidden rounded-[1.9rem]">{screen}</div>
    </div>
  );
}
