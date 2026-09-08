import { notFound } from "next/navigation";

import { getCategories, getProductById } from "@/lib/data";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categories, product] = await Promise.all([
    getCategories(),
    getProductById(id),
  ]);

  if (!product) notFound();

  const initial = {
    name: product.name,
    description: product.description,
    price: String(product.price),
    compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
    categoryId: product.categoryId,
    inStock: product.inStock,
    isNew: product.isNew,
    isBestSeller: product.isBestSeller,
    featured: product.featured,
    images: product.images.map((i) => i.url),
    colors: product.colors.map((c) => ({ name: c.name, hex: c.hex })),
    sizes: product.sizes.map((s) => s.label),
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight">
          Edit Product
        </h1>
        <p className="text-sm text-muted-foreground">{product.name}</p>
      </div>
      <ProductForm categories={categories} initial={initial} productId={product.id} />
    </div>
  );
}
