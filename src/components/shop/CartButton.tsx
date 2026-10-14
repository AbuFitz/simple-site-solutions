import { Link } from "react-router-dom";
import { ShoppingBasket } from "lucide-react";
import { useCart } from "./CartProvider";

/** Basket link for the header. The count is part of the accessible name. */
export function CartButton({ className = "" }: { className?: string }) {
  const { count } = useCart();
  return (
    <Link
      to="/shop/cart"
      aria-label={count ? `Basket, ${count} ${count === 1 ? "item" : "items"}` : "Basket, empty"}
      className={`relative inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-foreground hover:bg-secondary ${className}`}
    >
      <ShoppingBasket className="h-5 w-5" aria-hidden="true" />
      {count > 0 && (
        <span aria-hidden="true" className="nums absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
