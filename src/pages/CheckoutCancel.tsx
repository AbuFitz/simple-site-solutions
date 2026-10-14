import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";

export default function CheckoutCancel() {
  return (
    <Layout>
      <Seo path="/checkout/cancel" noindex />
      <section className="content-width mx-auto max-w-xl pt-28 pb-16 sm:pt-36">
        <h1 className="text-headline">Payment cancelled</h1>
        <p className="text-body-lg mt-4">You left checkout before paying, so nothing was charged. Your project details, if you sent them, are still with us.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/packages" className="btn-primary btn-lg min-h-[44px] justify-center !text-background">See packages</Link>
          <Link to="/start" className="btn-outline btn-lg min-h-[44px] justify-center">Send a brief instead</Link>
        </div>
      </section>
    </Layout>
  );
}
