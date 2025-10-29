"use client";
import { useRef, useState, useEffect, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import ProductCard from "@/features/products/components/ProductCard";
import { useAllProducts } from "@/features/all-products/api";
import { Product } from "@/features/products/types";
import Link from "next/link";
import PerformanceMonitor from "@/features/debug/PerformanceMonitor";

// Hook to detect column count based on screen size (Step 4)
function useColumnCount() {
  const [columns, setColumns] = useState(4);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= 1280) setColumns(4); // xl: 4 columns
      else if (width >= 1024) setColumns(3); // lg: 3 columns
      else if (width >= 640) setColumns(2); // sm: 2 columns
      else setColumns(1); // default: 1 column
    };

    updateColumns(); // Set initial value
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  return columns;
}

export default function AllProductsList() {
  const { products, isLoading, error, totalCount } = useAllProducts();

  // Detect responsive column count (Step 4)
  const columns = useColumnCount();

  // Step 5: Group products into rows based on column count
  const rows = useMemo(() => {
    const result: Product[][] = [];
    for (let i = 0; i < products.length; i += columns) {
      result.push(products.slice(i, i + columns));
    }
    return result;
  }, [products, columns]);

  // Calculate total row count
  const rowCount = rows.length;

  // Ref for the scroll container (Step 3)
  const parentRef = useRef<HTMLDivElement>(null);

  // Virtualizer hook - now using row count (Step 5)
  const rowVirtualizer = useVirtualizer({
    count: rowCount, // Total rows to virtualize (not products!)
    getScrollElement: () => parentRef.current, // Which element scrolls
    estimateSize: () => 400, // Estimated height per row (will adjust)
    overscan: 2, // Render 2 extra rows outside viewport for smooth scrolling
  });

  // Generate grid column class based on column count
  const gridColsClass = useMemo(() => {
    switch (columns) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-3";
      case 4:
        return "grid-cols-4";
      default:
        return "grid-cols-1";
    }
  }, [columns]);

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
        <div
          ref={parentRef}
          className="overflow-auto"
          style={{
            height: "calc(100vh - 180px)", // Viewport height minus header space
          }}
        >
          {/* Step 6: Virtual rendering container */}
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {/* Only render visible rows */}
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const productsInRow = rows[virtualRow.index];

              return (
                <div
                  key={virtualRow.key}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {/* Grid for products in this row */}
                  <div className={`grid ${gridColsClass} gap-6 items-stretch`}>
                    {productsInRow.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Performance Monitor - for measuring issues before virtualization */}
      <PerformanceMonitor />
    </main>
  );
}
