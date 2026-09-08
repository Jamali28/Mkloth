"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative overflow-hidden rounded-2xl bg-[#241E1A]"
      >
        <Image
          src="/images/promo.svg"
          alt=""
          fill
          priority={false}
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#241E1A] via-[#3A2418]/80 to-transparent" />

        <div className="relative z-10 grid gap-8 px-6 py-16 sm:px-12 md:grid-cols-[1.2fr_0.8fr] md:items-center lg:py-20">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#C6A15B]/35 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em]"
            >
              <span className="size-1.5 animate-pulse rounded-full bg-accent" />
              Limited Time
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="mt-5 text-3xl font-black uppercase leading-[0.98] tracking-tight text-primary-foreground sm:text-5xl"
            >
              Seasonal Sale
              <br />
              Up to <span className="text-accent">25% Off</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
              className="mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/70 sm:text-base"
            >
              Refresh your rotation. Heavy discounts on select Drop Shoulder,
              Crop and Polo tees — only while stock lasts.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
              className="mt-8"
            >
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-black uppercase tracking-widest text-accent-foreground transition-all duration-300 hover:shadow-lg hover:shadow-accent/30 active:scale-[0.97]"
              >
                Shop the Sale
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          <div className="hidden justify-end md:flex">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
              className="relative h-64 w-64 lg:h-72 lg:w-72"
            >
              <div className="absolute inset-0 rotate-6 rounded-xl border-2 border-accent/40" />
              <Image
                src="/images/promo-2.svg"
                alt="T-shirt on sale"
                fill
                sizes="288px"
                className="rounded-xl object-cover"
              />
              <div className="absolute -left-5 -top-5 flex size-20 -rotate-12 items-center justify-center rounded-full bg-accent text-center text-accent-foreground shadow-xl">
                <p className="text-[10px] font-black uppercase leading-tight">
                  Up to
                  <br />
                  25% off
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
