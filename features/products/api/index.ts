export const API =
  process.env.NEXT_PUBLIC_API_BASE || "https://api.bitechx.com";

export async function getProducts(params?: Record<string, string | number>) {
  const qs = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString()
    : "";
  const res = await fetch(`${API}/products${qs}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function getProductsCount(): Promise<number> {
  // Get total count by fetching with a high limit
  const res = await fetch(`${API}/products?limit=1000`);
  if (!res.ok) throw new Error("Failed to fetch products count");
  const products = await res.json();
  return Array.isArray(products) ? products.length : 0;
}
