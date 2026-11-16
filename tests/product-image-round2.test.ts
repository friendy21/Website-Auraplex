import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { MACHINES, getMachine, type Machine } from '../lib/catalog';
import { MACHINES_RAW } from '../lib/catalog.generated';

// Latest upstream main when this follow-up was prepared, including merged PR #4.
const baseCommit = '9c36bbcc82153e2e03996fad7d2727cde1c4b4fe';
const source = execFileSync('git', ['show', `${baseCommit}:lib/catalog.ts`], { encoding: 'utf8' });
const baselineModule = { exports: {} as { MACHINES: Machine[] } };
runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, {
  exports: baselineModule.exports,
  require: (name: string) => {
    assert.equal(name, './catalog.generated');
    return { MACHINES_RAW };
  },
});
const before: Machine[] = JSON.parse(JSON.stringify(baselineModule.exports.MACHINES));
const bytes = (file: string) => readFileSync(join(process.cwd(), 'public', 'products', file));

test('Round 2 changes only the two approved gallery references and preserves every other field and image order', () => {
  const removals: Record<string, string> = {
    'continuous-band-sealing-machine': '/products/Continuous_Band_Sealing_Machine_3.webp',
    'customized-top-labelling-machine': '/products/Customized_Top_Labelling_Machine_16.webp',
  };
  for (const [slug, file] of Object.entries(removals)) {
    assert.equal(before.find((m) => m.slug === slug)!.gallery.filter((image) => image === file).length, 1);
  }
  assert.deepEqual(MACHINES, before.map((m) => ({
    ...m,
    gallery: m.gallery.filter((file) => file !== removals[m.slug]),
  })));
  assert.equal(before.reduce((total, m) => total + m.gallery.length, 0), 66);
  assert.equal(MACHINES.reduce((total, m) => total + m.gallery.length, 0), 64);
});

test('Continuous Band Sealing retains _6.png as cover and removes only _3.webp', () => {
  const product = getMachine('continuous-band-sealing-machine')!;
  assert.equal(product.image, '/products/Continuous_Band_Sealing_Machine_6.png');
  assert.equal(product.gallery[0], product.image);
  assert.ok(!product.gallery.includes('/products/Continuous_Band_Sealing_Machine_3.webp'));
  assert.ok(bytes('Continuous_Band_Sealing_Machine_6.png').length);
  assert.ok(bytes('Continuous_Band_Sealing_Machine_3.webp').length);
});

test('Customized Top loses _16.webp while One Side retains the identical image once; both files remain', () => {
  assert.ok(!getMachine('customized-top-labelling-machine')!.gallery
    .includes('/products/Customized_Top_Labelling_Machine_16.webp'));
  const oneSide = getMachine('one-side-wrap-around-side-labelling-machine')!;
  assert.deepEqual(oneSide, before.find((m) => m.slug === oneSide.slug));
  assert.equal(oneSide.gallery.filter((file) =>
    file === '/products/One_Side_Wrap_Around_Side_Labelling_Machine_6.webp').length, 1);
  assert.deepEqual(bytes('Customized_Top_Labelling_Machine_16.webp'),
    bytes('One_Side_Wrap_Around_Side_Labelling_Machine_6.webp'));
});
