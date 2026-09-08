import { getProducts, getCategories, type ProductFilters } from "@/lib/data";
import { ShopClient } from "@/components/shop/shop-client";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const asArray = (v: string | string[] | undefined) =>
    v ? (Array.isArray(v) ? v : [v]) : undefined;

  const filters: ProductFilters = {
    q: typeof sp.q === "string" ? sp.q : undefined,
    category: typeof sp.category === "string" ? sp.category : undefined,
    sort: (typeof sp.sort === "string"
      ? sp.sort
      : "newest") as ProductFilters["sort"],
    minPrice: sp.min ? Number(sp.min) : undefined,
    maxPrice: sp.max ? Number(sp.max) : undefined,
    sizes: asArray(sp.size),
    colors: asArray(sp.color),
    isNew: sp.new === "1",
    isBestSeller: sp.best === "1",
  };

  const [categories, { products, total }] = await Promise.all([
    getCategories(),
    getProducts(filters),
  ]);

  const activeCategory = categories.find(
    (c) => c.slug === filters.category
  )?.name;

  const title = filters.isNew
    ? "New Arrivals"
    : filters.isBestSeller
      ? "Best Sellers"
      : activeCategory
        ? activeCategory
        : filters.q
          ? `Results for "${filters.q}"`
          : "Shop All";

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
      initialFilters={filters}
      title={title}
    />
  );
}
