import { insights } from "@/lib/site-data";
import { SITE_ORIGIN, toAbsoluteUrl } from "@/lib/seo";

export type SitemapImage = { url: string; title?: string };
export type SitemapPage = { path: string; lastModified?: string; priority?: number; changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"; images: SitemapImage[] };
export type SitemapProduct = { slug: string; name: string; updatedAt?: string; isActive: boolean; image: string; gallery: Array<{ id: number; url: string; alt: string; sortOrder: number }> };

export const SITEMAP_PAGES: SitemapPage[] = [
  { path: "/", priority: 1, changeFrequency: "weekly", images: [{ url: "/factory/新公司大门图片.png", title: "Xingtai Oubei rubber manufacturing facility" }] },
  { path: "/about", priority: 0.8, changeFrequency: "monthly", images: [{ url: "/factory/新公司大门图片.png", title: "Xingtai Oubei manufacturing facility" }] },
  { path: "/products", priority: 0.9, changeFrequency: "weekly", images: [{ url: "/stitch/products-05.jpg", title: "Precision rubber sealing products" }] },
  { path: "/materials", priority: 0.8, changeFrequency: "monthly", images: [{ url: "/stitch/home-03.jpg", title: "High-performance rubber material" }] },
  { path: "/custom", priority: 0.8, changeFrequency: "monthly", images: [{ url: "/stitch/custom-01.jpg", title: "Custom rubber molding engineering" }] },
  { path: "/resources", priority: 0.8, changeFrequency: "weekly", images: [{ url: "/stitch/resources-01.jpg", title: "Rubber seal engineering resources" }] },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly", images: [] },
  { path: "/quote", priority: 0.9, changeFrequency: "monthly", images: [{ url: "/stitch/custom-02.jpg", title: "Custom rubber seal engineering review" }] },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly", images: [] },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly", images: [] },
  { path: "/products/fkm-rubber-o-ring", priority: 0.8, changeFrequency: "monthly", images: [{ url: "/stitch/product-detail-06.jpg", title: "FKM rubber O-ring detail" }] },
  { path: "/resources/choosing-o-ring-hardness", priority: 0.7, changeFrequency: "monthly", images: [{ url: "/stitch/home-08.jpg", title: "O-ring hardness engineering guide" }] },
  { path: "/resources/technical-whitepapers/high-temperature-o-ring-material", priority: 0.7, changeFrequency: "monthly", images: [{ url: "/stitch/article-01.jpg", title: "High-temperature O-ring materials" }] },
  { path: "/resources/sealing-renewable-energy", lastModified: "2025-02-06", priority: 0.7, changeFrequency: "monthly", images: [{ url: "/stitch/home-09.jpg", title: "Renewable energy equipment sealing application" }] },
  { path: "/resources/global-shipping-update", lastModified: "2025-01-14", priority: 0.7, changeFrequency: "monthly", images: [{ url: "/stitch/home-10.jpg", title: "Export-ready rubber seal warehouse" }] },
  ...insights.filter((insight) => !["choosing-o-ring-hardness", "sealing-renewable-energy", "global-shipping-update"].includes(insight.slug)).map((insight) => ({ path: `/resources/${insight.slug}`, lastModified: insight.date, priority: 0.7, changeFrequency: "monthly" as const, images: [{ url: insight.image, title: insight.alt }] })),
];

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function absoluteUrl(path: string) {
  return path.startsWith("http://") || path.startsWith("https://") ? path : toAbsoluteUrl(path);
}

function renderUrl(page: SitemapPage) {
  const images = page.images.map((image) => `\n    <image:image><image:loc>${escapeXml(absoluteUrl(image.url))}</image:loc>${image.title ? `<image:title>${escapeXml(image.title)}</image:title>` : ""}</image:image>`).join("");
  const lastModified = page.lastModified ? `\n    <lastmod>${escapeXml(page.lastModified)}</lastmod>` : "";
  const changeFrequency = page.changeFrequency ? `\n    <changefreq>${page.changeFrequency}</changefreq>` : "";
  const priority = typeof page.priority === "number" ? `\n    <priority>${page.priority.toFixed(1)}</priority>` : "";
  return `  <url>\n    <loc>${escapeXml(absoluteUrl(page.path))}</loc>${lastModified}${changeFrequency}${priority}${images}\n  </url>`;
}

export function buildSitemapXml(pages: SitemapPage[], products: SitemapProduct[]) {
  const entries = new Map<string, SitemapPage>();
  pages.forEach((page) => entries.set(absoluteUrl(page.path), { ...page, images: [...page.images] }));
  products.filter((product) => product.isActive).forEach((product) => {
    const path = `/products/${product.slug}`;
    const images = product.gallery.length ? product.gallery.map((image) => ({ url: image.url, title: image.alt || product.name })) : [{ url: product.image, title: product.name }];
    const key = absoluteUrl(path);
    const existing = entries.get(key);
    entries.set(key, {
      path,
      lastModified: product.updatedAt,
      priority: 0.8,
      changeFrequency: "weekly",
      images: [...(existing?.images || []), ...images],
    });
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${[...entries.values()].map(renderUrl).join("\n")}\n</urlset>`;
}

export { SITE_ORIGIN };
