"use client";
import ProductCard from "@/features/products/components/ProductCard";
import { useAllProducts } from "@/features/all-products/api";
import Link from "next/link";

export default function AllProductsList() {
  const { products, isLoading, error, totalCount } = useAllProducts();

  if (isLoading) {
    return (
      <main className="p-0">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-semibold">All Products</h1>
          <Link href="/products" className="btn-primary rounded-md px-4 py-2">
            Back to Paginated View
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-0">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-semibold">All Products</h1>
          <Link href="/products" className="btn-primary rounded-md px-4 py-2">
            Back to Paginated View
          </Link>
        </div>
        <div className="card p-6 text-center">
          <p className="text-[--color-destructive] mb-2">
            Failed to load products
          </p>
          <p className="text-sm text-gray-600 mb-4">
            {error.message || "Please try refreshing the page"}
          </p>
          <Link href="/products" className="btn-primary rounded-md px-4 py-2">
            Go to Paginated View
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="p-0">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-semibold">All Products ({totalCount})</h1>
        <Link href="/products" className="btn-primary rounded-md px-4 py-2">
          Back to Paginated View
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600 mb-4">
            There are no products available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
