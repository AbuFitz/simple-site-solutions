import { useEffect, useState } from "react";

/**
 * Shown while a page's code loads. Waits briefly before appearing so fast loads show nothing at all, then a
 * thin progress bar runs along the top on the page background instead of a blank screen.
 */
export function RouteFallback() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setShow(true), 160);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <div className="min-h-screen bg-background" role="status" aria-label="Loading">
      {show && (
        <div className="fixed inset-x-0 top-0 z-[100] h-[3px] overflow-hidden bg-primary/15" aria-hidden="true">
          <div className="h-full w-1/3 rounded-full bg-primary motion-safe:animate-[route-load_1s_ease-in-out_infinite]" />
        </div>
      )}
    </div>
  );
}
