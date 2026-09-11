# Oubei WordPress Theme Conversion Design

## Goal

Convert the downloaded production Oubei website into a self-contained WordPress theme while preserving its current public design, URLs, product data, editable site settings, media slots, inquiry workflow, and SEO behavior. The result will run locally through XAMPP at `http://localhost:6911` and later deploy to the VPS as a conventional WordPress site.

## Source of Truth

- Production application archive: `D:\kehu\oubei\oubei-hostinger-20260911T035743Z\app-source.tar.gz`
- Production content snapshot: `D:\kehu\oubei\oubei-hostinger-20260911T035743Z\data\20260911T035923Z\site.db`
- Production snapshot contains four product categories, four products, four product-image records, 48 registered image slots, and 14 site settings.
- The existing Next.js project and downloaded production backup remain untouched as recovery references.

## Chosen Approach

Build a native PHP WordPress theme named `oubei`. Do not use WooCommerce, a headless Next.js frontend, a page builder, or paid plugins. Use WordPress core APIs, native posts, custom post types, taxonomies, meta fields, the media library, rewrite rules, and the Customizer/theme settings as appropriate.

This keeps deployment simple, gives the customer a familiar WordPress backend, and avoids unnecessary commerce infrastructure for a B2B catalog and inquiry site.

## Local Environment

- WordPress directory: `C:\xampp\htdocs\oubei-wordpress`
- Local URL: `http://localhost:6911`
- PHP: XAMPP PHP 8.2
- Database: a dedicated MariaDB database for Oubei
- Apache will listen on port 6911 without changing or disrupting other local sites.

## Theme Architecture

The theme will use focused modules:

- Theme bootstrap for supports, assets, menus, image sizes, and rewrite registration.
- Product domain module for the product custom post type, taxonomy, fields, validation, and queries.
- Inquiry module for form handling, persistence, notification delivery, status tracking, and resend operations.
- Site settings module for identity, contact information, social links, and notification destination.
- Media-slot module for the fixed page-image registry and WordPress media selections.
- SEO module for titles, descriptions, canonical URLs, Open Graph data, robots rules, and sitemaps where WordPress core is insufficient.
- Migration module for idempotent import of the production SQLite content and checked-in assets.

Theme templates will remain presentation-focused and read data through these modules rather than embedding product records in PHP files.

## Content Model

### Products

Register `oubei_product` as a public custom post type and `oubei_product_category` as its hierarchical taxonomy.

Each product stores:

- WordPress title and slug
- Product code
- Short description
- Full description
- Material
- Applications as an ordered list
- Specifications as an ordered list
- Featured image
- Ordered product gallery
- Publication status and product category

All catalog views query WordPress dynamically. Products created later in the WordPress backend automatically appear in product lists, filters, related-product queries, product detail routes, and the XML sitemap. Product detail URLs use `/products/{slug}`. Deletion uses the WordPress trash workflow.

### Product Categories

Categories are managed through the native taxonomy interface. Existing production categories and slugs are imported. Category archives and catalog filtering remain dynamic.

### Articles and Resources

- New editorial articles use WordPress native posts.
- Article list URL: `/blog`
- Article detail URL: `/blog/{slug}`
- Articles support categories, tags, featured images, excerpts, publish scheduling, and SEO fields.
- Existing technical resources remain available under `/resources` and `/resources/{slug}` and are not merged into the blog unless explicitly migrated later.

### Site Settings

An Oubei settings screen manages:

- Website name
- Company logo
- Company/contact names
- Address, phone, email, and business hours
- Facebook, LinkedIn, YouTube, Instagram, TikTok, and WhatsApp URLs
- Inquiry notification email

WordPress administrator accounts and native password management replace the custom Next.js administrator system.

### Page Image Slots

The existing 48 page-image slots remain a fixed theme registry. Each slot has a key, page group, label, alternative text, bundled default asset, and optional WordPress media override. Administrators can select, replace, or restore each slot. Removing an override restores the bundled default.

## Public Routes

Preserve the current public paths and their visual intent, including:

- `/`
- `/products`
- `/products/{slug}`
- `/materials`
- `/about`
- `/custom`
- `/resources`
- `/resources/{slug}`
- `/faq`
- `/quote`
- `/privacy`
- `/terms`

Add `/blog` and `/blog/{slug}`. Existing canonical paths and redirects from the production application must be carried over. Unknown products, resources, and posts return the WordPress 404 template.

## Frontend and Hero

Recreate the current responsive visual design in native theme templates and CSS. Reuse production assets from the archive. The Hero retains its current five animated Three.js rings and contains no GLB models or product PNG overlays. Three.js will be bundled as a versioned local production asset rather than loaded from a third-party CDN.

Navigation, footer identity, contact details, social links, product catalogs, images, and blog content resolve dynamically from WordPress data. The frontend must remain usable if optional settings or images are missing by falling back to theme defaults.

## Inquiry Workflow

Register a private `oubei_inquiry` post type for administrator-only records. Store:

- Contact name
- Company
- Email
- Phone
- Country
- Referenced product
- Requirements/message
- Submission timestamp
- Processing status
- Notification delivery status and error summary

On submission, validate a WordPress nonce, sanitize every field, apply a honeypot and a basic rate limit, then persist the inquiry before attempting email delivery. A mail failure never loses the inquiry. Administrators can view records, update processing status, and retry failed notifications.

## Import Strategy

Provide an administrator-only, idempotent importer that reads the production export prepared from SQLite and imports:

- Four existing product categories
- Four existing products and all structured fields
- Product featured images and galleries
- Site identity/contact/social settings
- Page media-slot defaults and available uploaded overrides
- Existing public resources required by the theme

The importer matches products and categories by stable slug, updating records instead of duplicating them. It records its import version and presents a dry summary before execution. Source assets are copied into the WordPress media library or theme defaults according to whether they are editable content or immutable theme assets.

## Security and Error Handling

- Require WordPress capabilities and nonces for every administrative mutation.
- Sanitize stored values and escape output according to context.
- Restrict media selections to permitted image types.
- Use prepared WordPress database APIs for custom query operations.
- Do not expose inquiry records publicly or through anonymous REST endpoints.
- Rate-limit public inquiry submission and provide generic public errors while retaining useful administrator diagnostics.
- Never commit production secrets from `config/oubei.env`.

## SEO

Preserve current page titles, descriptions, canonical URLs, robots behavior, redirects, and sitemap coverage. Add blog posts and dynamically created products to sitemap output. Product and article pages emit appropriate Open Graph metadata and structured data where supported by their content.

## Testing and Acceptance

### Local environment

- Apache serves the site at `http://localhost:6911`.
- WordPress installation and database are isolated from other XAMPP sites.
- Permalinks work without `index.php` in public URLs.

### Data and administration

- The four production categories and four production products import without duplication.
- An administrator can create, edit, publish, trash, and restore a product.
- A newly published product appears automatically at `/products` and `/products/{slug}`.
- Product fields, categories, featured image, and ordered gallery persist correctly.
- All site settings and 48 media slots can be edited and restored to defaults.
- An administrator can publish and edit blog posts.

### Inquiry workflow

- A valid inquiry is stored before notification is attempted.
- Successful mail delivery is recorded.
- Failed mail delivery leaves the inquiry available and supports retry.
- Invalid nonce, honeypot, malformed input, and rate-limit cases are rejected.

### Public frontend

- Every preserved route renders successfully or redirects to its canonical equivalent.
- Desktop and mobile layouts preserve the current site design.
- The Hero shows five separated animated rings and no GLB or product PNG overlay requests.
- Missing optional data falls back safely without fatal errors or broken layout.
- Page source has valid canonical metadata, and products and blog posts appear in the sitemap.

## Deliverables

- Working local WordPress site at port 6911
- Native Oubei WordPress theme source
- Idempotent production-content importer
- Imported local product and settings data
- Deployable theme ZIP
- Deployment, migration, permalink, email, backup, and restore documentation

## Out of Scope

- Shopping cart, checkout, payments, customer accounts, and order management
- WooCommerce
- Multilingual content unless separately requested
- General-purpose page-builder freedom that can restructure the approved design
- Migration of production secrets or administrator passwords
