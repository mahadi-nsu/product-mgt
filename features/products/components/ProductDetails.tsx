"use client";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/features/products/types";
import { useAppSelector } from "@/store";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE || "https://api.bitechx.com";

export default function ProductDetails({ slug }: { slug: string }) {
  const router = useRouter();
  const { data, error, isLoading } = useSWR<Product>(`${API}/products/${slug}`);
  const token = useAppSelector((s) => s.auth.token);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  if (isLoading) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-64 bg-gray-200 rounded-md mb-6" />
        <div className="h-6 w-1/2 bg-gray-200 rounded mb-3" />
        <div className="h-4 w-2/3 bg-gray-200 rounded mb-6" />
        <div className="h-10 w-40 bg-gray-200 rounded" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="card p-6 text-center">
        <p className="text-[--color-destructive] mb-2">
          Failed to load product
        </p>
        <button
          onClick={() => router.back()}
          className="rounded-md border px-3 py-2 text-sm bg-white hover:bg-gray-50"
        >
          Go back
        </button>
      </div>
    );
  }

  const product = data as Product;
  const imageSrc =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : "/placeholder-product.jpg";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="card overflow-hidden">
        <div className="relative aspect-square bg-gray-100">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover"
          />
          {product.category?.name && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center rounded-full bg-[var(--primary)]/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {product.category.name}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="card p-6">
        <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
        <p className="text-sm text-gray-600 mb-4">Slug: {product.slug}</p>
        <p className="text-gray-800 leading-relaxed mb-6">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Price</div>
            <div className="text-2xl font-bold text-[var(--primary)]">
              ৳ {new Intl.NumberFormat("bn-BD").format(product.price)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/products/${product.id}/edit`}
              className="rounded-md px-3 py-2 text-sm bg-[var(--sand)] text-white hover:brightness-110"
            >
              Edit
            </Link>
            <button
              className="btn-destructive rounded-md px-3 py-2 text-sm"
              onClick={() => setShowConfirm(true)}
            >
              Delete
            </button>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <div className="font-medium text-gray-800 mb-1">Category</div>
            <div>{product.category?.name}</div>
          </div>
          <div>
            <div className="font-medium text-gray-800 mb-1">Created</div>
            <div>{new Date(product.createdAt).toLocaleString()}</div>
          </div>
          <div>
            <div className="font-medium text-gray-800 mb-1">Updated</div>
            <div>{new Date(product.updatedAt).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={`fixed bottom-6 right-6 rounded-md px-4 py-2 text-sm shadow ${
            feedback.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {feedback.msg}
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm grid place-items-center p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Delete product?</h3>
            <p className="text-sm text-gray-600 mb-4">
              This sends a DELETE request and returns 200 on success.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="rounded-md border px-3 py-2 text-sm bg-white hover:bg-gray-50"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="btn-destructive rounded-md px-3 py-2 text-sm disabled:opacity-60"
                onClick={async () => {
                  if (!token) {
                    setFeedback({ type: "error", msg: "Not authenticated" });
                    return;
                  }
                  setIsDeleting(true);
                  try {
                    const res = await fetch(`${API}/products/${product.id}`, {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    if (res.ok) {
                      setFeedback({
                        type: "success",
                        msg: "Product deleted successfully",
                      });
                      setShowConfirm(false);
                      await new Promise((r) => setTimeout(r, 1500));
                      router.push("/products");
                    } else {
                      setFeedback({
                        type: "error",
                        msg: `Delete failed: ${res.status}`,
                      });
                      await new Promise((r) => setTimeout(r, 1500));
                    }
                  } catch (e) {
                    setFeedback({ type: "error", msg: "Network error" });
                    await new Promise((r) => setTimeout(r, 1500));
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Confirm delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
