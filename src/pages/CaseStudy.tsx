import { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { projects } from "../data/projects";
import { CountUp } from "../components/CountUp";
import { SmartBackRow } from "../components/SmartBackNav";
import "./CaseStudy.css";

export function CaseStudy() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug) ?? projects[0];
  const heroRef = useRef<HTMLElement>(null);
  const backTo =
    project.category === "website"
      ? "/portfolio/website"
      : project.category === "seo"
        ? "/portfolio/seo"
        : project.category === "branding"
          ? "/portfolio/branding"
          : "/portfolio";
  const backLabel =
    project.category === "website"
      ? "Back to Website Development"
      : project.category === "seo"
        ? "Back to SEO"
        : project.category === "branding"
          ? "Back to Branding"
          : "Back to Portfolio";

  return (
    <main className="case-page">
      <section className="page-hero" ref={heroRef}>
        <div className="container">
          <SmartBackRow to={backTo} label={backLabel} heroRef={heroRef} />
          <p className="crumb">
            <Link to="/portfolio">Portfolio</Link>
            {project.category === "website" ? (
              <>
                {" / "}
                <Link to="/portfolio/website">Website Development</Link>
              </>
            ) : null}{" "}
            / {project.name}
          </p>
          <h1>{project.name}</h1>
          <p>{project.summary}</p>
          {project.url ? (
            <p style={{ marginTop: 18 }}>
              <a className="btn btn-primary" href={project.url} target="_blank" rel="noopener noreferrer">
                🌐 Visit Live Website
              </a>
            </p>
          ) : null}
        </div>
      </section>

      {project.image ? (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <motion.div
              className="card"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ overflow: "hidden", borderRadius: 24, padding: 0 }}
            >
              <img
                src={project.image}
                alt={`${project.name} full website preview`}
                style={{ display: "block", width: "100%", height: "auto" }}
              />
            </motion.div>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container case-grid">
          <div className="case-copy">
            {[
              ["The Challenge", "The brand needed a credible digital presence that could convert serious buyers online."],
              ["Our Strategy", "We aligned website UX, messaging, and conversion paths around trust and clear product discovery."],
              ["Implementation", "Design, development, merchandising structure, and responsive performance launched as one system."],
              ["Results", "A live, production-ready website built to support growth, enquiries, and brand credibility."],
            ].map(([title, text], i) => (
              <motion.article
                key={title}
                className="case-block card"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            ))}
          </div>

          <div className="case-visual">
            <div className="card chart-card">
              <div className="chart-head">
                <span>{project.tech ? "Technology Stack" : "Organic Traffic Growth"}</span>
                <em>{project.tech ? project.industry.split("/")[0].trim() : "+195%"}</em>
              </div>
              {project.tech ? (
                <div style={{ padding: "8px 4px 4px" }}>
                  <p style={{ margin: "0 0 14px", color: "var(--muted)", lineHeight: 1.55 }}>
                    Built with {project.tech} for speed, clarity, and conversion-focused shopping experiences.
                  </p>
                  <div className="stat-row">
                    {[
                      ["Live", "", "Website"],
                      ["Full", "", "Responsive"],
                      ["Real", "", "Client Work"],
                      ["Hurfi", "", "Delivery"],
                    ].map(([n, , l]) => (
                      <div key={l}>
                        <strong>{n}</strong>
                        <span>{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <svg viewBox="0 0 320 160" className="growth-chart">
                    <defs>
                      <linearGradient id="fillA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(0,86,255,0.35)" />
                        <stop offset="100%" stopColor="rgba(0,86,255,0)" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d="M0 130 C40 120, 70 100, 100 95 S160 110, 190 70 S250 40, 280 35 S310 45, 320 28"
                      fill="none"
                      stroke="#0056ff"
                      strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4 }}
                    />
                    <path
                      d="M0 130 C40 120, 70 100, 100 95 S160 110, 190 70 S250 40, 280 35 S310 45, 320 28 V160 H0 Z"
                      fill="url(#fillA)"
                    />
                  </svg>
                  <div className="stat-row">
                    {[
                      ["188", "%", "Traffic"],
                      ["240", "%", "Leads"],
                      ["98", "", "Score"],
                      ["3.2", "x", "ROI"],
                    ].map(([n, s, l]) => (
                      <div key={l}>
                        <strong>
                          {l === "ROI" ? "3.2x" : <CountUp to={Number(n)} suffix={s} />}
                        </strong>
                        <span>{l}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
