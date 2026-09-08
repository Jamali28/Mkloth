"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { MotionConfig } from "framer-motion";

import { CartProvider } from "@/components/cart/cart-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SessionProvider>
        <CartProvider>
          {children}
          <Toaster
            position="bottom-center"
            richColors
            toastOptions={{
              style: {
                borderRadius: "10px",
                fontFamily: "var(--font-geist-sans), sans-serif",
              },
            }}
          />
        </CartProvider>
      </SessionProvider>
    </MotionConfig>
  );
}
