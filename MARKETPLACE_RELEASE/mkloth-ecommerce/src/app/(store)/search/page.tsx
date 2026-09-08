import { getProducts, getCategories } from "@/lib/data";
import { ShopClient } from "@/components/shop/shop-client";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;

  const [categories, { products, total }] = await Promise.all([
    getCategories(),
    getProducts({ q: q || undefined }),
  ]);

  return (
    <ShopClient
      categories={categories.map((c) => ({
        name: c.name,
        slug: c.slug,
        count: c._count.products,
      }))}
      initialProducts={products}
      initialTotal={total}
      allTotal={categories.reduce((s, c) => s + c._count.products, 0)}
      initialFilters={{ q: q || undefined }}
      title={q ? `Search: "${q}"` : "Search"}
    />
  );
}
