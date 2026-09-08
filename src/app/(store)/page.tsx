import { getCategories, getNewArrivals, getBestSellers } from "@/lib/data";
import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { ShopByStyle } from "@/components/home/shop-by-style";
import { ProductSection } from "@/components/home/product-section";
import { PromoBanner } from "@/components/home/promo-banner";

export default async function HomePage() {
  const [categories, newArrivals, bestSellers] = await Promise.all([
    getCategories(),
    getNewArrivals(4),
    getBestSellers(4),
  ]);

  const styleItems = categories.map((c) => ({
    name: c.name,
    slug: c.slug,
    image: c.image ?? `/images/categories/${c.slug}.svg`,
    description: c.description ?? undefined,
    count: c._count.products,
  }));

  return (
    <>
      <Hero />
      <Marquee />
      <ShopByStyle styles={styleItems} />
      <div className="border-y border-border bg-card">
        <ProductSection
          eyebrow="Most Wanted"
          title="Best Sellers"
          subtitle="The tees everyone keeps coming back for."
          products={bestSellers}
          href="/shop?best=1"
        />
      </div>
      <ProductSection
        eyebrow="Fresh Drops"
        title="New Arrivals"
        subtitle="Just landed — cop before they're gone."
        products={newArrivals}
        href="/shop?sort=newest&new=1"
      />
      <PromoBanner />
    </>
  );
}
