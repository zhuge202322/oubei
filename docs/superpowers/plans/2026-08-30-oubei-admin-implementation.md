# Oubei Admin CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved single-admin SQLite backend and connect its editable catalog, settings, social links, and media slots to the existing Oubei Next.js website.

**Architecture:** Keep one Next.js application. Node-runtime Route Handlers and server-only domain modules use `better-sqlite3`; an HttpOnly database-backed session protects `/admin` and `/api/admin/*`; uploaded assets live below `OUBEI_DATA_DIR/media`. Public routes resolve SQLite overrides over typed defaults and remain safe when the database or an override is missing.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, `better-sqlite3`, Node `crypto.scrypt`, Node `node:test`, existing Tailwind v4 and lucide-react.

**Spec:** `docs/superpowers/specs/2026-08-30-oubei-admin-design.md`

## Global Constraints

- One administrator only; no registration, roles, or multi-user permissions.
- SQLite is `${OUBEI_DATA_DIR}/site.db`; uploads are `${OUBEI_DATA_DIR}/media/`; never write runtime files to checked-in `public`.
- Existing page copy remains code-owned; only approved structured data and image slots become editable.
- Existing checked-in assets are defaults and must remain usable after an override is removed.
- Passwords use Node `scrypt`; sessions store hashed random tokens and are revoked on password change.
- Mutating admin requests require an authenticated session, JSON/schema validation, and same-origin protection.
- Uploads accept JPEG, PNG, WebP, GIF, and SVG only when enabled; default maximum is 10 MB; filenames are random.
- No `.env`, SQLite files, runtime media, `.next`, logs, or generated output may be committed.

---

### Task 1: Runtime, Dependencies, and Test Harness

**Files:**
- Modify: `package.json`, `package-lock.json`, `.gitignore`
- Create: `src/lib/server/config.ts`, `src/lib/server/test-helpers.ts`, `tests/smoke.test.ts`

**Interfaces:**
- Produces `getRuntimeConfig(): { dataDir: string; databasePath: string; mediaDir: string; sessionSecret: string; initialUsername: string; initialPassword: string; maxUploadBytes: number }`.
- Produces test command `node --test --import tsx tests/**/*.test.ts` and a `test` npm script.

- [ ] **Step 1: Write the failing test**

Create `tests/smoke.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { getRuntimeConfig } from "@/lib/server/config";

test("runtime config keeps database and media under the configured data directory", () => {
  const config = getRuntimeConfig({
    OUBEI_DATA_DIR: "/tmp/oubei-test",
    ADMIN_INITIAL_USERNAME: "admin",
    ADMIN_INITIAL_PASSWORD: "change-me-now",
    SESSION_SECRET: "a-secret-at-least-32-characters-long",
  });
  assert.equal(config.databasePath, "/tmp/oubei-test/site.db");
  assert.equal(config.mediaDir, "/tmp/oubei-test/media");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- --test-name-pattern="runtime config"`
Expected: FAIL because `@/lib/server/config` and the `test` script do not exist.

- [ ] **Step 3: Add dependencies and minimal config implementation**

Install `better-sqlite3`, `@types/better-sqlite3`, and `tsx`. Add `test` to `package.json` as `node --test --import tsx tests/**/*.test.ts`. Implement `getRuntimeConfig(overrides = process.env)` with production validation: throw when `SESSION_SECRET` is missing or shorter than 32 characters; default `OUBEI_DATA_DIR` to `.oubei-data` and `MAX_UPLOAD_BYTES` to `10485760`.

- [ ] **Step 4: Run the test and existing checks**

Run: `npm test -- --test-name-pattern="runtime config"`, `npm run lint`, `npm run build`.
Expected: the smoke test passes and lint/build exit 0.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json .gitignore src/lib/server/config.ts src/lib/server/test-helpers.ts tests/smoke.test.ts
git commit -m "chore: add backend runtime and test harness"
```

### Task 2: SQLite Schema, Migrations, Seed Data, and Content Resolver

**Files:**
- Create: `src/lib/server/db.ts`, `src/lib/server/migrations.ts`, `src/lib/server/seed.ts`, `src/lib/server/content.ts`
- Create: `tests/db.test.ts`, `tests/content.test.ts`
- Modify: `src/lib/site-data.ts` only to export default image-slot metadata without changing existing values

**Interfaces:**
- Produces `openDatabase(path?: string): Database`, `migrateDatabase(db): void`, and `seedDatabase(db): void`.
- Produces `getResolvedSiteContent(db): Promise<ResolvedSiteContent>` and `getResolvedProductBySlug(db, slug): Promise<ResolvedProduct | null>`.
- `ResolvedSiteContent` includes `settings`, `categories`, `products`, and `mediaSlots`; every field has a typed fallback from `site-data.ts`.

- [ ] **Step 1: Write failing tests**

`tests/db.test.ts` must assert that a fresh temporary database creates all required tables, migration is idempotent, seed inserts the four existing categories/products/settings, and a second seed does not duplicate rows. `tests/content.test.ts` must assert that an empty database returns the existing default product and that a `site_settings.site_name` override is returned in preference to the default.

Example assertion:

```ts
test("seed is idempotent and preserves stable product slugs", () => {
  const db = createTestDatabase();
  migrateDatabase(db);
  seedDatabase(db);
  seedDatabase(db);
  assert.equal(db.prepare("select count(*) as count from products").get().count, 4);
  assert.equal(db.prepare("select slug from products where slug = 'o-rings'").get()?.slug, "o-rings");
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/db.test.ts tests/content.test.ts`
Expected: FAIL because database modules and tables do not exist.

- [ ] **Step 3: Implement schema and seed**

Create migrations for `admin_users`, `admin_sessions`, `site_settings`, `categories`, `products`, `product_images`, `media_slots`, `media_files`, and `schema_migrations`, with foreign keys enabled and timestamps stored as ISO text. Seed settings from `companyContact`, seed products/materials from current typed defaults, and create a complete media-slot registry for every image path currently referenced by all public routes, including both hero GLBs/PNGs and product-detail galleries.

- [ ] **Step 4: Implement content resolution**

Read database rows and merge only non-empty overrides. Resolve media URLs through a helper that returns an uploaded `/media/<storage_name>` URL when referenced, otherwise the slot's `default_path`. Keep this module server-only and never import it into client components.

- [ ] **Step 5: Run tests and checks**

Run: `npm test -- tests/db.test.ts tests/content.test.ts`, `npm run lint`.
Expected: all database/content tests pass with no duplicate seed rows.

- [ ] **Step 6: Commit**

```bash
git add src/lib/server/db.ts src/lib/server/migrations.ts src/lib/server/seed.ts src/lib/server/content.ts src/lib/site-data.ts tests/db.test.ts tests/content.test.ts
git commit -m "feat: add sqlite schema and resolved site content"
```

### Task 3: Password Hashing, Sessions, and Admin API Guards

**Files:**
- Create: `src/lib/server/auth.ts`, `src/lib/server/admin-api.ts`
- Create: `src/app/api/admin/auth/login/route.ts`, `src/app/api/admin/auth/logout/route.ts`, `src/app/api/admin/auth/session/route.ts`
- Create: `tests/auth.test.ts`, `tests/admin-api.test.ts`

**Interfaces:**
- Produces `hashPassword(password): Promise<string>`, `verifyPassword(password, encodedHash): Promise<boolean>`.
- Produces `createSession(db, userId): string`, `getSessionUser(request, db): AdminUser | null`, `revokeSession(db, token): void`, and `revokeAllSessions(db, userId): void`.
- Produces `requireAdmin(request): Promise<{ db: Database; user: AdminUser }>` for Route Handlers.

- [ ] **Step 1: Write failing tests**

Test password round-trip and wrong-password rejection; test that an expired or revoked token returns `null`; test that `requireAdmin` returns a 401 response without a session and a user with a valid HttpOnly cookie. Add a login-route test that valid credentials set `oubei_admin_session` and invalid credentials return the same generic error.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/auth.test.ts tests/admin-api.test.ts`
Expected: FAIL because auth and route modules do not exist.

- [ ] **Step 3: Implement auth**

Use `crypto.scrypt` with a random 16-byte salt and encoded `scrypt$N$r$p$salt$hash` format; compare with `timingSafeEqual`. Use 32-byte random session tokens, store only SHA-256 hashes, expire after 7 days, and set cookie flags from the spec. Initialize the first admin from runtime config only when `admin_users` is empty.

- [ ] **Step 4: Implement auth routes and guards**

Use Node runtime Route Handlers. Parse JSON bodies, reject cross-origin mutating requests, return `{ data, error }`, and never include password hashes or tokens in responses. Add an in-memory failed-login counter keyed by IP and username with a five-minute window.

- [ ] **Step 5: Run tests and checks**

Run: `npm test -- tests/auth.test.ts tests/admin-api.test.ts`, `npm run lint`, `npm run build`.
Expected: all auth tests pass and the build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/lib/server/auth.ts src/lib/server/admin-api.ts src/app/api/admin/auth tests/auth.test.ts tests/admin-api.test.ts
git commit -m "feat: add single-admin authentication"
```

### Task 4: Media Storage, Upload Validation, and Image Slot APIs

**Files:**
- Create: `src/lib/server/media.ts`, `src/app/api/media/[storageName]/route.ts`, `src/app/api/admin/media/upload/route.ts`, `src/app/api/admin/media/[slotKey]/route.ts`
- Create: `tests/media.test.ts`

**Interfaces:**
- Produces `validateUpload(file, maxBytes): ValidatedUpload`, `saveUpload(upload, mediaDir): MediaFile`, `deleteUnreferencedMedia(db, mediaDir): number`, and `resolveSlotUrl(slot): string`.
- Produces authenticated slot operations: upload/replace, restore default, and delete override.

- [ ] **Step 1: Write failing tests**

Test acceptance of JPEG/PNG/WebP under 10 MB; rejection of executable MIME types, mismatched extensions, and oversized files; random storage names; replacement of a slot without changing its default path; and deletion of an unreferenced file while preserving referenced files.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/media.test.ts`
Expected: FAIL because media helpers and routes do not exist.

- [ ] **Step 3: Implement safe file handling**

Write multipart uploads to a temporary file below `mediaDir`, validate MIME/extension and byte size before renaming to a random basename, and store metadata in `media_files`. Reject path separators and user-provided storage names. Serve only database-known media files from the public media Route Handler with the stored content type.

- [ ] **Step 4: Implement slot routes**

Require admin sessions, update `media_slots.media_file_id` transactionally, restore by setting it to `NULL`, and run cleanup after replacement/deletion. Return the resolved URL and slot metadata in the response.

- [ ] **Step 5: Run tests and checks**

Run: `npm test -- tests/media.test.ts`, `npm run lint`, `npm run build`.
Expected: all media tests pass and the build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/lib/server/media.ts src/app/api/media src/app/api/admin/media tests/media.test.ts
git commit -m "feat: add local media storage and slot APIs"
```

### Task 5: Admin Shell, Login, and Navigation

**Files:**
- Create: `src/app/admin/layout.tsx`, `src/app/admin/page.tsx`, `src/app/admin/login/page.tsx`, `src/app/admin/admin-client.tsx`
- Create: `src/components/admin/AdminShell.tsx`, `src/components/admin/AdminTable.tsx`, `src/components/admin/AdminForm.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces a protected responsive admin shell with navigation to `/admin/categories`, `/admin/products`, `/admin/site`, `/admin/media`, and `/admin/security`.
- Login page consumes the auth routes and redirects to `/admin` on success.

- [ ] **Step 1: Write failing browser checks**

Define browser assertions: unauthenticated `/admin` redirects to `/admin/login`; valid login displays the dashboard shell; logout returns to login; mobile width keeps navigation usable. Use the Browser/IAB workflow after implementation because this repository has no component test runner.

- [ ] **Step 2: Implement server protection and client login**

The admin layout calls `getSessionUser`; unauthenticated requests redirect before rendering. The login form posts JSON to the login route, displays a generic error, and uses accessible labels. Keep admin-only client state in leaf components so the rest of the shell remains server-rendered.

- [ ] **Step 3: Implement dashboard shell**

Show product/category/media counts from a server query, active navigation state, logout control, and a clear link to the public site. Use existing colors and compact square geometry; do not add admin links to the public header.

- [ ] **Step 4: Run checks**

Run: `npm run lint`, `npm run build`, then Browser/IAB assertions for redirect/login/logout at desktop and 390px widths.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin src/components/admin src/app/globals.css
git commit -m "feat: add protected admin shell and login"
```

### Task 6: CRUD Screens and APIs for Categories, Products, Settings, and Security

**Files:**
- Create: `src/app/api/admin/categories/route.ts`, `src/app/api/admin/categories/[id]/route.ts`
- Create: `src/app/api/admin/products/route.ts`, `src/app/api/admin/products/[id]/route.ts`, `src/app/api/admin/products/[id]/images/route.ts`
- Create: `src/app/api/admin/settings/route.ts`, `src/app/api/admin/security/password/route.ts`
- Create: `src/app/admin/categories/page.tsx`, `src/app/admin/products/page.tsx`, `src/app/admin/site/page.tsx`, `src/app/admin/media/page.tsx`, `src/app/admin/security/page.tsx`
- Create: `tests/admin-crud.test.ts`

**Interfaces:**
- CRUD routes use `{ data, error }`, 400/401/404/409/500 status semantics, and transaction boundaries for multi-row writes.
- Product API accepts `applications: string[]`, `specs: string[]`, `categoryId`, and returns a public slug URL.

- [ ] **Step 1: Write failing tests**

Test category create/update/delete and 409 when a product references the category; product slug uniqueness and CRUD; product image ordering/removal; settings persistence; password change requiring current password and revoking sessions.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/admin-crud.test.ts`
Expected: FAIL because resource routes and admin screens do not exist.

- [ ] **Step 3: Implement APIs**

Normalize slugs with lowercase ASCII hyphens, reject duplicates, validate required product fields, and use foreign keys. Category deactivation preserves products. Product deletion cascades image records and invokes media cleanup. Settings updates whitelist the declared keys only. Password change verifies current password, writes a new scrypt hash, revokes all sessions, and returns a success status without logging out the response before it is sent.

- [ ] **Step 4: Implement admin screens**

Build focused forms for categories, products, site settings, media slots, and password security. Use explicit delete confirmation, inline validation, pending/error/success states, accessible file inputs, drag-free numeric sort fields, and public preview links. Product forms support multiple gallery uploads and remove/reorder actions.

- [ ] **Step 5: Run tests and checks**

Run: `npm test -- tests/admin-crud.test.ts`, `npm run lint`, `npm run build`, then Browser/IAB smoke through one create/edit/delete flow for each resource.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/admin/categories src/app/api/admin/products src/app/api/admin/settings src/app/api/admin/security src/app/admin/categories src/app/admin/products src/app/admin/site src/app/admin/media src/app/admin/security tests/admin-crud.test.ts
git commit -m "feat: add admin catalog settings and security CRUD"
```

### Task 7: Connect Every Public Route to Resolved Database Content

**Files:**
- Modify: `src/app/page.tsx`, `src/app/products/page.tsx`, `src/app/products/fkm-rubber-o-ring/page.tsx`, `src/app/materials/page.tsx`, `src/app/about/page.tsx`, `src/app/custom/page.tsx`, `src/app/resources/page.tsx`, `src/app/resources/[slug]/page.tsx`, `src/app/faq/page.tsx`, `src/app/quote/page.tsx`, `src/app/terms/page.tsx`, `src/app/privacy/page.tsx`, `src/components/site.tsx`, `src/components/MaterialShowcase.tsx`
- Create/modify: `src/app/products/[slug]/page.tsx` to support database-created products while preserving the existing FKM route
- Create: `tests/public-content.test.ts`

**Interfaces:**
- Every public image reference goes through a media-slot resolver or product gallery resolver.
- Public product list/detail pages consume `getResolvedSiteContent` and `getResolvedProductBySlug`; unknown slugs return `notFound()`.

- [ ] **Step 1: Write failing tests**

Test that a database site-name override appears in resolved header/footer settings, a replacement media slot returns `/media/...`, an added product is found by slug, and restoring a slot returns its checked-in default path.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/public-content.test.ts`
Expected: FAIL because public routes still read only code constants.

- [ ] **Step 3: Integrate server content reads**

Mark affected pages dynamic or use targeted `revalidatePath` after writes. Pass resolved data into existing client components as serializable props. Replace hardcoded public logo, contact, social, product, and image paths with named slots/settings while keeping current fallback values identical.

- [ ] **Step 4: Add dynamic product detail route**

Move shared detail rendering into `src/app/products/[slug]/page.tsx`; use database product fields and gallery rows. Keep a compatibility redirect or direct rendering for `/products/fkm-rubber-o-ring` so existing links remain valid.

- [ ] **Step 5: Run tests and browser verification**

Run: `npm test -- tests/public-content.test.ts`, `npm run lint`, `npm run build`. In Browser/IAB, create a product, refresh `/products`, open its detail URL, replace a homepage image slot, refresh the public page, then restore the slot.

- [ ] **Step 6: Commit**

```bash
git add src/app src/components/site.tsx src/components/MaterialShowcase.tsx tests/public-content.test.ts
git commit -m "feat: connect public routes to editable content"
```

### Task 8: VPS Operations, Backups, and Final Verification

**Files:**
- Create: `.env.example`, `scripts/backup-oubei.ps1`, `scripts/backup-oubei.sh`
- Modify: `README.md`, `next.config.ts`
- Create: `tests/backup.test.ts`

**Interfaces:**
- Documents `OUBEI_DATA_DIR`, initial credentials, session secret generation, reverse proxy/start commands, directory ownership, and backup/restore.
- Backup scripts copy `site.db` and `media/` together to a timestamped destination without deleting source files.

- [ ] **Step 1: Write failing operational checks**

Test that the documented environment variable names match `getRuntimeConfig`, backup destination names are timestamped, and `.gitignore` excludes `.env`, runtime SQLite, media, logs, and build output.

- [ ] **Step 2: Implement documentation and scripts**

Provide Linux and PowerShell backup commands, systemd example with `WorkingDirectory`, `EnvironmentFile`, and `ReadWritePaths`, and a restore sequence that stops the service before replacing the database/media directory. Serve uploaded files through the local `/media/[storageName]` Route Handler and keep Next image optimization disabled as already configured; no remote image domains are added.

- [ ] **Step 3: Run complete verification**

Run: `npm test`, `npm run lint`, `npm run build`, `git diff --check`. Start the production server, verify admin login, category/product CRUD, settings, media replacement/restoration, password revocation, and public product detail at desktop and mobile widths. Confirm a process restart preserves SQLite and media.

- [ ] **Step 4: Commit**

```bash
git add .env.example scripts README.md next.config.ts tests/backup.test.ts
git commit -m "docs: add VPS deployment and backup operations"
```

- [ ] **Step 5: Final status review**

Run `git status --short --branch` and verify only intentional commits/files exist. Record the production start command and persistent data directory in the final handoff.
