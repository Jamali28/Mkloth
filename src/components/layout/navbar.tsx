"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Menu, Search, User, LayoutDashboard, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { BrandLogo } from "@/components/layout/brand-logo";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";

function NavLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative px-3 py-2 text-sm font-medium uppercase tracking-widest transition-colors hover:text-accent",
        isActive ? "text-foreground" : "text-muted-foreground hover:text-accent"
      )}
    >
      {label}
      {isActive && (
        <motion.span
          layoutId="nav-underline"
          className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent"
        />
      )}
    </Link>
  );
}

function AccountMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (status === "loading") {
    return (
      <span className="inline-flex size-10 items-center justify-center rounded-md">
        <span className="size-4 animate-pulse rounded-full bg-muted" />
      </span>
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="inline-flex size-10 items-center justify-center rounded-md transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
        aria-label="Sign in"
      >
        <User className="size-5" />
      </Link>
    );
  }

  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/85 cursor-pointer"
        aria-label="Account menu"
      >
        {session.user.name?.charAt(0).toUpperCase() || "U"}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-64 rounded-md border bg-background p-2 shadow-xl"
          >
            <div className="border-b px-2 pb-2">
              <p className="truncate text-sm font-semibold">{session.user.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {session.user.email}
              </p>
            </div>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="mt-1 flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                <LayoutDashboard className="size-4" /> Admin Dashboard
              </Link>
            )}
            <button
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="mt-1 flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-destructive transition-colors hover:bg-muted cursor-pointer"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const { totalCount, bump, openCart } = useCart();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartBounce, setCartBounce] = useState(0);
  const lastBump = useRef(bump);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (bump !== lastBump.current) {
      lastBump.current = bump;
      setCartBounce((b) => b + 1);
    }
  }, [bump]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 border-b transition-all duration-300",
          scrolled
            ? "border-border bg-background/85 shadow-sm backdrop-blur-md"
            : "border-transparent bg-background"
        )}
      >
        <div className="truncate bg-primary px-4 py-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-primary-foreground">
          Free delivery on orders over $100 · Cash on Delivery nationwide
        </div>

        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-1 items-center gap-1">
            <button
              onClick={() => setMobileOpen(true)}
              className="inline-flex size-10 items-center justify-center rounded-md transition-colors hover:bg-muted lg:hidden cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <BrandLogo className="h-11 sm:h-12" />
          </div>

          <div className="hidden items-center gap-1 lg:flex">
            <NavLink href="/shop" label="Shop" isActive={pathname === "/shop"} />
            {CATEGORIES.map((c) => (
              <NavLink
                key={c.slug}
                href={`/collections/${c.slug}`}
                label={c.name}
                isActive={pathname === `/collections/${c.slug}`}
              />
            ))}
          </div>

          <div className="flex flex-1 items-center justify-end gap-0.5">
            <Link
              href="/search"
              className="inline-flex size-10 items-center justify-center rounded-md transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
              aria-label="Search"
            >
              <Search className="size-5" />
            </Link>
            <AccountMenu />
            <button
              onClick={openCart}
              className="relative inline-flex size-10 items-center justify-center rounded-md transition-colors hover:bg-muted cursor-pointer"
              aria-label="Open cart"
            >
              <motion.span
                key={cartBounce}
                animate={
                  cartBounce > 0
                    ? { scale: [1, 1.35, 0.9, 1.15, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex items-center justify-center"
              >
                <ShoppingBag className="size-5" />
              </motion.span>
              <AnimatePresence>
                {totalCount > 0 && (
                  <motion.span
                    key={totalCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                  >
                    {totalCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <CartDrawer />
    </>
  );
}
