import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/lib/constants";
import { auth } from "@/auth";

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1).max(99),
  size: z.string().min(1),
  color: z.string().min(1),
});

const orderSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone required"),
  email: z.string().email().optional().nullable(),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  province: z.string().min(2, "Province is required"),
  note: z.string().optional().nullable(),
  items: z.array(orderItemSchema).min(1, "Cart is empty").max(50),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid order data" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Prices are always taken from the database, never from the client.
    let subtotal = 0;
    const items = [];

    for (const item of data.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          colors: true,
          sizes: true,
          images: { orderBy: { position: "asc" } },
        },
      });

      if (!product) {
        return NextResponse.json(
          { error: "A product in your cart is no longer available." },
          { status: 400 }
        );
      }

      if (!product.inStock) {
        return NextResponse.json(
          { error: `"${product.name}" is currently out of stock.` },
          { status: 400 }
        );
      }

      if (!product.sizes.some((s) => s.label === item.size)) {
        return NextResponse.json(
          { error: `"${product.name}" is not available in this size.` },
          { status: 400 }
        );
      }

      if (!product.colors.some((c) => c.name === item.color)) {
        return NextResponse.json(
          { error: `"${product.name}" is not available in this color.` },
          { status: 400 }
        );
      }

      subtotal += product.price * item.quantity;
      items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: product.images[0]?.url ?? null,
      });
    }

    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const total = subtotal + deliveryFee;

    const session = await auth();
    let orderNumber = generateOrderNumber();
    let exists = await prisma.order.findUnique({ where: { orderNumber } });
    while (exists) {
      orderNumber = generateOrderNumber();
      exists = await prisma.order.findUnique({ where: { orderNumber } });
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user?.id,
        customerName: data.customerName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
        province: data.province,
        note: data.note,
        paymentMethod: "COD",
        subtotal,
        deliveryFee,
        total,
        items: { create: items },
      },
    });

    return NextResponse.json({ orderNumber: order.orderNumber }, { status: 201 });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 }
    );
  }
}