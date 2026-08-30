import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#eef2f7] text-[#0b2545]">{children}</div>;
}
