"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const SLIDES = [
  {
    name: "Drop Shoulder",
    slug: "drop-shoulder",
    tagline: "Oversized Comfort",
    image: "/images/hero/hero-drop-shoulder.svg",
    accent: "#A56F4E",
  },
  {
    name: "Crop",
    slug: "crop",
    tagline: "Short & Statement",
    image: "/images/hero/hero-crop.svg",
    accent: "#B58D64",
  },
  {
    name: "Polo",
    slug: "polo",
    tagline: "Clean & Classic",
    image: "/images/hero/hero-polo.svg",
    accent: "#7A5138",
  },
];

const AUTO_SLIDE_MS = 6000;

export function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (i: number) => setIndex((i + SLIDES.length) % SLIDES.length),
    []
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, AUTO_SLIDE_MS);
    return () => clearInterval(timer);
  }, [next, paused, index]);

  const slide = SLIDES[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="relative h-[calc(100svh-92px)] min-h-[520px] overflow-hidden bg-[#11100E]"
      style={{ "--hero-accent": slide.accent } as CSSProperties}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 50) {
          if (delta < 0) next();
          else prev();
        }
        touchStartX.current = null;
      }}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={slide.slug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="absolute inset-0"
        >
          <motion.div
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={slide.image}
              alt={`${slide.name} collection`}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-r from-[#11100E]/90 via-[#11100E]/40 to-[#11100E]/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11100E]/70 via-transparent to-[#11100E]/20" />

          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
                className="inline-flex items-center gap-2 rounded-full border border-[#C6A15B]/35 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.3em] text-[#F5F1E8] backdrop-blur-md"
              >
                <span className="size-1.5 rounded-full bg-[var(--hero-accent)]" />
                MKLOTH · Style 0{index + 1}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.28, ease: EASE }}
                className="mt-6 text-[clamp(3rem,9vw,7rem)] font-black uppercase leading-[0.92] tracking-tighter text-[#F5F1E8]"
              >
                {slide.name}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.42, ease: EASE }}
                className="mt-5 max-w-md text-base leading-relaxed text-[#BDB5A8] sm:text-lg"
              >
                {slide.tagline}. Heavyweight fabric, signature fit —
                engineered for the streets.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.56, ease: EASE }}
                className="mt-9"
              >
                <Link
                  href={`/collections/${slide.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full bg-[#C6A15B] px-8 py-4 text-sm font-black uppercase tracking-widest text-[#11100E] shadow-lg shadow-[#C6A15B]/25 transition-all duration-300 hover:bg-[#B08F4C] hover:shadow-xl hover:shadow-[#C6A15B]/30 active:scale-[0.97]"
                >
                  Shop Collection
                  <ArrowRight className="size-4 transition-transform duration-300" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black active:scale-95 sm:left-6 sm:size-12 cursor-pointer"
      >
        <ChevronLeft className="size-5 sm:size-6" />
      </button>

      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black active:scale-95 sm:right-6 sm:size-12 cursor-pointer"
      >
        <ChevronRight className="size-5 sm:size-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2.5 sm:bottom-8">
        {SLIDES.map((s, i) => (
          <button
            key={s.slug}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}: ${s.name}`}
            className={cn(
              "h-2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer",
              i === index ? "w-8 bg-[var(--hero-accent)]" : "w-2 bg-white/40 hover:bg-white/70"
            )}
          />
        ))}
      </div>

      <div className="absolute bottom-6 right-4 z-10 hidden items-center gap-1 text-sm font-bold tabular-nums tracking-widest text-[#BDB5A8] sm:right-8 sm:flex sm:bottom-8">
        <span className="text-accent">0{index + 1}</span>
        <span className="mx-1 h-px w-6 bg-[#C6A15B]/40" />
        <span>0{SLIDES.length}</span>
      </div>
    </section>
  );
}
