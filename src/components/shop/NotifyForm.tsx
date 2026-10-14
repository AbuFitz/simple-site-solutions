import { useId, useState } from "react";
import { Loader2 } from "lucide-react";

/** "Tell me when ordering opens": one message, explicit unticked consent, sent to the owner by email. */
export function NotifyForm({ slugs = [] }: { slugs?: string[] }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const honeypot = (e.currentTarget.elements.namedItem("company_site") as HTMLInputElement).value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setState("error");
      setMessage("Enter an email address like name@example.com");
      return;
    }
    if (!consent) {
      setState("error");
      setMessage("Tick the box to say we can email you once.");
      return;
    }
    setState("sending");
    try {
      const r = await fetch("/api/shop-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), consent: true, slugs, company_site: honeypot }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || "We couldn't save that. Please try again or email us.");
      setState("done");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "We couldn't save that. Please try again.");
    }
  };

  if (state === "done")
    return (
      <p role="status" className="rounded-lg border border-primary/40 bg-primary/10 p-3 text-sm">
        Thanks. We'll email you once when ordering opens, and nothing else.
      </p>
    );

  return (
    <form onSubmit={submit} noValidate className="space-y-3">
      <div>
        <label htmlFor={`${id}-email`} className="mb-1.5 block text-sm font-medium">
          Email me when ordering opens
        </label>
        <input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={state === "error" && !!message && !/Tick/.test(message)}
          aria-describedby={state === "error" ? `${id}-err` : undefined}
          className="input-base text-base"
          placeholder="name@example.com"
        />
      </div>
      <label className="flex min-h-[44px] cursor-pointer items-start gap-3 text-sm text-muted-foreground">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-5 w-5 accent-[hsl(var(--primary))]" />
        <span>I agree to be emailed once when ordering opens. No marketing, and my address is only used for that.</span>
      </label>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this empty
          <input type="text" name="company_site" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      {state === "error" && (
        <p id={`${id}-err`} role="alert" className="text-sm text-destructive">
          {message}
        </p>
      )}
      <button type="submit" disabled={state === "sending"} aria-busy={state === "sending"} className="btn-primary btn-md min-h-[44px] justify-center disabled:opacity-70">
        {state === "sending" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…
          </>
        ) : (
          "Notify me"
        )}
      </button>
    </form>
  );
}
