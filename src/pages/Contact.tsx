import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { FlowGlow } from "@/components/oss/FlowGlow";
import { Layout } from "@/components/layout/Layout";
import { Seo, breadcrumb } from "@/components/seo/Seo";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { SITE } from "@/data/site";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export default function Contact() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [failure, setFailure] = useState("");

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const honeypot = (e.currentTarget.elements.namedItem("company_site") as HTMLInputElement).value;
    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = "Your name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = "Enter an email address like name@example.com";
    if (values.message.trim().length < 10) next.message = "Tell us a little more (at least 10 characters)";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company_site: honeypot }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok) {
        setStatus("sent");
        return;
      }
      if (r.status === 400 && j.fields) setErrors(j.fields);
      setFailure(r.status === 429 ? "Too many attempts. Please wait a few minutes and try again." : j.error || "We couldn't send your message.");
      setStatus("failed");
    } catch {
      setFailure("We couldn't reach the server. Check your connection, or email us directly.");
      setStatus("failed");
    }
  };

  const input = (id: keyof typeof values, label: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label} <span className="font-normal text-muted-foreground">(required)</span>
      </label>
      <input
        id={id}
        value={values[id]}
        onChange={set(id)}
        aria-invalid={Boolean(errors[id as keyof Errors])}
        aria-describedby={errors[id as keyof Errors] ? `${id}-error` : undefined}
        aria-required
        className="input-base text-base"
        {...extra}
      />
      {errors[id as keyof Errors] && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-destructive">
          {errors[id as keyof Errors]}
        </p>
      )}
    </div>
  );

  return (
    <Layout>
      <Seo path="/contact"
        jsonLd={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24">
        <FlowGlow level={Object.values(values).filter((v) => typeof v === "string" && v.trim()).length * 2 + (status === "sent" ? 4 : 0)} />
        <DottedGrid className="opacity-30" spacing={32} />
        <div className="content-width relative z-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <h1 className="text-headline">
              Get in <span className="text-primary">touch</span>
            </h1>
            <p className="text-body-lg mt-4 max-w-xl">
              Got a question? Send a message and we'll reply by email. Ready to start? <Link className="underline underline-offset-4 hover:text-foreground" to="/start">Send a project brief</Link> instead; it gets the details we need.
            </p>

            {status === "sent" ? (
              <div role="status" className="bordered-highlight mt-8 p-6">
                <h2 className="text-title">Message sent</h2>
                <p className="mt-2 text-muted-foreground">Thanks. We'll reply to {values.email} by email.</p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="mt-8 max-w-xl space-y-4">
                {input("name", "Your name", { autoComplete: "name" })}
                {input("email", "Email address", { type: "email", autoComplete: "email" })}
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
                    Message <span className="font-normal text-muted-foreground">(required)</span>
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={values.message}
                    onChange={set("message")}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    aria-required
                    className="input-base resize-none text-base"
                  />
                  {errors.message && (
                    <p id="message-error" role="alert" className="mt-1.5 text-sm text-destructive">
                      {errors.message}
                    </p>
                  )}
                </div>
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>
                    Leave this empty
                    <input type="text" name="company_site" tabIndex={-1} autoComplete="off" defaultValue="" />
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  We use your details only to reply. See our <Link className="underline underline-offset-2 hover:text-foreground" to="/privacy">privacy policy</Link>.
                </p>
                {status === "failed" && (
                  <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    {failure} You can also email <a className="underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>.
                  </div>
                )}
                <button type="submit" disabled={status === "sending"} aria-busy={status === "sending"} className="btn-primary btn-lg min-h-[44px] justify-center disabled:opacity-70">
                  {status === "sending" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
                    </>
                  ) : (
                    "Send message"
                  )}
                </button>
              </form>
            )}
          </div>

          <aside className="bordered-section h-fit bg-card p-6">
            <h2 className="text-lg font-semibold">Other ways</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <span className="block text-muted-foreground">Email</span>
                <a className="inline-flex min-h-[44px] items-center underline underline-offset-4" href={`mailto:${SITE.email}`}>
                  {SITE.email}
                </a>
              </li>
              <li>
                <span className="block text-muted-foreground">Starting a project</span>
                <Link className="inline-flex min-h-[44px] items-center underline underline-offset-4" to="/start">
                  Project brief
                </Link>
              </li>
            </ul>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
