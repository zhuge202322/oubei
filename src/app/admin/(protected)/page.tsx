import Link from "next/link";
import { ImageIcon, Package, Tags, UsersRound } from "lucide-react";
import { AdminPageHeader, AdminPanel } from "@/components/admin/AdminTable";
import { requireAdminPage } from "@/lib/server/admin-page";

export default async function AdminDashboardPage() {
  const { db } = await requireAdminPage();
  const counts = {
    products: (db.prepare("select count(*) as count from products where is_active = 1").get() as { count: number }).count,
    categories: (db.prepare("select count(*) as count from categories where is_active = 1").get() as { count: number }).count,
    media: (db.prepare("select count(*) as count from media_slots where media_file_id is not null").get() as { count: number }).count,
    users: (db.prepare("select count(*) as count from admin_users").get() as { count: number }).count,
  };
  db.close();
  const cards = [
    { label: "Active products", value: counts.products, href: "/admin/products", icon: Package },
    { label: "Active categories", value: counts.categories, href: "/admin/categories", icon: Tags },
    { label: "Uploaded image overrides", value: counts.media, href: "/admin/media", icon: ImageIcon },
    { label: "Administrator", value: counts.users, href: "/admin/security", icon: UsersRound },
  ];
  return <><AdminPageHeader title="Overview" description="Manage the public Oubei website from one control center." /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, href, icon: Icon }) => <Link href={href} key={label} className="border border-[#d4dde8] bg-white p-5 transition-shadow hover:shadow-md"><Icon className="h-5 w-5 text-[#c62828]" /><p className="mt-6 text-xs font-medium uppercase tracking-[0.12em] text-[#697a8f]">{label}</p><p className="mt-2 text-3xl font-semibold text-[#0b2545]">{value}</p></Link>)}</div><AdminPanel className="mt-6 p-6"><h2 className="text-lg font-semibold text-[#0b2545]">Publishing workflow</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#5b6b7f]">Changes are saved to the persistent SQLite database and become available to the public site on the next request. Uploaded files stay in the configured media directory.</p></AdminPanel></>;
}
