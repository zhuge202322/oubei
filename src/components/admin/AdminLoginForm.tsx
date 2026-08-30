"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/admin/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ username, password }) });
      if (!response.ok) {
        setError("Invalid username or password.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Unable to sign in right now.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={submit}>
      <label className="block text-sm font-medium text-[#20324a]">
        Username
        <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required className="mt-2 h-11 w-full border border-[#c7d2e1] px-3 text-sm outline-none focus:border-[#0b2545] focus:ring-2 focus:ring-[#0b2545]/15" />
      </label>
      <label className="block text-sm font-medium text-[#20324a]">
        Password
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required className="mt-2 h-11 w-full border border-[#c7d2e1] px-3 text-sm outline-none focus:border-[#0b2545] focus:ring-2 focus:ring-[#0b2545]/15" />
      </label>
      {error ? <p role="alert" className="border border-[#efb2b2] bg-[#fff5f5] px-3 py-2 text-sm text-[#a91f1f]">{error}</p> : null}
      <button type="submit" disabled={pending} className="h-11 w-full bg-[#c62828] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#a91f1f] disabled:cursor-not-allowed disabled:opacity-60">{pending ? "Signing in..." : "Sign in"}</button>
    </form>
  );
}
