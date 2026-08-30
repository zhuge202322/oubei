import type { DatabaseConnection } from "@/lib/server/db";
import { getRuntimeConfig } from "@/lib/server/config";
import { assertSameOrigin, jsonError, jsonOk, requireAdmin } from "@/lib/server/admin-api";
import { deleteUnreferencedMedia } from "@/lib/server/media";

export const runtime = "nodejs";

export async function DELETE(request: Request, context: { params: Promise<{ slotKey: string }> }) {
  let db: DatabaseConnection | undefined;
  try {
    assertSameOrigin(request);
    db = (await requireAdmin(request)).db;
    const activeDb = db;
    const { slotKey } = await context.params;
    const result = activeDb.prepare("update media_slots set media_file_id = null, updated_at = ? where slot_key = ?").run(new Date().toISOString(), slotKey);
    if (!result.changes) return Response.json({ data: null, error: "Media slot not found" }, { status: 404 });
    await deleteUnreferencedMedia(activeDb, getRuntimeConfig().dataDir);
    return jsonOk({ slotKey, restored: true });
  } catch (error) {
    return jsonError(error);
  } finally {
    db?.close();
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ slotKey: string }> }) {
  return DELETE(request, context);
}
