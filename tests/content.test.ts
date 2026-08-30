import test from "node:test";
import assert from "node:assert/strict";
import Database from "better-sqlite3";
import { migrateDatabase } from "@/lib/server/migrations";
import { seedDatabase } from "@/lib/server/seed";
import { getResolvedProductBySlug, getResolvedSiteContent } from "@/lib/server/content";

function createSeededDatabase() {
  const db = new Database(":memory:");
  db.pragma("foreign_keys = ON");
  migrateDatabase(db);
  seedDatabase(db);
  return db;
}

test("resolved content exposes seeded products and default media slots", async () => {
  const db = createSeededDatabase();
  const content = await getResolvedSiteContent(db);
  const product = await getResolvedProductBySlug(db, "o-rings");

  assert.equal(content.products.length, 4);
  assert.equal(product?.name, "Precision O-Rings");
  assert.equal(content.settings.siteName, "Xingtai Oubei");
  assert.equal(content.mediaSlots["home.factory.workshop"].url, "/factory/车间1.jpg");
  db.close();
});

test("database setting overrides replace its typed default", async () => {
  const db = createSeededDatabase();
  db.prepare("update site_settings set value = ? where key = 'site_name'").run("Oubei Industrial Seals");
  const content = await getResolvedSiteContent(db);

  assert.equal(content.settings.siteName, "Oubei Industrial Seals");
  db.close();
});
