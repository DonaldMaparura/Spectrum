/**
 * Download brand-free Unsplash stock images for Spectrum.
 * Run: node scripts/download-stock-images.mjs
 */
import { createWriteStream, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "images", "stock");

mkdirSync(outDir, { recursive: true });

// Unsplash License — free for commercial use. Chosen for no visible brand logos.
const images = [
  {
    key: "hero",
    // Electrician at work — landscape, no company branding
    url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=max&w=2400&q=80",
  },
  {
    key: "electrical",
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=max&w=1600&q=80",
  },
  {
    key: "coc",
    url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=max&w=1600&q=80",
  },
  {
    key: "solar",
    url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=max&w=1600&q=80",
  },
  {
    key: "renovations",
    url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=max&w=1600&q=80",
  },
  {
    key: "floor",
    url: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=max&w=1600&q=80",
  },
  {
    key: "construction",
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=max&w=1600&q=80",
  },
  {
    key: "fencing",
    url: "https://images.unsplash.com/photo-1558618047-f4c7c8b4b0b0?auto=format&fit=max&w=1600&q=80",
  },
  {
    key: "clearview",
    url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=max&w=1600&q=80",
  },
  {
    key: "mechanical",
    url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=max&w=1600&q=80",
  },
  {
    key: "shutdowns",
    url: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=max&w=1600&q=80",
  },
  {
    key: "rubble",
    url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=max&w=1600&q=80",
  },
];

// Fallback map if a specific Unsplash ID 404s — alternate known-good photos
const fallbacks = {
  fencing: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=max&w=1600&q=80",
  clearview: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=max&w=1600&q=80",
  coc: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=max&w=1600&q=80",
  mechanical: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=max&w=1600&q=80",
  rubble: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=max&w=1600&q=80",
  shutdowns: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=max&w=1600&q=80",
};

async function download(url, dest) {
  const res = await fetch(url, {
    headers: { "User-Agent": "SpectrumSiteImageFetcher/1.0" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000) throw new Error(`Too small (${buf.length}b) for ${url}`);
  await sharp(buf)
    .rotate()
    .resize({ width: dest.includes("hero") ? 2400 : 1400, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(dest.replace(/\.webp$/, ".jpg"));
  await sharp(buf)
    .rotate()
    .resize({ width: dest.includes("hero") ? 2400 : 1400, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(dest);
  return buf.length;
}

for (const img of images) {
  const webpPath = join(outDir, `${img.key}.webp`);
  const jpgPath = join(outDir, `${img.key}.jpg`);
  const urls = [img.url];
  if (fallbacks[img.key]) urls.push(fallbacks[img.key]);

  let ok = false;
  for (const url of urls) {
    try {
      const size = await download(url, webpPath);
      console.log(`OK  ${img.key} (${Math.round(size / 1024)}KB) ← ${url.split("?")[0]}`);
      ok = true;
      break;
    } catch (err) {
      console.warn(`FAIL ${img.key}: ${err.message}`);
    }
  }
  if (!ok) {
    console.error(`Could not download ${img.key}`);
    process.exitCode = 1;
  }
}

// Copy hero into main images folder used by the site
if (existsSync(join(outDir, "hero.webp"))) {
  const { copyFileSync } = await import("node:fs");
  copyFileSync(join(outDir, "hero.webp"), join(root, "images", "hero.webp"));
  copyFileSync(join(outDir, "hero.jpg"), join(root, "images", "hero.jpg"));
  console.log("Updated images/hero.webp and images/hero.jpg");
}

console.log("Done.");
