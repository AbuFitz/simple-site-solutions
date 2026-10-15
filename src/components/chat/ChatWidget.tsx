import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const ChatPanel = lazy(() => import("./ChatPanel"));
const loadPanel = () => import("./ChatPanel");

// Wait until the cookie notice has been dismissed so the two never sit on top of each other.
const CONSENT_KEY = "oss_cookie_consent";
const hasConsent = () => {
  try {
    return Boolean(window.localStorage.getItem(CONSENT_KEY));
  } catch {
    return true;
  }
};

/** Pages where a floating chat would get in the way (payment, hidden onboarding, dev harness). */
const HIDDEN = [/^\/checkout\//, /^\/onboard/, /^\/__tpl/];
/** Pages with a sticky bottom action bar on phones: sit the launcher above it. */
const RAISED = [/^\/$/, /^\/preview/, /^\/start/];

export function ChatWidget() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const launcher = useRef<HTMLButtonElement>(null);
  const [consented, setConsented] = useState(hasConsent);

  useEffect(() => {
    const on = () => setConsented(true);
    window.addEventListener("oss-cookie-consent", on);
    return () => window.removeEventListener("oss-cookie-consent", on);
  }, []);

  useEffect(() => {
    if (HIDDEN.some((r) => r.test(pathname))) setOpen(false);
  }, [pathname]);

  if (HIDDEN.some((r) => r.test(pathname))) return null;
  const raised = RAISED.some((r) => r.test(pathname));

  const close = () => {
    setOpen(false);
    window.setTimeout(() => launcher.current?.focus(), 0);
  };

  return (
    <>
      {!open && consented && (
        <button
          ref={launcher}
          type="button"
          aria-expanded={false}
          aria-controls="sid-chat"
          aria-label="Open chat with Sid, our website assistant"
          onMouseEnter={loadPanel}
          onFocus={loadPanel}
          onClick={() => {
            setOpen(true);
            setEverOpened(true);
          }}
          className={`oss-chat-launcher fixed right-4 z-[60] flex h-14 items-center gap-2.5 rounded-full border-2 border-border bg-background pl-2 pr-2 shadow-xl transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:right-6 sm:pl-2 sm:pr-5 ${raised ? "bottom-24 sm:bottom-6" : "bottom-4 sm:bottom-6"}`}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-base font-extrabold text-primary-foreground" aria-hidden="true">S</span>
          <span className="hidden text-sm font-semibold sm:inline">Ask Sid</span>
          <MessageCircle className="mr-1 h-5 w-5 text-primary sm:hidden" aria-hidden="true" />
        </button>
      )}
      {(open || everOpened) && (
        <Suspense fallback={null}>
          <ChatPanel open={open} onClose={close} />
        </Suspense>
      )}
    </>
  );
}
