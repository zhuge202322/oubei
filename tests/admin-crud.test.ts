import test from "node:test";
import assert from "node:assert/strict";
import Database from "better-sqlite3";
import { migrateDatabase } from "@/lib/server/migrations";
import { seedDatabase } from "@/lib/server/seed";
import { createProduct, deleteCategory, normalizeProductInput, updateSiteSettings } from "@/lib/server/crud";

function database() {
  const db = new Database(":memory:");
  db.pragma("foreign_keys = ON");
  migrateDatabase(db);
  seedDatabase(db);
  return db;
}

test("category deletion returns a conflict while products still reference it", () => {
  const db = database();
  const category = db.prepare("select id from categories where slug = 'static-sealing'").get() as { id: number };
  assert.throws(() => deleteCategory(db, category.id), (error: unknown) => error instanceof Error && (error as Error & { status: number }).status === 409);
  db.close();
});

test("product input normalizes slug and preserves list fields", () => {
  const input = normalizeProductInput({ name: "  New Rotary Seal  ", code: "NS-1", applications: ["Pumps", 3], specs: ["ISO"], material: "NBR" });
  assert.equal(input.slug, "new-rotary-seal");
  assert.deepEqual(input.applications, ["Pumps"]);
  assert.deepEqual(input.specs, ["ISO"]);
});

test("product slugs are unique and settings updates ignore unknown keys", () => {
  const db = database();
  assert.throws(() => createProduct(db, { name: "Duplicate", slug: "o-rings", code: "DUP", categoryId: null, shortDescription: "", description: "", material: "", applications: [], specs: [], imageDefaultPath: null }), (error: unknown) => error instanceof Error && (error as Error & { status: number }).status === 409);
  updateSiteSettings(db, { site_name: "Oubei Content Control", unknown_key: "blocked" });
  assert.equal((db.prepare("select value from site_settings where key = 'site_name'").get() as { value: string }).value, "Oubei Content Control");
  assert.equal((db.prepare("select count(*) as count from site_settings where key = 'unknown_key'").get() as { count: number }).count, 0);
  db.close();
});
