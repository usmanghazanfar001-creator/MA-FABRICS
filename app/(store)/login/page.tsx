"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/lib/auth/actions";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await loginUser({ email, password });
    setLoading(false);
    if (result.success) {
      router.push(searchParams.get("redirect") ?? "/account");
    } else {
      setError(result.error ?? "Something went wrong.");
    }
  }

  return (
    <div className="mx-auto max-w-sm px-6 pb-24 pt-40 lg:px-10">
      <h1 className="mb-8 font-display text-3xl text-navy">Sign in</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm text-navy">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-navy/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-navy">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-navy/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-gold"
          />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-navy/60">
        New to MA Fabrics? <Link href="/register" className="text-navy underline">Create an account</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
