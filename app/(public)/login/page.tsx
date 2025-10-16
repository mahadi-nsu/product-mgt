"use client";
import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { useAppDispatch } from "@/store";
import { setCredentials } from "@/store/slices/authSlice";

async function authFetcher(url: string, { arg }: { arg: { email: string } }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE || "https://api.bitechx.com"}/auth`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(arg),
    }
  );
  if (!res.ok) throw new Error("Auth failed");
  return res.json() as Promise<{ token: string }>;
}

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("mahadi.nsucse@gmail.com");
  const { trigger, isMutating, error } = useSWRMutation("/auth", authFetcher);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { token } = await trigger({ email });
    dispatch(setCredentials({ email, token }));
    window.location.href = "/products";
  };

  return (
    <main className="min-h-dvh grid place-items-center p-6 bg-gradient-to-br from-[var(--ink)] via-[var(--green)] to-[var(--chestnut)]">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-xl p-8 text-[--color-foreground]">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[var(--sand)] grid place-items-center text-white font-semibold">
            PM
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">
              Product Manager
            </h1>
            <p className="text-sm text-white/80">Sign in to continue</p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/90">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-md border border-white/20 bg-white/80 px-3 py-3 text-[--ink] placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[--color-primary] focus:border-transparent"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-200">{String(error)}</p>}
          <button
            className="w-full rounded-md px-4 py-3 font-medium bg-[var(--green)] text-white hover:brightness-110 active:brightness-95 transition disabled:opacity-60"
            disabled={isMutating}
          >
            {isMutating ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-white/70">
          By continuing you agree to our{" "}
          <a
            className="underline decoration-white/40 hover:decoration-white"
            href="#"
          >
            Terms
          </a>{" "}
          and{" "}
          <a
            className="underline decoration-white/40 hover:decoration-white"
            href="#"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </main>
  );
}
