import test from "node:test";
import assert from "node:assert/strict";
import robots from "@/app/robots";
import { SITE_ORIGIN } from "@/lib/seo";
import { buildSitemapXml, type SitemapPage, type SitemapProduct } from "@/lib/sitemap";

const pages: SitemapPage[] = [
  { path: "/", lastModified: "2026-09-09", priority: 1, changeFrequency: "weekly", images: [{ url: "/hero.webp", title: "Oubei & industrial seals" }] },
  { path: "/resources/guide", lastModified: "2026-08-01", priority: 0.7, changeFrequency: "monthly", images: [] },
];

const products: SitemapProduct[] = [
  {
    slug: "active-seal",
    name: "Active & Reliable Seal",
    updatedAt: "2026-09-08T12:00:00.000Z",
    isActive: true,
    image: "/fallback.webp",
    gallery: [{ id: 1, url: "/api/media/image.webp", alt: "A & B product image", sortOrder: 0 }],
  },
  {
    slug: "hidden-seal",
    name: "Hidden Seal",
    updatedAt: "2026-09-08T12:00:00.000Z",
    isActive: false,
    image: "/hidden.webp",
    gallery: [],
  },
];

test("robots permits public content and declares the canonical sitemap", () => {
  const value = robots();
  assert.equal(value.sitemap, `${SITE_ORIGIN}/sitemap.xml`);
  assert.deepEqual(value.rules, [{ userAgent: "*", allow: "/", disallow: ["/admin/", "/api/"] }]);
});

test("sitemap includes canonical pages and product images but excludes hidden products", () => {
  const xml = buildSitemapXml(pages, products);
  assert.match(xml, /xmlns:image="http:\/\/www.google.com\/schemas\/sitemap-image\/1.1"/);
  assert.match(xml, new RegExp(`${SITE_ORIGIN}/products/active-seal`));
  assert.match(xml, new RegExp(`<image:loc>${SITE_ORIGIN}/api/media/image.webp</image:loc>`));
  assert.match(xml, /<image:title>A &amp; B product image<\/image:title>/);
  assert.doesNotMatch(xml, /hidden-seal|\/admin\/|\/api\/admin\//);
});

test("sitemap XML escapes page image titles and remains well formed", () => {
  const xml = buildSitemapXml(pages, []);
  assert.match(xml, /<image:title>Oubei &amp; industrial seals<\/image:title>/);
  assert.ok(xml.startsWith("<?xml version=\"1.0\" encoding=\"UTF-8\"?>"));
  assert.ok(xml.endsWith("</urlset>"));
});

