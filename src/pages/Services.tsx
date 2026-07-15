import { useRef } from "react";
import { motion } from "framer-motion";
import { SmartBackRow } from "../components/SmartBackNav";
import "./Services.css";

const services = [
  { title: "Website Development", text: "High-trust product and corporate sites built for speed, clarity, and conversion.", icon: "◎" },
  { title: "SEO", text: "Technical foundations, content systems, and rankings that attract buyer-intent traffic.", icon: "⌕" },
  { title: "Digital Marketing", text: "Campaigns and nurture flows that turn visibility into qualified conversations.", icon: "◈" },
  { title: "AEO / GEO", text: "Answer-engine and geographic visibility strategies for AI search and local authority.", icon: "✦" },
  { title: "Branding", text: "Identity systems that make manufacturers look credible in international markets.", icon: "◇" },
  { title: "Google Business", text: "Profile strength, reviews, and ranking support that improve discovery and trust.", icon: "◉" },
];

export function Services() {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <main>
      <section className="page-hero" ref={heroRef}>
        <div className="container">
          <SmartBackRow to="/" label="Back to Home" heroRef={heroRef} />
          <p className="crumb">Home / Services</p>
          <h1>Services</h1>
          <p>Everything required to build, find, and convert international B2B demand.</p>
        </div>
      </section>

      <section className="section">
        <div className="container services-grid">
          {services.map((s, i) => (
            <motion.article
              key={s.title}
              className="card service-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6 }}
            >
              <div className="service-ico">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
