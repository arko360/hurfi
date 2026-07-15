import { useEffect, useState } from "react";
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
  { to: "/portfolio/seo", label: "Search Engine Optimization", desc: "Search visibility & rankings" },
  { to: "/portfolio/branding", label: "Branding & Growth", desc: "Identity systems that scale" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const portfolioActive = location.pathname.startsWith("/portfolio");

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const closeNav = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="header-inner container">
        <Link className="brand" to="/" onClick={closeNav} aria-label="Hurfi home">
          <img src="/assets/icons/hurfi-mark.png" alt="" width={34} height={34} />
          <span>Hurfi</span>
        </Link>

        <nav className={`nav ${open ? "is-open" : ""}`} aria-label="Primary">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "is-active" : undefined)} onClick={closeNav}>
            Home
          </NavLink>

          <div className={`nav-dropdown ${portfolioActive ? "is-active" : ""}`}>
            <NavLink
              to="/portfolio"
              className={({ isActive }) => `nav-dropdown-trigger ${isActive ? "is-active" : ""}`}
              onClick={closeNav}
            >
              Portfolio
              <span className="caret" aria-hidden="true" />
            </NavLink>
            <div className="nav-dropdown-menu" role="menu" aria-label="Portfolio categories">
              {portfolioItems.map((item) => (
                <Link key={item.to} to={item.to} role="menuitem" onClick={closeNav}>
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
                onClick={closeNav}
              >
                {l.label}
              </NavLink>
            ))}
        </nav>

        <div className="header-actions">
          <Link className="link-quiet" to="/services" onClick={closeNav}>
            See Our Services
          </Link>
          <Link className="btn btn-primary btn-sm" to="/contact" onClick={closeNav}>
            Book a Strategy Call
            <span className="btn-arrow">→</span>
          </Link>
          <button
            className="nav-toggle"
            type="button"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
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
