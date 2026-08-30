import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import Database from "better-sqlite3";
import { migrateDatabase } from "@/lib/server/migrations";
import { seedDatabase } from "@/lib/server/seed";
import { createTemporaryDataDirectory } from "@/lib/server/test-helpers";
import { deleteUnreferencedMedia, saveUpload, validateUpload } from "@/lib/server/media";

test("upload validation accepts supported image types and rejects unsafe files", async () => {
  const valid = await validateUpload(new File([Buffer.from("png")], "seal.png", { type: "image/png" }), 1024);
  assert.equal(valid.mimeType, "image/png");
  await assert.rejects(() => validateUpload(new File([Buffer.from("exe")], "run.exe", { type: "application/x-msdownload" }), 1024));
  await assert.rejects(() => validateUpload(new File([Buffer.alloc(2048)], "large.png", { type: "image/png" }), 1024));
  await assert.rejects(() => validateUpload(new File([Buffer.from("png")], "seal.jpg", { type: "image/png" }), 1024));
});

test("saved uploads use random names and cleanup preserves referenced media", async () => {
  const temporary = createTemporaryDataDirectory("oubei-media-");
  const db = new Database(":memory:");
  migrateDatabase(db);
  seedDatabase(db);
  try {
    const upload = await validateUpload(new File([Buffer.from("png")], "seal.png", { type: "image/png" }), 1024);
    const saved = await saveUpload(upload, temporary.dataDir);
    assert.notEqual(saved.storageName, "seal.png");
    assert.equal(await fs.readFile(path.join(temporary.dataDir, "media", saved.storageName)).then(() => true), true);
    db.prepare("insert into media_files (storage_name, original_name, mime_type, size_bytes, relative_path, created_at) values (?, ?, ?, ?, ?, ?)").run(saved.storageName, saved.originalName, saved.mimeType, saved.sizeBytes, saved.relativePath, new Date().toISOString());
    const unreferenced = await saveUpload(upload, temporary.dataDir);
    db.prepare("insert into media_files (storage_name, original_name, mime_type, size_bytes, relative_path, created_at) values (?, ?, ?, ?, ?, ?)").run(unreferenced.storageName, unreferenced.originalName, unreferenced.mimeType, unreferenced.sizeBytes, unreferenced.relativePath, new Date().toISOString());
    const slotId = (db.prepare("select id from media_slots where slot_key = 'home.hero.left'").get() as { id: number }).id;
    db.prepare("update media_slots set media_file_id = ? where id = ?").run((db.prepare("select id from media_files where storage_name = ?").get(saved.storageName) as { id: number }).id, slotId);
    assert.equal(await deleteUnreferencedMedia(db, temporary.dataDir), 1);
    assert.equal(await fs.stat(path.join(temporary.dataDir, "media", saved.storageName)).then(() => true), true);
    await assert.rejects(() => fs.stat(path.join(temporary.dataDir, "media", unreferenced.storageName)));
  } finally {
    db.close();
    temporary.cleanup();
  }
});
