"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, ExternalLink, ImageIcon, KeyRound, LayoutDashboard, LogOut, Menu, Package, Settings2, Tags, X } from "lucide-react";
import { useState, type ReactNode } from "react";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/site", label: "Site settings", icon: Settings2 },
  { href: "/admin/media", label: "Media library", icon: ImageIcon },
  { href: "/admin/security", label: "Security", icon: KeyRound },
];

export default function AdminShell({ username, children }: { username: string; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
      <aside className={`${open ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-40 w-[250px] border-r border-[#17385f] bg-[#08203d] text-white transition-transform lg:static lg:translate-x-0`}>
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">Oubei</p><p className="mt-1 text-sm font-semibold">Site administration</p></div>
          <button type="button" aria-label="Close navigation" className="rounded-sm p-2 text-white/70 hover:bg-white/10 lg:hidden" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
        </div>
        <nav className="space-y-1 p-3" aria-label="Admin navigation">
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 text-sm ${active ? "bg-white/12 text-white" : "text-white/65 hover:bg-white/8 hover:text-white"}`}><Icon className="h-4 w-4" />{label}</Link>;
          })}
        </nav>
        <div className="absolute inset-x-0 bottom-0 border-t border-white/10 p-4">
          <p className="truncate text-xs text-white/55">Signed in as {username}</p>
          <button type="button" onClick={logout} className="mt-3 flex items-center gap-2 text-xs font-medium text-white/75 hover:text-white"><LogOut className="h-4 w-4" />Sign out</button>
        </div>
      </aside>
      {open ? <button type="button" aria-label="Close navigation overlay" className="fixed inset-0 z-30 bg-[#001e40]/35 lg:hidden" onClick={() => setOpen(false)} /> : null}
      <div className="min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-[#d4dde8] bg-white px-5 sm:px-8">
          <button type="button" aria-label="Open navigation" className="rounded-sm p-2 text-[#0b2545] hover:bg-[#edf2f7] lg:hidden" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
          <div className="hidden items-center gap-2 text-xs text-[#64748b] sm:flex"><BarChart3 className="h-4 w-4" />Content control center</div>
          <Link href="/" target="_blank" className="ml-auto flex items-center gap-2 text-xs font-semibold text-[#0b2545] hover:text-[#c62828]">View public site <ExternalLink className="h-4 w-4" /></Link>
        </header>
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
