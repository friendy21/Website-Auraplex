/**
 * Auraplex machine catalog — public API.
 *
 * Data comes from `lib/catalog.generated.ts`, which is produced by
 * `scripts/build-catalog.ts` reading source-of-truth files
 * (MACHINE_MAPPING.json + manifest.json + filesystem). Regenerate with
 * `pnpm catalog` after adding new photography.
 *
 * This module adds the decorative layer that doesn't belong in generated data:
 *   - human-written category summaries
 *   - the featured-slug allowlist
 *   - placeholder fields (speed/price/specs) ready to be filled when real
 *     data arrives — pages render an honest "On request" fallback meanwhile.
 */

import { MACHINES_RAW, type RawMachine } from './catalog.generated';

export type Category = 'labelling' | 'packaging' | 'automation';

export type Machine = RawMachine & {
  featured: boolean;
  summary: string;
  /** Throughput (units/min). Null until real numbers are supplied. */
  speed: number | null;
  /** Monthly OPEX price in RM. Null until real numbers are supplied. */
  monthlyPrice: number | null;
  /** Long-form specs. Empty until supplied. */
  specs: { label: string; value: string; unit?: string }[];
};

const CATEGORY_SUMMARY: Record<Category, string> = {
  labelling:
    'Precision applicator engineered for ASEAN container shapes. Local installation and parts support.',
  packaging:
    'Continuous-operation sealing built for Malaysian production lines. Local installation and parts support.',
  automation:
    'AR-series additive manufacturing for prototyping, fixtures and short-run production.',
};

// Hand-picked feature flags — surfaced on the homepage and category heroes.
const FEATURED_SLUGS = new Set([
  'flexy-applicator',
  'semi-auto-wrap-around-labelling-machine',
  'print-apply-top-labelling-machine',
  'customized-top-labelling-machine',
  'continuous-band-sealing-machine',
]);

export const MACHINES: Machine[] = MACHINES_RAW.map((m) => ({
  ...m,
  featured: FEATURED_SLUGS.has(m.slug),
  summary: CATEGORY_SUMMARY[m.category],
  speed: null,
  monthlyPrice: null,
  specs: [],
}));

export function getMachine(slug: string): Machine | null {
  return MACHINES.find((m) => m.slug === slug) ?? null;
}

export function getMachinesByCategory(category?: Category): Machine[] {
  if (!category) return MACHINES;
  return MACHINES.filter((m) => m.category === category);
}

/** Machines with a verified cover image — surface these first in grids. */
export function getMachinesWithCover(): Machine[] {
  return MACHINES.filter((m) => m.image !== null);
}

export function getFeaturedMachines(): Machine[] {
  return MACHINES.filter((m) => m.featured && m.image !== null);
}

/** Pretty category label for UI. */
export function categoryLabel(category: Category): string {
  return category === 'labelling'
    ? 'Labelling'
    : category === 'packaging'
      ? 'Packaging'
      : 'Automation';
}

/**
 * Auto-derive feature tags from a machine's name. Names follow a stable
 * vocabulary on auraplex.com.my, so token-matching is reliable. Limited to
 * the 3 most-informative tags per machine to keep cards scannable.
 */
export function machineTags(m: Machine): string[] {
  const n = m.name.toLowerCase();
  const tags: string[] = [];

  // Application style (mutually-exclusive — pick the most specific match)
  if (/print\s*[&\s]?\s*apply/.test(n)) tags.push('Print & Apply');
  else if (/wrap[\s-]?around/.test(n)) tags.push('Wrap-Around');
  else if (/flat/.test(n)) tags.push('Flat');

  // Position
  if (/two[\s-]?in[\s-]?one/.test(n)) tags.push('2-in-1');
  else if (/two[\s-]?side/.test(n)) tags.push('Two-Side');
  else if (/three[\s-]?side/.test(n)) tags.push('Three-Side');
  else if (/front[\s-]?[&\s]?[\s-]?back/.test(n)) tags.push('Front & Back');
  else if (/body[\s-]?[&\s]?[\s-]?neck/.test(n)) tags.push('Body & Neck');
  else if (/\btop\b/.test(n)) tags.push('Top');
  else if (/\bbottom\b/.test(n)) tags.push('Bottom');
  else if (/vertical/.test(n)) tags.push('Vertical');

  // Capability
  if (/checking|vision/.test(n)) tags.push('Vision');
  else if (/thermal\s*transfer/.test(n)) tags.push('Thermal Transfer');
  else if (/corner\s*press/.test(n)) tags.push('Corner Press');
  else if (/round\s*bottle/.test(n)) tags.push('Round Bottle');
  else if (/egg\s*tray/.test(n)) tags.push('Egg Tray');
  else if (/auto\s*feeder/.test(n)) tags.push('Auto Feeder');

  // Automation
  if (/semi[\s-]?auto/.test(n)) tags.push('Semi-Auto');

  // Custom flag — never first, treated as a modifier
  if (/customi[sz]ed|custom/.test(n) && !tags.includes('Vision')) {
    tags.push('Custom');
  }

  // Versioning
  const vMatch = n.match(/\bv(\d+)\b/);
  if (vMatch) tags.push(`v${vMatch[1]}`);

  return tags.slice(0, 3);
}

/** Counts per category (and total) — for filter UI. */
export function categoryCounts(): {
  all: number;
  labelling: number;
  packaging: number;
  automation: number;
} {
  return {
    all: MACHINES.length,
    labelling: MACHINES.filter((m) => m.category === 'labelling').length,
    packaging: MACHINES.filter((m) => m.category === 'packaging').length,
    automation: MACHINES.filter((m) => m.category === 'automation').length,
  };
}
