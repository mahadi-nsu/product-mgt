"use client";
import { Product } from "@/features/products/types";
import { formatPrice } from "@/features/products/utils";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageSrc =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : "/placeholder-product.jpg";
  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <div className="card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] h-full flex flex-col">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='18' fill='%236b7280' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center rounded-full bg-[var(--primary)]/90 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
              {product.category.name}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
            {product.name}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between mt-auto">
            <span className="text-xl font-bold text-[var(--primary)]">
              {formatPrice(product.price)}
            </span>

            {/* View Details Arrow */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <svg
                className="h-5 w-5 text-gray-400 group-hover:text-[var(--primary)] transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
