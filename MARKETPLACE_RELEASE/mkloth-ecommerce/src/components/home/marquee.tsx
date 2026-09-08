"use client";

const WORDS = [
  "Drop Shoulder",
  "Crop",
  "Polo",
  "Heavyweight",
  "Oversized",
  "Graphic Tees",
  "Pique",
  "Premium Cotton",
  "Boxy Fit",
  "Streetwear",
];

export function Marquee() {
  const items = [...WORDS, ...WORDS];
  return (
    <div className="relative overflow-hidden bg-primary py-4">
      <div className="flex w-max animate-marquee whitespace-nowrap will-change-transform">
        {items.map((word, i) => (
          <span
            key={i}
            aria-hidden={i >= WORDS.length}
            className="flex items-center gap-8 text-sm font-black uppercase tracking-[0.25em] text-primary-foreground"
          >
            {word}
            <span className="inline-block size-2 rounded-full bg-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}
