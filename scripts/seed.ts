/**
 * Sanity seed script. Run with: `pnpm tsx scripts/seed.ts`
 * Requires SANITY_API_WRITE_TOKEN in .env.local.
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

const products = [
  {
    _id: 'product-solo-wrap',
    _type: 'product',
    name: 'Solo-Wrap Labeller',
    slug: { _type: 'slug', current: 'solo-wrap-labeller' },
    category: 'labelling',
    featured: true,
    speed: 120,
    monthlyPrice: 1800,
    summary: 'Wrap-around labelling for round containers from 30mm to 250mm. Servo-driven precision at 120 units/min sustained.',
    specs: [
      { _key: 's1', _type: 'spec', label: 'Max speed', value: '120', unit: 'units/min' },
      { _key: 's2', _type: 'spec', label: 'Container diameter', value: '30–250', unit: 'mm' },
      { _key: 's3', _type: 'spec', label: 'Label types', value: 'Paper, BOPP, PE' },
      { _key: 's4', _type: 'spec', label: 'Power', value: '1.5', unit: 'kW' },
      { _key: 's5', _type: 'spec', label: 'Air requirement', value: '6', unit: 'bar' },
      { _key: 's6', _type: 'spec', label: 'Warranty', value: '2', unit: 'years' },
      { _key: 's7', _type: 'spec', label: 'Lead time', value: '4', unit: 'weeks' },
      { _key: 's8', _type: 'spec', label: 'Footprint', value: '1.8 × 0.9 × 1.6', unit: 'm' },
    ],
    features: [
      { _key: 'f1', _type: 'feature', icon: 'vision', title: 'Vision-guided precision', body: '1ms detection, ±0.3mm placement accuracy on every container.' },
      { _key: 'f2', _type: 'feature', icon: 'servo', title: 'Servo-driven feed', body: 'No tension drift. Same precision at hour 1 as hour 8.' },
      { _key: 'f3', _type: 'feature', icon: 'reject', title: 'Auto reject station', body: 'Deviated containers ejected, line keeps running.' },
      { _key: 'f4', _type: 'feature', icon: 'tool', title: 'Tool-less changeover', body: 'Swap container sizes in under 90 seconds.' },
    ],
    faq: [
      { _key: 'q1', _type: 'qa', q: 'Can it run mixed container sizes?', a: 'Yes — vision detects size and adjusts placement within the SKU envelope.' },
      { _key: 'q2', _type: 'qa', q: 'What\'s the typical install time?', a: 'On-site setup and operator training is two working days.' },
      { _key: 'q3', _type: 'qa', q: 'Does it integrate with existing conveyors?', a: 'Yes — the line-integration add-on includes PLC handshake (Modbus/EtherCAT) and conveyor sync.' },
    ],
  },
  {
    _id: 'product-duo-front-back',
    _type: 'product',
    name: 'Duo Front-and-Back',
    slug: { _type: 'slug', current: 'duo-front-back-labeller' },
    category: 'labelling',
    featured: false,
    speed: 90,
    monthlyPrice: 2200,
    summary: 'Front-and-back labelling for oval and rectangular containers. Synchronous dual-head application.',
    specs: [
      { _key: 's1', _type: 'spec', label: 'Max speed', value: '90', unit: 'units/min' },
      { _key: 's2', _type: 'spec', label: 'Container width', value: '40–180', unit: 'mm' },
      { _key: 's3', _type: 'spec', label: 'Label types', value: 'Paper, BOPP, transparent' },
    ],
  },
  {
    _id: 'product-shrink-tunnel',
    _type: 'product',
    name: 'Helix Shrink Tunnel',
    slug: { _type: 'slug', current: 'helix-shrink-tunnel' },
    category: 'packaging',
    featured: false,
    speed: 150,
    monthlyPrice: 2400,
    summary: 'Steam shrink tunnel for sleeve labels. Even heat distribution, no scorch marks.',
    specs: [
      { _key: 's1', _type: 'spec', label: 'Max speed', value: '150', unit: 'units/min' },
      { _key: 's2', _type: 'spec', label: 'Tunnel length', value: '1.2', unit: 'm' },
    ],
  },
  {
    _id: 'product-ax-300',
    _type: 'product',
    name: 'AX-300 Industrial 3D Printer',
    slug: { _type: 'slug', current: 'ax-300-printer' },
    category: 'automation',
    featured: false,
    speed: 0,
    monthlyPrice: 1500,
    summary: 'Industrial-grade FDM printer for spare parts, jigs, and short-run tooling. 300×300×400mm build volume.',
    specs: [
      { _key: 's1', _type: 'spec', label: 'Build volume', value: '300×300×400', unit: 'mm' },
      { _key: 's2', _type: 'spec', label: 'Materials', value: 'PETG, ABS, ASA, Nylon' },
    ],
  },
];

const caseStudies = [
  {
    _id: 'case-xyz-foods',
    _type: 'caseStudy',
    title: 'A 40% throughput lift, financed in 14 months.',
    slug: { _type: 'slug', current: 'xyz-foods' },
    customer: 'XYZ Foods · Selangor',
    industry: 'Food & beverage',
    summary: 'A mid-size sauce manufacturer in Shah Alam replaced two ageing imports with one Solo-Wrap and reallocated three operators to QC.',
    outcomes: [
      { _key: 'o1', _type: 'outcome', metric: 'Throughput', value: '+40%' },
      { _key: 'o2', _type: 'outcome', metric: 'Annual savings', value: 'RM 180k' },
      { _key: 'o3', _type: 'outcome', metric: 'Payback', value: '14 mo' },
      { _key: 'o4', _type: 'outcome', metric: 'Uptime', value: '99.6%' },
    ],
    pullQuote: 'The financing made our CFO say yes. The reliability made us reorder.',
    attribution: 'Plant Manager, XYZ Foods',
    publishedAt: '2026-03-15T00:00:00Z',
  },
  {
    _id: 'case-cosmetic-jb',
    _type: 'caseStudy',
    title: 'Three import labellers, retired in one weekend.',
    slug: { _type: 'slug', current: 'cosmetic-jb' },
    customer: 'Selasih Cosmetics · Johor Bahru',
    industry: 'Cosmetics',
    summary: 'A growing skincare brand consolidated three under-supported Chinese-import machines into one Duo unit, freeing 18m² of floor space.',
    outcomes: [
      { _key: 'o1', _type: 'outcome', metric: 'Floor space', value: '−18m²' },
      { _key: 'o2', _type: 'outcome', metric: 'SKU changeover', value: '−65%' },
      { _key: 'o3', _type: 'outcome', metric: 'Maintenance', value: '−RM 30k/yr' },
    ],
    pullQuote: 'We retired three labellers for one. The floor felt twice as big.',
    attribution: 'COO, Selasih Cosmetics',
    publishedAt: '2026-02-08T00:00:00Z',
  },
];

const settings = {
  _id: 'site-settings',
  _type: 'settings',
  tickerMachines: 1247,
  tickerLabelsToday: 8200000,
  tickerUptime: '99.4%',
  tickerFactories: 340,
  whatsappNumber: '60123456789',
  midaApproved: true,
};

async function seed() {
  console.log('Seeding products…');
  for (const p of products) await client.createOrReplace(p as any);
  console.log('Seeding case studies…');
  for (const c of caseStudies) await client.createOrReplace(c as any);
  console.log('Seeding settings…');
  await client.createOrReplace(settings as any);
  console.log('Done.');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
