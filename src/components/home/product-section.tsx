"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeading } from "@/components/motion/animations";
import { ProductCard } from "@/components/product/product-card";
import type { ProductWithRelations } from "@/lib/data";
import { cn } from "@/lib/utils";

export function ProductSection({
  title,
  eyebrow,
  subtitle,
  products,
  href,
  className,
}: {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  products: ProductWithRelations[];
  href?: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20",
        className
      )}
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          align="left"
          className="mb-0 max-w-xl"
        />
        {href && (
          <Link
            href={href}
            className="group mb-1 inline-flex items-center gap-2 rounded-full border border-foreground/15 px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-[0.97]"
          >
            View All
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-y-10">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
