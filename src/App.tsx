import { useLocation, Navigate, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ScrollToTop } from "./components/ScrollToTop";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Portfolio } from "./pages/Portfolio";
import { PortfolioCategory } from "./pages/PortfolioCategory";
import { WebsiteDevShowcase } from "./pages/portfolio/WebsiteDevShowcase";
import { Services } from "./pages/Services";
import { About } from "./pages/About";
import { Pricing } from "./pages/Pricing";
import { Contact } from "./pages/Contact";
import { CaseStudy } from "./pages/CaseStudy";

/** Reset page errors on navigation without remounting the whole route tree. */
function PageRoutes() {
  const { pathname } = useLocation();

  return (
    <ErrorBoundary name="Page" resetKey={pathname}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/website" element={<WebsiteDevShowcase />} />
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
  );
}

export default function App() {
  return (
    <ErrorBoundary name="App">
      <ScrollToTop />
      <Header />
      <PageRoutes />
      <Footer />
    </ErrorBoundary>
  );
}
