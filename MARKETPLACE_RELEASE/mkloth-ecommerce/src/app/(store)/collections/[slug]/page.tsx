import Image from "next/image";
import { notFound } from "next/navigation";
import { getProducts, getCategories } from "@/lib/data";
import { ShopClient } from "@/components/shop/shop-client";

export const dynamic = "force-dynamic";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) notFound();

  const { products, total } = await getProducts({ category: slug });

  const heroImage = category.image ?? `/images/categories/${slug}.svg`;

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={`${category.name} collection`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[46vh] max-w-7xl flex-col items-start justify-end px-4 pb-14 pt-32 sm:px-6 lg:px-8 lg:pb-20">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/70">
            MKLOTH · Collection
          </p>
          <h1 className="mt-3 text-5xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              {category.description}
            </p>
          )}
          <div className="mt-6 flex items-center gap-3">
            <span className="rounded-full bg-accent px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-accent-foreground">
              {total} Styles
            </span>
            <span className="rounded-full border border-white/25 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur">
              Cash on Delivery
            </span>
          </div>
        </div>
      </section>

      <ShopClient
        categories={categories.map((c) => ({
          name: c.name,
          slug: c.slug,
          count: c._count.products,
        }))}
        initialProducts={products}
        initialTotal={total}
        allTotal={categories.reduce((s, c) => s + c._count.products, 0)}
        initialFilters={{ category: slug }}
        title={category.name}
        hideTitle
      />
    </div>
  );
}
