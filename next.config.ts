import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product, category, hero and promo imagery is served locally from /public/images.
    // Remote domains are intentionally omitted so no third-party image host is trusted.
    // All SVGs are generated locally by scripts/generate-product-images.mjs (no user
    // input enters them), so allowing SVG here is safe.
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
