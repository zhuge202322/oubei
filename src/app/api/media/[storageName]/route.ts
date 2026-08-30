import fs from "node:fs/promises";
import path from "node:path";
import { openDatabase } from "@/lib/server/db";
import { getRuntimeConfig } from "@/lib/server/config";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ storageName: string }> }) {
  const { storageName } = await context.params;
  if (!/^[a-f0-9]{36}\.(?:jpg|png|webp|gif|svg)$/.test(storageName)) return new Response("Not found", { status: 404 });
  const db = openDatabase();
  const file = db.prepare("select relative_path, mime_type from media_files where storage_name = ?").get(storageName) as { relative_path: string; mime_type: string } | undefined;
  db.close();
  if (!file) return new Response("Not found", { status: 404 });
  try {
    const bytes = await fs.readFile(path.join(getRuntimeConfig().dataDir, file.relative_path));
    return new Response(bytes, { headers: { "content-type": file.mime_type, "cache-control": "public, max-age=31536000, immutable" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
