import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Drop Shoulder",
    slug: "drop-shoulder",
    image: "/images/categories/drop-shoulder.svg",
    description:
      "Oversized, heavy and relaxed. The signature streetwear cut — dropped seams and a boxy drape that sits perfectly off the shoulder.",
  },
  {
    name: "Crop",
    slug: "crop",
    image: "/images/categories/crop.svg",
    description:
      "Sharp, short and statement-making. Cropped silhouettes that add a modern edge to any rotation.",
  },
  {
    name: "Polo",
    slug: "polo",
    image: "/images/categories/polo.svg",
    description:
      "Clean collared classics with a streetwear twist. Premium pique and soft-touch fabric, cut sharp for everyday wear.",
  },
];

type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  categorySlug: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  featured?: boolean;
};

const products: SeedProduct[] = [
  // ---- Drop Shoulder ----
  {
    name: "Oversized Drop Shoulder Tee",
    slug: "oversized-drop-shoulder-tee",
    description:
      "Premium 240gsm heavyweight cotton tee with dropped shoulders and a relaxed oversized fit. The essential streetwear cut, built to layer or wear solo.",
    price: 49,
    compareAtPrice: 65,
    categorySlug: "drop-shoulder",
    colors: [
      { name: "Black", hex: "#111111" },
      { name: "White", hex: "#F5F5F5" },
      { name: "Grey", hex: "#6b7280" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isNew: true,
    isBestSeller: true,
    featured: true,
  },
  {
    name: "Heavyweight Drop Shoulder Tee",
    slug: "heavyweight-drop-shoulder-tee",
    description:
      "300gsm ultra-heavy fabric with a structured boxy shape and dropped seams. A substantial, premium tee that holds its shape wash after wash.",
    price: 55,
    compareAtPrice: 70,
    categorySlug: "drop-shoulder",
    colors: [
      { name: "Black", hex: "#111111" },
      { name: "White", hex: "#F5F5F5" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isBestSeller: true,
    featured: true,
  },
  {
    name: "Washed Drop Shoulder Tee",
    slug: "washed-drop-shoulder-tee",
    description:
      "Garment-washed cotton for a soft lived-in hand feel. Faded, worn-in tones with a relaxed drop-shoulder silhouette.",
    price: 52,
    categorySlug: "drop-shoulder",
    colors: [
      { name: "Grey", hex: "#6b7280" },
      { name: "Navy", hex: "#1f2a44" },
      { name: "Cream", hex: "#efe6d8" },
    ],
    sizes: ["M", "L", "XL", "XXL"],
    isNew: true,
  },
  {
    name: "Drop Shoulder Graphic Tee",
    slug: "drop-shoulder-graphic-tee",
    description:
      "Boxy drop-shoulder fit with a bold chest graphic and subtle back print. Heavyweight cotton with a street-ready finish.",
    price: 45,
    compareAtPrice: 58,
    categorySlug: "drop-shoulder",
    colors: [
      { name: "Black", hex: "#111111" },
      { name: "White", hex: "#F5F5F5" },
    ],
    sizes: ["S", "M", "L", "XL"],
    isNew: true,
  },
  {
    name: "Drop Shoulder Pocket Tee",
    slug: "drop-shoulder-pocket-tee",
    description:
      "A clean chest-pocket tee cut with dropped shoulders and a relaxed drape. Minimal, premium and endlessly wearable.",
    price: 42,
    categorySlug: "drop-shoulder",
    colors: [
      { name: "White", hex: "#F5F5F5" },
      { name: "Black", hex: "#111111" },
      { name: "Olive", hex: "#6b7f4e" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },

  // ---- Crop ----
  {
    name: "Cropped Box Tee",
    slug: "cropped-box-tee",
    description:
      "A short, boxy crop with a clean hem and premium 220gsm cotton. Sharp proportions that stack perfectly over baggy bottoms.",
    price: 39,
    compareAtPrice: 52,
    categorySlug: "crop",
    colors: [
      { name: "Black", hex: "#111111" },
      { name: "White", hex: "#F5F5F5" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    isBestSeller: true,
    featured: true,
  },
  {
    name: "Cropped Graphic Tee",
    slug: "cropped-graphic-tee",
    description:
      "Statement crop with a screen-printed front graphic and ribbed crew neck. Streetwear energy, clean lines.",
    price: 44,
    categorySlug: "crop",
    colors: [
      { name: "Black", hex: "#111111" },
      { name: "Grey", hex: "#6b7280" },
    ],
    sizes: ["S", "M", "L"],
    isNew: true,
  },
  {
    name: "Cropped Contrast Stitch Tee",
    slug: "cropped-contrast-stitch-tee",
    description:
      "Cropped cut with tonal-to-contrast stitching on the hems and collar. A subtle detail that elevates the whole fit.",
    price: 42,
    categorySlug: "crop",
    colors: [
      { name: "Black", hex: "#111111" },
      { name: "Cream", hex: "#efe6d8" },
    ],
    sizes: ["S", "M", "L"],
  },
  {
    name: "Cropped Ribbed Tee",
    slug: "cropped-ribbed-tee",
    description:
      "Ribbed knit crop with a fitted bodice and clean crop line. Soft, stretchy and made to be layered.",
    price: 45,
    categorySlug: "crop",
    colors: [
      { name: "Black", hex: "#111111" },
      { name: "White", hex: "#F5F5F5" },
    ],
    sizes: ["XS", "S", "M"],
    isNew: true,
  },

  // ---- Polo ----
  {
    name: "Classic Pique Polo",
    slug: "classic-pique-polo",
    description:
      "Premium pique polo with a ribbed collar and clean mother-of-pearl buttons. The collared essential, done right.",
    price: 55,
    compareAtPrice: 70,
    categorySlug: "polo",
    colors: [
      { name: "Black", hex: "#111111" },
      { name: "White", hex: "#F5F5F5" },
      { name: "Navy", hex: "#1f2a44" },
    ],
    sizes: ["M", "L", "XL", "XXL"],
    isBestSeller: true,
    featured: true,
  },
  {
    name: "Oversized Polo",
    slug: "oversized-polo",
    description:
      "A relaxed oversized polo with dropped shoulders and a longer hem. Collared comfort with a streetwear drape.",
    price: 59,
    categorySlug: "polo",
    colors: [
      { name: "Black", hex: "#111111" },
      { name: "Cream", hex: "#efe6d8" },
      { name: "Olive", hex: "#6b7f4e" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isNew: true,
  },
  {
    name: "Embroidered Logo Polo",
    slug: "embroidered-logo-polo",
    description:
      "Soft-touch cotton polo with tonal chest embroidery. Refined, minimal and built to elevate the everyday.",
    price: 62,
    categorySlug: "polo",
    colors: [
      { name: "White", hex: "#F5F5F5" },
      { name: "Navy", hex: "#1f2a44" },
      { name: "Black", hex: "#111111" },
    ],
    sizes: ["M", "L", "XL"],
    isNew: true,
  },
  {
    name: "Striped Classic Polo",
    slug: "striped-classic-polo",
    description:
      "Classic striped pique polo in a clean tailored fit. Timeless stripes, modern comfort.",
    price: 49,
    categorySlug: "polo",
    colors: [
      { name: "Navy", hex: "#1f2a44" },
      { name: "White", hex: "#F5F5F5" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
];

function img(seed: string, i: number) {
  return `/images/products/${seed}-${i}.svg`;
}

async function main() {
  console.log("Seeding database...");

  await prisma.category.deleteMany();

  for (let i = 0; i < categories.length; i++) {
    const c = categories[i];
    await prisma.category.create({
      data: {
        name: c.name,
        slug: c.slug,
        image: c.image,
        description: c.description,
        createdAt: new Date(Date.UTC(2026, 0, i + 1)),
      },
    });
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "placeholder-admin-pass";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Store Admin",
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 10),
      role: "ADMIN",
    },
  });

  const testUserEmail = "user@example.com";
  const testUserPassword = "placeholder-user-pass";

  await prisma.user.upsert({
    where: { email: testUserEmail },
    update: {},
    create: {
      name: "Test Customer",
      email: testUserEmail,
      password: await bcrypt.hash(testUserPassword, 10),
      role: "USER",
    },
  });

  for (const p of products) {
    const category = await prisma.category.findUnique({
      where: { slug: p.categorySlug },
    });

    if (!category) {
      console.warn(`Category not found for ${p.name}, skipping`);
      continue;
    }

    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        inStock: true,
        isNew: p.isNew ?? false,
        isBestSeller: p.isBestSeller ?? false,
        featured: p.featured ?? false,
        categoryId: category.id,
        images: {
          create: [
            { url: img(p.slug, 1), position: 0 },
            { url: img(p.slug, 2), position: 1 },
            { url: img(p.slug, 3), position: 2 },
          ],
        },
        colors: {
          create: p.colors.map((c) => ({ name: c.name, hex: c.hex })),
        },
        sizes: {
          create: p.sizes.map((s) => ({ label: s })),
        },
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
