"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ImagePlus,
  Loader2,
  Plus,
  Upload,
  X,
} from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { COLOR_OPTIONS, SIZE_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Category = { id: string; name: string };

type ProductValues = {
  name: string;
  description: string;
  price: string;
  compareAtPrice: string;
  categoryId: string;
  inStock: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  featured: boolean;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
};

const emptyValues: ProductValues = {
  name: "",
  description: "",
  price: "",
  compareAtPrice: "",
  categoryId: "",
  inStock: true,
  isNew: false,
  isBestSeller: false,
  featured: false,
  images: [],
  colors: [],
  sizes: [],
};

export function ProductForm({
  categories,
  initial,
  productId,
}: {
  categories: Category[];
  initial?: ProductValues;
  productId?: string;
}) {
  const router = useRouter();
  const isEdit = !!productId;
  const [values, setValues] = useState<ProductValues>(initial ?? emptyValues);
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const set = <K extends keyof ProductValues>(key: K, value: ProductValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error ?? "Upload failed");
          continue;
        }
        setValues((v) => ({ ...v, images: [...v.images, data.url] }));
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) =>
    set("images", values.images.filter((u) => u !== url));

  const moveImage = (index: number, dir: -1 | 1) => {
    const next = [...values.images];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    set("images", next);
  };

  const toggleSize = (size: string) =>
    set(
      "sizes",
      values.sizes.includes(size)
        ? values.sizes.filter((s) => s !== size)
        : [...values.sizes, size]
    );

  const toggleColor = (c: { name: string; hex: string }) =>
    set(
      "colors",
      values.colors.some((x) => x.name === c.name)
        ? values.colors.filter((x) => x.name !== c.name)
        : [...values.colors, c]
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (values.name.trim().length < 2) {
      toast.error("Please enter a product name");
      return;
    }
    if (values.description.trim().length < 5) {
      toast.error("Please enter a description");
      return;
    }
    if (!values.price || Number(values.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (
      values.compareAtPrice &&
      Number(values.compareAtPrice) <= Number(values.price)
    ) {
      toast.error("Compare-at price must be higher than the sale price");
      return;
    }
    if (!values.categoryId) {
      toast.error("Please select a category");
      return;
    }
    if (values.images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    if (values.colors.length === 0) {
      toast.error("Please select at least one color");
      return;
    }
    if (values.sizes.length === 0) {
      toast.error("Please select at least one size");
      return;
    }

    const payload = {
      name: values.name,
      description: values.description,
      price: Math.round(Number(values.price)),
      compareAtPrice: values.compareAtPrice
        ? Math.round(Number(values.compareAtPrice))
        : null,
      categoryId: values.categoryId,
      inStock: values.inStock,
      isNew: values.isNew,
      isBestSeller: values.isBestSeller,
      featured: values.featured,
      images: values.images,
      colors: values.colors,
      sizes: values.sizes,
    };

    startTransition(async () => {
      const res = await fetch(
        isEdit ? `/api/admin/products/${productId}` : "/api/admin/products",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        toast.success(isEdit ? "Product updated" : "Product created");
        router.push("/admin/products");
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error ?? "Failed to save product");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-lg border bg-background p-5">
            <h3 className="mb-4 text-sm font-black uppercase tracking-widest">
              Basic Info
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={values.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Oversized Heavyweight Tee"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="desc">Description *</Label>
                <Textarea
                  id="desc"
                  rows={4}
                  value={values.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe the fabric, fit and vibe..."
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={values.price}
                    onChange={(e) => set("price", e.target.value)}
                    placeholder="1899"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="compare">Compare At Price (optional)</Label>
                  <Input
                    id="compare"
                    type="number"
                    min="0"
                    value={values.compareAtPrice}
                    onChange={(e) => set("compareAtPrice", e.target.value)}
                    placeholder="2499"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Category *</Label>
                <Select
                  value={values.categoryId}
                  onValueChange={(v) => set("categoryId", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-background p-5">
            <h3 className="mb-4 text-sm font-black uppercase tracking-widest">
              Images *
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {values.images.map((url, i) => (
                <div
                  key={url}
                  className="group relative aspect-[4/5] overflow-hidden rounded-md border bg-muted"
                >
                  <Image
                    src={url}
                    alt={`Product image ${i + 1}`}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 top-0 flex justify-between p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveImage(i, -1)}
                        disabled={i === 0}
                        className="flex size-7 items-center justify-center rounded bg-black/60 text-white backdrop-blur disabled:opacity-40 cursor-pointer"
                        aria-label="Move left"
                      >
                        <ArrowLeft className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(i, 1)}
                        disabled={i === values.images.length - 1}
                        className="flex size-7 items-center justify-center rounded bg-black/60 text-white backdrop-blur disabled:opacity-40 cursor-pointer"
                        aria-label="Move right"
                      >
                        <ArrowRight className="size-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="flex size-7 items-center justify-center rounded bg-black/60 text-white backdrop-blur cursor-pointer"
                      aria-label="Remove image"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur">
                      PRIMARY
                    </span>
                  )}
                </div>
              ))}

              <label
                className={cn(
                  "flex aspect-[4/5] cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-foreground",
                  uploading && "pointer-events-none opacity-60"
                )}
              >
                {uploading ? (
                  <Loader2 className="size-6 animate-spin" />
                ) : (
                  <ImagePlus className="size-6" />
                )}
                <span className="text-xs font-medium">
                  {uploading ? "Uploading..." : "Upload"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files)}
                />
              </label>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Upload className="size-3.5" /> JPG, PNG, WEBP or GIF up to 5MB.
              First image is the primary.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-background p-5">
            <h3 className="mb-4 text-sm font-black uppercase tracking-widest">
              Visibility
            </h3>
            <div className="space-y-3">
              {(
                [
                  ["inStock", "In Stock"],
                  ["isNew", "New Arrival"],
                  ["isBestSeller", "Best Seller"],
                  ["featured", "Featured (homepage)"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="flex items-center gap-3">
                  <Checkbox
                    id={key}
                    checked={values[key]}
                    onCheckedChange={(v) => set(key, !!v)}
                  />
                  <Label htmlFor={key} className="cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border bg-background p-5">
            <h3 className="mb-4 text-sm font-black uppercase tracking-widest">
              Sizes *
            </h3>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={cn(
                    "min-w-12 rounded-md border px-3 py-2 text-sm font-semibold transition-all cursor-pointer",
                    values.sizes.includes(size)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "hover:border-primary hover:bg-muted"
                  )}
                >
                  {size}
                </button>
              ))}
              {values.sizes.length > 0 && (
                <div className="flex w-full flex-wrap gap-1.5 pt-2">
                  {values.sizes.map((s) => (
                    <span
                      key={s}
                      className="flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-bold"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => toggleSize(s)}
                        className="cursor-pointer"
                        aria-label={`Remove ${s}`}
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border bg-background p-5">
            <h3 className="mb-4 text-sm font-black uppercase tracking-widest">
              Colors *
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => toggleColor(c)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-md border py-2 transition-all cursor-pointer",
                    values.colors.some((x) => x.name === c.name)
                      ? "border-primary bg-muted"
                      : "hover:border-muted-foreground/40"
                  )}
                >
                  <span
                    className="relative flex size-8 items-center justify-center rounded-full border"
                    style={{ backgroundColor: c.hex }}
                  >
                    {values.colors.some((x) => x.name === c.name) && (
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
                  </span>
                  <span className="text-[10px] font-medium">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between gap-3 pb-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          <ArrowLeft className="size-4" /> Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {isEdit ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <Plus className="size-4" />
              {isEdit ? "Save Changes" : "Create Product"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
