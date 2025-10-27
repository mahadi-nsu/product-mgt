"use client";
import ProductCard from "@/features/products/components/ProductCard";
import PaginationControls from "@/features/products/components/PaginationControls";
import FilterBar from "@/features/products/components/FilterBar";
import { useProducts } from "@/features/products/api";
import Link from "next/link";

export default function ProductsList() {
  const {
    products,
    isLoading,
    error,
    currentPage,
    totalItems,
    itemsPerPage,
    handlePageChange,
    showPagination,
  } = useProducts();

  return (
    <main className="p-0">
      {/* header and filter bar */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-semibold">Products</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/all-products"
            className="rounded-md border px-4 py-2 text-sm bg-white hover:bg-gray-50"
          >
            View All Products
          </Link>
          <Link
            href="/products/new"
            className="btn-primary rounded-md px-4 py-2"
          >
            New Product
          </Link>
        </div>
      </div>

      {/* filter bar */}
      <FilterBar />

      {/* loading state */}
      {isLoading && (
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
      )}

      {/* error state */}
      {error && (
        <div className="card p-6 text-center">
          <p className="text-[--color-destructive] mb-2">
            Failed to load products
          </p>
          <p className="text-sm text-gray-600">
            Please try refreshing the page
          </p>
        </div>
      )}

      {/* products list */}
      {products && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* no products found */}
      {products && products.length === 0 && (
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
            Get started by creating your first product.
          </p>
          <Link
            href="/products/new"
            className="btn-primary rounded-md px-4 py-2"
          >
            Create Product
          </Link>
        </div>
      )}

      {/* Pagination Controls: shown for category listing or plain listing; hidden for pure search */}
      {showPagination && (
        <div className="mt-8">
          <PaginationControls
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </main>
  );
}
