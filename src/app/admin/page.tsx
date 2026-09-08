import Link from "next/link";
import {
  Package,
  FolderOpen,
  ClipboardList,
  Users,
  Banknote,
  TrendingUp,
  Plus,
} from "lucide-react";

import { getDashboardStats, getRecentOrders } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-violet-100 text-violet-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function AdminDashboardPage() {
  const [products, categories, orders, users, revenueAgg, statusGroups, todayOrders] =
    await getDashboardStats();
  const recentOrders = await getRecentOrders();

  const revenue = revenueAgg._sum.total ?? 0;
  const statusCounts = Object.fromEntries(
    statusGroups.map((g) => [g.status, (g._count as { _all?: number })._all ?? 0])
  );

  const stats = [
    {
      label: "Total Products",
      value: String(products),
      icon: Package,
      href: "/admin/products",
      accent: "bg-accent/30 text-accent-foreground",
    },
    {
      label: "Categories",
      value: String(categories),
      icon: FolderOpen,
      href: "/admin/categories",
      accent: "bg-blue-100 text-blue-700",
    },
    {
      label: "Total Orders",
      value: String(orders),
      icon: ClipboardList,
      href: "/admin/orders",
      accent: "bg-violet-100 text-violet-700",
    },
    {
      label: "Registered Users",
      value: String(users),
      icon: Users,
      href: "/admin",
      accent: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Revenue (excl. cancelled)",
      value: formatPrice(revenue),
      icon: Banknote,
      href: "/admin/orders",
      accent: "bg-amber-100 text-amber-700",
    },
    {
      label: "Orders Today",
      value: String(todayOrders._count._all),
      icon: TrendingUp,
      href: "/admin/orders",
      accent: "bg-rose-100 text-rose-700",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Overview of your store&apos;s performance.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="size-4" /> Add Product
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="py-5">
            <CardContent className="flex items-center gap-4 px-5">
              <div
                className={`flex size-12 shrink-0 items-center justify-center rounded-lg ${stat.accent}`}
              >
                <stat.icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </p>
                <p className="truncate text-xl font-black">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="py-5">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest">
              Orders by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(
                (status) => (
                  <div key={status} className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={`w-28 justify-center ${STATUS_COLORS[status]}`}
                    >
                      {status}
                    </Badge>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${
                            orders
                              ? Math.round(
                                  ((statusCounts[status] ?? 0) / orders) * 100
                                )
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="w-8 text-right text-sm font-bold">
                      {statusCounts[status] ?? 0}
                    </span>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="py-5">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-sm font-black uppercase tracking-widest">
              Recent Orders
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/orders">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                      No orders yet
                    </TableCell>
                  </TableRow>
                ) : (
                  recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-semibold">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell className="font-semibold">
                        {formatPrice(order.total)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${STATUS_COLORS[order.status]}`}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
