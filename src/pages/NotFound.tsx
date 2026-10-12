import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";

const NotFound = () => {
  const { pathname } = useLocation();
  return (
    <Layout>
      <Helmet>
        <title>Page not found | OneSimpleSite</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <section className="flex min-h-[80svh] items-center pt-28">
        <div className="content-width">
          <p className="eyebrow mb-4">404 · {pathname}</p>
          <h1 className="text-display">
            This page <span className="text-signal">didn't ship.</span>
          </h1>
          <p className="text-body-lg mt-6 max-w-md">The link may be old or mistyped. Everything that does exist is one click away.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/" className="btn-primary btn-lg">
              Back to home
            </Link>
            <Link to="/work" className="btn-outline btn-lg">
              See our work
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
