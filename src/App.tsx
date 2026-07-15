import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ScrollToTop } from "./components/ScrollToTop";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Portfolio } from "./pages/Portfolio";
import { PortfolioCategory } from "./pages/PortfolioCategory";
import { Services } from "./pages/Services";
import { About } from "./pages/About";
import { Pricing } from "./pages/Pricing";
import { Contact } from "./pages/Contact";
import { CaseStudy } from "./pages/CaseStudy";

const WebsiteDevShowcase = lazy(() =>
  import("./pages/portfolio/WebsiteDevShowcase").then((m) => ({
    default: m.WebsiteDevShowcase,
  }))
);

function WebsiteFallback() {
  return (
    <main className="wd-page wd-page-fallback" aria-busy="true" aria-label="Loading">
      <div className="container" style={{ padding: "100px 0 40px" }}>
        <div
          className="wd-skeleton"
          style={{ height: 48, width: "40%", borderRadius: 12, marginBottom: 24 }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="wd-skeleton" style={{ height: 360, borderRadius: 22 }} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <ErrorBoundary name="App">
      <ScrollToTop />
      <Header />
      <ErrorBoundary name="Page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route
            path="/portfolio/website"
            element={
              <Suspense fallback={<WebsiteFallback />}>
                <WebsiteDevShowcase />
              </Suspense>
            }
          />
          <Route path="/portfolio/seo" element={<PortfolioCategory category="seo" />} />
          <Route path="/portfolio/branding" element={<PortfolioCategory category="branding" />} />
          <Route path="/portfolio/:slug" element={<CaseStudy />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
      <Footer />
    </ErrorBoundary>
  );
}
