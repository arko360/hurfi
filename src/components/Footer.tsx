import { Link } from "react-router-dom";
import "./Footer.css";

const cols = [
  {
    title: "Services",
    links: [
      { to: "/services", label: "Website Development" },
      { to: "/services", label: "SEO" },
      { to: "/services", label: "Digital Marketing" },
      { to: "/services", label: "Branding" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/portfolio", label: "Portfolio" },
      { to: "/pricing", label: "Pricing" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { to: "/portfolio", label: "Case Studies" },
      { to: "/contact", label: "Strategy Call" },
      { to: "/about", label: "Our Process" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <img src="/assets/icons/hurfi-mark.png" alt="" />
            <span>Hurfi</span>
          </Link>
          <p>
            Helping B2B brands build trusted international online presence — website, search, and
            growth systems connected.
          </p>
          <div className="socials">
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="X">X</a>
            <a href="#" aria-label="Instagram">ig</a>
          </div>
        </div>

        {cols.map((col) => (
          <div key={col.title} className="footer-col">
            <h4>{col.title}</h4>
            {col.links.map((l) => (
              <Link key={l.label} to={l.to}>
                {l.label}
              </Link>
            ))}
          </div>
        ))}

        <div className="footer-col">
          <h4>Contact</h4>
          <a href="mailto:hello@hurfi.com">hello@hurfi.com</a>
          <a href="tel:+10000000000">+1 (000) 000-0000</a>
          <p>Global · Remote-first</p>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Hurfi. All rights reserved.</span>
        <div>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>
    </footer>
  );
}
