import { createHash, createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual, type ScryptOptions } from "node:crypto";
import type { DatabaseConnection } from "@/lib/server/db";
import { getRuntimeConfig } from "@/lib/server/config";

const PASSWORD_COST = 16_384;
const PASSWORD_BLOCK_SIZE = 8;
const PASSWORD_PARALLELIZATION = 1;
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function deriveKey(password: string, salt: Buffer, keyLength: number, options: ScryptOptions) {
  return new Promise<Buffer>((resolve, reject) => {
    scryptCallback(password, salt, keyLength, options, (error, derived) => {
      if (error) reject(error);
      else resolve(derived as Buffer);
    });
  });
}

export type AdminUser = { id: number; username: string };

export async function hashPassword(password: string) {
  if (password.length < 10) throw new Error("Password must contain at least 10 characters.");
  const salt = randomBytes(16);
  const derived = await deriveKey(password, salt, 64, {
    N: PASSWORD_COST,
    r: PASSWORD_BLOCK_SIZE,
    p: PASSWORD_PARALLELIZATION,
    maxmem: 32 * 1024 * 1024,
  });
  return ["scrypt", PASSWORD_COST, PASSWORD_BLOCK_SIZE, PASSWORD_PARALLELIZATION, salt.toString("base64url"), derived.toString("base64url")].join("$");
}

export async function verifyPassword(password: string, encodedHash: string) {
  const [, cost, blockSize, parallelization, saltText, hashText] = encodedHash.split("$");
  const salt = Buffer.from(saltText || "", "base64url");
  const expected = Buffer.from(hashText || "", "base64url");
  if (!salt.length || !expected.length) return false;
  try {
    const derived = await deriveKey(password, salt, expected.length, {
      N: Number(cost),
      r: Number(blockSize),
      p: Number(parallelization),
      maxmem: 32 * 1024 * 1024,
    });
    return derived.length === expected.length && timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

function tokenHash(token: string) {
  return createHmac("sha256", getRuntimeConfig().sessionSecret).update(token).digest("hex");
}

export async function ensureAdminUser(db: DatabaseConnection, input: { username: string; password: string }): Promise<AdminUser> {
  const existing = db.prepare("select id, username from admin_users order by id limit 1").get() as AdminUser | undefined;
  if (existing) return existing;
  const username = input.username.trim();
  if (!username || !input.password) throw new Error("Initial administrator credentials are required.");
  const timestamp = new Date().toISOString();
  const passwordHash = await hashPassword(input.password);
  const result = db.prepare("insert into admin_users (username, password_hash, created_at, updated_at) values (?, ?, ?, ?)").run(username, passwordHash, timestamp, timestamp);
  return { id: Number(result.lastInsertRowid), username };
}

export function createSession(db: DatabaseConnection, userId: number, options: { now?: Date; ttlMs?: number } = {}) {
  const token = randomBytes(32).toString("base64url");
  const now = options.now ?? new Date();
  const expires = new Date(now.getTime() + (options.ttlMs ?? SESSION_TTL_MS));
  db.prepare("insert into admin_sessions (user_id, token_hash, created_at, expires_at) values (?, ?, ?, ?)").run(userId, tokenHash(token), now.toISOString(), expires.toISOString());
  return token;
}

function readCookie(request: Request, name: string) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = request.headers.get("cookie")?.match(new RegExp(`(?:^|;\\s*)${escaped}=([^;]*)`));
  return match?.[1] || null;
}

export function getSessionToken(request: Request) {
  return readCookie(request, sessionCookieName);
}

export function getSessionUser(request: Request, db: DatabaseConnection, now = new Date()): AdminUser | null {
  const token = readCookie(request, "oubei_admin_session");
  if (!token) return null;
  const row = db.prepare(
    `select u.id, u.username from admin_sessions s
     join admin_users u on u.id = s.user_id
     where s.token_hash = ? and s.revoked_at is null and s.expires_at > ?`
  ).get(tokenHash(token), now.toISOString()) as AdminUser | undefined;
  return row ?? null;
}

export function revokeSession(db: DatabaseConnection, token: string) {
  db.prepare("update admin_sessions set revoked_at = ? where token_hash = ? and revoked_at is null").run(new Date().toISOString(), tokenHash(token));
}

export function revokeAllSessions(db: DatabaseConnection, userId: number) {
  db.prepare("update admin_sessions set revoked_at = ? where user_id = ? and revoked_at is null").run(new Date().toISOString(), userId);
}

export function hashOpaqueValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export const sessionCookieName = "oubei_admin_session";
