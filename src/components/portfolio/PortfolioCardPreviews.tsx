import { websiteProjects } from "../../data/websiteProjects";

/** Miniature Website Development portfolio — local WebP thumbnails only */
export function WebsiteCardPreview() {
  return (
    <div className="pf-prev pf-prev-website" aria-hidden="true">
      <div className="pf-prev-browser">
        <div className="pf-prev-tabs">
          {websiteProjects.slice(0, 3).map((p) => (
            <span key={p.slug} className="pf-prev-tab">
              {p.name.split(" ")[0]}
            </span>
          ))}
          <span className="pf-prev-tab ghost">+2</span>
        </div>
        <div className="pf-prev-chrome">
          <i />
          <i />
          <i />
          <em>hurfi.com/portfolio/website</em>
        </div>
        <div className="pf-prev-grid">
          {websiteProjects.map((p) => (
            <div key={p.slug} className="pf-prev-thumb">
              <div className="pf-prev-thumb-scroll">
                <img
                  src={p.cardPreview}
                  alt=""
                  width={120}
                  height={180}
                  sizes="40px"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <span className="pf-prev-thumb-label">{p.initial}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Premium SEO dashboard — SVG + CSS only */
export function SeoCardPreview() {
  return (
    <div className="pf-prev pf-prev-seo" aria-hidden="true">
      <div className="pf-seo-dash">
        <div className="pf-seo-top">
          <svg className="pf-seo-icon" viewBox="0 0 24 24" fill="none">
            <circle cx="10.5" cy="10.5" r="5.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M15 15l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span>Search Console</span>
          <strong className="pf-seo-kpi pf-seo-float-a">+127%</strong>
        </div>

        <svg className="pf-seo-chart" viewBox="0 0 220 52" fill="none">
          <path
            className="pf-seo-area"
            d="M0 42 L28 38 L56 34 L84 28 L112 22 L140 18 L168 12 L196 8 L220 4 L220 52 L0 52 Z"
          />
          <path
            className="pf-seo-line"
            d="M0 42 L28 38 L56 34 L84 28 L112 22 L140 18 L168 12 L196 8 L220 4"
          />
        </svg>

        <div className="pf-seo-bars">
          {[42, 58, 48, 72, 64, 88, 76].map((h, i) => (
            <span key={i} style={{ ["--h" as string]: `${h}%` }} />
          ))}
        </div>

        <div className="pf-seo-row">
          <div className="pf-seo-metric">
            <small>Keywords</small>
            <strong className="pf-seo-float-b">248</strong>
          </div>
          <div className="pf-seo-metric">
            <small>Rank</small>
            <strong>#1</strong>
          </div>
          <div className="pf-seo-metric">
            <small>Traffic</small>
            <strong>↑ 3.2k</strong>
          </div>
        </div>

        <div className="pf-seo-chips">
          <span className="pf-seo-chip pf-seo-float-c">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
              <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Google
          </span>
          <span className="pf-seo-chip ai pf-seo-float-d">AI Search</span>
          <span className="pf-seo-chip geo pf-seo-float-e">GEO</span>
        </div>
      </div>
    </div>
  );
}

/** Branding & Growth showcase — SVG + CSS only */
export function BrandingCardPreview() {
  return (
    <div className="pf-prev pf-prev-brand" aria-hidden="true">
      <div className="pf-brand-stage">
        <div className="pf-brand-palette pf-brand-float-a">
          <span style={{ background: "#0056ff" }} />
          <span style={{ background: "#0d2240" }} />
          <span style={{ background: "#5b9bff" }} />
          <span style={{ background: "#e8f0ff" }} />
        </div>

        <div className="pf-brand-logos pf-brand-float-b">
          <span>H</span>
          <span>G</span>
          <span>R</span>
          <span>Z</span>
        </div>

        <div className="pf-brand-card pf-brand-float-c">
          <small>Brand Identity</small>
          <strong>Guidelines</strong>
        </div>

        <svg className="pf-brand-growth pf-brand-float-d" viewBox="0 0 100 40" fill="none">
          <path className="pf-brand-growth-line" d="M4 32 L24 28 L44 22 L64 16 L84 10 L96 6" />
        </svg>

        <svg className="pf-brand-funnel pf-brand-float-e" viewBox="0 0 56 48" fill="none">
          <path d="M4 4h48l-12 14H16L4 4z" stroke="currentColor" strokeWidth="1.2" />
          <path d="M16 22h24l-8 10H24l-8-10z" stroke="currentColor" strokeWidth="1.2" />
          <path d="M24 36h8v8h-8v-8z" fill="currentColor" opacity="0.35" />
        </svg>

        <div className="pf-brand-socials">
          <span className="pf-brand-social pf-brand-float-f">in</span>
          <span className="pf-brand-social pf-brand-float-g">ig</span>
          <span className="pf-brand-social pf-brand-float-h">fb</span>
        </div>

        <span className="pf-brand-pill pf-brand-float-i">+84% Growth</span>
      </div>
    </div>
  );
}

export function PortfolioCardPreview({ id }: { id: string }) {
  if (id === "website") return <WebsiteCardPreview />;
  if (id === "seo") return <SeoCardPreview />;
  return <BrandingCardPreview />;
}
