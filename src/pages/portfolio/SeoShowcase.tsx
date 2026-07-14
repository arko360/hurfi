import { motion } from "framer-motion";
import { CountUp } from "../../components/CountUp";

const metrics = [
  { value: 320, suffix: "%", label: "Rankings" },
  { value: 195, suffix: "%", label: "Organic Traffic" },
  { value: 156, suffix: "%", label: "Leads Growth" },
];

const bars = [42, 58, 47, 71, 64, 82, 76, 91, 85, 98];
const keywords = [
  { kw: "b2b website agency", pos: 1, delta: "+4" },
  { kw: "manufacturer seo", pos: 2, delta: "+7" },
  { kw: "global brand presence", pos: 3, delta: "+2" },
  { kw: "google business ranking", pos: 1, delta: "+5" },
];

export function SeoShowcase() {
  return (
    <section className="showcase seo-showcase">
      <div className="showcase-head">
        <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          SEO
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          Search systems engineered for visibility — rankings, organic acquisition, and enquiry growth
          framed as a live analytics environment.
        </motion.p>
      </div>

      <div className="seo-layout">
        <div className="seo-metrics">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              className="float-stat seo-stat"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              whileHover={{ y: -6, scale: 1.03 }}
            >
              <strong>
                +<CountUp to={m.value} suffix={m.suffix} />
              </strong>
              <span>{m.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="seo-dashboard glass"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="dash-top">
            <div>
              <p>Google Search Console</p>
              <h3>Performance Overview</h3>
            </div>
            <div className="score-ring">
              <svg viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="28" />
                <motion.circle
                  cx="36"
                  cy="36"
                  r="28"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 0.92 }}
                  transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
                />
              </svg>
              <strong>
                <CountUp to={92} />
              </strong>
            </div>
          </div>

          <div className="chart-panel">
            <div className="chart-label">
              <span>Organic Traffic</span>
              <em>+195%</em>
            </div>
            <div className="line-chart">
              <svg viewBox="0 0 320 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="seoFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(0,123,255,0.35)" />
                    <stop offset="100%" stopColor="rgba(0,123,255,0)" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M0 95 C40 88, 60 70, 90 66 S140 78, 170 50 S230 30, 260 28 S300 40, 320 18"
                  fill="none"
                  stroke="#007bff"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                <motion.path
                  d="M0 95 C40 88, 60 70, 90 66 S140 78, 170 50 S230 30, 260 28 S300 40, 320 18 V120 H0 Z"
                  fill="url(#seoFill)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                />
              </svg>
            </div>

            <div className="bar-chart">
              {bars.map((h, i) => (
                <motion.span
                  key={i}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.25 + i * 0.05, duration: 0.55, ease: "easeOut" }}
                  style={{ height: `${h}%`, transformOrigin: "bottom" }}
                />
              ))}
            </div>
          </div>

          <div className="keyword-panel">
            <div className="keyword-head">
              <span>Keyword analytics</span>
              <span>Position</span>
            </div>
            {keywords.map((row, i) => (
              <motion.div
                key={row.kw}
                className="keyword-row"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.07 }}
              >
                <span>{row.kw}</span>
                <strong>
                  #{row.pos} <em>{row.delta}</em>
                </strong>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
