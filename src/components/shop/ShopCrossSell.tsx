import { Link } from "react-router-dom";
import { SUGGESTED_BY_BUSINESS, fromPricePence, getProduct, pounds, type Product } from "@/data/shop";
import { ProductVisual } from "./ProductVisual";

const COPY: Record<string, { title: string; text: string }> = {
  website: { title: "Pair your new website with the shop", text: "Review cards, counter signs and QR stickers send customers to the right place offline, and your website does the rest." },
  preview: { title: "Take it off the screen", text: "Products that suit this kind of business, each opening a page you choose." },
  start: { title: "While we build your site", text: "Get your review link and QR codes ready so customers can find you and review you from day one." },
  cart: { title: "People also add", text: "Other products that go with what's in your basket." },
  product: { title: "Goes well with", text: "Other products that work alongside this one." },
};

const DEFAULT = ["review-card", "qr-table-sign", "sticker-pack"];

export function ShopCrossSell({ context, businessType, slugs, exclude = [], max = 3 }: { context: keyof typeof COPY; businessType?: string; slugs?: string[]; exclude?: string[]; max?: number }) {
  const list = (slugs ?? (businessType && SUGGESTED_BY_BUSINESS[businessType]) ?? DEFAULT)
    .filter((s) => !exclude.includes(s))
    .map((s) => getProduct(s))
    .filter((p): p is Product => Boolean(p))
    .slice(0, max);
  if (list.length === 0) return null;
  const copy = COPY[context];
  const headingId = `xsell-${context}`;
  return (
    <section aria-labelledby={headingId} className="bordered-section bg-card p-5 sm:p-6">
      <h2 id={headingId} className="text-xl font-bold tracking-tight">
        {copy.title}
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{copy.text}</p>
      <ul className="mt-5 grid gap-4 sm:grid-cols-3">
        {list.map((p) => (
          <li key={p.slug} className="overflow-hidden rounded-xl border border-border">
            <Link to={`/shop/${p.slug}`} className="group block focus-visible:outline-offset-[-2px]">
              <ProductVisual kind={p.visual} className="aspect-[4/3] w-full" />
              <div className="p-4">
                <h3 className="font-semibold group-hover:text-primary">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  From <span className="nums font-semibold text-foreground">{pounds(fromPricePence(p))}</span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/shop" className="mt-4 inline-flex min-h-[44px] items-center text-sm font-semibold text-primary underline-offset-4 hover:underline">
        See the whole shop
      </Link>
    </section>
  );
}
