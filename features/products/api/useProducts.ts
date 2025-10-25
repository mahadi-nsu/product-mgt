import useSWR from "swr";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Product } from "@/features/products/types";

const API = process.env.NEXT_PUBLIC_API_BASE || "https://api.bitechx.com";
const ITEMS_PER_PAGE = 12;

export function useProducts() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const searchedText = searchParams.get("searchedText") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const offsetParam = Number(searchParams.get("offset") || "0");

  const initialPage = Math.floor(offsetParam / ITEMS_PER_PAGE) + 1;
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    // Keep local page in sync when URL offset changes (e.g., via back/forward)
    const urlPage =
      Math.floor(Number(searchParams.get("offset") || "0") / ITEMS_PER_PAGE) +
      1;
    if (!Number.isNaN(urlPage) && urlPage !== currentPage) {
      setCurrentPage(urlPage);
    }
  }, [searchParams, currentPage]);

  // Build API key prioritizing category filter via products endpoint per requirements
  const key = categoryId
    ? `${API}/products?limit=${ITEMS_PER_PAGE}&offset=${
        (currentPage - 1) * ITEMS_PER_PAGE
      }&categoryId=${categoryId}`
    : searchedText
    ? `${API}/products/search?searchedText=${encodeURIComponent(searchedText)}`
    : `${API}/products?limit=${ITEMS_PER_PAGE}&offset=${
        (currentPage - 1) * ITEMS_PER_PAGE
      }`;

  const { data, error, isLoading } = useSWR(key);

  const { data: totalList } = useSWR(
    categoryId ? `${API}/products?categoryId=${categoryId}` : `${API}/products`
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("offset", String((page - 1) * ITEMS_PER_PAGE));
    router.replace(`${pathname}?${sp.toString()}`);
  };

  // Filter products based on search and category
  const filteredProducts = Array.isArray(data)
    ? searchedText && categoryId
      ? data.filter((p: Product) =>
          String(p.name || "")
            .toLowerCase()
            .includes(searchedText.toLowerCase())
        )
      : searchedText && !categoryId
      ? data
      : data
    : [];

  return {
    // Data
    products: filteredProducts,
    totalList,
    isLoading,
    error,

    // Pagination
    currentPage,
    totalItems: Array.isArray(totalList) ? totalList.length : 0,
    itemsPerPage: ITEMS_PER_PAGE,

    // Filters
    searchedText,
    categoryId,

    // Actions
    handlePageChange,

    // Computed
    showPagination:
      (categoryId || !searchedText) && filteredProducts.length > 0,
  };
}
