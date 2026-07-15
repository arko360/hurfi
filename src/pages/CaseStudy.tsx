import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { projects } from "../data/projects";
import { CountUp } from "../components/CountUp";
import "./CaseStudy.css";

export function CaseStudy() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug) ?? projects[0];

  return (
    <main className="case-page">
      <section className="page-hero">
        <div className="container">
          <p className="crumb">
            <Link to="/portfolio">Portfolio</Link> / {project.name}
          </p>
          <h1>{project.name}</h1>
          <p>{project.summary}</p>
        </div>
      </section>

      <section className="section">
        <div className="container case-grid">
          <div className="case-copy">
            {[
              ["The Challenge", "The brand needed a credible international presence that could convert serious B2B buyers."],
              ["Our Strategy", "We aligned website UX, messaging, and search structure around trust and high-intent demand."],
              ["Implementation", "Design, development, SEO foundations, and conversion paths launched as one connected system."],
              ["Results", "Visible lifts in traffic quality, enquiry volume, and brand clarity across key markets."],
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
                <span>Organic Traffic Growth</span>
                <em>+195%</em>
              </div>
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
                      {l === "ROI" ? (
                        "3.2x"
                      ) : (
                        <CountUp to={Number(n)} suffix={s} />
                      )}
                    </strong>
                    <span>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
