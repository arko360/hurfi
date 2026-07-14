import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WebsiteShowcase } from "./portfolio/WebsiteShowcase";
import { SeoShowcase } from "./portfolio/SeoShowcase";
import { BrandingShowcase } from "./portfolio/BrandingShowcase";
import "./portfolio/portfolio.css";

type TabId = "website" | "seo" | "branding";

const tabs: {
  id: TabId;
  label: string;
  count: number;
  icon: ReactNode;
}[] = [
  {
    id: "website",
    label: "Website Development",
    count: 24,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M3 9h18" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="6.2" cy="6.5" r="0.8" fill="currentColor" />
        <circle cx="8.6" cy="6.5" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "seo",
    label: "SEO",
    count: 18,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="5.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M15 15l5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M8 10.5h5M10.5 8v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "branding",
    label: "Branding & Growth",
    count: 16,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3l2.2 4.6L19 8.3l-3.5 3.4.8 4.8L12 14.8 7.7 16.5l.8-4.8L5 8.3l4.8-.7L12 3z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export function Portfolio() {
  const [active, setActive] = useState<TabId>("website");

  return (
    <main className="portfolio-page">
      <section className="portfolio-hero">
        <div className="portfolio-hero-bg" aria-hidden="true">
          <span className="blob blob-a" />
          <span className="blob blob-b" />
          <span className="blob blob-c" />
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className="star" style={{ ["--i" as string]: i }} />
          ))}
        </div>

        <motion.div
          className="portfolio-hero-copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <p className="eyebrow">
            <span className="eyebrow-dot" />
            Selected Work
          </p>
          <h1>
            Portfolio built for
            <span className="text-accent"> measurable growth</span>
          </h1>
          <p>
            Explore Hurfi's premium delivery across websites, search, and brand systems — each
            showcase is crafted for clarity, trust, and conversion.
          </p>
        </motion.div>
      </section>

      <nav className="portfolio-tabs" aria-label="Portfolio categories">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`portfolio-tab ${isActive ? "is-active" : ""}`}
              onClick={() => setActive(tab.id)}
              aria-pressed={isActive}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              <span className="tab-count">{tab.count}</span>
              {isActive && (
                <motion.span
                  className="tab-underline"
                  layoutId="portfolio-tab-underline"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="portfolio-stage">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {active === "website" && <WebsiteShowcase />}
            {active === "seo" && <SeoShowcase />}
            {active === "branding" && <BrandingShowcase />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
