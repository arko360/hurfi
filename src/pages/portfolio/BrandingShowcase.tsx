import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CountUp } from "../../components/CountUp";

const stats = [
  { value: 230, suffix: "%", label: "Brand Recall" },
  { value: 180, suffix: "%", label: "Brand Growth" },
  { value: 140, suffix: "%", label: "Engagement" },
];

function Drift({
  children,
  className,
  depth = 16,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  depth?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 100, damping: 18 });
  const sy = useSpring(my, { stiffness: 100, damping: 18 });
  const x = useTransform(sx, (v) => v * depth * 0.035);
  const y = useTransform(sy, (v) => v * depth * 0.035);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut", delay }}
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
      whileHover={{ scale: 1.04 }}
    >
      {children}
    </motion.div>
  );
}

export function BrandingShowcase() {
  return (
    <section className="showcase branding-showcase">
      <div className="showcase-head">
        <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          Branding & Growth
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          Identity systems that feel premium in every touchpoint — from print and packaging to social
          kits and sales enablement.
        </motion.p>
      </div>

      <div className="brand-canvas">
        <span className="canvas-glow a" />
        <span className="canvas-glow b soft" />

        <div className="brand-stats">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="float-stat"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <strong>
                +<CountUp to={s.value} suffix={s.suffix} />
              </strong>
              <span>{s.label}</span>
            </motion.div>
          ))}
        </div>

        <Drift className="mock business-card" depth={14} delay={0.1}>
          <div className="card-face">
            <img src="/assets/icons/hurfi-mark.png" alt="" />
            <div>
              <strong>Hurfi</strong>
              <span>Brand Growth Partner</span>
            </div>
          </div>
        </Drift>

        <Drift className="mock shopping-bag" depth={20} delay={0.25}>
          <div className="bag-body">
            <span className="bag-handle" />
            <img src="/assets/icons/hurfi-mark.png" alt="" />
          </div>
        </Drift>

        <Drift className="mock coffee-cup" depth={22} delay={0.35}>
          <div className="cup">
            <span className="lid" />
            <span className="sleeve">HURFI</span>
          </div>
        </Drift>

        <Drift className="mock letterhead" depth={12} delay={0.15}>
          <div className="paper">
            <img src="/assets/icons/hurfi-mark.png" alt="" />
            <span />
            <span className="short" />
            <span className="short" />
          </div>
        </Drift>

        <Drift className="mock brand-book" depth={18} delay={0.2}>
          <div className="book">
            <div className="book-cover">
              <img src="/assets/images/hurfi-logo-white.png" alt="" />
              <em>Brand Book</em>
            </div>
          </div>
        </Drift>

        <Drift className="mock packaging" depth={16} delay={0.4}>
          <div className="box">
            <span />
            <strong>Hurfi</strong>
          </div>
        </Drift>

        <Drift className="mock logo-stage" depth={10} delay={0.05}>
          <div className="logo-panel">
            <img src="/assets/images/hurfi-logo-color.png" alt="Hurfi logo" />
          </div>
        </Drift>

        <Drift className="mock social-kit" depth={24} delay={0.3}>
          <div className="social-stack">
            <div className="social-card ig" />
            <div className="social-card li" />
            <div className="social-card x" />
          </div>
        </Drift>
      </div>
    </section>
  );
}
