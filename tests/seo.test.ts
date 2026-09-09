import test from "node:test";
import assert from "node:assert/strict";
import {
  PUBLIC_PAGE_SEO,
  SITE_ORIGIN,
  createPageMetadata,
  createProductMetadata,
  createResourceMetadata,
} from "@/lib/seo";

function absoluteTitle(metadata: ReturnType<typeof createPageMetadata>) {
  const title = metadata.title as { absolute?: string };
  assert.equal(typeof title, "object");
  assert.ok(title && "absolute" in title);
  return String(title.absolute);
}

test("public page metadata is unique, canonical and within SEO length targets", () => {
  const values = Object.values(PUBLIC_PAGE_SEO).map(createPageMetadata);
  const titles = values.map(absoluteTitle);
  const descriptions = values.map((metadata) => String(metadata.description));
  const canonicals = values.map((metadata) => String(metadata.alternates?.canonical));

  assert.equal(new Set(titles).size, titles.length);
  assert.equal(new Set(descriptions).size, descriptions.length);
  assert.equal(new Set(canonicals).size, canonicals.length);

  values.forEach((metadata) => {
    const title = absoluteTitle(metadata);
    const description = String(metadata.description);
    const canonical = String(metadata.alternates?.canonical);
    assert.ok(title.length >= 50 && title.length <= 60, `invalid title length ${title.length}: ${title}`);
    assert.ok(description.length >= 120 && description.length <= 155, `invalid description length ${description.length}: ${description}`);
    assert.ok(canonical.startsWith(`${SITE_ORIGIN}/`) || canonical === SITE_ORIGIN);
    assert.equal(metadata.openGraph?.url, canonical);
    assert.equal(metadata.openGraph?.title, title);
    assert.equal(metadata.openGraph?.description, description);
    assert.ok(Array.isArray(metadata.openGraph?.images) && metadata.openGraph.images.length > 0);
    assert.deepEqual(metadata.robots, { index: true, follow: true });
  });
});

test("metadata validation rejects titles and descriptions outside target ranges", () => {
  assert.throws(() => createPageMetadata({ path: "/bad", title: "Too short", description: "Too short", image: "/logo.webp" }), /50-60/);
});

test("dynamic product metadata is canonical and uses the product image", () => {
  const metadata = createProductMetadata({
    slug: "chemical-seal",
    name: "Chemical Process Seal",
    code: "CPS-100",
    shortDescription: "A reliable molded seal for pumps, valves and chemical processing equipment.",
    description: "",
    material: "FKM",
    image: "/api/media/product.webp",
  });
  assert.equal(metadata.alternates?.canonical, `${SITE_ORIGIN}/products/chemical-seal`);
  assert.ok(absoluteTitle(metadata).length >= 50 && absoluteTitle(metadata).length <= 60);
  assert.ok(String(metadata.description).length >= 120 && String(metadata.description).length <= 155);
  assert.deepEqual(metadata.openGraph?.images, [{ url: `${SITE_ORIGIN}/api/media/product.webp`, alt: "Chemical Process Seal" }]);
});

test("dynamic resource metadata uses the resource path and image", () => {
  const metadata = createResourceMetadata({
    slug: "sealing-renewable-energy",
    title: "Specialized Sealing for Renewable Energy Infrastructure",
    excerpt: "Material choices that improve reliability across solar, wind and battery environments.",
    image: "/stitch/home-09.jpg",
    alt: "Industrial facility",
  });
  assert.equal(metadata.alternates?.canonical, `${SITE_ORIGIN}/resources/sealing-renewable-energy`);
  assert.ok(absoluteTitle(metadata).length >= 50 && absoluteTitle(metadata).length <= 60);
  assert.ok(String(metadata.description).length >= 120 && String(metadata.description).length <= 155);
});
