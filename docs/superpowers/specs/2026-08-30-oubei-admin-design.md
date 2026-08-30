# Oubei Admin CMS Design

## Status

Approved design for implementation.

## Goal

Add a single-super-admin backend to the existing Oubei Next.js website. The backend must manage product categories, products and product detail galleries, customer-service contact details, company logo, website name, social links, and every registered page image slot. It must persist data in SQLite and uploaded media in a VPS-local directory so the site survives restarts and can run beside other website instances on the same VPS.

## Confirmed Scope

- Stack: Next.js built-in Route Handlers and server components, SQLite, VPS-local media files.
- One administrator only. No registration, multi-user roles, or permissions UI.
- Initial credentials come from environment variables. The administrator can change the password after login.
- Product creation includes a generated public detail route, product metadata, and multiple detail images.
- The first release manages the requested structured data and images. Existing page copy, headings, button labels, and article text remain code-owned.
- Existing built-in assets remain safe defaults. Removing an override restores the default asset instead of breaking a page.

## Architecture

The application remains a single Next.js deployment. Server-side content access is centralized in a `site-content` module that reads SQLite overrides and merges them with typed code defaults. Admin Route Handlers use the same domain/data modules as the frontend. Admin pages live under `/admin` and are protected by a server-side session check.

The instance-specific persistent root is configured with `OUBEI_DATA_DIR` (for example `/var/lib/oubei`). The database is `${OUBEI_DATA_DIR}/site.db`; uploaded files are `${OUBEI_DATA_DIR}/media/`. No runtime write is made to the checked-in `public` directory.

## Data Model

### `admin_users`

- `id` (integer primary key)
- `username` (unique text)
- `password_hash` (text; Node `scrypt` output with per-user salt)
- `created_at`, `updated_at`

There is exactly one row. Startup creates it from `ADMIN_INITIAL_USERNAME` and `ADMIN_INITIAL_PASSWORD` only when no administrator exists.

### `admin_sessions`

- `id` (integer primary key)
- `user_id` (foreign key)
- `token_hash` (unique text)
- `created_at`, `expires_at`, `revoked_at`

The browser receives only a random opaque token in an HttpOnly cookie. The database stores a SHA-256 hash of that token. Password change revokes every active session.

### `site_settings`

- `key` (unique text)
- `value` (text)
- `updated_at`

Seeded keys include `site_name`, `logo_path`, `contact_name`, `contact_short_name`, `contact_address`, `contact_phone`, `contact_email`, `contact_hours`, and social URLs (`social_facebook`, `social_linkedin`, `social_youtube`, `social_instagram`, `social_tiktok`, `social_whatsapp`). Empty social URLs are allowed and are not rendered publicly.

### `categories`

- `id` (integer primary key)
- `name`, `slug` (unique), `description`
- `sort_order` (integer)
- `is_active` (integer boolean)
- `created_at`, `updated_at`

Deleting a category that is referenced by a product returns a conflict. Deactivation hides it from public selectors while preserving existing products.

### `products`

- `id` (integer primary key)
- `slug` (unique), `name`, `code`, `category_id`
- `short_description`, `description`, `material`
- `applications_json`, `specs_json`
- `is_active` (integer boolean)
- `created_at`, `updated_at`

The public `/products/[slug]` route is dynamic so newly-created products are visible without a rebuild. Product deletion cascades its image records and removes unreferenced uploaded files.

### `product_images`

- `id` (integer primary key)
- `product_id` (foreign key)
- `media_file_id` (nullable foreign key)
- `default_path` (nullable text)
- `alt`, `sort_order`

Product galleries may contain uploaded files or checked-in default paths. Uploaded files are never stored as data URLs.

### `media_slots`

- `id` (integer primary key)
- `slot_key` (unique text)
- `page_key`, `label`, `alt`
- `default_path` (text)
- `media_file_id` (nullable foreign key)
- `updated_at`

The seed registry covers every image currently rendered by the homepage, products, product detail, materials, about, custom, resources, FAQ, quote, terms, and privacy surfaces, including hero product assets, factory photos, certificates, galleries, and resource images. Each route consumes a slot by key rather than embedding a mutable upload path.

### `media_files`

- `id` (integer primary key)
- `storage_name` (random basename), `original_name`
- `mime_type`, `size_bytes`, `relative_path`
- `created_at`

Only referenced files are served. A cleanup query removes files with no reference from `media_slots` or `product_images`.

### `schema_migrations`

Stores applied migration versions. Migrations are idempotent and run at application startup before reads.

## Authentication and Security

- Password hashing uses Node's built-in `crypto.scrypt` with a random salt and constant-time verification.
- Session tokens are generated with `crypto.randomBytes`; only their SHA-256 hashes are stored.
- Cookie flags: `HttpOnly`, `SameSite=Lax`, `Path=/`; `Secure` is enabled when production HTTPS is configured.
- All admin API writes and admin page loads require a non-expired, non-revoked session.
- Login attempts are rate-limited in memory per IP and username for the single-process deployment; failures return a generic message.
- Mutating requests validate the Origin/Host boundary and content types. JSON bodies are schema-validated before database writes.
- Uploads allow JPEG, PNG, WebP, GIF, and SVG only when explicitly enabled by the validator; default maximum is 10 MB per file. Storage names are generated, never derived from user input.
- No secrets, passwords, or session tokens are logged.

## Admin Surface

- `/admin/login`: username/password login and clear error state.
- `/admin`: summary counts and recent updates.
- `/admin/categories`: list, create, edit, reorder, enable/disable, guarded delete.
- `/admin/products`: searchable list, create/edit form, category selector, metadata fields, active state, gallery upload/reorder/remove, guarded delete.
- `/admin/site`: website name, logo upload/revert, contact fields, and social URLs.
- `/admin/media`: page/slot filter, current image preview, replace upload, restore default, and uploaded-file cleanup.
- `/admin/security`: current-password verification, new-password confirmation, and revoke-all-sessions result.

The management shell is intentionally separate from public navigation and is responsive enough for a VPS operator using a laptop or tablet. Destructive actions require an explicit confirmation in the UI and a server-side referential-integrity check.

## API Contract

- `POST /api/admin/auth/login`
- `POST /api/admin/auth/logout`
- `GET /api/admin/auth/session`
- `GET|POST /api/admin/categories`
- `PATCH|DELETE /api/admin/categories/:id`
- `GET|POST /api/admin/products`
- `GET|PATCH|DELETE /api/admin/products/:id`
- `POST|DELETE /api/admin/products/:id/images`
- `GET|PATCH /api/admin/settings`
- `POST /api/admin/media/upload`
- `PATCH|DELETE /api/admin/media/:slotKey`
- `POST /api/admin/security/password`

All endpoints return JSON with a stable `{ data, error }` envelope. Validation failures use 400, unauthenticated requests use 401, forbidden/invalid origin requests use 403, missing records use 404, category conflicts use 409, and unexpected failures use 500 without leaking internals.

## Frontend Integration

The existing typed defaults remain the fallback source. A server-only content layer exposes resolved settings, categories, products, product galleries, and media slot URLs. Public routes opt into dynamic rendering or targeted revalidation after mutations. The existing client-side material showcase receives resolved server data as props; it does not open SQLite from the browser.

The product listing and product detail pages consume the database-backed product type. A product's slug is normalized and checked for uniqueness before insert/update. Existing seed products are inserted with stable slugs so current links remain valid.

## Deployment and Operations

- Add `.env.example` with `OUBEI_DATA_DIR`, `ADMIN_INITIAL_USERNAME`, `ADMIN_INITIAL_PASSWORD`, `SESSION_SECRET`, and upload limits.
- Require a unique persistent directory per site instance, with ownership granted to the Node process and permissions limited to the service user.
- Document reverse proxy setup, `npm run build`, `npm run start`, persistent-volume backup, and restore.
- Backups copy `site.db` and the `media` directory together. Restore is done with the application stopped, followed by a migration check on startup.
- Never commit `.env`, SQLite files, runtime media, or generated build output.

## Testing and Acceptance

Tests cover password hashing/verification, session expiry/revocation, migration and seed idempotence, category conflict handling, product CRUD and slug validation, media upload validation and cleanup, settings persistence, and resolved frontend fallback behavior. Browser verification covers login, each admin section's primary mutation, public product creation visibility, image replacement visibility, password change session revocation, desktop layout, and mobile layout.

Acceptance requires:

1. The single administrator can log in with the configured initial credentials and change the password.
2. Categories and products can be added, edited, activated/deactivated, and safely deleted.
3. A newly-created product appears in the public catalog and has a working detail route with its gallery.
4. Website name, logo, contact details, and social links update the public header/footer/contact surfaces.
5. Every registered page image slot can be replaced and restored without editing source code.
6. Data and media remain after a process restart and do not overlap with other sites on the same VPS.
7. Invalid uploads, unauthorized requests, broken references, and failed writes return safe errors and leave prior content intact.

## Non-Goals for First Release

- Editing arbitrary page copy or rich text.
- Multi-language content management.
- Multiple administrators, roles, audit log UI, or public user accounts.
- External object storage, CDN, or horizontal scaling.
- Replacing the existing visual design system.
