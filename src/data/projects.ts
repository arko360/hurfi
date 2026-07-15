export type Project = {
  slug: string;
  name: string;
  category: "website" | "seo" | "branding";
  industry: string;
  metrics: [string, string];
  accent: string;
  summary: string;
};

export const projects: Project[] = [
  {
    slug: "sinotec-lighting",
    name: "Sinotec Lighting",
    category: "website",
    industry: "Manufacturing",
    metrics: ["+188% Traffic", "+240% Leads"],
    accent: "linear-gradient(145deg,#0d2240,#1a4d9c)",
    summary: "International manufacturer website rebuilt for trust, clarity, and enquiry conversion.",
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
    slug: "brightgrid-energy",
    name: "BrightGrid Energy",
    category: "website",
    industry: "Energy Tech",
    metrics: ["+156% Leads", "+98 Score"],
    accent: "linear-gradient(145deg,#0b2b4a,#0e7a6b)",
    summary: "Product-led B2B site with fast performance and clearer qualification paths.",
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
