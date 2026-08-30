import { rm } from "node:fs/promises";
import type { DatabaseConnection } from "@/lib/server/db";
import { getRuntimeConfig } from "@/lib/server/config";
import { assertSameOrigin, jsonError, jsonOk, requireAdmin } from "@/lib/server/admin-api";
import { deleteUnreferencedMedia, saveUpload, validateUpload } from "@/lib/server/media";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let db: DatabaseConnection | undefined;
  try {
    assertSameOrigin(request);
    db = (await requireAdmin(request)).db;
    const activeDb = db;
    const form = await request.formData();
    const slotKey = form.get("slotKey");
    const file = form.get("file");
    if (typeof slotKey !== "string" || !(file instanceof File)) return Response.json({ data: null, error: "Slot and image are required" }, { status: 400 });
    const config = getRuntimeConfig();
    const upload = await validateUpload(file, config.maxUploadBytes);
    const saved = await saveUpload(upload, config.dataDir);
    const slot = activeDb.prepare("select id from media_slots where slot_key = ?").get(slotKey) as { id: number } | undefined;
    if (!slot) {
      await rm(`${config.dataDir}/${saved.relativePath}`, { force: true });
      return Response.json({ data: null, error: "Media slot not found" }, { status: 404 });
    }
    const timestamp = new Date().toISOString();
    const result = activeDb.transaction(() => {
      const media = activeDb.prepare("insert into media_files (storage_name, original_name, mime_type, size_bytes, relative_path, created_at) values (?, ?, ?, ?, ?, ?)").run(saved.storageName, saved.originalName, saved.mimeType, saved.sizeBytes, saved.relativePath, timestamp);
      activeDb.prepare("update media_slots set media_file_id = ?, updated_at = ? where id = ?").run(media.lastInsertRowid, timestamp, slot.id);
      return Number(media.lastInsertRowid);
    })();
    await deleteUnreferencedMedia(activeDb, config.dataDir);
    return jsonOk({ mediaFileId: result, storageName: saved.storageName });
  } catch (error) {
    return jsonError(error);
  } finally {
    db?.close();
  }
}
