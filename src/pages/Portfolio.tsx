import { useRef, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { PortfolioCardPreview } from "../components/portfolio/PortfolioCardPreviews";
import "./Portfolio.css";

const categories = [
  {
    id: "website",
    title: "Website Development",
    to: "/portfolio/website",
    description: "Conversion-focused B2B websites engineered for trust and international growth.",
    accent: "linear-gradient(145deg, rgba(0,86,255,0.16), rgba(255,255,255,0.4))",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M3 9h18" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="6.2" cy="6.5" r="0.8" fill="currentColor" />
        <circle cx="8.6" cy="6.5" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "seo",
    title: "SEO",
    to: "/portfolio/seo",
    description: "Search systems that improve rankings, organic traffic, and qualified inbound demand.",
    accent: "linear-gradient(145deg, rgba(0,86,255,0.1), rgba(230,240,255,0.7))",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="5.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M15 15l5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M8 10.5h5M10.5 8v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "branding",
    title: "Branding & Growth",
    to: "/portfolio/branding",
    description: "Identity and growth systems that make brands memorable, credible, and scalable.",
    accent: "linear-gradient(145deg, rgba(13,34,64,0.08), rgba(0,86,255,0.12))",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3l2.2 4.6L19 8.3l-3.5 3.4.8 4.8L12 14.8 7.7 16.5l.8-4.8L5 8.3l4.8-.7L12 3z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

function MagneticLink({
  to,
  children,
  className,
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18 });
  const sy = useSpring(y, { stiffness: 260, damping: 18 });

  const onMove = (e: MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.25);
  };

  return (
    <motion.div style={{ x: sx, y: sy }} className="magnetic-wrap">
      <Link
        ref={ref}
        to={to}
        className={className}
        onMouseMove={onMove}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
      >
        {children}
      </Link>
    </motion.div>
  );
}

function TiltCardLink({
  to,
  children,
  className,
  style,
  delay,
}: {
  to: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 180, damping: 16 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 180, damping: 16 });
  const glowX = useTransform(mx, [-0.5, 0.5], [0, 100]);
  const glowY = useTransform(my, [-0.5, 0.5], [0, 100]);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${glowX}% ${glowY}%, rgba(0,86,255,0.18), transparent 45%)`;

  return (
    <motion.div
      className="pf-card-motion"
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <Link ref={ref} to={to} className={className} style={style}>
        <motion.div className="card-mouse-glow" style={{ background: glow }} />
        {children}
      </Link>
    </motion.div>
  );
}

export function Portfolio() {
  return (
    <main className="portfolio-landing">
      <section className="portfolio-viewport">
        <div className="pf-bg" aria-hidden="true">
          <span className="pf-grid" />
          <span className="pf-blob a" />
          <span className="pf-blob b" />
          <span className="pf-blob c" />
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="pf-particle" style={{ ["--i" as string]: i }} />
          ))}
        </div>

        <div className="pf-top-nav">
          <MagneticLink to="/" className="pf-back-btn">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Back to Home</span>
          </MagneticLink>
        </div>

        <div className="pf-hero-row">
          <motion.div
            className="pf-hero-copy"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              className="pf-badge"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              ✨ Trusted Digital Solutions
            </motion.span>
            <h1>Our Portfolio</h1>
            <div className="pf-dividers" aria-hidden="true">
              <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.25, duration: 0.55 }} />
              <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.35, duration: 0.55 }} />
            </div>
            <p>Explore the work that helps businesses build, rank, and grow with Hurfi.</p>
          </motion.div>
          <div className="pf-hero-spacer" />
        </div>

        <div className="pf-cards">
          {categories.map((cat, i) => (
            <TiltCardLink key={cat.id} to={cat.to} className="pf-card" delay={0.2 + i * 0.08}>
              <div className="pf-card-preview" style={{ background: cat.accent }}>
                <PortfolioCardPreview id={cat.id} />
                <motion.div
                  className="pf-float-icon"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.6 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                >
                  {cat.icon}
                </motion.div>
              </div>

              <div className="pf-card-body">
                <h2>{cat.title}</h2>
                <p>{cat.description}</p>
                <span className="btn btn-primary pf-cta">
                  → View Showcase
                  <span className="btn-arrow">→</span>
                </span>
              </div>
            </TiltCardLink>
          ))}
        </div>
      </section>

      <section className="section pf-cta-band">
        <div className="container pf-cta-band-inner">
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
