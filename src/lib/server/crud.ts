import type { DatabaseConnection } from "@/lib/server/db";
import { slugify } from "@/lib/server/seed";
import { AdminRequestError } from "@/lib/server/admin-api";

const SETTING_KEYS = new Set([
  "site_name", "logo_path", "contact_name", "contact_short_name", "contact_address", "contact_phone", "contact_email", "contact_hours",
  "social_facebook", "social_linkedin", "social_youtube", "social_instagram", "social_tiktok", "social_whatsapp",
]);

const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
const list = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && Boolean(item.trim())).map((item) => item.trim()) : [];
const timestamp = () => new Date().toISOString();

export type ProductInput = {
  name: string; slug: string; code: string; categoryId: number | null; shortDescription: string; description: string; material: string;
  applications: string[]; specs: string[]; imageDefaultPath: string | null; isActive?: boolean;
};

export function normalizeProductInput(input: Record<string, unknown>): ProductInput {
  const name = text(input.name);
  const rawSlug = text(input.slug);
  const slug = slugify(rawSlug || name);
  if (!name || !slug || !text(input.code)) throw new AdminRequestError(400, "Product name, slug and code are required");
  const categoryId = input.categoryId === null || input.categoryId === undefined || input.categoryId === "" ? null : Number(input.categoryId);
  if (categoryId !== null && !Number.isInteger(categoryId)) throw new AdminRequestError(400, "Invalid category");
  return { name, slug, code: text(input.code), categoryId, shortDescription: text(input.shortDescription), description: text(input.description), material: text(input.material), applications: list(input.applications), specs: list(input.specs), imageDefaultPath: text(input.imageDefaultPath) || null, isActive: input.isActive === undefined ? true : Boolean(input.isActive) };
}

function ensureUnique(db: DatabaseConnection, table: "categories" | "products", slug: string, id?: number) {
  const row = db.prepare(`select id from ${table} where slug = ?`).get(slug) as { id: number } | undefined;
  if (row && row.id !== id) throw new AdminRequestError(409, "Slug already exists");
}

export function listCategories(db: DatabaseConnection) { return db.prepare("select id, name, slug, description, sort_order as sortOrder, is_active as isActive from categories order by sort_order, id").all().map((row) => ({ ...row as object, isActive: Boolean((row as { isActive: number }).isActive) })); }
export function createCategory(db: DatabaseConnection, input: Record<string, unknown>) {
  const name = text(input.name); const slug = slugify(text(input.slug) || name); if (!name || !slug) throw new AdminRequestError(400, "Category name is required"); ensureUnique(db, "categories", slug);
  const now = timestamp(); const result = db.prepare("insert into categories (name, slug, description, sort_order, is_active, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?)").run(name, slug, text(input.description), Number(input.sortOrder) || 0, input.isActive === false ? 0 : 1, now, now); return Number(result.lastInsertRowid);
}
export function updateCategory(db: DatabaseConnection, id: number, input: Record<string, unknown>) {
  const existing = db.prepare("select id from categories where id = ?").get(id); if (!existing) throw new AdminRequestError(404, "Category not found");
  const name = text(input.name); const slug = slugify(text(input.slug) || name); if (!name || !slug) throw new AdminRequestError(400, "Category name is required"); ensureUnique(db, "categories", slug, id); const now = timestamp(); db.prepare("update categories set name = ?, slug = ?, description = ?, sort_order = ?, is_active = ?, updated_at = ? where id = ?").run(name, slug, text(input.description), Number(input.sortOrder) || 0, input.isActive === false ? 0 : 1, now, id); return id;
}
export function deleteCategory(db: DatabaseConnection, id: number) {
  const references = (db.prepare("select count(*) as count from products where category_id = ?").get(id) as { count: number }).count; if (references) throw new AdminRequestError(409, "Category is still used by products");
  const result = db.prepare("delete from categories where id = ?").run(id); if (!result.changes) throw new AdminRequestError(404, "Category not found");
}

export function listProducts(db: DatabaseConnection) { return db.prepare("select p.id, p.slug, p.name, p.code, p.category_id as categoryId, c.name as categoryName, p.short_description as shortDescription, p.description, p.material, p.applications_json as applicationsJson, p.specs_json as specsJson, p.image_default_path as imageDefaultPath, p.is_active as isActive from products p left join categories c on c.id = p.category_id order by p.id").all().map((row) => { const item = row as Record<string, unknown>; return { ...item, applications: JSON.parse(String(item.applicationsJson || "[]")), specs: JSON.parse(String(item.specsJson || "[]")), isActive: Boolean(item.isActive) }; }); }
export function createProduct(db: DatabaseConnection, raw: Record<string, unknown>) { const input = normalizeProductInput(raw); ensureUnique(db, "products", input.slug); if (input.categoryId !== null && !db.prepare("select id from categories where id = ?").get(input.categoryId)) throw new AdminRequestError(400, "Category not found"); const now = timestamp(); const result = db.prepare("insert into products (slug,name,code,category_id,short_description,description,material,applications_json,specs_json,image_default_path,is_active,created_at,updated_at) values (?,?,?,?,?,?,?,?,?,?,?, ?, ?)").run(input.slug,input.name,input.code,input.categoryId,input.shortDescription,input.description,input.material,JSON.stringify(input.applications),JSON.stringify(input.specs),input.imageDefaultPath,input.isActive ? 1 : 0,now,now); return Number(result.lastInsertRowid); }
export function updateProduct(db: DatabaseConnection, id: number, raw: Record<string, unknown>) { const input = normalizeProductInput(raw); if (!db.prepare("select id from products where id = ?").get(id)) throw new AdminRequestError(404, "Product not found"); ensureUnique(db, "products", input.slug, id); if (input.categoryId !== null && !db.prepare("select id from categories where id = ?").get(input.categoryId)) throw new AdminRequestError(400, "Category not found"); const now = timestamp(); db.prepare("update products set slug=?,name=?,code=?,category_id=?,short_description=?,description=?,material=?,applications_json=?,specs_json=?,image_default_path=?,is_active=?,updated_at=? where id=?").run(input.slug,input.name,input.code,input.categoryId,input.shortDescription,input.description,input.material,JSON.stringify(input.applications),JSON.stringify(input.specs),input.imageDefaultPath,input.isActive ? 1 : 0,now,id); return id; }
export function deleteProduct(db: DatabaseConnection, id: number) { const result = db.prepare("delete from products where id = ?").run(id); if (!result.changes) throw new AdminRequestError(404, "Product not found"); }

export function updateSiteSettings(db: DatabaseConnection, values: Record<string, unknown>) { const now = timestamp(); const statement = db.prepare("insert into site_settings (key,value,updated_at) values (?,?,?) on conflict(key) do update set value=excluded.value,updated_at=excluded.updated_at"); const update = db.transaction(() => Object.entries(values).filter(([key]) => SETTING_KEYS.has(key)).forEach(([key, value]) => statement.run(key, text(value), now))); update(); }
export function getSiteSettings(db: DatabaseConnection) { return Object.fromEntries((db.prepare("select key,value from site_settings order by key").all() as Array<{ key: string; value: string }>).map((row) => [row.key, row.value])); }
export const allowedSettingKeys = [...SETTING_KEYS];
