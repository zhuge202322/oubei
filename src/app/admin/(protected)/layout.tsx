import type { ReactNode } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdminPage } from "@/lib/server/admin-page";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const { db, user } = await requireAdminPage();
  db.close();
  return <AdminShell username={user.username}>{children}</AdminShell>;
}
