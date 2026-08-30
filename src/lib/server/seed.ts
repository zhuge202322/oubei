import type { DatabaseConnection } from "@/lib/server/db";
import {
  companyContact,
  defaultMediaSlots,
  products as defaultProducts,
} from "@/lib/site-data";

const now = () => new Date().toISOString();

export function seedDatabase(db: DatabaseConnection) {
  const seed = db.transaction(() => {
    const timestamp = now();
    const categoryIds = new Map<string, number>();

    const categories = [...new Set(defaultProducts.map((product) => product.category))];
    const findCategory = db.prepare("select id from categories where slug = ?");
    const insertCategory = db.prepare(
      "insert into categories (name, slug, description, sort_order, is_active, created_at, updated_at) values (?, ?, ?, ?, 1, ?, ?)",
    );
    categories.forEach((name, index) => {
      const slug = slugify(name);
      const existing = findCategory.get(slug) as { id: number } | undefined;
      const id = existing?.id ?? Number(insertCategory.run(name, slug, "", index, timestamp, timestamp).lastInsertRowid);
      categoryIds.set(name, id);
    });

    const insertProduct = db.prepare(
      `insert into products
        (slug, name, code, category_id, short_description, description, material, applications_json, specs_json, image_default_path, is_active, created_at, updated_at)
       values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`
    );
    const insertProductImage = db.prepare(
      "insert into product_images (product_id, default_path, alt, sort_order) values (?, ?, ?, 0)",
    );
    const findProduct = db.prepare("select id from products where slug = ?");
    defaultProducts.forEach((product) => {
      const existing = findProduct.get(product.slug) as { id: number } | undefined;
      const productId = existing?.id ?? Number(
        insertProduct.run(
          product.slug,
          product.name,
          product.code,
          categoryIds.get(product.category) ?? null,
          product.shortDescription,
          product.description,
          product.material,
          JSON.stringify(product.applications),
          JSON.stringify(product.specs),
          product.image,
          timestamp,
          timestamp,
        ).lastInsertRowid,
      );
      const imageCount = (db.prepare("select count(*) as count from product_images where product_id = ?").get(productId) as { count: number }).count;
      if (imageCount === 0) insertProductImage.run(productId, product.image, product.alt);
    });

    const settings: Record<string, string> = {
      site_name: companyContact.shortName,
      logo_path: "/logo.webp",
      contact_name: companyContact.name,
      contact_short_name: companyContact.shortName,
      contact_address: companyContact.address,
      contact_phone: companyContact.phone,
      contact_email: companyContact.email,
      contact_hours: companyContact.hours,
      social_facebook: "",
      social_linkedin: "",
      social_youtube: "",
      social_instagram: "",
      social_tiktok: "",
      social_whatsapp: "",
    };
    const insertSetting = db.prepare("insert or ignore into site_settings (key, value, updated_at) values (?, ?, ?)");
    Object.entries(settings).forEach(([key, value]) => insertSetting.run(key, value, timestamp));

    const insertSlot = db.prepare(
      "insert or ignore into media_slots (slot_key, page_key, label, alt, default_path, updated_at) values (?, ?, ?, ?, ?, ?)",
    );
    defaultMediaSlots.forEach((slot) => insertSlot.run(slot.slotKey, slot.pageKey, slot.label, slot.alt, slot.defaultPath, timestamp));
  });

  seed();
}

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
