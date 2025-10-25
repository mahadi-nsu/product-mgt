import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function formatPrice(centsOrNumber: number) {
  const value = Number(centsOrNumber);
  return new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
  }).format(value);
}

export function useDebounced<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export function useUrlParams() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const replaceParam = useCallback(
    (next: Record<string, string | null>) => {
      const sp = new URLSearchParams(params.toString());
      Object.entries(next).forEach(([k, v]) => {
        if (v === null || v === "") sp.delete(k);
        else sp.set(k, v);
      });
      // reset pagination when filters change
      sp.set("offset", "0");
      router.replace(`${pathname}?${sp.toString()}`);
    },
    [params, pathname, router]
  );

  return { replaceParam };
}
