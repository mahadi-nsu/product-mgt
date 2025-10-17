"use client";
import ProductForm from "@/features/products/components/ProductForm";

export default function NewProductPage() {
  return (
    <main className="p-0">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Create Product</h1>
      </div>
      <ProductForm />
    </main>
  );
}
