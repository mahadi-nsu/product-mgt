"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store";
import { Product } from "@/features/products/types";
import { Category } from "@/features/categories/types";

const API = process.env.NEXT_PUBLIC_API_BASE || "https://api.bitechx.com";

// ✅ Schema
const schema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(5, "Description is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  categoryId: z.string().uuid("Select a category"),
});

// ✅ Use `z.input` (not `z.infer` or `z.output`) — matches what zodResolver expects
type FormValues = z.input<typeof schema>;

export default function ProductForm() {
  const router = useRouter();
  const token = useAppSelector((s) => s.auth.token);

  const { data: categories } = useSWR<Category[]>(`${API}/categories`);
  const { data: productsForImages } = useSWR<Product[]>(`${API}/products`);

  // ✅ Fix type mismatch between zodResolver and useForm
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  // ✅ Properly typed SubmitHandler
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const pool: string[] = Array.isArray(productsForImages)
      ? productsForImages
          .flatMap((p: Product) => (Array.isArray(p.images) ? p.images : []))
          .filter(Boolean)
      : [];
    const fallback =
      pool.length > 0
        ? pool[Math.floor(Math.random() * pool.length)]
        : "https://picsum.photos/seed/pm/800/600";

    try {
      const res = await fetch(`${API}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          ...values,
          price: Number(values.price), // ensure numeric
          images: [fallback],
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Request failed: ${res.status}`);
      }

      const created = await res.json();
      router.push(`/products/${created.slug}`);
    } catch (e) {
      alert((e as Error).message);
    }
  };

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

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Price (BDT)</label>
          <input
            type="number"
            step="any"
            {...register("price")}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[--color-primary]"
            placeholder="1000"
          />
          {errors.price && (
            <p className="text-sm text-[--color-destructive] mt-1">
              {errors.price.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            {...register("categoryId")}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[--color-primary]"
            defaultValue=""
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories?.map((c: Category) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-sm text-[--color-destructive] mt-1">
              {errors.categoryId.message}
            </p>
          )}
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
          onClick={() => router.push("/products")}
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
          {isSubmitting ? "Creating..." : "Create Product"}
        </button>
      </div>
    </form>
  );
}
