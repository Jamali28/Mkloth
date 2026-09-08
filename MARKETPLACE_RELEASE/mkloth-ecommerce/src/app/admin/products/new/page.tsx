import { getCategories } from "@/lib/data";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight">
          Add Product
        </h1>
        <p className="text-sm text-muted-foreground">
          Fill in the details to add a new product to the catalog.
        </p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
