import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo, breadcrumb } from "@/components/seo/Seo";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { AvailabilityNotice } from "@/components/shop/AvailabilityNotice";
import { NfcQrExplainer } from "@/components/shop/NfcQrExplainer";
import { ProductCard } from "@/components/shop/ProductCard";
import { CATEGORIES, SHIPPING, fromPricePence, pounds, products, type ShopCategory } from "@/data/shop";

type Sort = "featured" | "price-asc" | "price-desc";
const SORTS: { id: Sort; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const category = CATEGORIES.some((c) => c.id === params.get("category")) ? (params.get("category") as ShopCategory) : null;
  const sort = SORTS.some((s) => s.id === params.get("sort")) ? (params.get("sort") as Sort) : "featured";

  const shown = useMemo(() => {
    const list = category ? products.filter((p) => p.category === category) : [...products];
    if (sort === "price-asc") list.sort((a, b) => fromPricePence(a) - fromPricePence(b));
    if (sort === "price-desc") list.sort((a, b) => fromPricePence(b) - fromPricePence(a));
    return list;
  }, [category, sort]);

  const update = (next: { category?: ShopCategory | null; sort?: Sort }) => {
    const p = new URLSearchParams(params);
    if (next.category !== undefined) {
      if (next.category) p.set("category", next.category);
      else p.delete("category");
    }
    if (next.sort !== undefined) {
      if (next.sort === "featured") p.delete("sort");
      else p.set("sort", next.sort);
    }
    setParams(p, { replace: true });
  };

  const chips: { id: ShopCategory | null; label: string }[] = [{ id: null, label: "All" }, ...CATEGORIES.map((c) => ({ id: c.id, label: c.label }))];

  return (
    <Layout>
      <Seo
        path="/shop"
        jsonLd={[
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
          ]),
        ]}
      />
      <section className="relative pt-24 pb-8 sm:pt-32 sm:pb-12">
        <DottedGrid className="opacity-30" spacing={32} />
        <div className="content-width relative z-10">
          <h1 className="text-headline max-w-3xl">
            QR and NFC products for <span className="text-primary">your business</span>
          </h1>
          <p className="text-body-lg mt-4 max-w-2xl">
            Review cards, counter signs, stickers and smart business cards, made with your details on them. Each one opens a link you choose when someone taps or scans it.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Delivery to the UK mainland: {pounds(SHIPPING.flatPence)}, free when your posted items come to {pounds(SHIPPING.freeOverPence)} or more. Digital products are emailed. <Link className="underline underline-offset-4 hover:text-foreground" to="/shop/help">Delivery and returns</Link>
          </p>
        </div>
      </section>

      <section className="pb-6">
        <div className="content-width">
          <AvailabilityNotice />
        </div>
      </section>

      <section aria-labelledby="catalogue" className="pb-12 sm:pb-16">
        <div className="content-width">
          <h2 id="catalogue" className="sr-only">
            Products
          </h2>
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div role="radiogroup" aria-label="Filter by category" className="flex flex-wrap gap-2">
              {chips.map((c) => {
                const active = (c.id ?? null) === category;
                return (
                  <button
                    key={c.label}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => update({ category: c.id })}
                    className={`min-h-[44px] rounded-full border px-4 text-sm font-medium transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-secondary"}`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="text-sm text-muted-foreground">
                Sort
              </label>
              <select id="sort" value={sort} onChange={(e) => update({ sort: e.target.value as Sort })} className="input-base min-h-[44px] w-auto py-2 text-sm">
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p role="status" aria-live="polite" className="mb-4 text-sm text-muted-foreground">
            {shown.length} {shown.length === 1 ? "product" : "products"}
            {category ? ` in ${CATEGORIES.find((c) => c.id === category)?.label}` : ""}
          </p>

          {shown.length === 0 ? (
            <p className="rounded-xl border border-border bg-card p-6">No products match. <button type="button" className="underline underline-offset-4" onClick={() => update({ category: null })}>Show all products</button></p>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs text-muted-foreground">Product images are illustrations, not photographs of the finished items. Finish and print may differ slightly.</p>
        </div>
      </section>

      <section className="pb-12 sm:pb-16">
        <div className="content-width">
          <NfcQrExplainer />
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="content-width">
          <div className="bordered-section flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-title">Need a website to send people to?</h2>
              <p className="mt-1 text-muted-foreground">Our fixed-price websites give your QR codes and NFC taps somewhere good to land.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/packages" className="btn-outline btn-md min-h-[44px] justify-center">See packages</Link>
              <Link to="/preview" className="btn-primary btn-md min-h-[44px] justify-center !text-background">Preview your site</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
