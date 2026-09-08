"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ShoppingBag, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useCart } from "@/components/cart/cart-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AddToCartForm({
  productId,
  slug,
  name,
  price,
  compareAtPrice,
  image,
  colors,
  sizes,
  inStock,
}: {
  productId: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  colors: { name: string; hex: string }[];
  sizes: { label: string }[];
  inStock: boolean;
}) {
  const { addItem, openCart } = useCart();
  const [color, setColor] = useState(colors[0]?.name ?? "");
  const [size, setSize] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (openAfter: boolean) => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }
    addItem({
      productId,
      slug,
      name,
      price,
      compareAtPrice,
      image,
      size,
      color,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
    if (openAfter) openCart();
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest">Color</p>
          <p className="text-xs text-muted-foreground">{color || "Select"}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <button
              key={c.name}
              onClick={() => setColor(c.name)}
              title={c.name}
              className={cn(
                "relative flex size-10 items-center justify-center rounded-full border-2 transition-all cursor-pointer",
                color === c.name
                  ? "border-primary"
                  : "border-muted hover:border-muted-foreground/40"
              )}
              style={{ backgroundColor: c.hex }}
              aria-label={c.name}
            >
              {color === c.name && (
                <Check
                  className={cn(
                    "size-4",
                    ["#111111", "#1f2a44", "#6f4e37", "#6b7f4e"].includes(
                      c.hex.toLowerCase()
                    )
                      ? "text-white"
                      : "text-black"
                  )}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest">Size</p>
          <p className="text-xs text-muted-foreground">
            {size ?? "Select a size"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s.label}
              onClick={() => setSize(s.label)}
              className={cn(
                "min-w-12 rounded-md border px-3 py-2.5 text-sm font-semibold transition-all cursor-pointer",
                size === s.label
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "hover:border-primary hover:bg-muted"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5 pt-2">
        {!inStock && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
            This item is currently out of stock.
          </div>
        )}

        <Button
          size="lg"
          disabled={!inStock}
          onClick={() => handleAdd(false)}
          className={cn("w-full overflow-hidden uppercase tracking-widest")}
        >
          <AnimatePresence mode="wait" initial={false}>
            {justAdded ? (
              <motion.span
                key="added"
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <Check className="size-4" /> Added to Cart
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <ShoppingBag className="size-4" /> Add to Cart
              </motion.span>
            )}
          </AnimatePresence>
        </Button>

        {inStock ? (
          <Button
            size="lg"
            variant="accent"
            onClick={() => handleAdd(true)}
            className="w-full uppercase tracking-widest"
          >
            <Zap className="size-4" /> Buy Now
          </Button>
        ) : (
          <Button
            size="lg"
            variant="outline"
            disabled
            className="w-full uppercase tracking-widest"
          >
            Sold Out
          </Button>
        )}
      </div>
    </div>
  );
}
