/**
 * One-shot image compressor for /public assets.
 *
 * Why: several source images shipped at camera-original sizes (12.8MB
 * PNG, 8.7MB JPEG). next/image serves optimized derivatives at runtime,
 * but oversized sources still bloat the repo, slow Vercel build caching,
 * and ship raw if anything ever references them outside next/image
 * (og images, RSS, copy-paste into emails).
 *
 * Strategy — conservative, in-place, same filename + format so no code
 * references break:
 *   - JPEG: resize to max 2400px wide, mozjpeg quality 75
 *   - PNG:  resize to max 2400px wide, compressionLevel 9, effort 7
 *   - Only overwrite when the result is meaningfully smaller (>10%)
 *
 * Usage: node scripts/compress-images.mjs
 */
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('../public', import.meta.url).pathname.replace(
  /^\/([A-Za-z]:)/,
  '$1',
);
const DIRS = ['products', 'floor', 'exhibitions', 'clients', 'brand'];
const THRESHOLD = 300 * 1024; // only touch files over 300KB
const MAX_WIDTH = 2400;

let totalBefore = 0;
let totalAfter = 0;
let touched = 0;

for (const dir of DIRS) {
  const dirPath = join(ROOT, dir);
  let entries;
  try {
    entries = await readdir(dirPath);
  } catch {
    continue; // directory may not exist
  }

  for (const file of entries) {
    const ext = extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;

    const filePath = join(dirPath, file);
    const before = (await stat(filePath)).size;
    if (before < THRESHOLD) continue;

    const tmpPath = `${filePath}.tmp`;
    const img = sharp(filePath).resize({
      width: MAX_WIDTH,
      withoutEnlargement: true,
    });

    if (ext === '.png') {
      await img.png({ compressionLevel: 9, effort: 7 }).toFile(tmpPath);
    } else if (ext === '.webp') {
      await img.webp({ quality: 78 }).toFile(tmpPath);
    } else {
      await img.jpeg({ quality: 75, mozjpeg: true }).toFile(tmpPath);
    }

    const after = (await stat(tmpPath)).size;
    if (after < before * 0.9) {
      await unlink(filePath);
      await rename(tmpPath, filePath);
      totalBefore += before;
      totalAfter += after;
      touched++;
      console.log(
        `✓ ${dir}/${file}: ${(before / 1024 / 1024).toFixed(1)}MB → ${(after / 1024 / 1024).toFixed(2)}MB`,
      );
    } else {
      await unlink(tmpPath);
    }
  }
}

console.log(
  `\nDone — ${touched} files, ${(totalBefore / 1024 / 1024).toFixed(1)}MB → ${(totalAfter / 1024 / 1024).toFixed(1)}MB (saved ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(1)}MB)`,
);
