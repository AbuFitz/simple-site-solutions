import { Link } from "react-router-dom";
import { CATEGORIES, fromPricePence, pounds, type Product } from "@/data/shop";
import { ProductVisual } from "./ProductVisual";

export function ProductCard({ product, headingLevel = 2 }: { product: Product; headingLevel?: 2 | 3 }) {
  const cat = CATEGORIES.find((c) => c.id === product.category);
  const H = `h${headingLevel}` as "h2" | "h3";
  return (
    <li className="bordered-section flex flex-col bg-card">
      <Link to={`/shop/${product.slug}`} className="group flex h-full flex-col focus-visible:outline-offset-[-2px]" aria-describedby={`${product.slug}-price`}>
        <ProductVisual kind={product.visual} className="aspect-[4/3] w-full" />
        <div className="flex flex-1 flex-col p-5">
          <p className="text-xs text-muted-foreground">
            {cat?.label} · {product.fulfilment === "digital" ? "Emailed" : "Posted"}
          </p>
          <H className="mt-1 text-lg font-bold tracking-tight group-hover:text-primary">{product.name}</H>
          <p className="mt-2 flex-1 text-sm text-muted-foreground">{product.tagline}</p>
          <p id={`${product.slug}-price`} className="mt-4 text-sm">
            <span className="text-muted-foreground">From </span>
            <span className="text-lg font-bold nums">{pounds(fromPricePence(product))}</span>
          </p>
        </div>
      </Link>
    </li>
  );
}
