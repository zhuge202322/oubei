import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md border border-[#c7d2e1] bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-8 border-b border-[#e2e8f0] pb-6">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c62828]">Oubei administration</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#0b2545]">Sign in to manage site content</h1>
          <p className="mt-3 text-sm leading-6 text-[#526174]">Manage products, contact details, social links, and media assets.</p>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}
