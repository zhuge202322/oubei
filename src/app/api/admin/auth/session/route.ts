import { getSessionUser } from "@/lib/server/auth";
import { openDatabase } from "@/lib/server/db";
import { jsonError, jsonOk } from "@/lib/server/admin-api";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const db = openDatabase();
    const user = getSessionUser(request, db);
    db.close();
    return user ? jsonOk({ user }) : Response.json({ data: null, error: "Authentication required" }, { status: 401 });
  } catch (error) {
    return jsonError(error);
  }
}
