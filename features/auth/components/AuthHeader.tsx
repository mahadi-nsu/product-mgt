"use client";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function AuthHeader() {
  const { email } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  function onLogout() {
    dispatch(logout());
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-10 border-b border-black/5 bg-[var(--surface)]/80 backdrop-blur">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-3">
        <a href="/products" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-[var(--sand)] grid place-items-center text-white font-semibold">
            PM
          </div>
          <span className="font-medium">Product Manager</span>
        </a>
        <div className="flex items-center gap-3">
          {email && (
            <span className="text-sm text-gray-600 hidden sm:block">
              {email}
            </span>
          )}
          <button
            onClick={onLogout}
            className="btn-destructive rounded-md px-3 py-1.5 text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
