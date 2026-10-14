import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { useCart } from "@/components/shop/CartProvider";

export default function ShopOrderCancel() {
  const { count } = useCart();
  return (
    <Layout>
      <Seo path="/shop/order/cancel" />
      <section className="content-width max-w-xl pt-28 pb-16 sm:pt-36">
        <h1 className="text-headline">Payment cancelled</h1>
        <p className="text-body-lg mt-4">You left checkout before paying, so nothing was charged.{count > 0 ? " Your basket is still saved." : ""}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/shop/checkout" className="btn-primary btn-lg min-h-[44px] justify-center !text-background">Back to checkout</Link>
          <Link to="/shop/cart" className="btn-outline btn-lg min-h-[44px] justify-center">View basket</Link>
        </div>
      </section>
    </Layout>
  );
}
