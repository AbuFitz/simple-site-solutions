import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CART_KEY, addLine, cartTotals, countItems, loadCart, removeLine, saveCart, setQty, type CartLine } from "@/lib/cart";
import { getProduct, getVariant } from "@/data/shop";
import type { Totals } from "@/data/shop";

interface CartApi {
  lines: CartLine[];
  count: number;
  totals: Totals;
  /** Latest screen-reader announcement, also rendered in a polite live region. */
  announcement: string;
  add: (input: { slug: string; variantId: string; qty: number; personalisation: Record<string, string> }) => boolean;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const Ctx = createContext<CartApi | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => loadCart());
  const [announcement, setAnnouncement] = useState("");

  // Also runs on mount, so anything sanitised away on load is removed from storage too.
  useEffect(() => {
    saveCart(lines);
  }, [lines]);

  // Keep several open tabs in step.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY || e.key === null) setLines(loadCart());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const say = useCallback((m: string) => setAnnouncement(m), []);

  const api = useMemo<CartApi>(
    () => ({
      lines,
      count: countItems(lines),
      totals: cartTotals(lines),
      announcement,
      add: (input) => {
        const before = countItems(lines);
        const next = addLine(lines, input);
        if (next === lines || countItems(next) === before) {
          say("Couldn't add that to your basket. It may be full or at the maximum quantity.");
          return false;
        }
        setLines(next);
        const p = getProduct(input.slug);
        const v = p && getVariant(p, input.variantId);
        say(`Added ${p?.name ?? "item"}${v ? `, ${v.label}` : ""} to your basket. ${countItems(next)} items in total.`);
        return true;
      },
      setQty: (id, qty) => setLines((l) => setQty(l, id, qty)),
      remove: (id) => {
        setLines((l) => removeLine(l, id));
        say("Removed from your basket.");
      },
      clear: () => setLines([]),
    }),
    [lines, announcement, say]
  );

  return (
    <Ctx.Provider value={api}>
      {children}
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </Ctx.Provider>
  );
}

export function useCart(): CartApi {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside <CartProvider>");
  return c;
}
