import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Header.css";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner container">
        <Link className="brand" to="/" onClick={() => setOpen(false)} aria-label="Hurfi home">
          <img src="/assets/icons/hurfi-mark.png" alt="" width={34} height={34} />
          <span>Hurfi</span>
        </Link>

        <nav className={`nav ${open ? "is-open" : ""}`} aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => (isActive ? "is-active" : undefined)}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="link-quiet" to="/services" onClick={() => setOpen(false)}>
            See Our Services
          </Link>
          <Link className="btn btn-primary btn-sm" to="/contact" onClick={() => setOpen(false)}>
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
