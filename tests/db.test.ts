import test from "node:test";
import assert from "node:assert/strict";
import Database from "better-sqlite3";
import { migrateDatabase } from "@/lib/server/migrations";
import { seedDatabase } from "@/lib/server/seed";

function createDatabase() {
  const db = new Database(":memory:");
  db.pragma("foreign_keys = ON");
  return db;
}

test("migrations create the complete content schema and are idempotent", () => {
  const db = createDatabase();
  migrateDatabase(db);
  migrateDatabase(db);

  const tables = db
    .prepare("select name from sqlite_master where type = 'table' and name != 'sqlite_sequence' order by name")
    .all()
    .map((row) => (row as { name: string }).name);

  assert.deepEqual(tables, [
    "admin_sessions",
    "admin_users",
    "categories",
    "media_files",
    "media_slots",
    "product_images",
    "products",
    "schema_migrations",
    "site_settings",
  ]);
  db.close();
});

test("seed is idempotent and preserves stable product slugs", () => {
  const db = createDatabase();
  migrateDatabase(db);
  seedDatabase(db);
  seedDatabase(db);

  assert.equal((db.prepare("select count(*) as count from categories").get() as { count: number }).count, 4);
  assert.equal((db.prepare("select count(*) as count from products").get() as { count: number }).count, 4);
  assert.equal((db.prepare("select slug from products where slug = 'o-rings'").get() as { slug: string }).slug, "o-rings");
  assert.equal((db.prepare("select value from site_settings where key = 'contact_email'").get() as { value: string }).value, "sales@xingtaioubei.com");
  db.close();
});
