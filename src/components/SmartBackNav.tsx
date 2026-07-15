import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import "./SmartBackNav.css";

type SmartBackNavProps = {
  to: string;
  label: string;
  heroRef: RefObject<HTMLElement | null>;
};

function usePastHero(heroRef: RefObject<HTMLElement | null>) {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setPast(!entry.isIntersecting),
      { root: null, threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [heroRef]);

  return past;
}

function useLightMotion() {
  const reduced = Boolean(useReducedMotion());
  return useMemo(() => {
    if (typeof navigator === "undefined") return reduced;
    const saveData =
      "connection" in navigator &&
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const cores = navigator.hardwareConcurrency || 8;
    return reduced || Boolean(saveData) || cores <= 4;
  }, [reduced]);
}

/** Exact same magnetic glass button as Portfolio "Back to Home" */
function MagneticPfLink({
  to,
  label,
  className,
}: {
  to: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18 });
  const sy = useSpring(y, { stiffness: 260, damping: 18 });

  const onMove = useCallback((e: MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.25);
  }, [x, y]);

  return (
    <motion.div style={{ x: sx, y: sy }} className="sbn-magnetic">
      <Link
        ref={ref}
        to={to}
        className={className ?? "pf-back-btn"}
        aria-label={label}
        title={label}
        onMouseMove={onMove}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M15 6l-6 6 6 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>{label}</span>
      </Link>
    </motion.div>
  );
}

/**
 * Same visual + feel as Portfolio Back to Home.
 * Full labeled button in hero; after scroll → same-style circular ← only.
 */
export function SmartBackNav({ to, label, heroRef }: SmartBackNavProps) {
  const pastHero = usePastHero(heroRef);
  const light = useLightMotion();

  return (
    <>
      <motion.div
        className="sbn-hero"
        animate={{
          opacity: pastHero ? 0 : 1,
          pointerEvents: pastHero ? "none" : "auto",
        }}
        transition={light ? { duration: 0.1 } : { duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <MagneticPfLink to={to} label={label} />
      </motion.div>

      <AnimatePresence>
        {pastHero ? (
          <motion.div
            className="sbn-fab"
            initial={light ? { opacity: 0 } : { opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={light ? { opacity: 0 } : { opacity: 0, scale: 0.88 }}
            transition={
              light
                ? { duration: 0.12 }
                : { type: "spring", stiffness: 420, damping: 28, mass: 0.55 }
            }
          >
            <MagneticPfLink to={to} label={label} className="pf-back-btn sbn-fab-round" />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export function SmartBackRow({
  to,
  label,
  heroRef,
  end,
}: SmartBackNavProps & { end?: ReactNode }) {
  return (
    <div className="sbn-row">
      <div className="sbn-slot">
        <SmartBackNav to={to} label={label} heroRef={heroRef} />
      </div>
      {end ? <div className="sbn-end">{end}</div> : null}
    </div>
  );
}
