"use client";
import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-dvh grid place-items-center p-6 bg-gradient-to-br from-[var(--ink)] via-[var(--green)] to-[var(--chestnut)]">
      <LoginForm />
    </main>
  );
}
