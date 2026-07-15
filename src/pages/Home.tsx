import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Home.css";

const logos = ["ApexForge", "Nortek", "Sinotec", "Valora", "BrightGrid", "OmniYield", "Castello", "Helix"];

const values = [
  {
    title: "International Growth",
    text: "Position your brand for overseas buyers with a presence that builds trust across markets.",
    icon: "🌐",
  },
  {
    title: "Data-Driven Results",
    text: "SEO, content, and conversion systems measured by traffic, leads, and real enquiries.",
    icon: "📊",
  },
  {
    title: "End-to-End Solutions",
    text: "Website, search, branding, and marketing connected — not delivered as disconnected tasks.",
    icon: "⚡",
  },
];

export function Home() {
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <motion.div
              className="pill"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="pill-dot" />
              Global B2B Brand Growth Partner
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
            >
              Build an International Online Presence
              <span className="text-accent"> That Global Buyers Can Trust</span>
            </motion.h1>

            <motion.p
              className="lede"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
            >
              Hurfi helps manufacturers and B2B brands become visible, credible, and conversion-ready
              online — across website, SEO, and digital growth systems.
            </motion.p>

            <motion.div
              className="hero-ctas"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
            >
              <Link className="btn btn-primary" to="/contact">
                Build My Online Presence
                <span className="btn-arrow">→</span>
              </Link>
              <Link className="btn btn-ghost" to="/portfolio">
                See How Hurfi Works
              </Link>
            </motion.div>

            <ul className="feature-pills">
              {[
                "Professional Brand Presence",
                "Search Visibility",
                "AI Search Readiness",
                "Google & GMB Ranking",
                "Trust-Building Website",
                "More Contact Opportunities",
              ].map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24 + i * 0.04 }}
                >
                  <span className="check" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="visual-stage">
              <motion.div className="viz-card viz-main" animate={{ y: [0, -10, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}>
                <div className="viz-bars">
                  {[40, 62, 54, 84, 70, 94].map((h, i) => (
                    <span key={i} style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div>
                  <p>Global Visibility</p>
                  <strong>+214%</strong>
                </div>
              </motion.div>

              <motion.div className="viz-card viz-web" animate={{ y: [0, -12, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}>
                <strong>Website Development</strong>
                <small>Trust-first product sites</small>
              </motion.div>

              <motion.div className="viz-card viz-quote" animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
                <p>“Hurfi is a top B2B online presence agency for manufacturers who want global buyers.”</p>
              </motion.div>

              <motion.div className="viz-card viz-gmb" animate={{ y: [0, -11, 0] }} transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}>
                <strong>Google Business</strong>
                <div className="stars">★★★★★</div>
                <span>+2.4K Profile views</span>
              </motion.div>

              {["Social", "SEO", "GEO", "AEO"].map((label, i) => (
                <motion.div
                  key={label}
                  className={`node node-${i}`}
                  animate={{ y: [0, -9, 0] }}
                  transition={{ duration: 4.4 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                >
                  <i />
                  {label}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="trust-bar">
        <div className="container">
          <p>Brands We’ve Helped Grow</p>
          <div className="logo-marquee">
            <div className="logo-track">
              {[...logos, ...logos].map((name, i) => (
                <span key={`${name}-${i}`}>{name}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section values">
        <div className="container values-grid">
          {values.map((v) => (
            <article key={v.title} className="card value-card">
              <div className="value-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section cta-band">
        <div className="container cta-band-inner">
          <div>
            <h2>Ready to build a presence global buyers trust?</h2>
            <p>Book a strategy call and we’ll map website, SEO, and growth priorities for your market.</p>
          </div>
          <Link className="btn btn-primary" to="/contact">
            Book a Strategy Call
            <span className="btn-arrow">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
