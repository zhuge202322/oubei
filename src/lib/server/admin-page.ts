import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { openDatabase, type DatabaseConnection } from "@/lib/server/db";
import { getSessionUser } from "@/lib/server/auth";

export async function requireAdminPage(): Promise<{ db: DatabaseConnection; user: { id: number; username: string } }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("oubei_admin_session")?.value;
  const db = openDatabase();
  const user = token ? getSessionUser(new Request("http://admin.local/admin", { headers: { cookie: `oubei_admin_session=${token}` } }), db) : null;
  if (!user) {
    db.close();
    redirect("/admin/login");
  }
  return { db, user };
}
