import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Truck, RefreshCcw, ShieldCheck, Package } from "lucide-react";

import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { ProductGallery } from "@/components/product/product-gallery";
import { AddToCartForm } from "@/components/product/add-to-cart-form";
import { ProductSection } from "@/components/home/product-section";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
  };
}

const PERKS = [
  { icon: Truck, title: "Free Delivery", text: "On orders over $100" },
  { icon: RefreshCcw, title: "Easy Exchange", text: "Within 7 days" },
  { icon: ShieldCheck, title: "COD Available", text: "Pay at your door" },
];

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const related = await getRelatedProducts(product.id, product.categoryId, 4);
  const hasSale =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const discount = hasSale
    ? Math.round(
        (1 - product.price / (product.compareAtPrice ?? product.price)) * 100
      )
    : 0;

  const firstImage =
    product.images[0]?.url ?? PLACEHOLDER_IMAGE;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="size-3.5" />
        <Link
          href={`/collections/${product.category.slug}`}
          className="hover:text-foreground"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="font-medium text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
              {product.category.name}
            </p>
            {product.isNew && (
              <Badge variant="accent" className="uppercase tracking-widest text-[10px]">
                New
              </Badge>
            )}
            {product.isBestSeller && (
              <Badge className="uppercase tracking-widest text-[10px]">
                Best Seller
              </Badge>
            )}
          </div>

          <h1 className="mt-2 text-3xl font-black uppercase leading-tight tracking-tight sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-black">{formatPrice(product.price)}</span>
            {hasSale && (
              <>
                <span className="text-base text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice!)}
                </span>
                <Badge variant="destructive">{discount}% OFF</Badge>
              </>
            )}
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs">
            <span
              className={`size-2 rounded-full ${
                product.inStock ? "bg-emerald-500" : "bg-destructive"
              }`}
            />
            <span className={product.inStock ? "text-emerald-600" : "text-destructive"}>
              {product.inStock ? "In stock" : "Out of stock"}
            </span>
          </div>

          <p className="mt-6 leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-8">
            <AddToCartForm
              productId={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              image={firstImage}
              colors={product.colors}
              sizes={product.sizes}
              inStock={product.inStock}
            />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {PERKS.map((perk) => (
              <div
                key={perk.title}
                className="flex flex-col items-center gap-1.5 rounded-lg border px-3 py-4 text-center"
              >
                <perk.icon className="size-5" />
                <p className="text-xs font-bold">{perk.title}</p>
                <p className="text-[10px] text-muted-foreground">{perk.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg bg-muted p-4 text-sm">
            <div className="flex items-start gap-3">
              <Package className="mt-0.5 size-5 shrink-0" />
              <div>
                <p className="font-semibold">Delivery estimate</p>
                <p className="text-muted-foreground">
                  Lahore & Karachi: 1–2 days · Other cities: 3–5 business days.
                  Cash on Delivery available nationwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <ProductSection
          eyebrow="Complete the look"
          title="You May Also Like"
          products={related}
          className="mt-20"
        />
      )}
    </div>
  );
}
