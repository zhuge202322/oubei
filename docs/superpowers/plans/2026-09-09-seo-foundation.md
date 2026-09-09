# Oubei SEO Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `https://www.htob-ffkm.com` the sole canonical origin and add complete per-page SEO metadata, dynamic page-and-image sitemap output, permanent redirects, and asset caching.

**Architecture:** A pure SEO helper constructs page metadata from page-specific inputs, while a separate pure sitemap builder renders escaped XML from fixed-page, resource, and database product records. Thin Next.js route modules expose `/robots.txt` and `/sitemap.xml`; per-route metadata exports keep canonical values self-referencing. The Oubei-only Nginx virtual host enforces the canonical origin and applies asset-specific caching.

**Tech Stack:** Next.js 16 App Router, TypeScript, Node test runner, SQLite, Nginx, systemd

**Spec:** `docs/superpowers/specs/2026-09-09-seo-foundation-design.md`

## Global Constraints

- Canonical origin is exactly `https://www.htob-ffkm.com`.
- Search Console verification and submission remain manual and out of scope.
- Products and resources must remain crawlable.
- Admin and API routes must not appear in the sitemap.
- Existing Oubei product data, media, admin authentication, and unrelated Nginx sites must not be changed.
- Public titles target 50-60 characters and descriptions target 120-155 characters.
- Uploaded media filenames are immutable; public source images are cached for seven days.

---

### Task 1: SEO Metadata Helper And Root Defaults

**Files:**
- Create: `src/lib/seo.ts`
- Modify: `src/app/layout.tsx`
- Test: `tests/seo.test.ts`

**Interfaces:**
- Produces: `SITE_ORIGIN`, `DEFAULT_SOCIAL_IMAGE`, `createPageMetadata(input)`, and `createProductMetadata(product)`.
- `createPageMetadata` returns a Next.js `Metadata` value with absolute title, description, canonical, OpenGraph, and Twitter fields.

- [ ] **Step 1: Write failing metadata tests**

```ts
test("page metadata is canonical, unique, and complete", () => {
  const metadata = createPageMetadata({ path: "/about", title: "About Xingtai Oubei Rubber Manufacturing Company", description: LONG_DESCRIPTION, image: "/factory/company.png" });
  assert.equal(metadata.alternates?.canonical, "https://www.htob-ffkm.com/about");
  assert.equal(metadata.openGraph?.url, "https://www.htob-ffkm.com/about");
  assert.deepEqual(metadata.robots, { index: true, follow: true });
});

test("metadata validation rejects titles and descriptions outside SEO ranges", () => {
  assert.throws(() => createPageMetadata({ path: "/bad", title: "Short", description: "Too short", image: "/logo.webp" }));
});
```

- [ ] **Step 2: Run the tests and confirm the missing-module failure**

Run: `node --test --import tsx tests/seo.test.ts`

- [ ] **Step 3: Implement the helper and root metadata**

`createPageMetadata` will normalize relative paths against `SITE_ORIGIN`, validate title and description lengths, and emit:

```ts
{
  title: { absolute: title },
  description,
  alternates: { canonical: absoluteUrl },
  robots: { index: true, follow: true },
  openGraph: { type: "website", locale: "en_US", siteName: "Xingtai Oubei", url: absoluteUrl, title, description, images: [{ url: absoluteImage }] },
  twitter: { card: "summary_large_image", title, description, images: [absoluteImage] },
}
```

The root layout will export `metadataBase: new URL(SITE_ORIGIN)`, global defaults, explicit `viewport`, and retain `<html lang="en">`.

- [ ] **Step 4: Run SEO tests, TypeScript, and lint**

Run: `node --test --import tsx tests/seo.test.ts && npx tsc --noEmit && npm run lint`

---

### Task 2: Dynamic Robots And Page/Image Sitemap

**Files:**
- Create: `src/lib/sitemap.ts`
- Create: `src/app/robots.ts`
- Create: `src/app/sitemap.xml/route.ts`
- Modify: `src/lib/server/content.ts`
- Test: `tests/sitemap.test.ts`

**Interfaces:**
- `robots()` returns Next.js `MetadataRoute.Robots`.
- `buildSitemapXml(pages, products)` returns a complete XML string with standard and image namespaces.
- Published `ResolvedProduct` records expose `updatedAt` and ordered gallery images.

- [ ] **Step 1: Write failing robots and sitemap tests**

```ts
test("robots permits public catalog and declares canonical sitemap", () => {
  const value = robots();
  assert.equal(value.sitemap, "https://www.htob-ffkm.com/sitemap.xml");
  assert.deepEqual(value.rules, [{ userAgent: "*", allow: "/", disallow: ["/admin/", "/api/"] }]);
});

test("sitemap includes canonical pages and product images but excludes hidden products", () => {
  const xml = buildSitemapXml(PAGES, PRODUCTS);
  assert.match(xml, /xmlns:image="http:\/\/www.google.com\/schemas\/sitemap-image\/1.1"/);
  assert.match(xml, /https:\/\/www.htob-ffkm.com\/products\/active-seal/);
  assert.match(xml, /<image:loc>https:\/\/www.htob-ffkm.com\/api\/media\/image.webp<\/image:loc>/);
  assert.doesNotMatch(xml, /hidden-seal|\/admin\/|\/api\/admin\//);
});

test("sitemap XML escapes user-controlled product text", () => {
  assert.match(buildSitemapXml(PAGES, PRODUCTS_WITH_AMPERSAND), /A &amp; B/);
});
```

- [ ] **Step 2: Run the tests and confirm missing implementations fail**

Run: `node --test --import tsx tests/sitemap.test.ts`

- [ ] **Step 3: Implement the pure builder and route adapters**

The fixed page inventory includes `/`, `/about`, `/products`, `/materials`, `/custom`, `/resources`, `/faq`, `/quote`, `/privacy`, `/terms`, the published resource paths, and the special FKM product page. Each entry has a representative image. The sitemap route reads current resolved site content, includes only active database products, converts all URLs to the canonical origin, and sets:

```http
Content-Type: application/xml; charset=utf-8
Cache-Control: public, max-age=0, s-maxage=3600, stale-while-revalidate=300
```

- [ ] **Step 4: Run sitemap tests and confirm public routes only**

Run: `node --test --import tsx tests/sitemap.test.ts`

---

### Task 3: Unique Metadata For Every Public Page

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/about/page.tsx`
- Create: `src/app/materials/layout.tsx`
- Modify: `src/app/custom/page.tsx`
- Create: `src/app/products/layout.tsx`
- Modify: `src/app/products/[slug]/page.tsx`
- Create: `src/app/products/fkm-rubber-o-ring/layout.tsx`
- Modify: `src/app/resources/page.tsx`
- Modify: `src/app/resources/[slug]/page.tsx`
- Modify: `src/app/resources/choosing-o-ring-hardness/page.tsx`
- Modify: `src/app/resources/technical-whitepapers/high-temperature-o-ring-material/page.tsx`
- Modify: `src/app/faq/page.tsx`
- Create: `src/app/quote/layout.tsx`
- Modify: `src/app/privacy/page.tsx`
- Modify: `src/app/terms/page.tsx`
- Modify: `src/app/admin/layout.tsx`
- Test: `tests/seo.test.ts`

**Interfaces:**
- Static server pages export `metadata = createPageMetadata(...)`.
- Client-only page segments receive metadata from sibling server `layout.tsx` files.
- Dynamic product/resource pages export `generateMetadata()` using their own data records.

- [ ] **Step 1: Extend tests with the complete public metadata inventory**

The fixture will contain every indexable public path and assert unique canonical URL, unique title, unique description, title length 50-60, description length 120-155, and complete OpenGraph fields.

- [ ] **Step 2: Run tests and confirm missing inventory entries fail**

Run: `node --test --import tsx tests/seo.test.ts`

- [ ] **Step 3: Add page-specific static metadata**

Each public route receives an English keyword-focused title and description based on its actual content. Client-only pages use route layouts so no client component is converted or restructured solely for metadata.

- [ ] **Step 4: Add dynamic product and resource metadata**

Product titles/descriptions use the product name, material, short description, and main gallery image with bounded fallbacks. Resource records use article title, excerpt, and image. Missing content returns `robots: { index: false, follow: false }` rather than a misleading canonical page.

- [ ] **Step 5: Mark all administration pages noindex**

`src/app/admin/layout.tsx` exports metadata with `robots: { index: false, follow: false, noarchive: true }`.

- [ ] **Step 6: Run metadata tests, all focused tests, TypeScript, lint, and production build**

Run: `node --test --import tsx tests/seo.test.ts tests/sitemap.test.ts tests/product-management.test.ts tests/admin-api.test.ts && npx tsc --noEmit && npm run lint && npm run build`

---

### Task 4: Oubei-Only Nginx Redirect And Cache Policy

**Files:**
- Modify on server: `/etc/nginx/sites-available/oubei`
- Backup on server: `/etc/nginx/sites-available/oubei.before-seo-20260909`

**Interfaces:**
- Port 80 server returns `301 https://www.htob-ffkm.com$request_uri` for both names.
- Bare-domain port 443 server returns the same canonical `301`.
- WWW port 443 server proxies the app and owns asset cache locations.

- [ ] **Step 1: Save current config and inventory unrelated enabled sites**

Run: `cp -a /etc/nginx/sites-available/oubei /etc/nginx/sites-available/oubei.before-seo-20260909` and record checksums for `/etc/nginx/sites-enabled/*` excluding the Oubei symlink.

- [ ] **Step 2: Write the isolated redirect server blocks**

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name htob-ffkm.com www.htob-ffkm.com;
    return 301 https://www.htob-ffkm.com$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name htob-ffkm.com;
    # existing certificate directives
    return 301 https://www.htob-ffkm.com$request_uri;
}
```

- [ ] **Step 3: Add cache locations to the WWW proxy server**

`/_next/static/` and `/api/media/` receive one-year immutable headers. Common public image/font extensions receive a seven-day cache plus stale revalidation. The default location retains the existing proxy headers, upgrade support, timeout, and upload limit.

- [ ] **Step 4: Validate before reload**

Run: `nginx -t`

Expected: syntax successful. Only then run `systemctl reload nginx`.

- [ ] **Step 5: Confirm unrelated virtual-host checksums are unchanged**

Compare the pre-change and post-change inventory excluding Oubei.

---

### Task 5: Production Deployment And Acceptance Verification

**Files:**
- Deploy changed application files to `/var/www/oubei/app`
- Preserve data under `/var/lib/oubei`

**Interfaces:**
- `oubei.service` remains on `127.0.0.1:4100`.
- Nginx remains the only public HTTP/HTTPS listener.

- [ ] **Step 1: Back up persistent data and deploy application files**

Stop only `oubei.service` for a consistent SQLite copy, back up `/var/lib/oubei/site.db`, restart it, deploy files, then run tests and `npm run build`.

- [ ] **Step 2: Restore runtime permissions and restart Oubei**

Run: `chgrp -R www-data .next node_modules && chmod -R g+rX .next node_modules && systemctl restart oubei.service`.

- [ ] **Step 3: Verify redirect matrix**

Use `curl --resolve` to assert status `301` and exact `Location` values for HTTP bare, HTTP www, and HTTPS bare URLs with a sample path and query. Assert canonical HTTPS returns `200`.

- [ ] **Step 4: Verify robots, sitemap, metadata, and cache headers**

Check that robots and sitemap return `200`, sitemap parses as XML and includes image entries, representative static/product/resource pages emit unique title/description/canonical/OpenGraph plus English language and viewport, and cache headers match each asset class.

- [ ] **Step 5: Run browser SEO smoke checks**

Using Playwright, load representative desktop/mobile public pages, assert no framework overlay or console errors, inspect head metadata, and save screenshots outside the repository.

- [ ] **Step 6: Report the manual Search Console handoff**

Provide `https://www.htob-ffkm.com/sitemap.xml` and state that Google Search Console property verification and submission remain for the user to perform manually.

