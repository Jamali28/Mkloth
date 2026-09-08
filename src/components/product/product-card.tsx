"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { formatPrice, cn } from "@/lib/utils";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import type { ProductWithRelations } from "@/lib/data";
import { useCart } from "@/components/cart/cart-provider";

export function ProductCard({
  product,
  index = 0,
}: {
  product: ProductWithRelations;
  index?: number;
}) {
  const { addItem } = useCart();

  const images = product.images.length
    ? product.images
    : [{ id: "fallback", url: PLACEHOLDER_IMAGE, position: 0 }];

  const image = images[0];
  const hasSale =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const discount = hasSale
    ? Math.round(
        (1 - product.price / (product.compareAtPrice ?? product.price)) * 100
      )
    : 0;

  const handleQuickAdd = () => {
    if (!product.inStock) return;
    const size = product.sizes[0]?.label ?? "M";
    const color = product.colors[0]?.name ?? "One Color";
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: images[0].url,
      size,
      color,
    });
    toast.success("Added to cart", { description: product.name });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.55,
        delay: (index % 4) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative flex flex-col"
    >
      <Link
        href={`/product/${product.slug}`}
        className="group/image relative block aspect-[4/5] overflow-hidden rounded-sm bg-muted"
      >
        <Image
          src={image.url}
          alt={product.name}
          fill
          priority={index < 4}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={cn(
            "object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]",
            images.length > 1 && "group-hover/image:opacity-0"
          )}
        />
        {images.length > 1 && (
          <Image
            src={images[1 % images.length].url}
            alt={`${product.name} alternate view`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="absolute inset-0 object-cover opacity-0 transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/image:scale-[1.04] group-hover/image:opacity-100"
          />
        )}

        {/* color swatches quick glance */}
        {product.colors.length > 1 && (
          <div className="absolute bottom-3 left-3 flex -space-x-1.5">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="size-3.5 rounded-full border border-white/70 shadow-sm"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}

        {/* badges */}
        {(!product.inStock || product.isNew) && (
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {product.isNew && (
              <span className="rounded-full bg-background px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.15em] shadow-sm">
                New
              </span>
            )}
            {!product.inStock && (
              <span className="rounded-full bg-background px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground shadow-sm">
                Sold Out
              </span>
            )}
          </div>
        )}

        {/* quick add on hover */}
        {product.inStock && (
          <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleQuickAdd();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-white/95 py-2.5 text-xs font-bold uppercase tracking-widest text-black shadow-lg backdrop-blur transition-colors hover:bg-accent active:scale-[0.98]"
            >
              <Plus className="size-3.5" />
              Quick Add
            </button>
          </div>
        )}
      </Link>

      <div className="mt-4 flex flex-col gap-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {product.category.name}
        </p>
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 text-sm font-semibold leading-snug transition-colors hover:text-foreground/70"
        >
          {product.name}
        </Link>
        <p className="mt-0.5 text-sm font-semibold text-foreground">
          {formatPrice(product.price)}
          {hasSale && (
            <span className="ml-2 text-xs font-normal text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </p>
      </div>
    </motion.div>
  );
}
