import { anyAvailable, useShopStatus } from "@/lib/shop-status";
import { NotifyForm } from "./NotifyForm";

/** Honest state of the shop. Renders nothing once ordering is genuinely open. */
export function AvailabilityNotice({ slugs, compact = false }: { slugs?: string[]; compact?: boolean }) {
  const status = useShopStatus();
  if (status.state === "loading") return <p className="text-sm text-muted-foreground" aria-live="polite">Checking availability…</p>;
  if (anyAvailable(status)) return null;
  return (
    <section aria-labelledby="avail-title" className={`rounded-xl border border-border bg-card p-5 ${compact ? "" : "md:grid md:grid-cols-2 md:items-start md:gap-8"}`}>
      <div>
        <h2 id="avail-title" className={compact ? "text-base font-semibold" : "text-lg font-semibold"}>
          {status.state === "error" ? "We can't check availability right now" : "Ordering isn't open yet"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {status.state === "error"
            ? "You can still look around and build a basket, but don't count on being able to pay until this message has gone."
            : "The shop is being set up. You can look around and build a basket, but you can't pay yet. We'll tell you when that changes."}
        </p>
      </div>
      <div className="mt-4 md:mt-0">
        <NotifyForm slugs={slugs} />
      </div>
    </section>
  );
}
