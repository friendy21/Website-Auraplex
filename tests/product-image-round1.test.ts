import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { MACHINES, type Machine } from '../lib/catalog';
import { MACHINES_RAW } from '../lib/catalog.generated';
import evidence from '../docs/product-image-round1/changes.json';

const sha = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');
const bytes = (file: string) => readFileSync(join(process.cwd(), 'public', file));
const source = execFileSync('git', ['show', `${evidence.baseCommit}:lib/catalog.ts`], { encoding: 'utf8' });
const baselineModule = { exports: {} as { MACHINES: Machine[] } };
runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, {
  exports: baselineModule.exports,
  require: (name: string) => {
    assert.equal(name, './catalog.generated');
    return { MACHINES_RAW };
  },
});
// Normalize the VM objects so comparisons do not depend on their realm.
const before: Machine[] = JSON.parse(JSON.stringify(baselineModule.exports.MACHINES));

test('only the documented products and image fields change; taxonomy and all other fields survive', () => {
  assert.equal(MACHINES.length, 30);
  assert.equal(evidence.products.length, 10);
  assert.equal(before.reduce((total, m) => total + m.gallery.length, 0), 102);
  assert.equal(MACHINES.reduce((total, m) => total + m.gallery.length, 0), 66);
  for (const original of before) {
    const actual = MACHINES.find((m) => m.slug === original.slug)!;
    const change = evidence.products.find((m) => m.slug === original.slug);
    assert.deepEqual(actual, { ...original, ...(change?.after ?? {}) }, original.slug);
    if (change) assert.deepEqual(change.before, { image: original.image, gallery: original.gallery });
  }
});

test('all 35 wrong-image removals have human evidence and all unaffected gallery views stay in order', () => {
  const removals = evidence.operations.filter((op) => op.operation === 'remove');
  assert.equal(removals.length, 35);
  for (const op of removals) {
    assert.equal(op.round1?.identity, 'wrong');
    assert.equal(op.imageHash, `sha256:${sha(bytes(op.originalImage))}`);
    assert.ok(before.find((m) => m.slug === op.productSlug)!.gallery.includes(op.originalImage));
    assert.ok(!MACHINES.find((m) => m.slug === op.productSlug)!.gallery.includes(op.originalImage));
  }
  for (const original of before) {
    const ops = evidence.operations.filter((op) => op.productSlug === original.slug);
    const excluded = ops.filter((op) => op.operation !== 'cover').map((op) => op.originalImage);
    const retained = original.gallery.filter((file) => !excluded.includes(file));
    const cover = ops.find((op) => op.operation === 'cover')?.updatedImage;
    const expected = cover ? [cover, ...retained.filter((file) => file !== cover)] : retained;
    assert.deepEqual(MACHINES.find((m) => m.slug === original.slug)!.gallery, expected, original.slug);
  }
});

test('duplicate removal retains byte-identical content, and all resulting paths exist without duplicates', () => {
  const duplicate = evidence.operations.filter((op) => op.operation === 'remove-byte-duplicate');
  assert.equal(duplicate.length, 1);
  assert.deepEqual(bytes(duplicate[0].originalImage), bytes(duplicate[0].updatedImage!));
  for (const m of MACHINES) {
    assert.ok(m.image && m.gallery.length, m.slug);
    assert.equal(m.gallery[0], m.image, m.slug);
    const hashes = m.gallery.map((file) => sha(bytes(file)));
    assert.equal(new Set(hashes).size, hashes.length, m.slug);
    assert.equal(new Set(m.gallery).size, m.gallery.length, m.slug);
  }
});

test('replacement cover is independently identity- and cover-reviewed; disputed cover stays', () => {
  const cover = evidence.operations.find((op) => op.operation === 'cover')!;
  assert.equal(cover.round1?.identity, 'correct');
  assert.equal(cover.round1?.cover, 'cover');
  assert.equal(cover.imageHash, `sha256:${sha(bytes(cover.updatedImage!))}`);
  assert.equal(MACHINES.find((m) => m.slug === cover.productSlug)!.image, cover.updatedImage);
  assert.equal(MACHINES.find((m) => m.slug === 'customized-top-labelling-machine')!.image,
    before.find((m) => m.slug === 'customized-top-labelling-machine')!.image);
  assert.ok(evidence.operations.every((op) => op.approvalStatus === 'proposed; pending Friendy PR review'));
});
