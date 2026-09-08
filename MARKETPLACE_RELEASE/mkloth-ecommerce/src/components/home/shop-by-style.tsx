"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import {
  SectionHeading,
  fadeUp,
  staggerContainer,
} from "@/components/motion/animations";

type StyleItem = {
  name: string;
  slug: string;
  image: string;
  description?: string;
  count?: number;
};

const EASE = [0.22, 1, 0.36, 1] as const;

const STYLE_ACCENT: Record<string, { color: string; fg: string }> = {
  "drop-shoulder": { color: "#A56F4E", fg: "#F5F1E8" },
  crop: { color: "#B58D64", fg: "#F5F1E8" },
  polo: { color: "#7A5138", fg: "#F5F1E8" },
};

const accentFor = (slug: string) =>
  STYLE_ACCENT[slug] ?? { color: "#C6A15B", fg: "#11100E" };

export function ShopByStyle({ styles }: { styles: StyleItem[] }) {
  return (
    <section className="bg-[#241E1A] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Shop by Style"
          title="Pick Your Cut"
          subtitle="Three signature silhouettes. One premium standard. Find the fit that speaks to you."
          dark
        />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-12 grid gap-4 sm:gap-5 md:grid-cols-3 lg:gap-6"
      >
        {styles.map((style, i) => {
          const accent = accentFor(style.slug);
          return (
          <motion.div
            key={style.slug}
            variants={fadeUp}
            className={i === 1 ? "md:-mt-6 md:mb-6" : ""}
          >
            <Link
              href={`/collections/${style.slug}`}
              className="group relative block overflow-hidden rounded-2xl bg-muted"
              style={{ "--card-accent": accent.color, "--card-accent-fg": accent.fg } as CSSProperties}
            >
              <div className="relative aspect-[3/4] overflow-hidden sm:aspect-[4/5]">
                <Image
                  src={style.image}
                  alt={`${style.name} collection`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 transition-opacity duration-500 group-hover:from-black/90" />

                <div className="absolute left-4 top-4 flex items-center gap-2 sm:left-5 sm:top-5">
                  <span className="rounded-full bg-background/15 px-3 py-1 text-[11px] font-black uppercase tracking-[0.25em] text-white backdrop-blur-md">
                    0{i + 1}
                  </span>
                  {typeof style.count === "number" && (
                    <span className="rounded-full bg-[var(--card-accent)] px-3 py-1 text-[11px] font-black uppercase tracking-widest text-[var(--card-accent-fg)]">
                      {style.count} Tees
                    </span>
                  )}
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                  <p
                    className="text-[11px] font-bold uppercase tracking-[0.3em]"
                    style={{ color: accent.color + "CC" }}
                  >
                    MKLOTH · STYLE 0{i + 1}
                  </p>
                  <h3 className="mt-2 text-3xl font-black uppercase leading-none tracking-tight text-white sm:text-4xl">
                    {style.name}
                  </h3>

                  {style.description && (
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 sm:translate-y-2 group-hover:translate-y-0">
                      {style.description}
                    </p>
                  )}

                  <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-black uppercase tracking-widest text-black transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:gap-3 group-hover:bg-[var(--card-accent)] group-hover:text-[var(--card-accent-fg)]">
                    Shop Now
                    <ArrowRight className="size-4 transition-transform duration-300" />
                  </span>
                </div>

                <span className="absolute -right-10 -top-10 size-32 rounded-full bg-accent/0 blur-2xl transition-all duration-700 group-hover:bg-[var(--card-accent)]/30" />
                <span className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 translate-x-4 items-center justify-center rounded-full bg-white/90 text-black opacity-0 backdrop-blur transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100 group-hover:bg-[var(--card-accent)] group-hover:text-[var(--card-accent-fg)]">
                  <ArrowUpRight className="size-5" />
                </span>
              </div>
            </Link>
          </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
        className="mt-12 flex justify-center"
      >
        <Link
          href="/shop"
          className="group inline-flex items-center gap-2 rounded-full border border-[#C6A15B]/50 px-8 py-4 text-xs font-black uppercase tracking-widest text-[#F5F1E8] transition-all hover:bg-[#C6A15B] hover:text-[#11100E] active:scale-[0.97]"
        >
          View All Tees
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </motion.div>
      </div>
    </section>
  );
}
