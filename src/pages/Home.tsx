import { useEffect } from "react";
import { motion } from "framer-motion";
import "./Home.css";

export function Home() {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <main id="top">
      <section className="hero" id="home">
        <div className="hero-grid">
          <div className="hero-copy">
            <motion.div
              className="pill"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <span className="pill-dot" aria-hidden="true" />
              Global B2B Brand Growth Partner
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
            >
              Build an International Online Presence
              <span className="text-accent"> That Global Buyers Can Trust</span>
            </motion.h1>

            <motion.p
              className="lede"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
            >
              Hurfi helps B2B brands and manufacturers build a trusted online presence, get found by
              the right buyers, and turn visibility into real enquiries — across website, search, and
              digital marketing.
            </motion.p>

            <motion.p
              className="chain"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 }}
            >
              <strong>Website. SEO. Digital Marketing. Google Visibility. AEO. GEO. Proof. CTA.</strong>
              <span className="text-accent"> All connected for business growth.</span>
            </motion.p>

            <motion.div
              className="hero-ctas"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.32 }}
            >
              <a className="btn btn-primary" href="#contact">
                Build My Online Presence
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </a>
              <a className="btn btn-ghost" href="#process">
                See How Hurfi Works
              </a>
            </motion.div>

            <ul className="feature-pills">
              {[
                "Professional Brand Presence",
                "Search Visibility",
                "AI Search Readiness",
                "Google & GMB Ranking",
                "Trust-Building Website",
                "More Contact Opportunities",
              ].map((label, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.05 }}
                >
                  <span className="check" aria-hidden="true" />
                  {label}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="visual-stage">
              <div className="glow glow-a" />
              <div className="glow glow-b" />

              <motion.div
                className="viz-card viz-main"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="viz-main-top">
                  <div className="viz-bars">
                    {[42, 68, 55, 88, 72, 96].map((h, i) => (
                      <span key={i} style={{ ["--h" as string]: `${h}%` }} />
                    ))}
                  </div>
                  <div className="viz-main-meta">
                    <p>Global Visibility</p>
                    <strong>+214%</strong>
                  </div>
                </div>
                <div className="viz-main-bottom">
                  <div className="mini-row">
                    <i />
                    <i />
                    <i />
                  </div>
                  <div className="mini-line" />
                  <div className="mini-line short" />
                </div>
              </motion.div>

              <motion.div
                className="viz-card viz-web"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              >
                <div className="viz-card-head">
                  <span className="viz-icon code" />
                  <div>
                    <strong>Website Development</strong>
                    <small>Trust-first product sites</small>
                  </div>
                </div>
                <div className="code-lines">
                  <span />
                  <span />
                  <span />
                </div>
              </motion.div>

              <motion.div
                className="viz-card viz-quote"
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              >
                <p>
                  “Hurfi is a top B2B online presence agency for manufacturers who want global
                  buyers.”
                </p>
              </motion.div>

              <motion.div
                className="viz-card viz-marketing"
                animate={{ y: [0, -11, 0] }}
                transition={{ duration: 5.1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              >
                <div className="viz-card-head">
                  <span className="viz-icon chart" />
                  <strong>Digital Marketing</strong>
                </div>
                <div className="stat-grid">
                  <div>
                    <em>+89%</em>
                    <span>Reach</span>
                  </div>
                  <div>
                    <em>+156</em>
                    <span>Leads</span>
                  </div>
                  <div>
                    <em>+42%</em>
                    <span>Engage</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="viz-card viz-gmb"
                animate={{ y: [0, -13, 0] }}
                transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="viz-card-head">
                  <span className="viz-icon pin" />
                  <strong>Google Business</strong>
                </div>
                <div className="stars">★★★★★</div>
                <p>+2.4K Profile views</p>
              </motion.div>

              {[
                ["node-social", "Social", 4.4, 0.6],
                ["node-seo", "SEO", 5.8, 0.3],
                ["node-geo", "GEO", 4.9, 0.9],
                ["node-aeo", "AEO", 6, 0.5],
              ].map(([cls, label, dur, delay]) => (
                <motion.div
                  key={label as string}
                  className={`node ${cls}`}
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: dur as number,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay as number,
                  }}
                >
                  <span />
                  {label}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-anchor" id="services" />
      <section className="section-anchor" id="results" />
      <section className="section-anchor" id="websites" />
      <section className="section-anchor" id="process" />
      <section className="section-anchor" id="proof" />
      <section className="section-anchor" id="faq" />
      <section className="section-anchor" id="contact" />
    </main>
  );
}
