import { getSessionToken, revokeSession, sessionCookieName } from "@/lib/server/auth";
import { openDatabase } from "@/lib/server/db";
import { assertSameOrigin, jsonError, jsonOk } from "@/lib/server/admin-api";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const token = getSessionToken(request);
    if (token) {
      const db = openDatabase();
      revokeSession(db, token);
      db.close();
    }
    return jsonOk(null, { headers: { "set-cookie": `${sessionCookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0` } });
  } catch (error) {
    return jsonError(error);
  }
}
