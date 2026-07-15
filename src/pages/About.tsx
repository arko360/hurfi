import { useRef } from "react";
import { motion } from "framer-motion";
import { CountUp } from "../components/CountUp";
import { SmartBackRow } from "../components/SmartBackNav";
import "./About.css";

const stats = [
  { n: 8, suffix: "+", label: "Years Experience" },
  { n: 200, suffix: "+", label: "Global Clients" },
  { n: 40, suffix: "+", label: "Industries Served" },
  { n: 95, suffix: "%", label: "Client Retention" },
];

const values = [
  ["Clarity", "Messaging and UX that make complex offers easy to trust."],
  ["Proof", "Everything we ship is designed to generate measurable demand."],
  ["Craft", "Premium execution across design, engineering, and search."],
  ["Partnership", "We operate as an extension of your growth team."],
];

export function About() {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <main>
      <section className="page-hero" ref={heroRef}>
        <div className="container">
          <SmartBackRow to="/" label="Back to Home" heroRef={heroRef} />
          <p className="crumb">Home / About</p>
          <h1>About Hurfi</h1>
          <p>We help B2B brands become the trusted option in international markets.</p>
        </div>
      </section>

      <section className="section-tight">
        <div className="container about-stats">
          {stats.map((s) => (
            <div key={s.label} className="card about-stat">
              <strong>
                <CountUp to={s.n} suffix={s.suffix} />
              </strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container about-grid">
          <div className="about-photo card">
            <div className="photo-fallback">Hurfi Team</div>
          </div>
          <div>
            <h2>Built for international B2B growth</h2>
            <p>
              Hurfi combines brand positioning, high-converting websites, and search systems so
              manufacturers can attract and convert the right buyers — not just collect vanity traffic.
            </p>
            <div className="value-list">
              {values.map(([t, d], i) => (
                <motion.div
                  key={t}
                  className="value-item"
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <h4>{t}</h4>
                  <p>{d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
