import type { ReactNode } from "react";

export function AdminPageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <div className="mb-8 flex flex-col gap-4 border-b border-[#d4dde8] pb-6 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-semibold text-[#0b2545] sm:text-3xl">{title}</h1>{description ? <p className="mt-2 text-sm leading-6 text-[#5b6b7f]">{description}</p> : null}</div>{action}</div>;
}

export function AdminPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`border border-[#d4dde8] bg-white ${className}`}>{children}</section>;
}
