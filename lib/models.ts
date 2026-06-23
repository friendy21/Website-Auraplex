// Server-only: reads the filesystem. Import only from Server Components /
// route handlers, never from a 'use client' module.
import fs from 'node:fs';
import path from 'node:path';

const MODELS_DIR = path.join(process.cwd(), 'public', 'models');

/**
 * Whether a 3D model (`public/models/<slug>.glb`) exists for a machine.
 *
 * The configurator's `useGLTF` throws on a missing asset, which previously
 * crashed every configurator route to the page error boundary (no `.glb`
 * files ship yet). Gating on this lets the CTA and the 3D viewport degrade
 * gracefully, and auto-enables per machine the moment a model is dropped in.
 */
export function hasMachineModel(slug: string): boolean {
  try {
    return fs.existsSync(path.join(MODELS_DIR, `${slug}.glb`));
  } catch {
    return false;
  }
}
