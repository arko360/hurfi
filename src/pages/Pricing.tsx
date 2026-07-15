import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Pricing.css";

const plans = [
  {
    name: "Starter",
    monthly: 1499,
    yearly: 1299,
    desc: "For brands establishing a credible digital foundation.",
    features: ["Website foundation", "On-page SEO setup", "Basic analytics", "Email support"],
  },
  {
    name: "Growth",
    monthly: 2999,
    yearly: 2599,
    desc: "Most popular for scaling inbound demand.",
    popular: true,
    features: [
      "Conversion-focused website",
      "SEO + content system",
      "Lead tracking setup",
      "Monthly strategy reviews",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    monthly: 5499,
    yearly: 4799,
    desc: "Full-funnel presence for international teams.",
    features: [
      "Custom website + CMS",
      "Advanced SEO / AEO",
      "Brand system support",
      "Multi-market rollout",
      "Dedicated growth lead",
    ],
  },
];

export function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="crumb">Home / Pricing</p>
          <h1>Pricing</h1>
          <p>Simple packages designed around outcomes — not endless retainers without direction.</p>
          <div className="billing-toggle" role="group" aria-label="Billing period">
            <button type="button" className={!yearly ? "is-active" : ""} onClick={() => setYearly(false)}>
              Monthly
            </button>
            <button type="button" className={yearly ? "is-active" : ""} onClick={() => setYearly(true)}>
              Yearly
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container pricing-grid">
          {plans.map((plan, i) => (
            <motion.article
              key={plan.name}
              className={`card pricing-card ${plan.popular ? "is-popular" : ""}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              {plan.popular && <span className="badge">Most Popular</span>}
              <h3>{plan.name}</h3>
              <p className="plan-desc">{plan.desc}</p>
              <div className="price">
                <strong>${yearly ? plan.yearly : plan.monthly}</strong>
                <span>/mo</span>
              </div>
              <ul>
                {plan.features.map((f) => (
                  <li key={f}>
                    <span>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link className={`btn ${plan.popular ? "btn-primary" : "btn-ghost"}`} to="/contact">
                Get Started
                <span className="btn-arrow">→</span>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
