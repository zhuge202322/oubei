# Oubei SEO Foundation Design

## Goal

Make `https://www.htob-ffkm.com` the single canonical public origin and give every public page complete, crawlable SEO metadata, a dynamically maintained page-and-image sitemap, and production caching without serving stale administration or API responses.

## Scope

This change covers the public Next.js application and the Oubei Nginx virtual host. Google Search Console account verification and sitemap submission are explicitly excluded; the deployed sitemap URL will be handed off for manual submission.

## Canonical Origin And Redirects

The only canonical origin is `https://www.htob-ffkm.com`.

- Every request to `http://htob-ffkm.com/*` or `http://www.htob-ffkm.com/*` returns a permanent `301` redirect to `https://www.htob-ffkm.com/*` while preserving the path and query string.
- Every request to `https://htob-ffkm.com/*` returns a permanent `301` redirect to `https://www.htob-ffkm.com/*` while preserving the path and query string.
- Only the `www` HTTPS virtual host proxies application traffic to `127.0.0.1:4100`.
- The existing certificate must continue to cover both hostnames so the bare HTTPS redirect is valid before the browser follows it.

## Robots And Sitemap

The application will expose `/robots.txt` and `/sitemap.xml` from the canonical origin.

`robots.txt` will:

- allow crawling of public pages, products, and resources;
- avoid blanket rules that block product or blog/resource routes;
- disallow private administration and API routes;
- declare `https://www.htob-ffkm.com/sitemap.xml`.

`sitemap.xml` will be generated dynamically from two sources:

- a maintained list of fixed public routes and resource/blog routes;
- the SQLite database's currently published products and their ordered product images.

The XML will use both the standard sitemap namespace and Google's image sitemap namespace. Each URL entry may contain one or more `image:image` elements with absolute canonical image URLs and escaped captions. Hidden products and administration/API routes will not appear. The response will use a one-hour shared-cache lifetime so crawlers receive regular automatic updates without requiring cron or deployment after product changes.

## Metadata Architecture

A focused SEO helper module will own the canonical origin, default social image, and builders for static and dynamic metadata. Public pages will use this helper to avoid inconsistent URL construction while still supplying unique content.

Every indexable public route will provide:

- a unique English title targeting approximately 50-60 characters;
- a unique English description targeting approximately 120-155 characters;
- a self-referencing canonical URL on the `www` HTTPS origin;
- OpenGraph type, URL, title, description, site name, locale, and image;
- Twitter summary-card metadata derived from the same page-specific values.

Dynamic product metadata will be read from the same database record used to render the page. Unknown or hidden product slugs will not emit misleading indexable metadata. Dynamic resource/blog pages will derive metadata from their article record.

The root layout will define `metadataBase`, the site-wide title template, the default OpenGraph image, and an explicit English locale. Individual pages remain responsible for their own canonical, title, and description so no child page accidentally inherits the homepage canonical.

Administration pages will be marked `noindex, nofollow`. API routes are excluded from the sitemap and blocked in `robots.txt`.

## Language And Viewport

The root document will retain `<html lang="en">`. The application will explicitly export a mobile viewport with device width, initial scale `1`, and an appropriate theme color. This makes the existing framework-generated viewport behavior explicit and testable.

## Caching

Nginx will apply cache rules by asset class:

- `/_next/static/`: one year, public, immutable;
- `/api/media/`: one year, public, immutable because uploaded filenames are random and never overwritten;
- common public image/font extensions served through the application: seven days with stale revalidation support;
- HTML pages, admin routes, application APIs, `robots.txt`, and `sitemap.xml`: no one-year browser cache. The sitemap controls its own one-hour shared-cache header.

Proxy forwarding headers and the existing upload-size limit will remain unchanged. Cache directives will be confined to the Oubei virtual host and will not alter any other website on the server.

## Error Handling And Escaping

The sitemap generator will XML-escape URLs, captions, and other text. Database failures must return a server error rather than a partial or malformed sitemap. Product image URLs will be normalized against the canonical origin; only published products will be included.

## Verification

Automated tests will cover:

- canonical URL construction and metadata uniqueness constraints;
- robots rules and sitemap declaration;
- sitemap inclusion of fixed pages, resources, published products, resources, and image images;
- exclusion of hidden products, admin routes, and API routes;
- XML escaping and canonical `www` URLs.

Deployment verification will cover:

- `301` for both HTTP hosts and bare-domain HTTPS while preserving paths and queries;
- `200` for canonical HTTPS pages, robots, and sitemap;
- valid XML with page and image namespaces;
- unique canonical, title, description, OpenGraph, language, and viewport output on representative static, product, and resource pages;
- expected cache headers for Next.js assets, uploaded media, HTML, API, robots, and sitemap;
- valid Nginx configuration and healthy Oubei/Nginx services;
- no configuration changes to unrelated server virtual hosts.

## Acceptance Criteria

1. `robots.txt` declares the sitemap and does not block products or resources.
2. `sitemap.xml` contains fixed pages, resource/blog pages, published products, and their images, and updates automatically from current application data.
3. All HTTP requests permanently redirect to canonical HTTPS with status `301`.
4. Bare-domain HTTPS permanently redirects to the `www` hostname with status `301`.
5. Static and image assets receive appropriate cache headers without long-caching HTML, admin, or API responses.
6. The document language is English.
7. The mobile viewport is explicitly declared.
8. Every indexable page has a unique, keyword-relevant title of approximately 50-60 characters.
9. Every indexable page has a unique description of approximately 120-155 characters.
10. Every indexable page has a self-referencing canonical URL on `https://www.htob-ffkm.com`.
11. Every indexable page has page-specific OpenGraph title, description, image, and URL.

