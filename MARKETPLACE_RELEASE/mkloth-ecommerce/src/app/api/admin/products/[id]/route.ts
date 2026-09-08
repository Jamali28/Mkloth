import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  price: z.number().int().positive(),
  compareAtPrice: z.number().int().positive().optional().nullable(),
  categoryId: z.string().min(1),
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
  return session?.user?.role === "ADMIN";
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid product data" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.productImage.deleteMany({ where: { productId: id } }),
      prisma.productColor.deleteMany({ where: { productId: id } }),
      prisma.productSize.deleteMany({ where: { productId: id } }),
    ]);

    await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
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

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
