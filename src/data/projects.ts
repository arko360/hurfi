export type Project = {
  slug: string;
  name: string;
  category: "website" | "seo" | "branding";
  industry: string;
  metrics: [string, string];
  accent: string;
  summary: string;
  url?: string;
  tech?: string;
  image?: string;
};

export const projects: Project[] = [
  {
    slug: "ghorsajan",
    name: "Ghorsajan",
    category: "website",
    industry: "E-commerce / Home Decor",
    metrics: ["Live Store", "Catalog UX"],
    accent: "linear-gradient(145deg,#0d4a2a,#1a8f4f)",
    summary:
      "A conversion-focused Bengali e-commerce store for garden décor, artificial plants, and home styling products.",
    url: "https://ghorsajan.com/",
    tech: "Custom E-commerce",
    image: "/portfolio-preview/ghorsajan.webp",
  },
  {
    slug: "real-sign-bd",
    name: "Real Sign BD",
    category: "website",
    industry: "Fashion / Lifestyle",
    metrics: ["Live Store", "Bilingual UX"],
    accent: "linear-gradient(145deg,#5a3a10,#c7922e)",
    summary:
      "Premium men’s fashion and fragrance storefront with polished product merchandising and bilingual shopping UX.",
    url: "https://realsignbd.com/",
    tech: "WooCommerce",
    image: "/portfolio-preview/realsignbd.webp",
  },
  {
    slug: "gully-apparel",
    name: "Gully Apparel",
    category: "website",
    industry: "Streetwear / Fashion",
    metrics: ["Launch Site", "Brand Story"],
    accent: "linear-gradient(145deg,#0d0d0d,#7a6200)",
    summary:
      "Bold, high-contrast streetwear landing experience built to sell limited-edition mesh jerseys with cultural energy.",
    url: "https://gullyapparel.store/",
    tech: "Shopify",
    image: "/portfolio-preview/gullyapparel.webp",
  },
  {
    slug: "gozero-print",
    name: "Gozero Print",
    category: "website",
    industry: "Custom Printing",
    metrics: ["Canada-wide", "Trust UX"],
    accent: "linear-gradient(145deg,#7a2e00,#e45c12)",
    summary:
      "Canada-wide custom apparel and printing brand site designed for trust, catalog clarity, and fast enquiry conversion.",
    url: "https://gozeroprint.com/",
    tech: "WordPress / WooCommerce",
    image: "/portfolio-preview/gozeroprint.webp",
  },
  {
    slug: "zaiax",
    name: "Zaiax",
    category: "website",
    industry: "Apparel / E-commerce",
    metrics: ["Flash Sales", "Catalog UX"],
    accent: "linear-gradient(145deg,#3a2a18,#8a6a48)",
    summary:
      "Modern apparel commerce experience with flash sales, category storytelling, and clean product presentation.",
    tech: "Custom E-commerce",
    image: "/portfolio-preview/zaiax.webp",
    url: "https://zaiax.com/",
  },
  {
    slug: "nortek-industries",
    name: "Nortek Industries",
    category: "seo",
    industry: "B2B Components",
    metrics: ["+320% Rankings", "+195% Organic"],
    accent: "linear-gradient(145deg,#102a4a,#007bff)",
    summary: "Search visibility system focused on high-intent manufacturing keywords.",
  },
  {
    slug: "valora-group",
    name: "Valora Group",
    category: "branding",
    industry: "Industrial Brand",
    metrics: ["+230% Brand Recall", "+140% Engage"],
    accent: "linear-gradient(145deg,#141822,#335)",
    summary: "Brand system across web, sales collateral, and social for global buyers.",
  },
  {
    slug: "omniyield",
    name: "OmniYield",
    category: "seo",
    industry: "SaaS / Ops",
    metrics: ["+210% Traffic", "+164% Demos"],
    accent: "linear-gradient(145deg,#1b1140,#3b4dff)",
    summary: "Organic growth engine tied to demo conversion and content clusters.",
  },
  {
    slug: "castello-pack",
    name: "Castello Pack",
    category: "branding",
    industry: "Packaging",
    metrics: ["+180% Growth", "+120% Mentions"],
    accent: "linear-gradient(145deg,#2a1a12,#8a4b28)",
    summary: "Visual identity and digital brand kit for international trade channels.",
  },
];
