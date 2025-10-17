import ProductEditForm from "@/features/products/components/ProductEditForm";

interface EditProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { slug } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600">Update product information</p>
      </div>
      <ProductEditForm productSlug={slug} />
    </div>
  );
}
