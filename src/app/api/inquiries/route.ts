import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const allowedExtensions = new Set([
  ".pdf",
  ".step",
  ".stp",
  ".dwg",
  ".dxf",
  ".png",
  ".jpg",
  ".jpeg",
]);

type InquiryType = "product" | "quote";
type InquiryFields = Record<string, string>;

const fieldLimits: Record<string, number> = {
  quantity: 80,
  material: 120,
  email: 254,
  projectType: 120,
  application: 300,
  name: 160,
  company: 200,
  phone: 80,
  message: 4000,
};

function cleanField(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function isEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value);
}

function validate(type: InquiryType, fields: InquiryFields, consent: boolean) {
  const required = type === "product"
    ? ["quantity", "material", "email"]
    : ["projectType", "material", "application", "name", "company", "email", "phone"];

  const missing = required.filter((field) => !fields[field]);
  if (missing.length > 0) return `Missing required fields: ${missing.join(", ")}.`;
  if (!isEmail(fields.email)) return "Enter a valid email address.";
  if (type === "quote" && !consent) return "Consent is required before sending this request.";
  return null;
}

function safeFileName(fileName: string) {
  const extension = path.extname(fileName).toLowerCase();
  const stem = path.basename(fileName, extension)
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "attachment";
  return `${stem}${extension}`;
}

async function parseRequest(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  let typeValue = "";
  let consent = false;
  let attachment: File | null = null;
  const fields: InquiryFields = {};

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    typeValue = cleanField(form.get("type"), 20);
    consent = form.get("consent") === "true";
    const candidate = form.get("file");
    attachment = candidate instanceof File && candidate.size > 0 ? candidate : null;
    for (const [field, limit] of Object.entries(fieldLimits)) {
      fields[field] = cleanField(form.get(field), limit);
    }
  } else if (contentType.includes("application/json")) {
    const body = await request.json() as Record<string, unknown>;
    typeValue = cleanField(body.type, 20);
    consent = body.consent === true;
    for (const [field, limit] of Object.entries(fieldLimits)) {
      fields[field] = cleanField(body[field], limit);
    }
  } else {
    throw new Error("UNSUPPORTED_CONTENT_TYPE");
  }

  if (typeValue !== "product" && typeValue !== "quote") {
    throw new Error("INVALID_INQUIRY_TYPE");
  }

  return { type: typeValue as InquiryType, fields, consent, attachment };
}

export async function POST(request: Request) {
  try {
    const { type, fields, consent, attachment } = await parseRequest(request);
    const validationError = validate(type, fields, consent);
    if (validationError) {
      return NextResponse.json({ ok: false, error: validationError }, { status: 400 });
    }

    if (attachment) {
      const extension = path.extname(attachment.name).toLowerCase();
      if (!allowedExtensions.has(extension)) {
        return NextResponse.json({ ok: false, error: "This attachment type is not supported." }, { status: 400 });
      }
      if (attachment.size > MAX_FILE_SIZE) {
        return NextResponse.json({ ok: false, error: "The attachment must be 10 MB or smaller." }, { status: 413 });
      }
    }

    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const day = createdAt.slice(0, 10);
    const storageRoot = process.env.INQUIRY_STORAGE_DIR
      ? path.resolve(process.env.INQUIRY_STORAGE_DIR)
      : path.join(process.cwd(), "storage", "inquiries");
    const recordDirectory = path.join(storageRoot, day);
    await mkdir(recordDirectory, { recursive: true });

    let attachmentRecord: null | {
      originalName: string;
      storedName: string;
      size: number;
      contentType: string;
    } = null;

    if (attachment) {
      const storedName = `${id}-${safeFileName(attachment.name)}`;
      await writeFile(path.join(recordDirectory, storedName), Buffer.from(await attachment.arrayBuffer()));
      attachmentRecord = {
        originalName: attachment.name,
        storedName,
        size: attachment.size,
        contentType: attachment.type || "application/octet-stream",
      };
    }

    const record = {
      id,
      type,
      createdAt,
      consent: type === "quote" ? consent : undefined,
      fields,
      attachment: attachmentRecord,
    };
    await writeFile(
      path.join(recordDirectory, `${id}.json`),
      `${JSON.stringify(record, null, 2)}\n`,
      { encoding: "utf8", flag: "wx" },
    );

    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && ["UNSUPPORTED_CONTENT_TYPE", "INVALID_INQUIRY_TYPE"].includes(error.message)) {
      return NextResponse.json({ ok: false, error: "Invalid inquiry request." }, { status: 400 });
    }
    console.error("Failed to store inquiry", error);
    return NextResponse.json({ ok: false, error: "The request could not be stored. Please try again." }, { status: 500 });
  }
}
