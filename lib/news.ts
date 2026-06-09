/**
 * Static news posts.
 *
 * Why static and not Sanity? The real autolabellermalaysia.com has a
 * News & Events nav item but appears to publish thinly. A handful of
 * anchor posts shipped as code is a better baseline than an empty
 * Sanity collection — easier to keep accurate, no editing overhead.
 * Migrate to Sanity once the cadence justifies a CMS.
 *
 * Editorial guidelines:
 *  - Use real entities (PROPAK Asia, internship cohorts, real machine
 *    slugs from the catalog). No fabricated customer names or specs.
 *  - Lead time / throughput numbers should match what lib/catalog.ts
 *    publishes. Don't invent new ones here.
 *  - Cross-link to /internship, /2026, /products/[slug] where natural.
 *  - Body is plain markdown-ish strings — the detail page renders them
 *    as paragraphs without parsing markdown syntax (keep it simple).
 */

export type NewsPost = {
  slug: string;
  /** ISO 8601, e.g. '2026-11-12'. Used for sort + display. */
  date: string;
  /** One-word category for the chip — Cohort / Exhibition / Build / Review. */
  category: 'Cohort' | 'Exhibition' | 'Build' | 'Review' | 'Service';
  /** Headline, sentence-case, no trailing period unless it's a question. */
  title: string;
  /** One-sentence summary for the list view. */
  summary: string;
  /**
   * Hero image — path under /public. Used as the thumbnail in the
   * list view and as the full-bleed hero on the detail page. Pull
   * from the machine catalog so every post is illustrated with real
   * Auraplex product photography rather than stock.
   */
  image?: string;
  /** Optional descriptive alt text for the hero image. */
  imageAlt?: string;
  /** Optional related route (e.g. '/internship', '/2026') for the CTA. */
  ctaHref?: string;
  ctaLabel?: string;
  /** Body — array of paragraph strings, rendered in order. */
  body: string[];
};

export const NEWS: NewsPost[] = [
  {
    slug: 'january-2027-internship-cohort-open',
    date: '2026-11-15',
    category: 'Cohort',
    title: 'Applications open — January 2027 internship cohort',
    summary:
      'Six disciplines, three to six months, paid stipend. Applications for the January cohort close on 8 December 2026.',
    image: '/floor/workers.jpg',
    imageAlt: 'Auraplex engineers on the Seri Kembangan factory floor',
    ctaHref: '/internship',
    ctaLabel: 'Apply now',
    body: [
      'Auraplex is opening applications for the January 2027 internship cohort. We onboard two interns per month across mechanical, electrical, controls, software, industrial design, and service.',
      'Every internship is paid — monthly RM stipend confirmed in writing on the offer letter, scaled by discipline and the level of work. Default duration is three months with an option to extend to six if your university semester aligns.',
      "What's different about the program: you sit next to the engineer who designed the machine you're working on, not at a separate intern desk. Safety boots, calipers, HMI debugging, real machines on the floor. Strong performers leave with a full-time offer signed before they head back to campus for finals.",
      'The application form below takes about five minutes. We review every CV within five business days and reply either way — even if it\'s a "not this cohort, try the next one" we tell you so you\'re not stuck waiting.',
    ],
  },
  {
    slug: 'propak-asia-2026-recap',
    date: '2026-10-22',
    category: 'Exhibition',
    title: 'PROPAK Asia 2026 — what we brought to the floor',
    summary:
      'Three machines shown live, two custom rigs in conversation, one excellent week in Bangkok.',
    image: '/exhibitions/mimf-2025.jpg',
    imageAlt: 'Auraplex booth at Malaysia International Machinery Fair 2025',
    body: [
      'PROPAK Asia is the regional pulse-check for packaging and labelling. Auraplex took three machines onto the floor this year: the Flexy Applicator, the Customized Top Labelling Machine with Checking System, and the Continuous Band Sealing Machine. Each ran demo containers in rotation for the four exhibition days.',
      'The conversations that mattered most weren\'t at the booth — they were the engineering teams from across ASEAN who walked us through their existing lines, their throughput targets, and the bottlenecks they wanted to solve. We came back with two confirmed custom-rig discoveries and a long list of follow-ups.',
      'If you saw us in Bangkok and would like to continue the conversation, the same engineers who staffed the booth answer the WhatsApp number at the bottom of every page on this site.',
    ],
  },
  {
    slug: 'behind-the-build-customized-top-labelling',
    date: '2026-09-14',
    category: 'Build',
    title: 'Behind the build — vision-grade top labelling',
    summary:
      'Inside the eight-week build of a customized top labeller with integrated checking system, photographed on our Seri Kembangan floor.',
    image: '/floor/strength.jpg',
    imageAlt: 'Auraplex engineer working on a labelling machine assembly',
    ctaHref: '/products/custom-top-labelling-machine-with-checking-system',
    ctaLabel: 'See the machine',
    body: [
      "Custom builds at Auraplex don't happen in a back room. The machine is assembled on the same floor, by the same engineers, that you'll meet when you walk in for a factory tour. This piece is a behind-the-scenes look at one of those builds — a customized top labelling machine with an integrated vision-checking system.",
      'The build moved through our standard seven-step process: discovery on the customer\'s line in Selangor, fixed-price quote within three days for the custom scope, CAD review with the customer\'s plant manager, then six weeks of build + commissioning on our floor. FAT (Factory Acceptance Test) photographs were shared with the customer at week five so there were no surprises on delivery day.',
      'The vision system catches deviations at 1 ms detection, with auto-reject handling routed back to the line PLC. Throughput sustained at 120 units per minute through the FAT runs. Two weeks of install + commissioning on the customer floor followed; the line was producing labelled output by week three of install.',
    ],
  },
  {
    slug: '30-machines-one-year-2026-review',
    date: '2026-08-30',
    category: 'Review',
    title: '30 machines, one year — read the 2026 floor review',
    summary:
      'Every machine we shipped this year, every industry we served, every install we photographed. The Auraplex 2026 review is live.',
    image: '/exhibitions/mimf-2024.jpg',
    imageAlt: 'Auraplex at MIMF 2024 — the year in review',
    ctaHref: '/2026',
    ctaLabel: 'Read the 2026 review',
    body: [
      "The /2026 page is the long read — every machine, every industry served, every photograph from the floor. It's the closest thing we publish to an annual report, written without the corporate gloss.",
      'If you only have time for one section, scroll to "§ 05 / Quarter by quarter" — four releases, four named milestones, the honest version of what happened on the floor between January and December.',
    ],
  },
];

export function getNewsPost(slug: string): NewsPost | undefined {
  return NEWS.find((n) => n.slug === slug);
}

export function getNewsByDate(): NewsPost[] {
  return [...NEWS].sort((a, b) => b.date.localeCompare(a.date));
}
