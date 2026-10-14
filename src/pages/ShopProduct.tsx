import { useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Check, Minus, Plus } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo, breadcrumb } from "@/components/seo/Seo";
import { AvailabilityNotice } from "@/components/shop/AvailabilityNotice";
import { useCart } from "@/components/shop/CartProvider";
import { ProductVisual } from "@/components/shop/ProductVisual";
import { ShopCrossSell } from "@/components/shop/ShopCrossSell";
import { CATEGORIES, SHIPPING, getProduct, pounds, type PersonaliseField } from "@/data/shop";
import { isFieldVisible, normaliseUrl, validateField, validatePersonalisation } from "@/lib/shop-rules";
import { statusOf, useShopStatus } from "@/lib/shop-status";
import NotFound from "./NotFound";

export default function ShopProduct() {
  const { slug = "" } = useParams();
  const product = getProduct(slug);
  if (!product) return <NotFound />;
  return <ProductView key={product.slug} slug={slug} />;
}

function ProductView({ slug }: { slug: string }) {
  const product = getProduct(slug)!;
  const [params] = useSearchParams();
  const cart = useCart();
  const status = useShopStatus();
  const startVariant = product.variants.some((v) => v.id === params.get("variant")) ? (params.get("variant") as string) : product.variants[0].id;
  const [variantId, setVariantId] = useState(startVariant);
  const [qty, setQty] = useState(1);
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [added, setAdded] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const variant = product.variants.find((v) => v.id === variantId)!;
  const cat = CATEGORIES.find((c) => c.id === product.category);
  const visible = useMemo(() => product.fields.filter((f) => isFieldVisible(f, values)), [product, values]);
  const st = statusOf(status, product.slug, variantId);

  const setValue = (f: PersonaliseField, v: string) => {
    setAdded(false);
    setValues((cur) => ({ ...cur, [f.id]: v }));
    if (errors[f.id]) setErrors((e) => ({ ...e, [f.id]: validateField(f, v) ?? "" }));
  };

  const blur = (f: PersonaliseField) => {
    let v = values[f.id] ?? "";
    if ((f.rule === "httpsUrl" || f.rule === "googleReviewUrl") && v.trim()) {
      v = normaliseUrl(v);
      setValues((cur) => ({ ...cur, [f.id]: v }));
    }
    const err = validateField(f, v);
    setErrors((e) => ({ ...e, [f.id]: err ?? "" }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = validatePersonalisation(product, values);
    setErrors(res.errors);
    if (!res.ok) {
      const first = visible.find((f) => res.errors[f.id]);
      if (first) formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(`${product.slug}-${first.id}`)}`)?.focus();
      return;
    }
    if (cart.add({ slug: product.slug, variantId, qty, personalisation: res.clean })) setAdded(true);
  };

  const field = (f: PersonaliseField) => {
    const id = `${product.slug}-${f.id}`;
    const err = errors[f.id] || undefined;
    const describedBy = [f.hint ? `${id}-hint` : "", err ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;
    const common = { id, "aria-invalid": Boolean(err), "aria-describedby": describedBy, "aria-required": f.required || undefined, onBlur: () => blur(f), className: "input-base text-base" };
    return (
      <div key={f.id}>
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
          {f.label} <span className="font-normal text-muted-foreground">({f.required ? "required" : "optional"})</span>
        </label>
        {f.hint && (
          <p id={`${id}-hint`} className="mb-1.5 text-xs text-muted-foreground">
            {f.hint}
          </p>
        )}
        {f.kind === "select" ? (
          <select {...common} value={values[f.id] ?? ""} onChange={(e) => setValue(f, e.target.value)}>
            <option value="">Choose…</option>
            {f.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            {...common}
            type={f.kind === "password" ? "text" : f.kind === "url" ? "text" : "text"}
            inputMode={f.kind === "url" ? "url" : undefined}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            maxLength={f.max + 40}
            placeholder={f.placeholder}
            value={values[f.id] ?? ""}
            onChange={(e) => setValue(f, e.target.value)}
          />
        )}
        {err && (
          <p id={`${id}-err`} role="alert" className="mt-1.5 text-sm text-destructive">
            {err}
          </p>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <Seo
        path={`/shop/${product.slug}`}
        jsonLd={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: product.name, path: `/shop/${product.slug}` },
        ])}
      />
      <div className="content-width pt-24 sm:pt-32">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link className="inline-flex min-h-[44px] items-center hover:text-foreground" to="/shop">Shop</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground">{product.name}</li>
          </ol>
        </nav>
      </div>

      <section className="pb-12">
        <div className="content-width grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="bordered-section lg:sticky lg:top-28">
              <ProductVisual kind={product.visual} className="aspect-[4/3] w-full" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Illustration, not a photograph. The QR pattern shown is decorative; yours is made from your link.</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              {cat?.label} · {product.fulfilment === "digital" ? "Emailed to you" : "Made to order and posted"}
            </p>
            <h1 className="text-headline mt-1">{product.name}</h1>
            <p className="text-body-lg mt-3">{product.summary}</p>

            <form ref={formRef} onSubmit={submit} noValidate className="mt-8 space-y-6" aria-label={`Order ${product.name}`}>
              <fieldset>
                <legend className="mb-2 text-sm font-semibold">Option</legend>
                <div role="radiogroup" aria-label="Option" className="grid gap-2">
                  {product.variants.map((v) => {
                    const active = v.id === variantId;
                    const vs = statusOf(status, product.slug, v.id);
                    return (
                      <button
                        key={v.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => {
                          setVariantId(v.id);
                          setAdded(false);
                        }}
                        className={`flex min-h-[44px] items-center justify-between gap-3 rounded-xl border-2 p-3 text-left transition-colors ${active ? "border-primary bg-primary/5" : "border-border bg-card hover:border-muted-foreground/50"}`}
                      >
                        <span>
                          <span className="block font-medium">{v.label}</span>
                          {v.detail && <span className="block text-xs text-muted-foreground">{v.detail}</span>}
                          {vs === "sold-out" && <span className="block text-xs text-destructive">Sold out</span>}
                        </span>
                        <span className="nums text-lg font-bold">{pounds(v.pricePence)}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="mb-1 text-sm font-semibold">Your details (printed on your product)</legend>
                <p className="text-xs text-muted-foreground">Check these carefully. We make your product exactly as entered, and we can't change it afterwards.</p>
                {visible.map(field)}
              </fieldset>

              <div>
                <label htmlFor="qty" className="mb-1.5 block text-sm font-semibold">
                  Quantity
                </label>
                <div className="flex items-center gap-2">
                  <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border hover:bg-secondary disabled:opacity-40">
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <input id="qty" inputMode="numeric" value={qty} onChange={(e) => setQty(Math.max(1, Math.min(product.maxQty, parseInt(e.target.value, 10) || 1)))} aria-describedby="qty-hint" className="input-base nums h-11 w-16 text-center" />
                  <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(product.maxQty, q + 1))} disabled={qty >= product.maxQty} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border hover:bg-secondary disabled:opacity-40">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <p id="qty-hint" className="mt-1 text-xs text-muted-foreground">Up to {product.maxQty} per order.</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">{qty} x {variant.label}</span>
                  <span className="nums text-2xl font-bold">{pounds(variant.pricePence * qty)}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {product.fulfilment === "digital" ? "No delivery charge." : `Plus ${pounds(SHIPPING.flatPence)} UK delivery, free over ${pounds(SHIPPING.freeOverPence)}.`} Prices are what you pay; VAT is still to be confirmed (see <Link className="underline" to="/shop/help#prices">prices</Link>).
                </p>
                {st === "sold-out" && <p className="mt-2 text-sm text-destructive">This option is sold out.</p>}
                {(st === "unavailable" || st === "unknown") && <p className="mt-2 text-sm text-muted-foreground">{st === "unknown" ? "Checking whether ordering is open…" : "Ordering isn't open yet. You can add this to your basket and pay when it opens."}</p>}
              </div>

              <button type="submit" className="btn-primary btn-lg min-h-[44px] w-full justify-center">
                Add to basket
              </button>

              {added && (
                <div role="status" className="flex flex-col gap-3 rounded-xl border border-primary/40 bg-primary/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <Check className="h-4 w-4 text-primary" aria-hidden="true" /> Added to your basket
                  </p>
                  <div className="flex gap-3">
                    <Link to="/shop" className="inline-flex min-h-[44px] items-center text-sm underline underline-offset-4">Keep shopping</Link>
                    <Link to="/shop/cart" className="btn-primary btn-sm min-h-[44px] !text-background">View basket</Link>
                  </div>
                </div>
              )}
            </form>

            <div className="mt-8">
              <AvailabilityNotice slugs={[product.slug]} compact />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="content-width grid gap-8 md:grid-cols-3">
          <div>
            <h2 className="text-title">How it works</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-muted-foreground">
              {product.howItWorks.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="text-title">What's included</h2>
            <ul className="mt-4 space-y-3 text-muted-foreground">
              {product.includes.map((h) => (
                <li key={h} className="flex gap-3">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-title">What's not included</h2>
            <ul className="mt-4 space-y-3 text-muted-foreground">
              {product.notIncluded.map((h) => (
                <li key={h} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" aria-hidden="true" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="content-width">
          <div className="bordered-section grid gap-6 bg-card p-5 sm:p-6 md:grid-cols-3">
            <div>
              <h2 className="font-semibold">Delivery</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {product.fulfilment === "digital"
                  ? "Files are emailed to the address you give at checkout once your payment is confirmed. If a link can't be turned into a QR code we'll tell you."
                  : "Made to order and posted to the UK mainland. We email you a dispatch date after you order. By law we must deliver within 30 days unless we agree otherwise."}
              </p>
            </div>
            <div>
              <h2 className="font-semibold">Returns</h2>
              <p className="mt-1 text-sm text-muted-foreground">Personalised items are made for you, so the 14-day cancellation right doesn't apply to them. If something arrives faulty or not as you ordered, you have your legal rights and we'll put it right.</p>
            </div>
            <div>
              <h2 className="font-semibold">Questions</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                See <Link className="underline underline-offset-4" to="/shop/help">delivery, returns and FAQs</Link>, or <Link className="underline underline-offset-4" to="/contact">contact us</Link> before you order.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="content-width space-y-6">
          <ShopCrossSell context="product" slugs={product.related} exclude={[product.slug]} />
          <div className="bordered-section flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-title">Need somewhere good for it to point?</h2>
              <p className="mt-1 text-muted-foreground">A OneSimpleSite website gives every tap and scan a clear next step.</p>
            </div>
            <Link to="/packages" className="btn-outline btn-md min-h-[44px] justify-center">See website packages</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
