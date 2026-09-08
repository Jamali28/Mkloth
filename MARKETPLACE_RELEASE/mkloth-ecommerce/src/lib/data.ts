import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const productInclude = {
  images: { orderBy: { position: "asc" as const } },
  colors: true,
  sizes: true,
  category: true,
} satisfies Prisma.ProductInclude;

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

export type SortOption = "newest" | "price-asc" | "price-desc" | "popular";

export type ProductFilters = {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  sort?: SortOption;
  isNew?: boolean;
  isBestSeller?: boolean;
};

export type CategoryWithCount = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
  createdAt: Date;
  _count: { products: number };
};

export function getCategories(): Promise<CategoryWithCount[]> {
  return prisma.category.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function getProducts(filters: ProductFilters = {}) {
  const {
    q,
    category,
    minPrice,
    maxPrice,
    sizes,
    colors,
    sort = "newest",
    isNew,
    isBestSeller,
  } = filters;

  const where: Prisma.ProductWhereInput = {
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { description: { contains: q } },
            { category: { name: { contains: q } } },
          ],
        }
      : {}),
    ...(category ? { category: { slug: category } } : {}),
    ...(minPrice !== undefined ? { price: { gte: minPrice } } : {}),
    ...(maxPrice !== undefined ? { price: { lte: maxPrice } } : {}),
    ...(sizes && sizes.length
      ? { sizes: { some: { label: { in: sizes } } } }
      : {}),
    ...(colors && colors.length
      ? { colors: { some: { name: { in: colors } } } }
      : {}),
    ...(isNew ? { isNew: true } : {}),
    ...(isBestSeller ? { isBestSeller: true } : {}),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput[] =
    sort === "price-asc"
      ? [{ price: "asc" }]
      : sort === "price-desc"
        ? [{ price: "desc" }]
        : sort === "popular"
          ? [{ isBestSeller: "desc" }, { createdAt: "desc" }]
          : [{ createdAt: "desc" }];

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total };
}

export function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: productInclude,
  });
}

export function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
}

export function getFeaturedProducts(limit = 4) {
  return prisma.product.findMany({
    where: { featured: true },
    include: productInclude,
    take: limit,
  });
}

export function getNewArrivals(limit = 8) {
  return prisma.product.findMany({
    where: { isNew: true },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export function getBestSellers(limit = 8) {
  return prisma.product.findMany({
    where: { isBestSeller: true },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export function getRelatedProducts(productId: string, categoryId: string, limit = 4) {
  return prisma.product.findMany({
    where: {
      categoryId,
      id: { not: productId },
    },
    include: productInclude,
    take: limit,
  });
}

export function getRecentOrders(limit = 5) {
  return prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export function getDashboardStats() {
  return prisma.$transaction([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "CANCELLED" } },
    }),
    prisma.order.groupBy({
      by: ["status"],
      orderBy: { status: "asc" },
      _count: { _all: true },
    }),
    prisma.order.aggregate({
      _count: { _all: true },
      where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
    }),
  ]);
}
