"use client";
import AuthHeader from "@/features/auth/components/AuthHeader";
import { useAppSelector } from "@/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, hydrated } = useAppSelector((s) => s.auth);
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !token) {
      router.replace("/login");
    }
  }, [token, hydrated, router]);

  if (!hydrated) return null;
  if (!token) return null;

  return (
    <div className="min-h-dvh">
      <AuthHeader />
      <div className="mx-auto max-w-6xl p-6">{children}</div>
    </div>
  );
}
