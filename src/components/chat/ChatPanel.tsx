import { FormEvent, Fragment, KeyboardEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, RotateCcw, X } from "lucide-react";

interface Action { label: string; href: string }
interface Msg { id: string; role: "user" | "assistant"; content: string; actions?: Action[]; error?: boolean }

const STORE = "oss-sid-chat-v1";
const MAX_CHARS = 500;
const WELCOME: Msg = { id: "welcome", role: "assistant", content: "Hi, I'm Sid, OneSimpleSite's website assistant. Ask me about packages, prices, timings or whether we cover your area." };
const PROMPTS = ["What do the packages cost?", "How long does a website take?", "Do you cover my area?", "Can I see a preview first?"];

const uid = () => Math.random().toString(36).slice(2, 10);

function load(): Msg[] {
  try {
    const raw = sessionStorage.getItem(STORE);
    const arr = raw ? (JSON.parse(raw) as Msg[]) : [];
    return Array.isArray(arr) && arr.length ? arr.slice(-40) : [WELCOME];
  } catch {
    return [WELCOME];
  }
}

/** Renders **bold** and [label](/internal-path) only. Everything else is plain text. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\(\/[a-z0-9\-/]*\)|\*\*[^*]+\*\*)/gi);
  return (
    <>
      {parts.map((p, i) => {
        const link = p.match(/^\[([^\]]+)\]\((\/[a-z0-9\-/]*)\)$/i);
        if (link) return <Link key={i} to={link[2]} className="font-semibold underline underline-offset-2">{link[1]}</Link>;
        const bold = p.match(/^\*\*([^*]+)\*\*$/);
        if (bold) return <strong key={i}>{bold[1]}</strong>;
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}

export default function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>(load);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [offline, setOffline] = useState(false);
  const [mobile, setMobile] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches);
  const [box, setBox] = useState<{ top: number; height: number } | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORE, JSON.stringify(msgs.slice(-40)));
    } catch {
      /* private mode: the chat still works, it just won't be remembered */
    }
  }, [msgs]);

  // Phone layout follows the visual viewport, so the composer stays above the on-screen keyboard.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const onMq = () => setMobile(mq.matches);
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);
  useEffect(() => {
    if (!open || !mobile) {
      setBox(null);
      return;
    }
    const vv = window.visualViewport;
    const sync = () => vv && setBox({ top: vv.offsetTop, height: vv.height });
    sync();
    vv?.addEventListener("resize", sync);
    vv?.addEventListener("scroll", sync);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      vv?.removeEventListener("resize", sync);
      vv?.removeEventListener("scroll", sync);
      document.body.style.overflow = prev;
    };
  }, [open, mobile]);

  useEffect(() => {
    if (!open) return;
    if (mobile) closeBtn.current?.focus();
    else input.current?.focus();
  }, [open, mobile]);

  useLayoutEffect(() => {
    const el = list.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, busy, open, box]);

  useEffect(() => {
    const el = input.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
  }, [text, open]);

  // Escape closes even when focus has fallen to the page (for example after a suggestion chip disappears).
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: globalThis.KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onDoc);
    return () => document.removeEventListener("keydown", onDoc);
  }, [open, onClose]);

  // Tab stays inside the dialog while it is open.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Tab" && panel.current) {
      const f = [...panel.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),textarea:not([disabled])')].filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const send = useCallback(
    async (raw: string) => {
      const content = raw.trim().slice(0, MAX_CHARS);
      if (!content || busy || offline) return;
      const next: Msg[] = [...msgs, { id: uid(), role: "user", content }];
      setMsgs(next);
      setText("");
      setBusy(true);
      abort.current?.abort();
      const ctl = new AbortController();
      abort.current = ctl;
      try {
        const history = next.filter((m) => m.id !== "welcome" && !m.error).slice(-12).map((m) => ({ role: m.role, content: m.content }));
        const r = await fetch("/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages: history }), signal: ctl.signal });
        const j = (await r.json().catch(() => ({}))) as { reply?: string; actions?: Action[]; error?: string; offline?: boolean };
        if (r.ok && j.reply) {
          setMsgs((m) => [...m, { id: uid(), role: "assistant", content: j.reply!, actions: j.actions }]);
        } else {
          if (j.offline) setOffline(true);
          setMsgs((m) => [...m, { id: uid(), role: "assistant", error: true, content: j.error || "Something went wrong. Please try again, or use the contact form.", actions: [{ label: "Contact us", href: "/contact" }] }]);
        }
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setMsgs((m) => [...m, { id: uid(), role: "assistant", error: true, content: "I couldn't connect. Check your connection and try again, or use the contact form.", actions: [{ label: "Contact us", href: "/contact" }] }]);
      } finally {
        setBusy(false);
        if (!mobile) input.current?.focus();
      }
    },
    [msgs, busy, offline, mobile],
  );

  const reset = () => {
    abort.current?.abort();
    setBusy(false);
    setOffline(false);
    setMsgs([WELCOME]);
    setText("");
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    void send(text);
  };
  const onTextKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void send(text);
    }
  };

  const fresh = msgs.length === 1 && msgs[0].id === "welcome";
  const style = mobile && box ? { top: box.top, height: box.height } : undefined;

  return (
    <div
      ref={panel}
      id="sid-chat"
      role="dialog"
      aria-label="Chat with Sid, the OneSimpleSite assistant"
      aria-modal={mobile ? "true" : undefined}
      hidden={!open}
      onKeyDown={onKeyDown}
      style={style}
      className={`fixed z-[85] flex-col overflow-hidden ${open ? "flex" : "hidden"} border-border bg-background shadow-2xl ${mobile ? "inset-x-0 bottom-0 rounded-t-2xl border-t-2" : "bottom-6 right-6 h-[min(640px,calc(100dvh-3rem))] w-[390px] rounded-2xl border-2"} ${open ? "animate-in fade-in-0 slide-in-from-bottom-4 duration-200 motion-reduce:animate-none" : ""}`}
    >
      <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3" style={{ paddingTop: mobile ? "max(0.75rem, env(safe-area-inset-top))" : undefined }}>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-extrabold text-primary-foreground" aria-hidden="true">S</span>
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold leading-tight">Sid</p>
          <p className="truncate text-xs text-muted-foreground">OneSimpleSite assistant · AI</p>
        </div>
        <button type="button" onClick={reset} aria-label="Start a new chat" className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <RotateCcw className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
        <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close chat" className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      <div ref={list} role="log" aria-live="polite" aria-label="Conversation" className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4">
        {msgs.map((m) => (
          <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex flex-col items-start gap-2"}>
            <p className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-[0.95rem] leading-relaxed ${m.role === "user" ? "rounded-br-md bg-primary text-primary-foreground" : m.error ? "rounded-bl-md border border-border bg-card text-foreground" : "rounded-bl-md bg-secondary text-foreground"}`}>
              <span className="sr-only">{m.role === "user" ? "You: " : "Sid: "}</span>
              <Rich text={m.content} />
            </p>
            {m.actions && m.actions.length > 0 && (
              <div className="flex max-w-[88%] flex-wrap gap-2">
                {m.actions.map((a) => (
                  <Link key={a.href + a.label} to={a.href} onClick={onClose} className="inline-flex min-h-[40px] items-center rounded-full border border-primary/60 px-3.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
                    {a.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        {fresh && (
          <div className="flex flex-wrap gap-2 pt-1" aria-label="Suggested questions">
            {PROMPTS.map((p) => (
              <button key={p} type="button" onClick={() => void send(p)} className="min-h-[40px] rounded-full border border-border bg-card px-3.5 text-sm transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                {p}
              </button>
            ))}
          </div>
        )}
        {busy && (
          <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-secondary px-4 py-3 w-fit" role="status">
            <span className="sr-only">Sid is typing</span>
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-2 w-2 rounded-full bg-muted-foreground motion-safe:animate-bounce" style={{ animationDelay: `${i * 120}ms` }} aria-hidden="true" />
            ))}
          </div>
        )}
      </div>

      <form onSubmit={submit} className="border-t border-border bg-card px-3 pb-3 pt-2.5" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
        {offline ? (
          <p className="px-1 py-2 text-sm text-muted-foreground">Chat is offline right now. <Link to="/contact" onClick={onClose} className="font-semibold text-primary underline underline-offset-2">Use the contact form</Link> and we'll reply by email.</p>
        ) : (
          <div className="flex items-end gap-2">
            <label htmlFor="sid-input" className="sr-only">Message Sid</label>
            <textarea
              id="sid-input"
              ref={input}
              rows={1}
              value={text}
              maxLength={MAX_CHARS}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onTextKey}
              placeholder="Ask about packages, prices, areas…"
              enterKeyHint="send"
              autoComplete="off"
              className="max-h-28 min-h-[44px] flex-1 resize-none rounded-2xl border border-border bg-background px-3.5 py-[11px] text-base leading-snug placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <button type="submit" disabled={busy || !text.trim()} aria-label="Send message" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <ArrowUp className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
        <p className="mt-2 px-1 text-[0.72rem] leading-snug text-muted-foreground">
          Sid is an AI and can get things wrong. Please don't share passwords or card details. <Link to="/privacy" onClick={onClose} className="underline underline-offset-2">How chats are handled</Link>
          {text.length > 400 && <span className="ml-1 tabular-nums">{MAX_CHARS - text.length} left</span>}
        </p>
      </form>
    </div>
  );
}
