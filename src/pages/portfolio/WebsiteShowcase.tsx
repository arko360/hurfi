import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CountUp } from "../../components/CountUp";

const stats = [
  { value: 186, suffix: "%", label: "Traffic Growth", rotate: -6, x: "4%", y: "8%" },
  { value: 240, suffix: "%", label: "Leads Increase", rotate: 5, x: "78%", y: "12%" },
  { value: 98, suffix: "%", label: "Conversion Rate", rotate: -4, x: "8%", y: "72%" },
  { value: 99, suffix: "", label: "Performance Score", rotate: 6, x: "74%", y: "70%" },
];

function ParallaxLayer({
  children,
  className,
  depth = 20,
}: {
  children: ReactNode;
  className?: string;
  depth?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 18 });
  const sy = useSpring(my, { stiffness: 120, damping: 18 });
  const x = useTransform(sx, (v) => v * depth * 0.04);
  const y = useTransform(sy, (v) => v * depth * 0.04);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set(e.clientX - (r.left + r.width / 2));
        my.set(e.clientY - (r.top + r.height / 2));
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export function WebsiteShowcase() {
  return (
    <section className="showcase website-showcase">
      <div className="showcase-head">
        <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          Website Development
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          Immersive product experiences engineered for trust, speed, and international buyer
          conversion — presented as a living device ecosystem.
        </motion.p>
        <motion.a
          className="btn btn-primary cta-ripple"
          href="/#contact"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          View Projects
          <span className="btn-arrow">→</span>
        </motion.a>
      </div>

      <div className="device-canvas">
        <span className="canvas-glow a" />
        <span className="canvas-glow b" />
        <span className="canvas-particle" />
        <span className="canvas-particle delay" />

        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="float-stat"
            style={{ left: stat.x, top: stat.y, rotate: stat.rotate }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
            whileHover={{ y: -8, scale: 1.05 }}
          >
            <strong>
              +<CountUp to={stat.value} suffix={stat.suffix} />
            </strong>
            <span>{stat.label}</span>
          </motion.div>
        ))}

        <ParallaxLayer className="device monitor" depth={12}>
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
            <div className="bezel">
              <div className="screen site-ui">
                <div className="browser-bar">
                  <i />
                  <i />
                  <i />
                  <em>hurfi.com</em>
                </div>
                <div className="site-hero-ui">
                  <b />
                  <span />
                  <span className="short" />
                </div>
                <div className="site-grid-ui">
                  <div />
                  <div />
                  <div />
                </div>
              </div>
            </div>
            <div className="stand" />
            <div className="base" />
          </motion.div>
        </ParallaxLayer>

        <ParallaxLayer className="device laptop" depth={18}>
          <motion.div
            animate={{ y: [0, -11, 0] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          >
            <div className="laptop-screen site-ui alt">
              <div className="browser-bar dark">
                <i />
                <i />
                <i />
              </div>
              <div className="dash-rows">
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="laptop-deck" />
          </motion.div>
        </ParallaxLayer>

        <ParallaxLayer className="device tablet" depth={24}>
          <motion.div
            animate={{ y: [0, -9, 0] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <div className="tablet-body site-ui soft">
              <div className="mobile-notch" />
              <div className="tablet-content">
                <span />
                <span className="short" />
                <div className="tablet-cards">
                  <i />
                  <i />
                </div>
              </div>
            </div>
          </motion.div>
        </ParallaxLayer>

        <ParallaxLayer className="device phone" depth={28}>
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
          >
            <div className="phone-body site-ui">
              <div className="mobile-notch" />
              <div className="phone-content">
                <span />
                <span className="short" />
                <div className="phone-cta" />
              </div>
            </div>
          </motion.div>
        </ParallaxLayer>

        <ParallaxLayer className="device browser" depth={16}>
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="browser-window site-ui"
          >
            <div className="browser-bar">
              <i />
              <i />
              <i />
              <em>projects.hurfi.com</em>
            </div>
            <div className="browser-body">
              <aside />
              <main>
                <span />
                <span className="short" />
                <div className="browser-tiles">
                  <i />
                  <i />
                  <i />
                </div>
              </main>
            </div>
          </motion.div>
        </ParallaxLayer>
      </div>
    </section>
  );
}
