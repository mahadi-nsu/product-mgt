"use client";
import useSWR from "swr";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE || "https://api.bitechx.com";

function useDebounced<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function FilterBar() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [searchInput, setSearchInput] = useState(
    params.get("searchedText") || ""
  );
  const debouncedSearch = useDebounced(searchInput);

  const currentCategoryId = params.get("categoryId") || "";

  const { data: categories } = useSWR(`${API}/categories`);

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

  useEffect(() => {
    // apply debounced search to URL
    if (debouncedSearch !== (params.get("searchedText") || "")) {
      replaceParam({ searchedText: debouncedSearch || null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const onChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    replaceParam({ categoryId: value || null });
  };

  const onClear = () => {
    setSearchInput("");
    replaceParam({ searchedText: null, categoryId: null });
  };

  const selectedCategoryName = useMemo(() => {
    return categories?.find((c: any) => c.id === currentCategoryId)?.name;
  }, [categories, currentCategoryId]);

  return (
    <div className="sticky top-[56px] z-10 mb-6 -mx-4 sm:mx-0">
      <div className="mx-4 sm:mx-0 rounded-xl bg-[var(--surface)]/80 backdrop-blur border border-black/5 p-3 sm:p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-9 outline-none focus:ring-2 focus:ring-[--color-primary]"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
          </div>
          <select
            value={currentCategoryId}
            onChange={onChangeCategory}
            className="w-[200px] rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[--color-primary]"
          >
            <option value="">All categories</option>
            {categories?.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          {(searchInput || currentCategoryId) && (
            <button
              onClick={onClear}
              className="rounded-md border px-3 py-2 text-sm bg-white hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      {selectedCategoryName && (
        <div className="mx-4 sm:mx-0 mt-2 text-xs text-gray-600">
          Filtering by: {selectedCategoryName}
        </div>
      )}
    </div>
  );
}
