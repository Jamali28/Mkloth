import { getCategories } from "@/lib/data";
import { CategoriesManager } from "@/components/admin/categories-manager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight">
          Categories
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage store categories. Product counts are shown for reference.
        </p>
      </div>
      <CategoriesManager
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          image: c.image,
          description: c.description,
          count: c._count.products,
        }))}
      />
    </div>
  );
}
