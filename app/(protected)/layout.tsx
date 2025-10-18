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

  // Show loading state while checking authentication
  if (!hydrated) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading state while redirecting to login
  if (!token) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh">
      <AuthHeader />
      <div className="mx-auto max-w-6xl p-6">{children}</div>
    </div>
  );
}
