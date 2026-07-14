import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./Header.css";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/#services", label: "Services" },
  { to: "/#results", label: "Results" },
  { to: "/#websites", label: "Websites" },
  { to: "/#process", label: "Process" },
  { to: "/#proof", label: "Proof" },
  { to: "/#faq", label: "FAQ" },
  { to: "/#contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="Hurfi home" onClick={() => setOpen(false)}>
          <img className="brand-mark" src="/assets/icons/hurfi-mark.png" alt="" width={34} height={34} />
          <span className="brand-text">Hurfi</span>
        </Link>

        <nav className={`nav ${open ? "is-open" : ""}`} id="primary-nav" aria-label="Primary">
          {links.map((link) =>
            link.to.startsWith("/#") ? (
              <a
                key={link.label}
                href={link.to}
                className={location.hash === link.to.slice(1) ? "is-active" : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ) : (
              <NavLink
                key={link.label}
                to={link.to}
                end={link.end}
                className={({ isActive }) => (isActive ? "is-active" : undefined)}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="header-actions">
          <a className="link-quiet" href="/#services">
            See Our Services
          </a>
          <a className="btn btn-primary btn-sm" href="/#contact">
            Book a Strategy Call
            <span className="btn-arrow" aria-hidden="true">
              →
            </span>
          </a>
          <button
            className="nav-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="primary-nav"
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
