import type { FormEvent } from "react";
import { useRef, useState } from "react";
import { SmartBackRow } from "../components/SmartBackNav";
import "./Contact.css";

export function Contact() {
  const [sent, setSent] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main>
      <section className="page-hero" ref={heroRef}>
        <div className="container">
          <SmartBackRow to="/" label="Back to Home" heroRef={heroRef} />
          <p className="crumb">Home / Contact</p>
          <h1>Contact</h1>
          <p>Tell us about your market, offer, and growth goals — we’ll reply with next steps.</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <form className="card contact-form" onSubmit={onSubmit}>
            <label>
              Full name
              <input name="name" required placeholder="Alex Morgan" />
            </label>
            <label>
              Work email
              <input type="email" name="email" required placeholder="alex@company.com" />
            </label>
            <label>
              Company
              <input name="company" placeholder="Company name" />
            </label>
            <label>
              Message
              <textarea name="message" rows={5} required placeholder="What are you looking to improve?" />
            </label>
            <button className="btn btn-primary" type="submit">
              {sent ? "Message Sent" : "Send Message"}
              <span className="btn-arrow">→</span>
            </button>
          </form>

          <aside className="card contact-aside">
            <h3>Get in touch</h3>
            <div className="info-row">
              <strong>Email</strong>
              <a href="mailto:hello@hurfi.com">hello@hurfi.com</a>
            </div>
            <div className="info-row">
              <strong>Phone</strong>
              <a href="tel:+10000000000">+1 (000) 000-0000</a>
            </div>
            <div className="info-row">
              <strong>Office</strong>
              <p>Remote-first · Serving global B2B brands</p>
            </div>
            <div className="map-mock" aria-hidden="true">
              <span>Map</span>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
