import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Pill } from "@/components/oss/Pill";

const NotFound = () => {
  const { pathname } = useLocation();
  return (
    <Layout>
      <Helmet>
        <title>Page not found | OneSimpleSite</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <section className="pb-28 pt-16 md:pb-44 md:pt-28">
        <div className="content-width">
          <p className="t-label">404 · {pathname}</p>
          <h1 className="t-mega mt-8" style={{ fontSize: "clamp(3.5rem, 12vw, 10rem)" }}>
            This page
            <span className="block pl-[8vw]">isn&rsquo;t here.</span>
          </h1>
          <p className="t-lead mt-8 max-w-md md:ml-[8vw]">The link may be old or mistyped. Everything that does exist is one click away.</p>
          <div className="mt-8 flex flex-wrap items-center gap-6 md:ml-[8vw]">
            <Pill to="/">Back to home</Pill>
            <Link to="/work" className="link-line">See our work</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
