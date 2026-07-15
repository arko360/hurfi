export type WebsiteProject = {
  slug: string;
  name: string;
  url: string;
  industry: string;
  tech: string;
  description: string;
  /** Archived full-page WebP (case study) — NEVER loaded on the portfolio grid */
  preview: string;
  /** Lightweight card WebP used for hover-scroll preview (STATIC ONLY) */
  cardPreview: string;
  initial: string;
  accent: string;
};

/**
 * Static screenshot registry.
 * Ultra HD WebPs live under /public/portfolio-preview/ (permanent).
 * Refresh with: npm run update-previews
 * Missing files are filled only by Node on `npm run dev` / `npm run build`.
 * Visitors never trigger captures. The UI never uses iframes or live sites.
 */
export const websiteProjects: WebsiteProject[] = [
  {
    slug: "ghorsajan",
    name: "Ghorsajan",
    url: "https://ghorsajan.com/",
    industry: "E-commerce / Home Decor",
    tech: "Custom E-commerce",
    description:
      "A conversion-focused Bengali e-commerce store for garden décor, artificial plants, and home styling.",
    preview: "/portfolio-preview/ghorsajan.webp",
    cardPreview: "/portfolio-preview/cards/ghorsajan.webp",
    initial: "G",
    accent: "linear-gradient(145deg, #e8f6ee, #ffffff)",
  },
  {
    slug: "real-sign-bd",
    name: "Real Sign BD",
    url: "https://realsignbd.com/",
    industry: "Fashion / Lifestyle",
    tech: "WooCommerce",
    description:
      "Premium men’s fashion and fragrance storefront with polished product merchandising.",
    preview: "/portfolio-preview/realsignbd.webp",
    cardPreview: "/portfolio-preview/cards/realsignbd.webp",
    initial: "R",
    accent: "linear-gradient(145deg, #fff6e8, #ffffff)",
  },
  {
    slug: "gully-apparel",
    name: "Gully Apparel",
    url: "https://gullyapparel.store/",
    industry: "Streetwear / Fashion",
    tech: "Shopify",
    description:
      "Bold streetwear landing experience built to sell limited-edition mesh jerseys.",
    preview: "/portfolio-preview/gullyapparel.webp",
    cardPreview: "/portfolio-preview/cards/gullyapparel.webp",
    initial: "G",
    accent: "linear-gradient(145deg, #1a1a1a, #3d3200)",
  },
  {
    slug: "gozero-print",
    name: "Gozero Print",
    url: "https://gozeroprint.com/",
    industry: "Custom Printing",
    tech: "WordPress / WooCommerce",
    description:
      "Canada-wide custom apparel and printing brand site built for trust and conversion.",
    preview: "/portfolio-preview/gozeroprint.webp",
    cardPreview: "/portfolio-preview/cards/gozeroprint.webp",
    initial: "G",
    accent: "linear-gradient(145deg, #fff1e8, #ffffff)",
  },
  {
    slug: "zaiax",
    name: "Zaiax",
    url: "https://zaiax.com/",
    industry: "Apparel / E-commerce",
    tech: "Custom E-commerce",
    description:
      "Modern apparel commerce with flash sales, category storytelling, and clean product UX.",
    preview: "/portfolio-preview/zaiax.webp",
    cardPreview: "/portfolio-preview/cards/zaiax.webp",
    initial: "Z",
    accent: "linear-gradient(145deg, #f3efe8, #ffffff)",
  },
];
