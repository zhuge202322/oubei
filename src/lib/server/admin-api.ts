import type { DatabaseConnection } from "@/lib/server/db";
import { openDatabase } from "@/lib/server/db";
import { getSessionUser } from "@/lib/server/auth";

export class AdminAuthError extends Error {
  status = 401;

  constructor(message = "Authentication required") {
    super(message);
    this.name = "AdminAuthError";
  }
}

export class AdminRequestError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "AdminRequestError";
  }
}

export async function requireAdmin(request: Request, db: DatabaseConnection = openDatabase()) {
  const user = getSessionUser(request, db);
  if (!user) throw new AdminAuthError();
  return { db, user };
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return;
  const url = new URL(request.url);
  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",", 1)[0]?.trim();
  const protocol = forwardedProtocol ? `${forwardedProtocol}:` : url.protocol;
  const host = request.headers.get("host")?.trim() || url.host;
  if (origin !== `${protocol}//${host}`) throw new AdminRequestError(403, "Invalid request origin");
}

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return Response.json({ data, error: null }, init);
}

export function jsonError(error: unknown) {
  const status = error instanceof AdminAuthError || error instanceof AdminRequestError ? error.status : error instanceof SyntaxError ? 400 : 500;
  const message = error instanceof AdminAuthError ? error.message : error instanceof AdminRequestError ? error.message : error instanceof SyntaxError ? "Invalid JSON body" : "Unexpected server error";
  return Response.json({ data: null, error: message }, { status });
}
