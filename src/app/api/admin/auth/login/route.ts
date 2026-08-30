import { openDatabase } from "@/lib/server/db";
import { createSession, ensureAdminUser, sessionCookieName, verifyPassword } from "@/lib/server/auth";
import { getRuntimeConfig } from "@/lib/server/config";
import { jsonError, jsonOk } from "@/lib/server/admin-api";

export const runtime = "nodejs";

const failures = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: Request, username: string) {
  return `${request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"}:${username.toLowerCase()}`;
}

function cookieHeader(token: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${sessionCookieName}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}${secure}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { username?: unknown; password?: unknown };
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!username || !password) return Response.json({ data: null, error: "Invalid username or password" }, { status: 400 });

    const key = clientKey(request, username);
    const current = failures.get(key);
    if (current && current.resetAt > Date.now() && current.count >= 5) {
      return Response.json({ data: null, error: "Invalid username or password" }, { status: 429 });
    }

    const db = openDatabase();
    const config = getRuntimeConfig();
    await ensureAdminUser(db, { username: config.initialUsername, password: config.initialPassword || "change-this-initial-password" });
    const user = db.prepare("select id, username, password_hash from admin_users where username = ?").get(username) as { id: number; username: string; password_hash: string } | undefined;
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      const next = current && current.resetAt > Date.now() ? { count: current.count + 1, resetAt: current.resetAt } : { count: 1, resetAt: Date.now() + 5 * 60 * 1000 };
      failures.set(key, next);
      db.close();
      return Response.json({ data: null, error: "Invalid username or password" }, { status: 401 });
    }
    failures.delete(key);
    const token = createSession(db, user.id);
    db.close();
    return jsonOk({ user: { id: user.id, username: user.username } }, { headers: { "set-cookie": cookieHeader(token) } });
  } catch (error) {
    return jsonError(error);
  }
}
