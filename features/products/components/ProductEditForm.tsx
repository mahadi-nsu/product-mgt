"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store";
import { Product } from "@/features/products/types";
import { Category } from "@/features/categories/types";
import { useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE || "https://api.bitechx.com";

// Schema for edit form (only name and description can be updated)
const schema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(5, "Description is required"),
});

type FormValues = z.input<typeof schema>;

interface ProductEditFormProps {
  productSlug: string;
}

export default function ProductEditForm({ productSlug }: ProductEditFormProps) {
  const router = useRouter();
  const token = useAppSelector((s) => s.auth.token);

  const {
    data: product,
    error,
    isLoading,
  } = useSWR<Product>(`${API}/products/${productSlug}`);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  // Reset form when product data loads
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
      });
    }
  }, [product, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (!product) return;

    try {
      const res = await fetch(`${API}/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Request failed: ${res.status}`);
      }

      const updated = await res.json();
      router.push(`/products/${updated.slug}`);
    } catch (e) {
      alert((e as Error).message);
    }
  };

  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="card p-6">
        <div className="text-center">
          <p className="text-red-600">Failed to load product</p>
          <button
            onClick={() => router.push("/products")}
            className="mt-4 btn-primary rounded-md px-4 py-2 text-sm"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            {...register("name")}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[--color-primary]"
            placeholder="Product name"
          />
          {errors.name && (
            <p className="text-sm text-[--color-destructive] mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Price (read-only) */}
        <div>
          <label className="block text-sm font-medium mb-1">Price (BDT)</label>
          <input
            type="text"
            value={product.price.toLocaleString()}
            disabled
            className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Price cannot be changed</p>
        </div>

        {/* Category (read-only) */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            type="text"
            value={product.category.name}
            disabled
            className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">
            Category cannot be changed
          </p>
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register("description")}
            rows={5}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[--color-primary]"
            placeholder="Tell something about this product"
          />
          {errors.description && (
            <p className="text-sm text-[--color-destructive] mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => router.push(`/products/${product.slug}`)}
          className="rounded-md border px-4 py-2 text-sm bg-white hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary rounded-md px-4 py-2 text-sm text-white disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Product"}
        </button>
      </div>
    </form>
  );
}
