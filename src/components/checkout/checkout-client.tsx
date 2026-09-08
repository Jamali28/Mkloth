"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  Loader2,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { formatPrice } from "@/lib/utils";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PROVINCE_OPTIONS = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Gilgit-Baltistan",
];

export function CheckoutClient() {
  const { items, subtotal, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{ number: string } | null>(null);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    province: "",
    note: "",
  });

  const deliveryFee =
    subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const placeOrder = async () => {
    if (items.length === 0) return;

    if (!form.customerName.trim() || !form.phone.trim() || !form.address.trim() || !form.city.trim() || !form.province) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!/^[\d+\-\s]{10,}$/.test(form.phone.trim())) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            size: i.size,
            color: i.color,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong");
        return;
      }

      setOrderResult({ number: data.orderNumber });
      clearCart();
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderResult) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center sm:px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="flex size-20 items-center justify-center rounded-full bg-emerald-100"
        >
          <CheckCircle2 className="size-10 text-emerald-600" />
        </motion.div>
        <h1 className="mt-6 text-3xl font-black uppercase tracking-tight">
          Order Placed!
        </h1>
        <p className="mt-3 text-muted-foreground">
          Thank you for shopping with MKloth. Your order has been confirmed
          and will be delivered via Cash on Delivery.
        </p>
        <div className="mt-6 w-full rounded-xl border p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Order Number
          </p>
          <p className="mt-1 text-2xl font-black tracking-wider">
            {orderResult.number}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Our team will contact you shortly to verify your order.
          </p>
        </div>
        <div className="mt-8 flex gap-3">
          <Button asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center sm:px-6">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="size-7 text-muted-foreground" />
        </div>
        <h1 className="mt-5 text-2xl font-black uppercase tracking-tight">
          Your cart is empty
        </h1>
        <p className="mt-2 text-muted-foreground">
          Add some pieces before heading to checkout.
        </p>
        <Button asChild className="mt-6">
          <Link href="/shop">
            <ArrowLeft className="size-4" /> Start Shopping
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Continue shopping
      </Link>
      <h1 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl">
        Checkout
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                1
              </span>
              Contact Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={form.customerName}
                  onChange={set("customerName")}
                  placeholder="Ahmed Raza"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="0300 1234567"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                />
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                2
              </span>
              Delivery Address
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="address">Street Address *</Label>
                <Textarea
                  id="address"
                  value={form.address}
                  onChange={set("address")}
                  placeholder="House #, Street, Area"
                  rows={2}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={set("city")}
                  placeholder="Karachi"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Province *</Label>
                <Select
                  value={form.province}
                  onValueChange={(v) => setForm((f) => ({ ...f, province: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCE_OPTIONS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="note">Order Note (optional)</Label>
                <Textarea
                  id="note"
                  value={form.note}
                  onChange={set("note")}
                  placeholder="Any instructions for delivery..."
                  rows={2}
                />
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                3
              </span>
              Payment Method
            </h2>
            <div className="flex items-center gap-4 rounded-xl border-2 border-primary bg-muted/50 p-4">
              <div className="flex size-11 items-center justify-center rounded-full bg-primary">
                <Banknote className="size-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-bold">Cash on Delivery (COD)</p>
                <p className="text-xs text-muted-foreground">
                  Pay in cash when your order arrives.
                </p>
              </div>
              <CheckCircle2 className="size-5 text-primary" />
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="rounded-xl border bg-card p-5">
            <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest">
              <Truck className="size-4" /> Order Summary
            </h2>
            <div className="mt-4 space-y-3">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3"
                  >
                    <div className="relative aspect-[4/5] w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                      <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {item.color} · {item.size}
                      </p>
                    </div>
                    <span className="text-xs font-bold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-semibold">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600">Free</span>
                  ) : (
                    formatPrice(deliveryFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2 text-base">
                <span className="font-bold">Total</span>
                <span className="font-black">{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              size="lg"
              className="mt-5 w-full uppercase tracking-widest"
              onClick={placeOrder}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Placing Order...
                </>
              ) : (
                <>
                  <Banknote className="size-4" /> Place Order · COD
                </>
              )}
            </Button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              By placing this order you agree to our terms & conditions.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
