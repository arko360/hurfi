import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./Header.css";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
];

const portfolioItems = [
  { to: "/portfolio/website", label: "Website Development", desc: "High-converting B2B sites" },
  { to: "/portfolio/seo", label: "SEO", desc: "Search visibility & rankings" },
  { to: "/portfolio/branding", label: "Branding & Growth", desc: "Identity systems that scale" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [portfolioClosing, setPortfolioClosing] = useState(false);
  const location = useLocation();
  const portfolioActive = location.pathname.startsWith("/portfolio");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const leaveLockRef = useRef(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const blurDropdownFocus = useCallback(() => {
    const active = document.activeElement;
    if (active instanceof HTMLElement && dropdownRef.current?.contains(active)) {
      active.blur();
    }
  }, []);

  /** Temporary close — can reopen on next hover (outside click / route change). */
  const softClosePortfolio = useCallback(() => {
    clearCloseTimer();
    leaveLockRef.current = false;
    setPortfolioOpen(false);
    setPortfolioClosing(true);
    blurDropdownFocus();
    closeTimerRef.current = setTimeout(() => {
      setPortfolioClosing(false);
      closeTimerRef.current = null;
    }, 220);
  }, [blurDropdownFocus, clearCloseTimer]);

  /** Stay closed until the pointer leaves the dropdown (item click). */
  const closeUntilPointerLeave = useCallback(() => {
    clearCloseTimer();
    leaveLockRef.current = true;
    setPortfolioOpen(false);
    setPortfolioClosing(true);
    blurDropdownFocus();
  }, [blurDropdownFocus, clearCloseTimer]);

  const openPortfolio = useCallback(() => {
    if (leaveLockRef.current) return;
    clearCloseTimer();
    setPortfolioClosing(false);
    setPortfolioOpen(true);
  }, [clearCloseTimer]);

  const onPointerLeaveDropdown = useCallback(() => {
    clearCloseTimer();
    leaveLockRef.current = false;
    setPortfolioOpen(false);
    setPortfolioClosing(false);
    blurDropdownFocus();
  }, [blurDropdownFocus, clearCloseTimer]);

  const scheduleCloseOnLeave = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      onPointerLeaveDropdown();
    }, 120);
  }, [clearCloseTimer, onPointerLeaveDropdown]);

  useEffect(() => {
    setMobileOpen(false);
    softClosePortfolio();
  }, [location.pathname, softClosePortfolio]);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        softClosePortfolio();
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") softClosePortfolio();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [softClosePortfolio]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="site-header">
      <div className="header-inner container">
        <Link
          className="brand"
          to="/"
          onClick={() => {
            closeMobile();
            softClosePortfolio();
          }}
          aria-label="Hurfi home"
        >
          <img src="/assets/icons/hurfi-mark.png" alt="" width={34} height={34} />
          <span>Hurfi</span>
        </Link>

        <nav className={`nav ${mobileOpen ? "is-open" : ""}`} aria-label="Primary">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "is-active" : undefined)}
            onClick={() => {
              closeMobile();
              softClosePortfolio();
            }}
          >
            Home
          </NavLink>

          <div
            ref={dropdownRef}
            className={[
              "nav-dropdown",
              portfolioActive ? "is-active" : "",
              portfolioOpen ? "is-open" : "",
              portfolioClosing ? "is-closing" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onMouseEnter={openPortfolio}
            onMouseLeave={scheduleCloseOnLeave}
            onFocus={openPortfolio}
          >
            <NavLink
              to="/portfolio"
              className={({ isActive }) => `nav-dropdown-trigger ${isActive ? "is-active" : ""}`}
              aria-expanded={portfolioOpen && !portfolioClosing}
              aria-haspopup="menu"
              onClick={() => {
                closeMobile();
                softClosePortfolio();
              }}
            >
              Portfolio
              <span className="caret" aria-hidden="true" />
            </NavLink>
            <div className="nav-dropdown-menu" role="menu" aria-label="Portfolio categories">
              {portfolioItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  role="menuitem"
                  onClick={() => {
                    closeMobile();
                    closeUntilPointerLeave();
                  }}
                >
                  <strong>{item.label}</strong>
                  <span>{item.desc}</span>
                </Link>
              ))}
            </div>
          </div>

          {links
            .filter((l) => l.to !== "/")
            .map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => (isActive ? "is-active" : undefined)}
                onClick={() => {
                  closeMobile();
                  softClosePortfolio();
                }}
              >
                {l.label}
              </NavLink>
            ))}
        </nav>

        <div className="header-actions">
          <Link
            className="link-quiet"
            to="/services"
            onClick={() => {
              closeMobile();
              softClosePortfolio();
            }}
          >
            See Our Services
          </Link>
          <Link
            className="btn btn-primary btn-sm"
            to="/contact"
            onClick={() => {
              closeMobile();
              softClosePortfolio();
            }}
          >
            Book a Strategy Call
            <span className="btn-arrow">→</span>
          </Link>
          <button
            className="nav-toggle"
            type="button"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
