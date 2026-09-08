"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { formatPrice } from "@/lib/utils";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    totalCount,
  } = useCart();

  const remainingForFree = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/60"
          onClick={closeCart}
        />
      )}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="size-5" />
                <h2 className="text-lg font-black uppercase tracking-tight">
                  Your Cart
                </h2>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">
                  {totalCount}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="inline-flex size-9 items-center justify-center rounded-md transition-colors hover:bg-muted cursor-pointer"
                aria-label="Close cart"
              >
                <X className="size-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                  <ShoppingBag className="size-7 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-base font-semibold">Your cart is empty</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Looks like you haven&apos;t added anything yet.
                  </p>
                </div>
                <Button onClick={closeCart} asChild>
                  <Link href="/shop">Start Shopping</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="border-b px-5 py-3">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-medium text-muted-foreground">
                      {remainingForFree > 0
                        ? `Add ${formatPrice(remainingForFree)} more for free delivery`
                        : "You've unlocked free delivery!"}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full rounded-full bg-accent"
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-4"
                      >
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={closeCart}
                          className="relative block aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-md bg-muted"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold">
                                {item.name}
                              </p>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {item.color} · Size {item.size}
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="shrink-0 text-muted-foreground transition-colors hover:text-destructive cursor-pointer"
                              aria-label="Remove item"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center rounded-md border">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="flex size-7 items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                                aria-label="Decrease"
                              >
                                <Minus className="size-3.5" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="flex size-7 items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                                aria-label="Increase"
                              >
                                <Plus className="size-3.5" />
                              </button>
                            </div>
                            <span className="text-sm font-bold">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="border-t px-5 py-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="font-medium">
                        {deliveryFee === 0 ? (
                          <span className="font-semibold text-emerald-600">
                            Free
                          </span>
                        ) : (
                          formatPrice(deliveryFee)
                        )}
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-base">
                      <span className="font-semibold">Total</span>
                      <span className="font-black">{formatPrice(total)}</span>
                    </div>
                  </div>
                  <Button asChild size="lg" className="mt-4 w-full uppercase tracking-widest">
                    <Link href="/checkout" onClick={closeCart}>
                      Checkout · Cash on Delivery
                    </Link>
                  </Button>
                  <button
                    onClick={closeCart}
                    className="mt-3 w-full text-center text-xs font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                  >
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
