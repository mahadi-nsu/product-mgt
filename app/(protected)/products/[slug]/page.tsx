"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductDetails from "@/features/products/components/ProductDetails";

export default function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  return (
    <main className="p-0">
      <div className="mb-4">
        <Link
          href="/products"
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back to products
        </Link>
      </div>
      <ProductDetails slug={slug} />
    </main>
  );
}
