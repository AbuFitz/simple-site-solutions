import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "@fontsource-variable/hanken-grotesk/wght.css";
import "@fontsource-variable/funnel-display/wght.css";
import "@fontsource-variable/fraunces/opsz-italic.css";
import "@fontsource-variable/inter/wght.css";
import "@fontsource/dm-mono/400.css";
import "./index.css";
import "./styles/oss.css";
import "./styles/oss-pages.css";
import "./styles/oss-extra.css";
import "./styles/oss-home.css";
import "./styles/oss-inner.css";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
