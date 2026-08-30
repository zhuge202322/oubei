import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import type { DatabaseConnection } from "@/lib/server/db";

const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

export type ValidatedUpload = {
  bytes: Buffer;
  extension: string;
  mimeType: string;
  originalName: string;
};

export type MediaFile = {
  storageName: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  relativePath: string;
};

export async function validateUpload(file: File, maxBytes: number): Promise<ValidatedUpload> {
  const mimeType = file.type.toLowerCase();
  const extension = MIME_EXTENSIONS[mimeType];
  const originalName = file.name.trim();
  const suppliedExtension = path.extname(originalName).slice(1).toLowerCase();
  if (!extension || suppliedExtension !== extension) throw new Error("Unsupported image type.");
  if (!originalName || originalName.includes("/") || originalName.includes("\\")) throw new Error("Invalid file name.");
  if (file.size <= 0 || file.size > maxBytes) throw new Error("Image exceeds the upload size limit.");
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length !== file.size) throw new Error("Unable to read uploaded image.");
  return { bytes, extension, mimeType, originalName };
}

export async function saveUpload(upload: ValidatedUpload, dataDir: string): Promise<MediaFile> {
  const mediaDir = path.join(dataDir, "media");
  await fs.mkdir(mediaDir, { recursive: true });
  const storageName = `${crypto.randomBytes(18).toString("hex")}.${upload.extension}`;
  await fs.writeFile(path.join(mediaDir, storageName), upload.bytes, { flag: "wx" });
  return {
    storageName,
    originalName: upload.originalName,
    mimeType: upload.mimeType,
    sizeBytes: upload.bytes.length,
    relativePath: path.posix.join("media", storageName),
  };
}

export async function deleteUnreferencedMedia(db: DatabaseConnection, dataDir: string) {
  const files = db.prepare(
    `select mf.id, mf.storage_name, mf.relative_path
     from media_files mf
     where not exists (select 1 from media_slots ms where ms.media_file_id = mf.id)
       and not exists (select 1 from product_images pi where pi.media_file_id = mf.id)`
  ).all() as Array<{ id: number; storage_name: string; relative_path: string }>;
  const remove = db.transaction(() => {
    files.forEach((file) => {
      db.prepare("delete from media_files where id = ?").run(file.id);
    });
  });
  remove();
  await Promise.all(files.map((file) => fs.rm(path.join(dataDir, file.relative_path), { force: true })));
  return files.length;
}

export function resolveSlotUrl(slot: { mediaFileId: number | null; defaultPath: string }, storageName?: string) {
  return slot.mediaFileId && storageName ? `/media/${encodeURIComponent(storageName)}` : slot.defaultPath;
}
