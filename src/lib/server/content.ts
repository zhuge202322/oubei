import type { DatabaseConnection } from "@/lib/server/db";
import { companyContact, defaultMediaSlots, products as defaultProducts } from "@/lib/site-data";

export type ResolvedSettings = {
  siteName: string;
  logoPath: string;
  contact: typeof companyContact;
  social: Record<string, string>;
};

export type ResolvedMediaSlot = {
  slotKey: string;
  pageKey: string;
  label: string;
  alt: string;
  defaultPath: string;
  mediaFileId: number | null;
  url: string;
};

export type ResolvedProduct = (typeof defaultProducts)[number] & {
  id: number;
  isActive: boolean;
  updatedAt: string;
  gallery: Array<{ id: number; url: string; alt: string; sortOrder: number }>;
};

export type ResolvedSiteContent = {
  settings: ResolvedSettings;
  categories: Array<{ id: number; name: string; slug: string; description: string; sortOrder: number; isActive: boolean }>;
  products: ResolvedProduct[];
  mediaSlots: Record<string, ResolvedMediaSlot>;
};

type ProductRow = {
  id: number;
  slug: string;
  name: string;
  code: string;
  category: string;
  short_description: string;
  description: string;
  material: string;
  applications_json: string;
  specs_json: string;
  image_default_path: string | null;
  is_active: number;
  updated_at: string;
};

function readJsonArray(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function readSettings(db: DatabaseConnection) {
  const rows = db.prepare("select key, value from site_settings").all() as Array<{ key: string; value: string }>;
  const values = new Map(rows.map((row) => [row.key, row.value]));
  const get = (key: string, fallback: string) => values.get(key) || fallback;
  return {
    siteName: get("site_name", companyContact.shortName),
    logoPath: get("logo_path", "/logo.webp"),
    contact: {
      name: get("contact_name", companyContact.name),
      shortName: get("contact_short_name", companyContact.shortName),
      address: get("contact_address", companyContact.address),
      phone: get("contact_phone", companyContact.phone),
      email: get("contact_email", companyContact.email),
      hours: get("contact_hours", companyContact.hours),
    },
    social: {
      facebook: get("social_facebook", ""),
      linkedin: get("social_linkedin", ""),
      youtube: get("social_youtube", ""),
      instagram: get("social_instagram", ""),
      tiktok: get("social_tiktok", ""),
      whatsapp: get("social_whatsapp", ""),
    },
  } satisfies ResolvedSettings;
}

function resolveFileUrl(mediaFileId: number | null, fallback: string, db: DatabaseConnection) {
  if (!mediaFileId) return fallback;
  const file = db.prepare("select storage_name from media_files where id = ?").get(mediaFileId) as { storage_name: string } | undefined;
  return file ? `/api/media/${encodeURIComponent(file.storage_name)}` : fallback;
}

function readProducts(db: DatabaseConnection): ResolvedProduct[] {
  const rows = db.prepare(
    `select p.*, c.name as category
     from products p left join categories c on c.id = p.category_id
     where p.is_active = 1 order by p.id`
  ).all() as ProductRow[];
  return rows.map((row) => {
    const fallback = defaultProducts.find((product) => product.slug === row.slug);
    const galleryRows = db.prepare(
      `select pi.id, pi.default_path, pi.alt, pi.sort_order, pi.media_file_id
       from product_images pi where pi.product_id = ? order by pi.sort_order, pi.id`
    ).all(row.id) as Array<{ id: number; default_path: string | null; alt: string; sort_order: number; media_file_id: number | null }>;
    const gallery = galleryRows.map((image) => ({
      id: image.id,
      url: resolveFileUrl(image.media_file_id, image.default_path || fallback?.image || "/logo.webp", db),
      alt: image.alt || fallback?.alt || row.name,
      sortOrder: image.sort_order,
    }));
    return {
      slug: row.slug,
      name: row.name,
      code: row.code,
      category: row.category || fallback?.category || "",
      shortDescription: row.short_description,
      description: row.description,
      image: gallery[0]?.url || row.image_default_path || fallback?.image || "/logo.webp",
      alt: gallery[0]?.alt || fallback?.alt || row.name,
      applications: readJsonArray(row.applications_json),
      specs: readJsonArray(row.specs_json),
      material: row.material,
      id: row.id,
      isActive: Boolean(row.is_active),
      updatedAt: row.updated_at,
      gallery,
    };
  });
}

export async function getResolvedSiteContent(db: DatabaseConnection): Promise<ResolvedSiteContent> {
  const categories = (db.prepare("select id, name, slug, description, sort_order, is_active from categories order by sort_order, id").all() as Array<{ id: number; name: string; slug: string; description: string; sort_order: number; is_active: number }>).map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    sortOrder: category.sort_order,
    isActive: Boolean(category.is_active),
  }));
  const slotRows = db.prepare("select slot_key, page_key, label, alt, default_path, media_file_id from media_slots").all() as Array<{ slot_key: string; page_key: string; label: string; alt: string; default_path: string; media_file_id: number | null }>;
  const mediaSlots: Record<string, ResolvedMediaSlot> = {};
  defaultMediaSlots.forEach((slot) => {
    const row = slotRows.find((candidate) => candidate.slot_key === slot.slotKey);
    mediaSlots[slot.slotKey] = {
      slotKey: slot.slotKey,
      pageKey: row?.page_key || slot.pageKey,
      label: row?.label || slot.label,
      alt: row?.alt || slot.alt,
      defaultPath: row?.default_path || slot.defaultPath,
      mediaFileId: row?.media_file_id ?? null,
      url: resolveFileUrl(row?.media_file_id ?? null, row?.default_path || slot.defaultPath, db),
    };
  });
  return { settings: readSettings(db), categories, products: readProducts(db), mediaSlots };
}

export async function getResolvedProductBySlug(db: DatabaseConnection, slug: string) {
  const content = await getResolvedSiteContent(db);
  return content.products.find((product) => product.slug === slug) ?? null;
}
