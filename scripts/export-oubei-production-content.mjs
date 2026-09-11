import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

const root = path.resolve(import.meta.dirname, '..');
const dbPath = process.argv[2] || path.join(root, '..', 'oubei-hostinger-20260911T035743Z', 'data', '20260911T035923Z', 'site.db');
const outputPath = process.argv[3] || path.join(root, 'wordpress-theme', 'oubei', 'import', 'production-content.json');
const db = new Database(dbPath, { readonly: true });
const parseJson = (value, fallback = []) => { try { const parsed = JSON.parse(value ?? ''); return Array.isArray(parsed) ? parsed : fallback; } catch { return fallback; } };

const categories = db.prepare('select id,name,slug,description,sort_order,is_active from categories where is_active = 1 order by sort_order,id').all();
const products = db.prepare(`select p.id,p.slug,p.name,p.code,p.category_id,p.short_description,p.description,p.material,p.applications_json,p.specs_json,p.image_default_path,p.is_active,c.slug as category_slug
  from products p left join categories c on c.id = p.category_id where p.is_active = 1 order by p.id`).all().map((row) => ({
  slug: row.slug, name: row.name, code: row.code, categorySlug: row.category_slug, shortDescription: row.short_description,
  description: row.description, material: row.material, applications: parseJson(row.applications_json), specs: parseJson(row.specs_json), imageDefaultPath: row.image_default_path || null,
  gallery: db.prepare('select default_path,alt,sort_order from product_images where product_id = ? order by sort_order,id').all(row.id).map((image) => ({ defaultPath: image.default_path || null, alt: image.alt, sortOrder: image.sort_order })),
}));
const settings = Object.fromEntries(db.prepare('select key,value from site_settings order by key').all().map((row) => [row.key, row.value]));
const mediaSlots = db.prepare('select slot_key,page_key,label,alt,default_path from media_slots order by id').all().map((row) => ({ slotKey: row.slot_key, pageKey: row.page_key, label: row.label, alt: row.alt, defaultPath: row.default_path }));
const payload = { version: 1, settings, categories, products, mediaSlots, resources: [] };
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2) + '\n');
console.log(JSON.stringify({ outputPath, categories: categories.length, products: products.length, mediaSlots: mediaSlots.length }, null, 2));
