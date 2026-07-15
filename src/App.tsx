import { Routes, Route, useParams } from "react-router-dom";
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

function PortfolioEntry() {
  const { slug } = useParams();
  if (slug === "website" || slug === "seo" || slug === "branding") {
    return <PortfolioCategory />;
  }
  return <CaseStudy />;
}

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:slug" element={<PortfolioEntry />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </>
  );
}
