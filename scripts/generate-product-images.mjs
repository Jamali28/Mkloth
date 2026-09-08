import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = dirname(fileURLToPath(import.meta.url));
const outDir = join(root, "..", "public", "images");

const GARMENT_LIGHT = "#EFE9DB";
const INK = "#1C1B19";
const GOLD = "#C6A15B";

// Warm premium streetwear garment palette — a brown family (never near-black) so
// garments read clearly as brown on the cream canvas. Each product gets its own
// brown shade via a light->deep vertical gradient.
const HUES = {
  camel: { light: "#C9A87C", deep: "#8A6549" }, // warm camel
  sand: { light: "#D9C49A", deep: "#A98F68" }, // khaki sand
  tan: { light: "#B58D64", deep: "#7C5A3B" }, // mid tan
  caramel: { light: "#C08A5A", deep: "#8A532C" }, // caramel brown
  mocha: { light: "#A56F4E", deep: "#6B4230" }, // rich mocha
  walnut: { light: "#8B6247", deep: "#52392A" }, // walnut brown
  espresso: { light: "#7A5138", deep: "#452D1F" }, // deep espresso (still brown)
  taupe: { light: "#A18A6E", deep: "#6E5949" }, // taupe
};

mkdirSync(join(outDir, "products"), { recursive: true });
mkdirSync(join(outDir, "categories"), { recursive: true });
mkdirSync(join(outDir, "hero"), { recursive: true });

function teePath(hemY) {
  return [
    `M330 285`,
    `L252 240`,
    `L182 324`,
    `Q 242 348 238 388`,
    `L238 ${hemY}`,
    `Q 400 ${hemY + 34} 562 ${hemY}`,
    `L562 388`,
    `Q 558 348 618 324`,
    `L548 240`,
    `L470 285`,
    `Q 400 324 330 285`,
    `Z`,
  ].join(" ");
}

function folds(hue) {
  return [
    `<path d="M288 430 L284 660" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.08" fill="none"/>`,
    `<path d="M516 430 L520 660" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.08" fill="none"/>`,
    `<path d="M330 448 L326 660" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.05" fill="none"/>`,
  ].join("");
}

function collar(kind, light) {
  if (kind === "polo") {
    return [
      `<path d="M312 262 Q 400 306 488 262" stroke="${light}" stroke-width="17" fill="none" stroke-linecap="round" />`,
      `<path d="M318 258 Q 400 300 482 258" stroke="#2a2723" stroke-width="6" fill="none" stroke-linecap="round" />`,
      `<path d="M378 298 L422 298 L422 372 L378 372 Z" fill="${GARMENT_LIGHT}" />`,
      `<circle cx="400" cy="322" r="4.5" fill="${INK}" opacity="0.7" />`,
      `<circle cx="400" cy="348" r="4.5" fill="${INK}" opacity="0.7" />`,
    ].join("");
  }
  return `<path d="M304 258 Q 400 300 496 258" stroke="${light}" stroke-width="13" fill="none" stroke-linecap="round"/>`;
}

function garment(kind, hemY, fillSpec, light, stroke = "#14110E") {
  return [
    `<path d="${teePath(hemY)}" fill="${fillSpec}" stroke="${stroke}" stroke-width="2"/>`,
    folds(light),
    collar(kind, light),
  ].join("");
}

function defs(uid, colors) {
  const stops = colors
    .map((c, i) => `<stop offset="${i === 0 ? "0%" : "100%"}" stop-color="${c}"/>`)
    .join("");
  return `<linearGradient id="${uid}" x1="0" y1="0" x2="0" y2="1">${stops}</linearGradient>`;
}

function productSvg({ kind, bg, shade, name, hue }) {
  const uid = `g${shade}`;
  const { light, deep } = HUES[hue];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000" role="img" aria-label="${name.replace(/-/g, " ")}">
  <defs>
    <linearGradient id="${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${light}"/>
      <stop offset="100%" stop-color="${deep}"/>
    </linearGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="26"/>
    </filter>
  </defs>
  <rect width="800" height="1000" fill="${bg}"/>
  <ellipse cx="400" cy="806" rx="196" ry="34" fill="#241E1A" opacity="0.10" filter="url(#soft)"/>
  <g>
    ${garment(kind === "Drop Shoulder" ? "tee" : kind === "Polo" ? "polo" : "crop", kind === "Crop" ? 548 : 700).replace(/url\(#gDark\)/g, `url(#${uid})`)}
  </g>
  <line x1="330" y1="894" x2="470" y2="894" stroke="${GOLD}" opacity="0.45"/>
  <text x="400" y="928" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" letter-spacing="18" fill="${INK}" opacity="0.28">M K L O T H</text>
</svg>`;
}

const KIND_BY_SLUG = {
  "drop-shoulder": "Drop Shoulder",
  "crop": "Crop",
  "polo": "Polo",
};

const products = [
  ["oversized-drop-shoulder-tee", "drop-shoulder", "camel"],
  ["heavyweight-drop-shoulder-tee", "drop-shoulder", "espresso"],
  ["washed-drop-shoulder-tee", "drop-shoulder", "sand"],
  ["drop-shoulder-graphic-tee", "drop-shoulder", "caramel"],
  ["drop-shoulder-pocket-tee", "drop-shoulder", "walnut"],
  ["cropped-box-tee", "crop", "tan"],
  ["cropped-graphic-tee", "crop", "mocha"],
  ["cropped-contrast-stitch-tee", "crop", "taupe"],
  ["cropped-ribbed-tee", "crop", "caramel"],
  ["classic-pique-polo", "polo", "walnut"],
  ["oversized-polo", "polo", "camel"],
  ["embroidered-logo-polo", "polo", "mocha"],
  ["striped-classic-polo", "polo", "tan"],
];

const bgs = ["#F7F3EA", "#F1EBDF", "#EAE3D6"];

for (const [slug, cat, hue] of products) {
  for (let i = 1; i <= 3; i++) {
    const svg = productSvg({
      kind: KIND_BY_SLUG[cat],
      bg: bgs[i - 1],
      shade: i,
      name: slug,
      hue,
    });
    writeFileSync(join(outDir, "products", `${slug}-${i}.svg`), svg);
  }
}

function categorySvg(slug, label, hue) {
  const kind = KIND_BY_SLUG[slug];
  const varIdx = slug === "drop-shoulder" ? 1 : slug === "crop" ? 2 : 3;
  const bg = bgs[varIdx - 1];
  const { light, deep } = HUES[hue];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500" width="1200" height="1500" role="img" aria-label="${label} collection">
  <defs>
    <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${light}"/>
      <stop offset="100%" stop-color="${deep}"/>
    </linearGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="34"/></filter>
  </defs>
  <rect width="1200" height="1500" fill="${bg}"/>
  <ellipse cx="600" cy="1210" rx="300" ry="46" fill="#241E1A" opacity="0.12" filter="url(#soft)"/>
  <g transform="translate(215 235) scale(1.32)">
    ${garment(kind === "Drop Shoulder" ? "tee" : kind === "Polo" ? "polo" : "crop", kind === "Crop" ? 548 : 700, "url(#cg)")}
  </g>
  <line x1="480" y1="1355" x2="720" y2="1355" stroke="${GOLD}" opacity="0.45"/>
  <text x="600" y="1395" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="30" letter-spacing="24" fill="${INK}" opacity="0.28">M K L O T H</text>
  <text x="600" y="1450" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="400" font-size="19" letter-spacing="8" fill="${light}" opacity="1">${label.toUpperCase()}</text>
</svg>`;
}

writeFileSync(join(outDir, "categories", "drop-shoulder.svg"), categorySvg("drop-shoulder", "Drop Shoulder", "camel"));
writeFileSync(join(outDir, "categories", "crop.svg"), categorySvg("crop", "Crop", "caramel"));
writeFileSync(join(outDir, "categories", "polo.svg"), categorySvg("polo", "Polo", "mocha"));

function heroSvg(slug, label, hue) {
  const kind = KIND_BY_SLUG[slug];
  const { light, deep } = HUES[hue];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080" role="img" aria-label="${label} hero">
  <defs>
    <linearGradient id="hbg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#14120F"/>
      <stop offset="100%" stop-color="#0A0908"/>
    </linearGradient>
    <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${light}"/>
      <stop offset="100%" stop-color="${deep}"/>
    </linearGradient>
    <filter id="glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="42"/></filter>
  </defs>
  <rect width="1920" height="1080" fill="url(#hbg)"/>
  <circle cx="1540" cy="540" r="320" fill="${light}" opacity="0.10" filter="url(#glow)"/>
  <g transform="translate(1170 210) scale(0.72)">
    ${garment(kind === "Drop Shoulder" ? "tee" : kind === "Polo" ? "polo" : "crop", kind === "Crop" ? 548 : 700, "url(#hg)").replace(/url\(#gDark\)/g, "url(#hg)")}
  </g>
  <line x1="0" y1="1012" x2="1920" y2="1012" stroke="${GOLD}" stroke-width="1" opacity="0.3"/>
  <text x="88" y="964" font-family="Arial, Helvetica, sans-serif" font-size="17" letter-spacing="9" fill="#BDB5A8" opacity="0.65">${label.toUpperCase()}</text>
</svg>`;
}

writeFileSync(join(outDir, "hero", "hero-drop-shoulder.svg"), heroSvg("drop-shoulder", "Drop Shoulder", "camel"));
writeFileSync(join(outDir, "hero", "hero-crop.svg"), heroSvg("crop", "Crop", "caramel"));
writeFileSync(join(outDir, "hero", "hero-polo.svg"), heroSvg("polo", "Polo", "mocha"));

function promoSvg(w, h, hue) {
  const { light, deep } = HUES[hue];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="sale promotion">
  <defs>
    <linearGradient id="pbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#241E1A"/>
      <stop offset="100%" stop-color="#0A0908"/>
    </linearGradient>
    <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${light}"/>
      <stop offset="100%" stop-color="${deep}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#pbg)"/>
  <g transform="translate(${w - 520} ${h * 0.5 - 200}) scale(0.66)">
    ${garment("tee", 700, "url(#pg)")}
  </g>
  <line x1="0" y1="${h - 40}" x2="${w}" y2="${h - 40}" stroke="${GOLD}" stroke-width="1" opacity="0.3"/>
</svg>`;
}

writeFileSync(join(outDir, "promo.svg"), promoSvg(1600, 700, "caramel"));
writeFileSync(join(outDir, "promo-2.svg"), promoSvg(500, 500, "walnut"));

writeFileSync(
  join(outDir, "placeholder.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <rect width="800" height="1000" fill="#EFEADF"/>
  <path d="${teePath(700)}" fill="none" stroke="${INK}" stroke-width="3" opacity="0.2"/>
  <line x1="330" y1="810" x2="470" y2="810" stroke="${GOLD}" opacity="0.35"/>
  <text x="400" y="846" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" letter-spacing="18" fill="${INK}" opacity="0.28">M K L O T H</text>
</svg>`
);

console.log(`Generated ${products.length * 3} product, 3 category, 3 hero, 2 promo and 1 placeholder SVGs under public/images/`);