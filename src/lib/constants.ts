export const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

export const CATEGORIES = [
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
] as const;

export const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const COLOR_OPTIONS = [
  { name: "Black", hex: "#111111" },
  { name: "White", hex: "#F5F5F5" },
  { name: "Grey", hex: "#6b7280" },
  { name: "Olive", hex: "#6b7f4e" },
  { name: "Navy", hex: "#1f2a44" },
  { name: "Brown", hex: "#6f4e37" },
  { name: "Khaki", hex: "#b9a26a" },
  { name: "Cream", hex: "#efe6d8" },
  { name: "Red", hex: "#b91c1c" },
  { name: "Blue", hex: "#1d4ed8" },
] as const;

export const DELIVERY_FEE = 4;
export const FREE_DELIVERY_THRESHOLD = 100;

export const ORDER_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

export const BRAND_NAME = "MKloth";
