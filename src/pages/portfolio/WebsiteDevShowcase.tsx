/**
 * STATIC portfolio showcase — local WebP screenshots only.
 * No iframes. No live sites. No screenshot generation on page load.
 */
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { websiteProjects, type WebsiteProject } from "../../data/websiteProjects";
import { SmartBackRow } from "../../components/SmartBackNav";
import "./WebsiteDevShowcase.css";

const ScrollPreview = memo(function ScrollPreview({
  project,
  priority,
}: {
  project: WebsiteProject;
  priority: boolean;
}) {
  const [ready, setReady] = useState(false);

  return (
    <div className="wd-browser">
      <div className="wd-browser-bar">
        <span className="wd-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="wd-favicon-wrap" aria-hidden="true">
          {project.initial}
        </span>
        <span className="wd-url">{project.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
      </div>
      <div className={`wd-preview ${ready ? "is-ready" : ""}`}>
        {!ready ? <div className="wd-skeleton" aria-hidden="true" /> : null}
        <img
          src={project.cardPreview}
          alt=""
          width={960}
          height={1600}
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw"
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "low"}
          onLoad={() => setReady(true)}
          className={ready ? "is-visible" : ""}
        />
      </div>
    </div>
  );
});

const ProjectCard = memo(function ProjectCard({
  project,
  index,
  reduced,
}: {
  project: WebsiteProject;
  index: number;
  reduced: boolean;
}) {
  const openLive = useCallback(() => {
    window.open(project.url, "_blank", "noopener,noreferrer");
  }, [project.url]);

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLive();
      }
    },
    [openLive]
  );

  return (
    <motion.article
      className="wd-card"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: "80px" }}
      transition={{ duration: 0.3, delay: Math.min(index, 3) * 0.04, ease: "easeOut" }}
      onClick={openLive}
      role="link"
      tabIndex={0}
      onKeyDown={onKey}
    >
      <div className="wd-card-media" style={{ background: project.accent }}>
        <ScrollPreview project={project} priority={index < 4} />
        <span className="wd-float-badge">Live Project</span>
      </div>
      <div className="wd-card-body">
        <div className="wd-badges">
          <span className="wd-pill live">Live Website</span>
          <span className="wd-pill responsive">Responsive</span>
        </div>
        <h2>{project.name}</h2>
        <p>{project.description}</p>
        <dl className="wd-meta">
          <div>
            <dt>Industry</dt>
            <dd>{project.industry}</dd>
          </div>
          <div>
            <dt>Technology</dt>
            <dd>{project.tech}</dd>
          </div>
        </dl>
        <div className="wd-actions">
          <a
            className="btn btn-primary wd-btn"
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            🌐 Visit Live Website
          </a>
          <Link
            className="btn btn-ghost wd-btn"
            to={`/portfolio/${project.slug}`}
            onClick={(e) => e.stopPropagation()}
          >
            📖 View Case Study
          </Link>
        </div>
      </div>
    </motion.article>
  );
});

function PageSkeleton() {
  return (
    <div className="wd-skeleton-page" aria-busy="true" aria-label="Loading portfolio">
      <div className="container">
        <div className="wd-skel-top">
          <div className="wd-skeleton wd-skel-btn" />
          <div className="wd-skeleton wd-skel-chip" />
        </div>
        <div className="wd-skel-hero">
          <div>
            <div className="wd-skeleton wd-skel-line short" />
            <div className="wd-skeleton wd-skel-title" />
            <div className="wd-skeleton wd-skel-line" />
          </div>
          <div className="wd-skel-stats">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="wd-skeleton wd-skel-stat-pill" />
            ))}
          </div>
        </div>
        <div className="wd-skel-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="wd-skeleton wd-skel-card" />
          ))}
        </div>
      </div>
    </div>
  );
}

function PreloadFirstFour() {
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    websiteProjects.slice(0, 4).forEach((p) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = p.cardPreview;
      link.type = "image/webp";
      document.head.appendChild(link);
      links.push(link);
    });
    return () => links.forEach((l) => l.remove());
  }, []);
  return null;
}

const HERO_STATS = [
  { value: websiteProjects.length, suffix: "+", label: "Live Websites", count: true },
  { value: 100, suffix: "%", label: "Responsive", count: true },
  { value: null, suffix: "", label: "Modern UI", count: false },
  { value: null, suffix: "", label: "Fast Performance", count: false },
] as const;

function useCountUp(target: number, active: boolean, duration = 900) {
  const [value, setValue] = useState(active ? 0 : target);

  useEffect(() => {
    if (!active) {
      setValue(target);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - p) ** 3;
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);

  return value;
}

const HeroStat = memo(function HeroStat({
  stat,
  index,
  reduced,
}: {
  stat: (typeof HERO_STATS)[number];
  index: number;
  reduced: boolean;
}) {
  const count = useCountUp(stat.count ? (stat.value ?? 0) : 0, Boolean(stat.count && !reduced));

  return (
    <motion.div
      className="wd-hero-stat"
      initial={reduced ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.12 + index * 0.07, ease: "easeOut" }}
    >
      <strong>
        {stat.count ? (
          <>
            {count}
            <span>{stat.suffix}</span>
          </>
        ) : (
          stat.label.split(" ")[0]
        )}
      </strong>
      <span>{stat.count ? stat.label : stat.label.split(" ").slice(1).join(" ") || stat.label}</span>
    </motion.div>
  );
});

function HeroVisuals() {
  return (
    <div className="wd-hero-stage" aria-hidden="true">
      <div className="wd-hero-bg">
        <div className="wd-hero-mesh" />
        <div className="wd-hero-glow" />
        <span className="wd-hero-blob a" />
        <span className="wd-hero-blob b" />
        <span className="wd-hero-blob c" />
        <div className="wd-hero-grid" />
        <div className="wd-hero-lines" />
      </div>

      <div className="wd-hero-parallax wd-hero-parallax--deco">
        <div className="wd-hero-deco">
          <svg className="wd-deco-browser" viewBox="0 0 200 140" fill="none">
            <rect x="1" y="1" width="198" height="138" rx="12" stroke="currentColor" strokeWidth="1.2" />
            <line x1="1" y1="28" x2="199" y2="28" stroke="currentColor" strokeWidth="1" />
            <rect x="14" y="44" width="80" height="8" rx="4" fill="currentColor" opacity="0.5" />
            <rect x="14" y="62" width="172" height="6" rx="3" fill="currentColor" opacity="0.35" />
            <rect x="14" y="76" width="140" height="6" rx="3" fill="currentColor" opacity="0.35" />
            <rect x="14" y="96" width="56" height="32" rx="6" stroke="currentColor" strokeWidth="1" />
            <rect x="78" y="96" width="56" height="32" rx="6" stroke="currentColor" strokeWidth="1" />
          </svg>
          <span className="wd-deco-dot" />
          <span className="wd-deco-dot" />
          <span className="wd-deco-dot" />
        </div>
      </div>

      <div className="wd-hero-parallax wd-hero-parallax--floats">
        <div className="wd-hero-floats">
          <svg className="wd-float f1" viewBox="0 0 120 88" fill="none">
            <rect x="1" y="1" width="118" height="86" rx="10" stroke="currentColor" strokeWidth="1.5" />
            <line x1="1" y1="22" x2="119" y2="22" stroke="currentColor" strokeWidth="1" />
            <circle cx="14" cy="11" r="3" fill="currentColor" />
            <circle cx="24" cy="11" r="3" fill="currentColor" opacity="0.6" />
            <circle cx="34" cy="11" r="3" fill="currentColor" opacity="0.35" />
          </svg>
          <svg className="wd-float f2" viewBox="0 0 64 64" fill="none">
            <path
              d="M18 12h8v40h-8V12zm20 0h8v40h-8V12z"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <svg className="wd-float f3" viewBox="0 0 100 72" fill="none">
            <rect x="1" y="1" width="98" height="70" rx="8" stroke="currentColor" strokeWidth="1.2" />
            <rect x="12" y="14" width="76" height="8" rx="4" fill="currentColor" opacity="0.45" />
            <rect x="12" y="30" width="52" height="6" rx="3" fill="currentColor" opacity="0.3" />
            <rect x="12" y="42" width="76" height="6" rx="3" fill="currentColor" opacity="0.3" />
          </svg>
          <svg className="wd-float f4" viewBox="0 0 88 32" fill="none">
            <rect x="1" y="1" width="86" height="30" rx="8" stroke="currentColor" strokeWidth="1.2" />
            <rect x="10" y="10" width="28" height="6" rx="3" fill="currentColor" opacity="0.5" />
            <rect x="44" y="10" width="20" height="6" rx="3" fill="currentColor" opacity="0.3" />
          </svg>
          <svg className="wd-float f5" viewBox="0 0 140 100" fill="none">
            <rect x="1" y="1" width="138" height="98" rx="6" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
            <line x1="1" y1="32" x2="139" y2="32" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" />
            <rect x="12" y="44" width="48" height="40" rx="4" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" />
            <rect x="68" y="44" width="60" height="18" rx="4" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" />
            <rect x="68" y="68" width="60" height="16" rx="4" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function useHeroParallax(enabled: boolean, heroRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!enabled) return;
    const hero = heroRef.current;
    if (!hero) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const rect = hero.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 7;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 7;
        hero.style.setProperty("--mx", x.toFixed(2));
        hero.style.setProperty("--my", y.toFixed(2));
      });
    };

    const onLeave = () => {
      hero.style.setProperty("--mx", "0");
      hero.style.setProperty("--my", "0");
    };

    hero.addEventListener("mousemove", onMove, { passive: true });
    hero.addEventListener("mouseleave", onLeave, { passive: true });
    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled, heroRef]);
}

export function WebsiteDevShowcase() {
  const reduced = Boolean(useReducedMotion());
  const heroRef = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);

  useHeroParallax(!reduced, heroRef);

  useLayoutEffect(() => {
    const prev =
      "scrollRestoration" in window.history ? window.history.scrollRestoration : "auto";
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = prev as ScrollRestoration;
      }
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setReady(true);
  }, []);

  return (
    <main className="wd-page">
      {!ready ? (
        <PageSkeleton />
      ) : (
        <motion.div
          className="wd-page-inner"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <PreloadFirstFour />

          <div className="wd-bg" aria-hidden="true" />

          <header className="wd-header" ref={heroRef}>
            <HeroVisuals />
            <div className="container wd-header-top-wrap">
              <SmartBackRow
                to="/portfolio"
                label="Back to Portfolio"
                heroRef={heroRef}
                end={<span className="wd-top-label">Website Development</span>}
              />
            </div>
            <div className="container wd-header-inner">
              <motion.div
                className="wd-hero-copy"
                initial={reduced ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <p className="wd-eyebrow">Hurfi Portfolio</p>
                <div className="wd-hero-heading-wrap">
                  <h1>Website Development</h1>
                </div>
                <p className="wd-lead">
                  Explore our real-world web development projects delivered for businesses across multiple industries.
                </p>
                <div className="wd-hero-stats">
                  {HERO_STATS.map((stat, i) => (
                    <HeroStat key={stat.label} stat={stat} index={i} reduced={reduced} />
                  ))}
                </div>
              </motion.div>
            </div>
          </header>

          <section className="container wd-grid">
            {websiteProjects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} reduced={reduced} />
            ))}
          </section>

          <section className="section wd-cta">
            <div className="container wd-cta-inner">
              <div>
                <h2>Need a website that looks premium and converts?</h2>
                <p>Let’s design and build a high-performing site for your brand — from first sketch to live launch.</p>
              </div>
              <Link className="btn btn-primary" to="/contact">
                Start Your Project
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          </section>
        </motion.div>
      )}
    </main>
  );
}
