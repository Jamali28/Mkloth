"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";

export function ProductGallery({
  images,
  name,
}: {
  images: { url: string; position: number }[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const gallery = images.length ? images : [{ url: PLACEHOLDER_IMAGE, position: 0 }];

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      <div className="flex gap-3 overflow-x-auto sm:flex-col sm:overflow-visible no-scrollbar">
        {gallery.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            className={cn(
              "relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-md border-2 transition-all cursor-pointer sm:w-20",
              active === i
                ? "border-primary"
                : "border-transparent opacity-70 hover:opacity-100"
            )}
            aria-label={`View image ${i + 1}`}
          >
            <Image
              src={img.url}
              alt={`${name} view ${i + 1}`}
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-xl bg-muted">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={gallery[active].url}
              alt={`${name} view ${active + 1}`}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          {active + 1} / {gallery.length}
        </div>
      </div>
    </div>
  );
}
