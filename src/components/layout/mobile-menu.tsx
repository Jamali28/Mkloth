"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, LayoutDashboard, ChevronRight } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

import { CATEGORIES } from "@/lib/constants";
import { BrandLogo } from "@/components/layout/brand-logo";

const QUICK_LINKS = [
  { label: "Shop All", href: "/shop" },
  { label: "New Arrivals", href: "/shop?sort=newest&new=1" },
  { label: "Best Sellers", href: "/shop?best=1" },
];

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85vw] flex-col bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between border-b px-5 py-4">
              <BrandLogo className="h-10" />
              <button
                onClick={onClose}
                className="inline-flex size-9 items-center justify-center rounded-md hover:bg-muted transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                Collections
              </p>
              <div className="space-y-1">
                <Link
                  href="/"
                  onClick={onClose}
                  className="block rounded-md px-2 py-2.5 text-base font-bold transition-colors hover:bg-muted"
                >
                  Home
                </Link>
                {CATEGORIES.map((c, i) => (
                  <motion.div
                    key={c.slug}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                  >
                    <Link
                      href={`/collections/${c.slug}`}
                      onClick={onClose}
                      className="group flex items-center justify-between rounded-md px-2 py-2.5 text-base font-medium transition-colors hover:bg-muted"
                    >
                      {c.name}
                      <ChevronRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <p className="mb-3 mt-8 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                Explore
              </p>
              <div className="space-y-1">
                {QUICK_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={onClose}
                    className="block rounded-md px-2 py-2.5 text-base font-medium transition-colors hover:bg-muted"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t px-5 py-4">
              <div className="flex flex-col gap-2">
                {session?.user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 rounded-md bg-muted px-3 py-2.5">
                      <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {session.user.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        signOut({ callbackUrl: "/" });
                      }}
                      className="w-full rounded-md border py-2.5 text-center text-sm font-semibold transition-colors hover:bg-muted active:scale-[0.97] cursor-pointer"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      href="/login"
                      onClick={onClose}
                      className="flex-1 rounded-md bg-primary py-2.5 text-center text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.97]"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      onClick={onClose}
                      className="flex-1 rounded-md border py-2.5 text-center text-sm font-semibold transition-colors hover:bg-muted active:scale-[0.97]"
                    >
                      Register
                    </Link>
                  </div>
                )}
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="flex items-center gap-2 rounded-md border px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
                  >
                    <LayoutDashboard className="size-4" /> Admin Dashboard
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
