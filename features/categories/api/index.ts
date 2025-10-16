export const API =
  process.env.NEXT_PUBLIC_API_BASE || "https://api.bitechx.com";

export async function getCategories(params?: Record<string, string | number>) {
  const qs = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString()
    : "";
  const res = await fetch(`${API}/categories${qs}`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}
