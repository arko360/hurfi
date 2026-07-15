import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "../data/projects";
import "./Portfolio.css";

type Tab = "website" | "seo" | "branding";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "website", label: "Website Development", icon: "▢" },
  { id: "seo", label: "SEO", icon: "⌕" },
  { id: "branding", label: "Branding & Growth", icon: "✧" },
];

export function Portfolio() {
  const [active, setActive] = useState<Tab>("website");

  const filtered = useMemo(
    () => projects.filter((p) => p.category === active),
    [active]
  );

  return (
    <main className="portfolio-page">
      <section className="page-hero">
        <div className="container">
          <p className="crumb">Home / Portfolio</p>
          <h1>Our Portfolio</h1>
          <p>
            Selected work across websites, search, and brand systems — built for measurable B2B
            growth.
          </p>
        </div>
      </section>

      <div className="container">
        <nav className="portfolio-tabs" aria-label="Portfolio categories">
          {tabs.map((tab) => {
            const count = projects.filter((p) => p.category === tab.id).length;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`portfolio-tab ${isActive ? "is-active" : ""}`}
                onClick={() => setActive(tab.id)}
              >
                <span className="tab-ico">{tab.icon}</span>
                <span>{tab.label}</span>
                <span className="tab-count">{count}</span>
                {isActive && (
                  <motion.span
                    className="tab-line"
                    layoutId="tab-line"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="project-grid"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {filtered.map((project, i) => (
              <motion.article
                key={project.slug}
                className="project-card card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -6 }}
              >
                <Link to={`/portfolio/${project.slug}`} className="project-media" style={{ background: project.accent }}>
                  <div className="mock-browser">
                    <div className="mock-dots">
                      <i />
                      <i />
                      <i />
                    </div>
                    <div className="mock-screen">
                      <span />
                      <span className="short" />
                      <div className="mock-tiles">
                        <b />
                        <b />
                        <b />
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="project-body">
                  <p className="project-meta">
                    {project.name} — {project.industry}
                  </p>
                  <div className="project-metrics">
                    <span>{project.metrics[0]}</span>
                    <span>{project.metrics[1]}</span>
                  </div>
                  <Link className="project-link" to={`/portfolio/${project.slug}`}>
                    View Project <span>→</span>
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
