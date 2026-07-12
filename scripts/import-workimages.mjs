// One-off: import selected clean machine renders from D:\WORK\Auraplex,
// resize/compress to web webp, and drop them in public/products/real.
// Run: node scripts/import-workimages.mjs
import { mkdir, access } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const SRC = 'D:/WORK/Auraplex';
const OUT = new URL('../public/products/real/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

// slug -> chosen source render (best iso/front view). Confident matches only.
const MAP = {
  'flexy-applicator': 'flexy applicato/flexy applicator 45 degree orthgraphic.png',
  'two-side-labelling-machine': '2 Side Labelling Machine/2 SIDE LABELLING MACHINE.1.png',
  'two-in-one-wrap-around-side-labelling-machine': '2 IN 1 WRAP AROUND/2in1_warp_around.33.png',
  'ar600-3d-printer': '3d printer/AR600 ( ISO).png',
  'ar320-3d-printer': '3d printer/SL320.34.png',
  'ar220-3d-printer': '3d printer/iso 1.1.png',
  'bottom-labelling-machine': 'bottom labeling/bottom labeling (keyshot).163.png',
  'standard-top-labelling-machine': 'standard top machine render/STANDARD MACHINE 1.20.png',
  'semi-auto-round-bottle-labelling-machine': 'round bottle labelling/round bottle labeling ( small).217.png',
  'top-labelling-machine': '1TL Machine/1TL Machine Render.151.png',
  // pending-slot fills (confident)
  'vertical-wrap-around-labelling-machine': 'vertical wrap machine.png',
  'custom-top-labelling-machine-with-checking-system': 'schmaco machine/CAM 5 - RIGHT VIEW.245.png',
  'top-labelling-machine-v2': '1TL Machine/1TL Machine Render.152.png',
};

await mkdir(OUT, { recursive: true });
const done = [];
for (const [slug, rel] of Object.entries(MAP)) {
  const src = join(SRC, rel);
  try {
    await access(src);
  } catch {
    console.warn('MISSING, skipped:', slug, '->', rel);
    continue;
  }
  const out = join(OUT, `${slug}.webp`);
  await sharp(src)
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(out);
  done.push(slug);
  console.log('ok:', slug);
}
console.log('\nIMPORTED', done.length, 'of', Object.keys(MAP).length);
