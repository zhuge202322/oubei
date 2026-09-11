# Oubei WordPress Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a native WordPress B2B catalog theme that reproduces the production Oubei website, imports all current catalog/settings/media data, supports dynamic future products and posts, stores and emails inquiries, and runs under XAMPP at `http://localhost:6911`.

**Architecture:** WordPress core lives at `C:\xampp\htdocs\oubei-wordpress`, while versioned theme source lives in this repository at `wordpress-theme/oubei` and is mounted into `wp-content/themes/oubei` for local development. Focused PHP modules register content models and backend editing surfaces; templates query WordPress dynamically; an idempotent JSON importer consumes a sanitized export from the production SQLite snapshot. Compiled CSS and a locally bundled Three.js module reproduce the current frontend without WooCommerce, page builders, paid plugins, or CDN runtime dependencies.

**Tech Stack:** WordPress 6.x, PHP 8.2, MariaDB 10.4, XAMPP Apache, WordPress core APIs, native Custom Post Types/taxonomies/meta boxes/media library, JavaScript, Three.js, Tailwind CSS v4/PostCSS, Node.js asset tooling, WP-CLI integration checks.

**Spec:** `docs/superpowers/specs/2026-09-11-oubei-wordpress-theme-design.md`

## Global Constraints

- Local WordPress path is exactly `C:\xampp\htdocs\oubei-wordpress` and web port is exactly `6911`.
- Theme slug is `oubei`; source is versioned at `wordpress-theme/oubei`.
- Preserve `/`, `/products`, `/products/{slug}`, `/materials`, `/about`, `/custom`, `/resources`, `/resources/{slug}`, `/faq`, `/quote`, `/privacy`, and `/terms`.
- Add `/blog` and `/blog/{slug}` for WordPress-native posts.
- Products are dynamic `oubei_product` posts classified by `oubei_product_category`; no WooCommerce, cart, checkout, payments, or customer accounts.
- Preserve the 48 registered page-image slots, with bundled defaults and media-library overrides.
- Store every valid inquiry before attempting email notification; failed email must not lose the inquiry.
- Retain the current five-ring Hero and make no GLB or product-overlay PNG requests.
- Never import or commit production environment secrets or administrator password hashes.
- Existing Next.js source and the downloaded Hostinger backup are read-only migration references.

---

### Task 1: Isolated XAMPP WordPress Runtime and Theme Skeleton

**Files:**
- Create: `scripts/setup-oubei-wordpress.ps1`
- Create: `scripts/test-oubei-wordpress.ps1`
- Create: `wordpress-theme/oubei/style.css`
- Create: `wordpress-theme/oubei/functions.php`
- Create: `wordpress-theme/oubei/index.php`
- Create: `wordpress-theme/oubei/tests/runtime-smoke.php`
- Modify: `.gitignore`

**Interfaces:**
- Produces local URL `http://localhost:6911` and WP-CLI command wrapper `scripts/test-oubei-wordpress.ps1`.
- Produces activated theme slug `oubei` and the common PHP test entrypoint `wp eval-file wordpress-theme/oubei/tests/<file>.php`.

- [ ] **Step 1: Write the failing runtime smoke check**

Create `wordpress-theme/oubei/tests/runtime-smoke.php`:

```php
<?php
oubei_assert(get_stylesheet() === 'oubei', 'Oubei theme must be active');
oubei_assert(home_url('/') === 'http://localhost:6911/', 'Local URL must use port 6911');
oubei_assert(get_option('permalink_structure') === '/blog/%postname%/', 'Post permalinks must live under /blog');
```

Create `scripts/test-oubei-wordpress.ps1` with an `oubei_assert()` bootstrap and `wp eval-file` execution against `C:\xampp\htdocs\oubei-wordpress`.

- [ ] **Step 2: Run the check and verify failure**

Run: `powershell -File scripts/test-oubei-wordpress.ps1 runtime-smoke.php`

Expected: FAIL because the isolated WordPress installation and theme do not exist.

- [ ] **Step 3: Implement repeatable local setup**

Implement `scripts/setup-oubei-wordpress.ps1` to:

```powershell
$sitePath = 'C:\xampp\htdocs\oubei-wordpress'
$siteUrl = 'http://localhost:6911'
$database = 'oubei_wordpress'
```

Download WordPress and WP-CLI only when absent, create the dedicated MariaDB database, generate `wp-config.php` with development-safe local credentials, install WordPress, set `/blog/%postname%/`, mount `wordpress-theme/oubei` into the theme directory, activate `oubei`, and add an Apache `Listen 6911` virtual host whose document root is `$sitePath`. Back up Apache configuration before its first modification and make every repeated run idempotent.

- [ ] **Step 4: Add the minimum valid theme**

Add the required theme header to `style.css`, load focused modules from `functions.php`, and render a valid WordPress loop from `index.php`.

- [ ] **Step 5: Start Apache/MariaDB and verify the runtime**

Run:

```powershell
powershell -File scripts/setup-oubei-wordpress.ps1
powershell -File scripts/test-oubei-wordpress.ps1 runtime-smoke.php
```

Expected: site returns HTTP 200 on port 6911 and all three assertions pass.

- [ ] **Step 6: Commit**

```bash
git add .gitignore scripts/setup-oubei-wordpress.ps1 scripts/test-oubei-wordpress.ps1 wordpress-theme/oubei
git commit -m "chore: add isolated Oubei WordPress runtime"
```

### Task 2: Theme Bootstrap, Asset Pipeline, and Shared Layout

**Files:**
- Create: `wordpress-theme/oubei/inc/setup.php`
- Create: `wordpress-theme/oubei/inc/assets.php`
- Create: `wordpress-theme/oubei/header.php`
- Create: `wordpress-theme/oubei/footer.php`
- Create: `wordpress-theme/oubei/assets/src/theme.css`
- Create: `wordpress-theme/oubei/assets/src/site.js`
- Create: `wordpress-theme/oubei/package.json`
- Create: `wordpress-theme/oubei/postcss.config.mjs`
- Create: `wordpress-theme/oubei/tests/theme-setup.php`
- Modify: `wordpress-theme/oubei/functions.php`

**Interfaces:**
- Produces `oubei_asset_uri(string $path): string`, registered navigation location `primary`, theme supports, compiled `assets/dist/theme.css`, and compiled `assets/dist/site.js`.
- Consumes active WordPress runtime from Task 1.

- [ ] **Step 1: Write failing setup assertions**

```php
<?php
oubei_assert(current_theme_supports('title-tag'), 'title-tag support missing');
oubei_assert(current_theme_supports('post-thumbnails'), 'post thumbnails missing');
oubei_assert(array_key_exists('primary', get_registered_nav_menus()), 'primary menu missing');
oubei_assert(wp_style_is('oubei-theme', 'registered'), 'theme stylesheet missing');
```

- [ ] **Step 2: Verify the assertions fail**

Run: `powershell -File scripts/test-oubei-wordpress.ps1 theme-setup.php`

Expected: FAIL on missing supports/menu/assets.

- [ ] **Step 3: Implement setup and local build pipeline**

Register HTML5 support, title tags, featured images, custom logo, responsive embeds, primary navigation, image sizes, and versioned assets. Configure Tailwind/PostCSS to scan `*.php`, `inc/*.php`, and `assets/src/*.js`; compile production CSS and JavaScript without runtime CDN requests.

- [ ] **Step 4: Port shared Header and Footer**

Translate the current navigation, mobile menu, logo, CTA, footer columns, contact block, accessibility labels, and responsive breakpoints into `header.php`, `footer.php`, and `site.js`. Use WordPress escaping and settings fallbacks rather than hardcoded administrator values.

- [ ] **Step 5: Build and verify**

Run:

```powershell
npm --prefix wordpress-theme/oubei install
npm --prefix wordpress-theme/oubei run build
powershell -File scripts/test-oubei-wordpress.ps1 theme-setup.php
C:\xampp\php\php.exe -l wordpress-theme\oubei\header.php
C:\xampp\php\php.exe -l wordpress-theme\oubei\footer.php
```

Expected: asset build and all assertions/lint checks pass.

- [ ] **Step 6: Commit**

```bash
git add wordpress-theme/oubei
git commit -m "feat: add Oubei theme foundation and shared layout"
```

### Task 3: Dynamic Product and Resource Content Models

**Files:**
- Create: `wordpress-theme/oubei/inc/products.php`
- Create: `wordpress-theme/oubei/inc/product-fields.php`
- Create: `wordpress-theme/oubei/inc/resources.php`
- Create: `wordpress-theme/oubei/tests/content-models.php`
- Modify: `wordpress-theme/oubei/functions.php`

**Interfaces:**
- Produces `oubei_product` CPT, `oubei_product_category` taxonomy, `oubei_resource` CPT, and `oubei_get_product_data(int $post_id): array`.
- Product meta keys: `_oubei_code`, `_oubei_material`, `_oubei_short_description`, `_oubei_applications`, `_oubei_specs`, `_oubei_gallery_ids`.

- [ ] **Step 1: Write failing content-model assertions**

```php
<?php
oubei_assert(post_type_exists('oubei_product'), 'product post type missing');
oubei_assert(taxonomy_exists('oubei_product_category'), 'product taxonomy missing');
oubei_assert(post_type_exists('oubei_resource'), 'resource post type missing');
$product = wp_insert_post(['post_type' => 'oubei_product', 'post_title' => 'Dynamic Test Seal', 'post_status' => 'publish']);
update_post_meta($product, '_oubei_applications', ['Pumps', 'Valves']);
oubei_assert(oubei_get_product_data($product)['applications'] === ['Pumps', 'Valves'], 'product lists not preserved');
wp_delete_post($product, true);
```

- [ ] **Step 2: Verify failure**

Run: `powershell -File scripts/test-oubei-wordpress.ps1 content-models.php`

Expected: FAIL because types and helper are undefined.

- [ ] **Step 3: Register types, taxonomy, fields, and meta boxes**

Use `/products/%postname%` and `/resources/%postname%` rewrites. Register REST-visible typed meta, nonce-protected meta boxes, ordered applications/specifications, featured image, and ordered gallery selection through the native media modal. Sanitize each field and guard saves against autosaves and missing `edit_post` capability.

- [ ] **Step 4: Verify dynamic create/edit/trash behavior**

Run: `powershell -File scripts/test-oubei-wordpress.ps1 content-models.php`

Expected: PASS and temporary product is removed.

- [ ] **Step 5: Commit**

```bash
git add wordpress-theme/oubei/inc wordpress-theme/oubei/tests wordpress-theme/oubei/functions.php
git commit -m "feat: add dynamic product and resource models"
```

### Task 4: Production SQLite Export and Idempotent WordPress Import

**Files:**
- Create: `scripts/export-oubei-production-content.mjs`
- Create: `wordpress-theme/oubei/import/production-content.json`
- Create: `wordpress-theme/oubei/inc/importer.php`
- Create: `wordpress-theme/oubei/tests/importer.php`
- Modify: `wordpress-theme/oubei/functions.php`

**Interfaces:**
- Produces sanitized JSON schema `{ version, settings, categories, products, mediaSlots, resources }`.
- Produces `oubei_import_production_content(array $payload): array{created:int,updated:int,skipped:int,errors:string[]}`.

- [ ] **Step 1: Write failing importer test**

```php
<?php
$payload = json_decode(file_get_contents(get_theme_file_path('import/production-content.json')), true);
$first = oubei_import_production_content($payload);
$second = oubei_import_production_content($payload);
oubei_assert(count(get_posts(['post_type' => 'oubei_product', 'numberposts' => -1, 'post_status' => 'any'])) === 4, 'exactly four products expected');
oubei_assert(count(get_terms(['taxonomy' => 'oubei_product_category', 'hide_empty' => false])) === 4, 'exactly four categories expected');
oubei_assert($second['created'] === 0, 'second import must be idempotent');
```

- [ ] **Step 2: Verify failure**

Run: `powershell -File scripts/test-oubei-wordpress.ps1 importer.php`

Expected: FAIL because export and importer do not exist.

- [ ] **Step 3: Export sanitized production content**

Read `..\oubei-hostinger-20260911T035743Z\data\20260911T035923Z\site.db` in read-only mode through the existing `better-sqlite3` dependency. Export the four categories, four products, product-image defaults, 48 media slots, public settings, and existing resource data. Explicitly exclude `admin_users`, `admin_sessions`, environment values, password hashes, and session tokens.

- [ ] **Step 4: Implement importer and backend import screen**

Match terms and posts by slug, sideload editable images into the media library, update instead of duplicate, record import version, and show a dry summary plus nonce/capability-protected import action under Tools. Copy immutable visual assets into the theme assets tree.

- [ ] **Step 5: Run export and repeat import verification**

Run:

```powershell
node scripts/export-oubei-production-content.mjs
powershell -File scripts/test-oubei-wordpress.ps1 importer.php
powershell -File scripts/test-oubei-wordpress.ps1 importer.php
```

Expected: four products/four categories after both runs; second run creates zero records.

- [ ] **Step 6: Commit**

```bash
git add scripts/export-oubei-production-content.mjs wordpress-theme/oubei/import wordpress-theme/oubei/inc/importer.php wordpress-theme/oubei/tests/importer.php wordpress-theme/oubei/assets
git commit -m "feat: import production Oubei catalog data"
```

### Task 5: Site Settings and the 48 Media Slots

**Files:**
- Create: `wordpress-theme/oubei/inc/settings.php`
- Create: `wordpress-theme/oubei/inc/media-slots.php`
- Create: `wordpress-theme/oubei/assets/src/admin-media.js`
- Create: `wordpress-theme/oubei/tests/settings-media.php`
- Modify: `wordpress-theme/oubei/functions.php`

**Interfaces:**
- Produces `oubei_get_setting(string $key, string $fallback = ''): string`.
- Produces `oubei_get_media_slot(string $key): array{url:string,alt:string,is_default:bool}` and `oubei_media_slot_registry(): array` containing exactly 48 keyed entries.

- [ ] **Step 1: Write failing settings/media assertions**

```php
<?php
oubei_assert(count(oubei_media_slot_registry()) === 48, '48 media slots required');
update_option('oubei_site_settings', ['contact_email' => 'sales@example.com']);
oubei_assert(oubei_get_setting('contact_email') === 'sales@example.com', 'setting override missing');
$slot = oubei_get_media_slot('home.factory.workshop');
oubei_assert(str_starts_with($slot['url'], 'http') || str_starts_with($slot['url'], '/'), 'slot URL missing');
```

- [ ] **Step 2: Verify failure**

Run: `powershell -File scripts/test-oubei-wordpress.ps1 settings-media.php`

Expected: FAIL because helpers do not exist.

- [ ] **Step 3: Implement settings and media-slot screens**

Add Oubei admin pages for website identity, contact details, inquiry notification address, six social URLs, and grouped media slots. Use WordPress media selection, show default/override previews, and provide a nonce-protected “Restore default” action per slot.

- [ ] **Step 4: Verify persistence and fallback**

Run: `powershell -File scripts/test-oubei-wordpress.ps1 settings-media.php`

Expected: PASS, including exact registry count and fallback URL behavior.

- [ ] **Step 5: Commit**

```bash
git add wordpress-theme/oubei/inc wordpress-theme/oubei/assets/src/admin-media.js wordpress-theme/oubei/tests wordpress-theme/oubei/functions.php
git commit -m "feat: add editable site settings and media slots"
```

### Task 6: Home Page and Five-Ring Hero

**Files:**
- Create: `wordpress-theme/oubei/front-page.php`
- Create: `wordpress-theme/oubei/assets/src/hero.js`
- Create: `wordpress-theme/oubei/tests/home-page.php`
- Modify: `wordpress-theme/oubei/package.json`
- Modify: `wordpress-theme/oubei/assets/src/theme.css`

**Interfaces:**
- Consumes site settings/media-slot helpers from Task 5.
- Produces compiled `assets/dist/hero.js` with exactly five animated torus meshes and no external asset request.

- [ ] **Step 1: Write failing homepage assertions**

```php
<?php
$html = wp_remote_retrieve_body(wp_remote_get(home_url('/')));
oubei_assert(substr_count($html, 'data-oubei-ring') === 5, 'five ring descriptors required');
oubei_assert(!str_contains($html, '.glb'), 'GLB references are forbidden');
oubei_assert(!str_contains($html, 'hero-products/1.png') && !str_contains($html, 'hero-products/2.png'), 'product overlays are forbidden');
```

- [ ] **Step 2: Verify failure**

Run: `powershell -File scripts/test-oubei-wordpress.ps1 home-page.php`

Expected: FAIL because the homepage template and Hero are absent.

- [ ] **Step 3: Port homepage structure and dynamic content**

Translate the current Hero copy/CTAs, trust strip, material showcase, factory capability, property comparison, insights, and final CTA. Resolve registered images through `oubei_get_media_slot()`.

- [ ] **Step 4: Port and bundle the five-ring animation**

Create five configuration nodes rendered as `data-oubei-ring` descriptors and instantiate five Three.js torus meshes from them. Preserve reduced-motion behavior, resize handling, lighting, cleanup, spacing, current enlarged gold/purple rings, and right-shifted composition. Bundle Three.js locally through the theme build.

- [ ] **Step 5: Build and verify**

Run:

```powershell
npm --prefix wordpress-theme/oubei run build
powershell -File scripts/test-oubei-wordpress.ps1 home-page.php
```

Expected: PASS with five rings and zero GLB/product-overlay references.

- [ ] **Step 6: Commit**

```bash
git add wordpress-theme/oubei/front-page.php wordpress-theme/oubei/assets wordpress-theme/oubei/package.json wordpress-theme/oubei/tests/home-page.php
git commit -m "feat: port Oubei homepage and animated hero"
```

### Task 7: Dynamic Product Catalog, Filters, and Detail Pages

**Files:**
- Create: `wordpress-theme/oubei/archive-oubei_product.php`
- Create: `wordpress-theme/oubei/single-oubei_product.php`
- Create: `wordpress-theme/oubei/template-parts/product-card.php`
- Create: `wordpress-theme/oubei/assets/src/catalog.js`
- Create: `wordpress-theme/oubei/tests/product-routes.php`
- Modify: `wordpress-theme/oubei/inc/products.php`
- Modify: `wordpress-theme/oubei/assets/src/theme.css`

**Interfaces:**
- Produces `/products` and `/products/{slug}` views driven entirely by published WordPress products.
- Produces query filters `product_category`, `material`, and search without hardcoded product arrays.

- [ ] **Step 1: Write failing dynamic-route test**

```php
<?php
$id = wp_insert_post(['post_type' => 'oubei_product', 'post_title' => 'Future Dynamic Seal', 'post_name' => 'future-dynamic-seal', 'post_status' => 'publish']);
update_post_meta($id, '_oubei_code', 'FDS-1');
flush_rewrite_rules(false);
$archive = wp_remote_retrieve_body(wp_remote_get(home_url('/products')));
$detail = wp_remote_get(home_url('/products/future-dynamic-seal'));
oubei_assert(str_contains($archive, 'Future Dynamic Seal'), 'new product missing from archive');
oubei_assert(wp_remote_retrieve_response_code($detail) === 200, 'dynamic detail route missing');
wp_delete_post($id, true);
```

- [ ] **Step 2: Verify failure**

Run: `powershell -File scripts/test-oubei-wordpress.ps1 product-routes.php`

Expected: FAIL on archive or detail output.

- [ ] **Step 3: Implement archive and detail templates**

Port the responsive cards, filters, pagination, product code, category, materials, applications, specifications, gallery, inquiry CTA, and related products. All queries must use published `oubei_product` posts and the registered taxonomy/meta fields.

- [ ] **Step 4: Verify dynamic behavior**

Run: `powershell -File scripts/test-oubei-wordpress.ps1 product-routes.php`

Expected: newly inserted product appears without theme code changes, detail returns 200, and cleanup removes it.

- [ ] **Step 5: Commit**

```bash
git add wordpress-theme/oubei/archive-oubei_product.php wordpress-theme/oubei/single-oubei_product.php wordpress-theme/oubei/template-parts wordpress-theme/oubei/assets wordpress-theme/oubei/inc/products.php wordpress-theme/oubei/tests/product-routes.php
git commit -m "feat: add dynamic WordPress product catalog"
```

### Task 8: Preserved Static Routes and Technical Resources

**Files:**
- Create: `wordpress-theme/oubei/page-materials.php`
- Create: `wordpress-theme/oubei/page-about.php`
- Create: `wordpress-theme/oubei/page-custom.php`
- Create: `wordpress-theme/oubei/archive-oubei_resource.php`
- Create: `wordpress-theme/oubei/single-oubei_resource.php`
- Create: `wordpress-theme/oubei/page-faq.php`
- Create: `wordpress-theme/oubei/page-privacy.php`
- Create: `wordpress-theme/oubei/page-terms.php`
- Create: `wordpress-theme/oubei/inc/pages.php`
- Create: `wordpress-theme/oubei/tests/preserved-routes.php`
- Modify: `wordpress-theme/oubei/functions.php`

**Interfaces:**
- Produces the exact public routes listed in Global Constraints and idempotent `oubei_ensure_core_pages(): void`.
- Consumes settings/media helpers and imported resources.

- [ ] **Step 1: Write failing route matrix test**

```php
<?php
foreach (['/materials','/about','/custom','/resources','/faq','/privacy','/terms'] as $path) {
    $response = wp_remote_get(home_url($path));
    oubei_assert(wp_remote_retrieve_response_code($response) === 200, "$path must return 200");
}
```

- [ ] **Step 2: Verify failure**

Run: `powershell -File scripts/test-oubei-wordpress.ps1 preserved-routes.php`

Expected: at least one required route fails.

- [ ] **Step 3: Create core pages and port templates**

Create pages by stable slug only when missing. Port current copy, sections, tables, FAQs, resources, images, breadcrumbs, and CTAs; resolve page images through the fixed media slots. Existing resource records use `oubei_resource` and `/resources/{slug}`.

- [ ] **Step 4: Verify routes**

Run: `powershell -File scripts/test-oubei-wordpress.ps1 preserved-routes.php`

Expected: every path returns 200.

- [ ] **Step 5: Commit**

```bash
git add wordpress-theme/oubei/page-*.php wordpress-theme/oubei/archive-oubei_resource.php wordpress-theme/oubei/single-oubei_resource.php wordpress-theme/oubei/inc/pages.php wordpress-theme/oubei/tests/preserved-routes.php wordpress-theme/oubei/functions.php
git commit -m "feat: preserve Oubei public routes and resources"
```

### Task 9: Native Blog List, Articles, and Editorial SEO Fields

**Files:**
- Create: `wordpress-theme/oubei/home.php`
- Create: `wordpress-theme/oubei/single.php`
- Create: `wordpress-theme/oubei/template-parts/post-card.php`
- Create: `wordpress-theme/oubei/inc/post-seo-fields.php`
- Create: `wordpress-theme/oubei/tests/blog.php`
- Modify: `wordpress-theme/oubei/functions.php`

**Interfaces:**
- Produces `/blog` and `/blog/{slug}` using native WordPress posts.
- Meta keys: `_oubei_seo_title`, `_oubei_seo_description`.

- [ ] **Step 1: Write failing blog test**

```php
<?php
$id = wp_insert_post(['post_type' => 'post', 'post_title' => 'WordPress Editing Test', 'post_name' => 'wordpress-editing-test', 'post_status' => 'publish', 'post_excerpt' => 'Editorial excerpt']);
$list = wp_remote_retrieve_body(wp_remote_get(home_url('/blog')));
$detail = wp_remote_get(home_url('/blog/wordpress-editing-test'));
oubei_assert(str_contains($list, 'WordPress Editing Test'), 'post missing from blog list');
oubei_assert(wp_remote_retrieve_response_code($detail) === 200, 'post detail missing');
wp_delete_post($id, true);
```

- [ ] **Step 2: Verify failure**

Run: `powershell -File scripts/test-oubei-wordpress.ps1 blog.php`

Expected: FAIL until blog templates and rewrites are active.

- [ ] **Step 3: Implement blog templates and SEO fields**

Add responsive list/pagination, featured images, category/tag metadata, excerpts, article body, related posts, and native editing support. Add nonce-protected SEO title/description fields without replacing WordPress core content editing.

- [ ] **Step 4: Verify dynamic post publishing**

Run: `powershell -File scripts/test-oubei-wordpress.ps1 blog.php`

Expected: temporary post appears at both routes and is removed afterward.

- [ ] **Step 5: Commit**

```bash
git add wordpress-theme/oubei/home.php wordpress-theme/oubei/single.php wordpress-theme/oubei/template-parts/post-card.php wordpress-theme/oubei/inc/post-seo-fields.php wordpress-theme/oubei/tests/blog.php wordpress-theme/oubei/functions.php
git commit -m "feat: add native Oubei blog"
```

### Task 10: Persistent Inquiry Records and Email Notification

**Files:**
- Create: `wordpress-theme/oubei/inc/inquiries.php`
- Create: `wordpress-theme/oubei/page-quote.php`
- Create: `wordpress-theme/oubei/assets/src/inquiry.js`
- Create: `wordpress-theme/oubei/tests/inquiries.php`
- Modify: `wordpress-theme/oubei/functions.php`

**Interfaces:**
- Produces private `oubei_inquiry` CPT and `oubei_handle_inquiry(array $input, array $context): array{success:bool,inquiry_id:int,error:string,mail_sent:bool}`.
- Inquiry meta keys: `_oubei_company`, `_oubei_email`, `_oubei_phone`, `_oubei_country`, `_oubei_product_id`, `_oubei_message`, `_oubei_status`, `_oubei_mail_status`, `_oubei_mail_error`.

- [ ] **Step 1: Write failing persistence-before-mail test**

```php
<?php
add_filter('pre_wp_mail', static fn() => false);
$result = oubei_handle_inquiry([
  'name' => 'Test Buyer', 'company' => 'Buyer Co', 'email' => 'buyer@example.com',
  'phone' => '+1 555 0100', 'country' => 'US', 'product_id' => 0, 'message' => 'Need a quotation', 'website' => ''
], ['ip' => '127.0.0.50', 'nonce_valid' => true]);
oubei_assert($result['inquiry_id'] > 0, 'inquiry must persist');
oubei_assert($result['mail_sent'] === false, 'forced mail failure expected');
oubei_assert(get_post_status($result['inquiry_id']) === 'private', 'inquiry must remain private');
wp_delete_post($result['inquiry_id'], true);
```

- [ ] **Step 2: Verify failure**

Run: `powershell -File scripts/test-oubei-wordpress.ps1 inquiries.php`

Expected: FAIL because the handler is undefined.

- [ ] **Step 3: Implement inquiry domain and backend screen**

Validate nonce, honeypot, required fields, email, message length, and IP/email rate limit. Insert a private inquiry before calling `wp_mail()`. Record mail success/failure, show administrator columns and status controls, and add a nonce/capability-protected retry action.

- [ ] **Step 4: Implement public inquiry form**

Port `/quote`, provide product preselection, accessible validation, pending/success/error states, and progressive enhancement through WordPress AJAX or REST with nonce validation. Public errors remain generic while delivery diagnostics remain administrator-only.

- [ ] **Step 5: Verify failure fallback and successful persistence**

Run: `powershell -File scripts/test-oubei-wordpress.ps1 inquiries.php`

Expected: PASS; simulated mail failure preserves the private record.

- [ ] **Step 6: Commit**

```bash
git add wordpress-theme/oubei/inc/inquiries.php wordpress-theme/oubei/page-quote.php wordpress-theme/oubei/assets/src/inquiry.js wordpress-theme/oubei/tests/inquiries.php wordpress-theme/oubei/functions.php
git commit -m "feat: add persistent B2B inquiry workflow"
```

### Task 11: Canonical URLs, Metadata, Redirects, and Sitemaps

**Files:**
- Create: `wordpress-theme/oubei/inc/seo.php`
- Create: `wordpress-theme/oubei/inc/redirects.php`
- Create: `wordpress-theme/oubei/tests/seo-routes.php`
- Modify: `wordpress-theme/oubei/functions.php`

**Interfaces:**
- Produces `oubei_get_canonical_url(): string`, product/article JSON-LD, Open Graph metadata, and legacy redirect map.
- Extends WordPress sitemap providers with published products and resources; native posts remain in core post sitemap.

- [ ] **Step 1: Write failing SEO route assertions**

```php
<?php
$product = get_page_by_path('o-rings', OBJECT, 'oubei_product');
oubei_assert($product instanceof WP_Post, 'seed product missing');
$html = wp_remote_retrieve_body(wp_remote_get(get_permalink($product)));
oubei_assert(substr_count($html, 'rel="canonical"') === 1, 'exactly one canonical required');
oubei_assert(str_contains($html, 'application/ld+json'), 'product structured data missing');
$sitemap = wp_remote_retrieve_body(wp_remote_get(home_url('/wp-sitemap.xml')));
oubei_assert(str_contains($sitemap, 'oubei_product'), 'product sitemap missing');
```

- [ ] **Step 2: Verify failure**

Run: `powershell -File scripts/test-oubei-wordpress.ps1 seo-routes.php`

Expected: FAIL on canonical, structured data, or product sitemap.

- [ ] **Step 3: Implement metadata and redirects**

Preserve the production title/description rules and canonical route structure. Emit one canonical, Open Graph tags, product/article schema, safe robots directives, and 301 redirects for the existing compatibility URLs documented by the Next.js SEO module. Do not duplicate WordPress core canonical output.

- [ ] **Step 4: Verify SEO output**

Run: `powershell -File scripts/test-oubei-wordpress.ps1 seo-routes.php`

Expected: PASS with product and blog sitemap coverage.

- [ ] **Step 5: Commit**

```bash
git add wordpress-theme/oubei/inc/seo.php wordpress-theme/oubei/inc/redirects.php wordpress-theme/oubei/tests/seo-routes.php wordpress-theme/oubei/functions.php
git commit -m "feat: preserve Oubei SEO and canonical routes"
```

### Task 12: Full Visual QA, Packaging, and VPS Documentation

**Files:**
- Create: `scripts/package-oubei-theme.ps1`
- Create: `wordpress-theme/README.md`
- Create: `wordpress-theme/oubei/tests/full-smoke.php`
- Create: `wordpress-theme/oubei/screenshot.png`
- Modify: `README.md`

**Interfaces:**
- Produces `dist/oubei-theme.zip` containing only deployable theme files.
- Documents local startup, content import, SMTP configuration, VPS install, permalinks, ownership, backup, restore, and rollback.

- [ ] **Step 1: Write failing package/smoke checks**

```php
<?php
foreach (['/','/products','/products/o-rings','/materials','/about','/custom','/resources','/faq','/quote','/privacy','/terms','/blog'] as $path) {
    $response = wp_remote_get(home_url($path));
    oubei_assert(wp_remote_retrieve_response_code($response) === 200, "$path failed");
}
oubei_assert(count(get_posts(['post_type' => 'oubei_product', 'post_status' => 'publish', 'numberposts' => -1])) >= 4, 'catalog import missing');
```

- [ ] **Step 2: Run complete automated verification**

Run:

```powershell
powershell -File scripts/test-oubei-wordpress.ps1 full-smoke.php
Get-ChildItem wordpress-theme\oubei -Recurse -Filter *.php | ForEach-Object { C:\xampp\php\php.exe -l $_.FullName }
npm --prefix wordpress-theme/oubei run build
```

Expected: route smoke may expose remaining integration defects; PHP lint and asset build must be clean before continuing.

- [ ] **Step 3: Fix integration defects through focused failing regressions**

For each defect found in Step 2, add the smallest reproducing assertion to the owning test file, verify it fails, make the scoped fix, and rerun that test plus `full-smoke.php`.

- [ ] **Step 4: Run Browser visual and interaction QA**

At desktop and 390px mobile widths verify: homepage/Hero, mobile navigation, product filters, a dynamically created product and detail page, media override/restoration, article publish/list/detail, inquiry submission with stored record, 404, and absence of console/framework errors. Compare critical sections against the production reference and record only intentional deviations.

- [ ] **Step 5: Package and inspect theme ZIP**

Implement `scripts/package-oubei-theme.ps1` to run the production asset build, exclude `node_modules`, source maps, tests, import-only development data, and local configuration, then produce `dist/oubei-theme.zip`. List the ZIP and verify it contains `oubei/style.css`, `oubei/functions.php`, templates, compiled assets, and bundled default images.

- [ ] **Step 6: Write deployment and operations documentation**

Document database creation, theme upload/activation, importer use, rewrite flush, SMTP plugin/provider configuration, writable uploads, HTTPS/canonical domain update, database/uploads backup, restore order, rollback to the prior site, and post-deployment route checks.

- [ ] **Step 7: Final verification and commit**

Run:

```powershell
powershell -File scripts/test-oubei-wordpress.ps1 full-smoke.php
powershell -File scripts/package-oubei-theme.ps1
git diff --check
git status --short --branch
```

Expected: all checks pass, theme ZIP exists, and only intentional files remain.

```bash
git add scripts/package-oubei-theme.ps1 wordpress-theme README.md
git commit -m "docs: package and document Oubei WordPress deployment"
```
