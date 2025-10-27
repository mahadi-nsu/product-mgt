import useSWR from "swr";
import { Product } from "@/features/products/types";
import { useAppSelector } from "@/store";

const API = process.env.NEXT_PUBLIC_API_BASE || "https://api.bitechx.com";

// Custom fetcher with auth headers
const fetcher = async (url: string, token: string) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export function useAllProducts() {
  const token = useAppSelector((state) => state.auth.token);

  const { data, error, isLoading } = useSWR<Product[]>(
    token ? [`${API}/products`, token] : null,
    ([url, token]) => fetcher(url, token)
  );

  return {
    products: data || [],
    isLoading,
    error,
    totalCount: data?.length || 0,
  };
}
