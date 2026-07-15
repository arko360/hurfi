import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { projects, type Project } from "../data/projects";
import { SmartBackRow } from "../components/SmartBackNav";
import "./Portfolio.css";

const meta: Record<
  Exclude<Project["category"], "website">,
  { title: string; subtitle: string; crumb: string }
> = {
  seo: {
    title: "Search Engine Optimization",
    subtitle: "Rankings, organic traffic, and search systems that generate qualified demand.",
    crumb: "SEO",
  },
  branding: {
    title: "Branding & Growth",
    subtitle: "Brand systems and growth assets that make companies memorable and credible.",
    crumb: "Branding & Growth",
  },
};

function SeoStage() {
  const bars = [42, 58, 50, 72, 66, 84, 78, 94];
  return (
    <div className="cat-stage seo-stage" aria-hidden="true">
      <motion.div
        className="seo-panel"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="seo-panel-head">
          <strong>Organic Growth</strong>
          <em>+195%</em>
        </div>
        <svg viewBox="0 0 280 90" className="seo-line">
          <motion.path
            d="M0 70 C40 66, 60 50, 90 48 S140 58, 170 34 S230 18, 280 12"
            fill="none"
            stroke="#0056ff"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4 }}
          />
        </svg>
        <div className="seo-bars">
          {bars.map((h, i) => (
            <motion.span
              key={i}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.05, duration: 0.5 }}
              style={{ height: `${h}%`, transformOrigin: "bottom" }}
            />
          ))}
        </div>
      </motion.div>
      {["SEO", "Keywords", "Traffic", "Rank"].map((label, i) => (
        <motion.div
          key={label}
          className={`seo-chip chip-${i}`}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.8 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
        >
          {label}
        </motion.div>
      ))}
    </div>
  );
}

function BrandingStage() {
  return (
    <div className="cat-stage branding-stage" aria-hidden="true">
      <motion.div
        className="brand-logo-reveal"
        initial={{ opacity: 0, scale: 0.86 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <img src="/assets/icons/hurfi-mark.svg" alt="" />
        <strong>Hurfi</strong>
      </motion.div>
      <div className="palette">
        {["#0056ff", "#2f7dff", "#e8f2ff", "#0a1930", "#ffffff"].map((c, i) => (
          <motion.span
            key={c}
            style={{ background: c, border: c === "#ffffff" ? "1px solid #d9e2ec" : undefined }}
            initial={{ y: 12, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.06 }}
          />
        ))}
      </div>
      <motion.div
        className="growth-pill"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      >
        Brand Growth +180%
      </motion.div>
      {["IG", "in", "X"].map((s, i) => (
        <motion.div
          key={s}
          className={`social-float s-${i}`}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.6 + i * 0.35, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
        >
          {s}
        </motion.div>
      ))}
    </div>
  );
}

type Props = {
  category: "seo" | "branding";
};

export function PortfolioCategory({ category }: Props) {
  const heroRef = useRef<HTMLElement>(null);
  const info = meta[category];
  const filtered = useMemo(
    () => projects.filter((p) => p.category === category),
    [category]
  );

  return (
    <main className="portfolio-page category-page">
      <section className="page-hero cat-hero" ref={heroRef}>
        <div className="container">
          <SmartBackRow
            to="/portfolio"
            label="Back to Portfolio"
            heroRef={heroRef}
            end={<span className="cat-top-label">{info.crumb}</span>}
          />
          <div className="cat-hero-grid">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="crumb">
                <Link to="/portfolio">Portfolio</Link> / {info.crumb}
              </p>
              <h1>{info.title}</h1>
              <p>{info.subtitle}</p>
            </motion.div>
            {category === "seo" ? <SeoStage /> : <BrandingStage />}
          </div>
        </div>
      </section>

      <div className="container">
        <motion.h2
          className="projects-label"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Selected Work
        </motion.h2>
        <motion.div
          className="project-grid"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {filtered.map((project, i) => (
            <motion.article
              key={project.slug}
              className="project-card card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -6 }}
            >
              <Link to={`/portfolio/${project.slug}`} className="project-card-link">
                <div className="project-media" style={{ background: project.accent }}>
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
                </div>
                <div className="project-body">
                  <p className="project-meta">
                    {project.name} — {project.industry}
                  </p>
                  <div className="project-metrics">
                    <span>{project.metrics[0]}</span>
                    <span>{project.metrics[1]}</span>
                  </div>
                  <span className="project-link">
                    View Project <span>→</span>
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
