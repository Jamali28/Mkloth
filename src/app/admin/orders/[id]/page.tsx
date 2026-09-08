import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Banknote, MapPin, Phone, User, Mail, StickyNote } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusControl } from "@/components/admin/order-status-control";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-violet-100 text-violet-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Back to orders
          </Link>
          <h1 className="mt-2 text-2xl font-black uppercase tracking-tight">
            Order {order.orderNumber}
          </h1>
          <p className="text-sm text-muted-foreground">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleString("en-PK", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>
        <Badge variant="outline" className={`px-4 py-1 text-sm ${STATUS_STYLES[order.status]}`}>
          {order.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border bg-background p-5">
            <h2 className="mb-4 text-sm font-black uppercase tracking-widest">
              Items
            </h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Size / Color</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <div className="relative aspect-[4/5] w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.productId ? "In catalog" : "Removed"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.size} · {item.color}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="rounded-lg border bg-background p-5">
            <h2 className="mb-4 text-sm font-black uppercase tracking-widest">
              Update Status
            </h2>
            <OrderStatusControl orderId={order.id} currentStatus={order.status} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-background p-5">
            <h2 className="mb-4 text-sm font-black uppercase tracking-widest">
              Customer
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <User className="size-4 text-muted-foreground" />
                <span className="font-semibold">{order.customerName}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="size-4 text-muted-foreground" />
                {order.phone}
              </div>
              {order.email && (
                <div className="flex items-center gap-3">
                  <Mail className="size-4 text-muted-foreground" />
                  {order.email}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border bg-background p-5">
            <h2 className="mb-4 text-sm font-black uppercase tracking-widest">
              Delivery Address
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p>{order.address}</p>
                  <p className="text-muted-foreground">
                    {order.city}, {order.province}
                  </p>
                </div>
              </div>
              {order.note && (
                <div className="flex items-start gap-3">
                  <StickyNote className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <p className="italic">{order.note}</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border bg-background p-5">
            <h2 className="mb-4 text-sm font-black uppercase tracking-widest">
              Payment
            </h2>
            <div className="flex items-center gap-3 rounded-md bg-muted px-3 py-2.5 text-sm">
              <Banknote className="size-4" />
              <span className="font-semibold">Cash on Delivery</span>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-medium">{formatPrice(order.deliveryFee)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-base">
                <span className="font-bold">Total</span>
                <span className="font-black">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
