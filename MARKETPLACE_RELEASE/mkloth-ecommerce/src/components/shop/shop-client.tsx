"use client";

import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  Search,
  ArrowUpDown,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import { ProductCard } from "@/components/product/product-card";
import { ProductGridSkeleton } from "@/components/shop/product-grid-skeleton";
import type { ProductWithRelations } from "@/lib/data";
import { COLOR_OPTIONS, SIZE_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Category = { name: string; slug: string; count: number };

type Filters = {
  category?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  q?: string;
};

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function ShopClient({
  categories,
  initialProducts,
  initialTotal,
  allTotal,
  initialFilters,
  title,
  hideTitle = false,
}: {
  categories: Category[];
  initialProducts: ProductWithRelations[];
  initialTotal: number;
  allTotal: number;
  initialFilters: Filters;
  title: string;
  hideTitle?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(true);
  const [colorOpen, setColorOpen] = useState(true);

  const selectedSizes = useMemo(() => filters.sizes ?? [], [filters.sizes]);
  const selectedColors = useMemo(() => filters.colors ?? [], [filters.colors]);

  const pushFilters = (next: Filters) => {
    setFilters(next);
    setMobileFiltersOpen(false);
    const params = new URLSearchParams();
    if (next.category) params.set("category", next.category);
    if (next.q) params.set("q", next.q);
    if (next.sort && next.sort !== "newest") params.set("sort", next.sort);
    if (next.minPrice) params.set("min", String(next.minPrice));
    if (next.maxPrice) params.set("max", String(next.maxPrice));
    next.sizes?.forEach((s) => params.append("size", s));
    next.colors?.forEach((c) => params.append("color", c));
    if (next.isNew) params.set("new", "1");
    if (next.isBestSeller) params.set("best", "1");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const toggleSize = (size: string) => {
    const next = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    pushFilters({ ...filters, sizes: next });
  };

  const toggleColor = (color: string) => {
    const next = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];
    pushFilters({ ...filters, colors: next });
  };

  const resetFilters = () => {
    pushFilters({});
  };

  const hasActiveFilters =
    !!filters.category ||
    !!filters.q ||
    !!filters.minPrice ||
    !!filters.maxPrice ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    !!filters.isNew ||
    !!filters.isBestSeller;

  const renderFilters = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest">
          Categories
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => pushFilters({ ...filters, category: undefined })}
            className={cn(
              "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted cursor-pointer",
              !filters.category && "bg-muted font-semibold"
            )}
          >
            All Products
            <span className="text-xs text-muted-foreground">
              {allTotal}
            </span>
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() =>
                pushFilters({ ...filters, category: c.slug, isNew: false, isBestSeller: false })
              }
              className={cn(
                "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted cursor-pointer",
                filters.category === c.slug && "bg-muted font-semibold"
              )}
            >
              {c.name}
              <span className="text-xs text-muted-foreground">{c.count}</span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <button
          onClick={() => setPriceOpen((o) => !o)}
          className="flex w-full items-center justify-between text-xs font-bold uppercase tracking-widest cursor-pointer"
        >
          Price
          <ChevronDown
            className={cn("size-4 transition-transform", priceOpen && "rotate-180")}
          />
        </button>
        <AnimatePresence initial={false}>
          {priceOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-3 grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  defaultValue={filters.minPrice ?? ""}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      pushFilters({
                        ...filters,
                        minPrice: Number((e.target as HTMLInputElement).value) || undefined,
                      });
                    }
                  }}
                  className="h-9 rounded-md border px-3 text-sm outline-none focus:border-ring"
                />
                <input
                  type="number"
                  placeholder="Max"
                  defaultValue={filters.maxPrice ?? ""}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      pushFilters({
                        ...filters,
                        maxPrice: Number((e.target as HTMLInputElement).value) || undefined,
                      });
                    }
                  }}
                  className="h-9 rounded-md border px-3 text-sm outline-none focus:border-ring"
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {[
                  { label: "Under $40", min: 0, max: 39 },
                  { label: "$40 - $50", min: 40, max: 50 },
                  { label: "$50 - $60", min: 51, max: 60 },
                  { label: "$60+", min: 61, max: undefined },
                ].map((range) => (
                  <button
                    key={range.label}
                    onClick={() =>
                      pushFilters({
                        ...filters,
                        minPrice: range.min,
                        maxPrice: range.max,
                      })
                    }
                    className="rounded-full border px-3 py-1 text-xs font-medium transition-colors hover:bg-primary hover:text-primary-foreground cursor-pointer"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator />

      <div>
        <button
          onClick={() => setSizeOpen((o) => !o)}
          className="flex w-full items-center justify-between text-xs font-bold uppercase tracking-widest cursor-pointer"
        >
          Size
          <ChevronDown
            className={cn("size-4 transition-transform", sizeOpen && "rotate-180")}
          />
        </button>
        <AnimatePresence initial={false}>
          {sizeOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex flex-wrap gap-2">
                {SIZE_OPTIONS.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={cn(
                      "min-w-11 rounded-md border px-3 py-2 text-sm font-medium transition-all cursor-pointer",
                      selectedSizes.includes(size)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "hover:border-primary hover:bg-muted"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator />

      <div>
        <button
          onClick={() => setColorOpen((o) => !o)}
          className="flex w-full items-center justify-between text-xs font-bold uppercase tracking-widest cursor-pointer"
        >
          Color
          <ChevronDown
            className={cn("size-4 transition-transform", colorOpen && "rotate-180")}
          />
        </button>
        <AnimatePresence initial={false}>
          {colorOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-3 grid grid-cols-2 gap-1.5">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => toggleColor(c.name)}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted cursor-pointer",
                      selectedColors.includes(c.name) && "bg-muted font-semibold"
                    )}
                  >
                    <span
                      className="size-4 rounded-full border"
                      style={{ backgroundColor: c.hex }}
                    />
                    {c.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" className="w-full" onClick={resetFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {!hideTitle && (
            <h1 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">
              {title}
            </h1>
          )}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <ArrowUpDown className="size-4" />
                  {SORTS.find((s) => s.value === (filters.sort ?? "newest"))?.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup
                  value={filters.sort ?? "newest"}
                  onValueChange={(v) => pushFilters({ ...filters, sort: v })}
                >
                  {SORTS.map((s) => (
                    <DropdownMenuRadioItem key={s.value} value={s.value}>
                      {s.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet
              open={mobileFiltersOpen}
              onOpenChange={setMobileFiltersOpen}
            >
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 lg:hidden">
                  <SlidersHorizontal className="size-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {(selectedSizes.length + selectedColors.length +
                        (filters.category ? 1 : 0) +
                        (filters.minPrice || filters.maxPrice ? 1 : 0))}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-lg font-black uppercase">
                    Filters
                  </SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-8">
                  {renderFilters()}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {filters.q && (
          <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm">
            <Search className="size-4 text-muted-foreground" />
            Showing results for{" "}
            <span className="font-semibold">&quot;{filters.q}&quot;</span>
            <button
              onClick={() => pushFilters({ ...filters, q: undefined })}
              className="ml-auto flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            >
              <X className="size-3.5" /> Clear
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            {renderFilters()}
          </div>
        </aside>

        <div>
          <AnimatePresence mode="wait">
            {isPending ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProductGridSkeleton count={8} />
              </motion.div>
            ) : (
              <motion.div
                key={`grid-${JSON.stringify(filters)}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {initialTotal} product{initialTotal === 1 ? "" : "s"}
                </p>
                {initialProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-24 text-center">
                    <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                      <Search className="size-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-base font-semibold">No products found</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Try adjusting your filters or search terms.
                      </p>
                    </div>
                    <Button variant="outline" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3">
                    {initialProducts.map((product, i) => (
                      <ProductCard key={product.id} product={product} index={i} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
