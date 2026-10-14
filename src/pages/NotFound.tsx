import { Link, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";

const links = [
  { to: "/packages", label: "Packages and prices" },
  { to: "/work", label: "Our work" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/start", label: "Start a project" },
  { to: "/contact", label: "Contact us" },
];

const NotFound = () => {
  const { pathname } = useLocation();
  return (
    <Layout>
      <Seo title="Page not found | OneSimpleSite" description="That page doesn't exist." path={pathname} noindex />
      <section className="content-width max-w-2xl pt-28 pb-20 sm:pt-36">
        <p className="text-sm text-muted-foreground">Error 404</p>
        <h1 className="text-headline mt-2">We can't find that page</h1>
        <p className="text-body-lg mt-4">The address may be wrong, or the page may have moved. Try one of these:</p>
        <ul className="mt-6 grid gap-1">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="inline-flex min-h-[44px] items-center text-lg underline underline-offset-4 hover:text-primary">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/" className="btn-primary btn-lg mt-8 min-h-[44px] justify-center !text-background">Back to home</Link>
      </section>
    </Layout>
  );
};

export default NotFound;
