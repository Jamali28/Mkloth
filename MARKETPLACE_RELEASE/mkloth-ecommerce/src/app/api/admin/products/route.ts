import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { auth } from "@/auth";

const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(5, "Description is required"),
  price: z.number().int().positive("Price must be positive"),
  compareAtPrice: z.number().int().positive().optional().nullable(),
  categoryId: z.string().min(1, "Category is required"),
  inStock: z.boolean().default(true),
  isNew: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  featured: z.boolean().default(false),
  images: z.array(z.string()).default([]),
  colors: z.array(z.object({ name: z.string(), hex: z.string() })).default([]),
  sizes: z.array(z.string()).default([]),
}).refine(
  (d) => d.compareAtPrice == null || d.compareAtPrice > d.price,
  {
    message: "Compare-at price must be higher than the sale price",
    path: ["compareAtPrice"],
  }
);

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return false;
  }
  return true;
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid product data" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    let slug = slugify(data.name);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        price: data.price,
        compareAtPrice: data.compareAtPrice ?? null,
        categoryId: data.categoryId,
        inStock: data.inStock,
        isNew: data.isNew,
        isBestSeller: data.isBestSeller,
        featured: data.featured,
        images: {
          create: data.images.map((url, i) => ({ url, position: i })),
        },
        colors: {
          create: data.colors.map((c) => ({ name: c.name, hex: c.hex })),
        },
        sizes: {
          create: data.sizes.map((label) => ({ label })),
        },
      },
    });

    return NextResponse.json({ id: product.id }, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
