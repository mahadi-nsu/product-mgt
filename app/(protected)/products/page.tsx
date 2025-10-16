"use client";
import useSWR from "swr";
import { formatPrice } from "@/features/products/utils";

const API = process.env.NEXT_PUBLIC_API_BASE || "https://api.bitechx.com";

export default function ProductsPage() {
  const { data, error, isLoading } = useSWR(
    `${API}/products?limit=10&offset=0`
  );

  return (
    <main className="p-0">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <a href="/products/new" className="btn-primary rounded-md px-4 py-2">
          New Product
        </a>
      </div>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-[--color-destructive]">Failed to load</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((p: any) => (
          <a
            key={p.id}
            href={`/products/${p.slug}`}
            className="card p-4 hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <img
                src={p.images?.[0]}
                alt=""
                className="h-12 w-12 rounded object-cover"
              />
              <div>
                <h3 className="font-medium">{p.name}</h3>
                <p className="text-sm text-gray-500">{formatPrice(p.price)}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
