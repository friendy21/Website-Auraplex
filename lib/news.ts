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
 *  - Posts are the REAL events published on auraplex.com.my (MIMF /
 *    Metaltech / MAHA exhibitions + the MIMF innovation recognition).
 *    No fabricated customer names, specs, or throughput numbers.
 *  - Cross-link to /products, /contact, /2026 where natural.
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
    slug: 'mimf-best-company-for-innovation',
    date: '2024-12-10',
    category: 'Review',
    title: 'Recognised as a best company for innovation at MIMF',
    summary:
      'Auraplex SDN BHD was recognised as a best company for innovation at the Malaysia International Machinery Fair (MITEC, Kuala Lumpur).',
    image: '/exhibitions/mimf-2025.jpg',
    imageAlt: 'Auraplex at the Malaysia International Machinery Fair, MITEC Kuala Lumpur',
    ctaHref: '/products',
    ctaLabel: 'Browse the machines',
    body: [
      'Auraplex SDN BHD was recognised as a best company for innovation at the Malaysia International Machinery Fair, held at MITEC in Kuala Lumpur.',
      'Auraplex specializes in manufacturing labelling machines, packaging machines, 3D printers and customized machines, and is dedicated to delivering high-quality automation solutions tailored to meet your needs.',
    ],
  },
  {
    slug: 'metaltech-hybrid-exhibition-2024',
    date: '2024-07-15',
    category: 'Exhibition',
    title: 'Metaltech Hybrid Exhibition 2024 — MITEC',
    summary:
      'Auraplex joined one of the largest equipment exhibitions at MITEC, Kuala Lumpur, introducing our machines to the manufacturing public.',
    image: '/exhibitions/mimf-2024.jpg',
    imageAlt: 'Auraplex booth at the Metaltech Hybrid Exhibition 2024, MITEC',
    ctaHref: '/contact',
    ctaLabel: 'Talk to us',
    body: [
      'Auraplex Sdn Bhd joined one of the largest equipment exhibitions, held at MITEC in Kuala Lumpur, introducing our company and machines to the general public.',
      'Visitors saw our labelling, packaging and automation machines first-hand and discussed their own line requirements with the engineers who build them.',
    ],
  },
  {
    slug: 'malaysia-international-machinery-fair-2023',
    date: '2023-07-13',
    category: 'Exhibition',
    title: 'Malaysia International Machinery Fair 2023',
    summary:
      'Auraplex Sdn Bhd joined MIMF 2023 at MITEC, Kuala Lumpur, 13–15 July 2023, presenting our company to the general public.',
    image: '/exhibitions/mimf-2023.png',
    imageAlt: 'Auraplex at the Malaysia International Machinery Fair 2023, MITEC',
    ctaHref: '/products',
    ctaLabel: 'Browse the machines',
    body: [
      'Auraplex Sdn Bhd has joined one of the largest equipment exhibitions, the Malaysia International Machinery Fair 2023, which was held at MITEC in Kuala Lumpur from the 13th to the 15th of July 2023.',
      'The fair was an opportunity to introduce our company and machines to the general public and to meet manufacturers from across the region.',
    ],
  },
  {
    slug: 'malaysia-international-machinery-fair-2022',
    date: '2022-07-15',
    category: 'Exhibition',
    title: 'Malaysia International Machinery Fair 2022',
    summary:
      'Auraplex exhibited at the Malaysia International Machinery Fair 2022, bringing our machines to the manufacturing floor.',
    image: '/exhibitions/mimf-2022.jpg',
    imageAlt: 'Auraplex at the Malaysia International Machinery Fair 2022',
    ctaHref: '/products',
    ctaLabel: 'Browse the machines',
    body: [
      'Auraplex Sdn Bhd exhibited at the Malaysia International Machinery Fair 2022, presenting our labelling, packaging and automation machines to the public.',
      'It was an early opportunity to meet manufacturers and understand the line challenges we now build machines to solve.',
    ],
  },
  {
    slug: 'metaltech-hybrid-exhibition-2022',
    date: '2022-05-18',
    category: 'Exhibition',
    title: 'Metaltech Hybrid Exhibition 2022 — MITEC',
    summary:
      'Auraplex joined the Metaltech Hybrid Exhibition 2022 at MITEC, Kuala Lumpur.',
    image: '/exhibitions/metaltech-2022.jpg',
    imageAlt: 'Auraplex at the Metaltech Hybrid Exhibition 2022, MITEC',
    ctaHref: '/contact',
    ctaLabel: 'Talk to us',
    body: [
      'Auraplex Sdn Bhd joined the Metaltech Hybrid Exhibition 2022, held at MITEC in Kuala Lumpur.',
      'The exhibition put our machines in front of the manufacturing and engineering community in the Klang Valley and beyond.',
    ],
  },
  {
    slug: 'agro-job-fair-maha-2022',
    date: '2022-09-15',
    category: 'Exhibition',
    title: 'Agro Job Fair at MAHA Exhibition 2022',
    summary:
      'Auraplex took part in the Agro Job Fair at the MAHA exhibition in 2022, meeting agri-processing manufacturers.',
    image: '/exhibitions/agro-2022.jpg',
    imageAlt: 'Auraplex at the Agro Job Fair, MAHA Exhibition 2022',
    body: [
      'Auraplex Sdn Bhd participated in the Agro Job Fair at the MAHA (Malaysia Agriculture, Horticulture & Agrotourism) exhibition in 2022.',
      'It was a chance to meet agri-processing manufacturers whose packaging and labelling lines our machines are built to serve.',
    ],
  },
];

export function getNewsPost(slug: string): NewsPost | undefined {
  return NEWS.find((n) => n.slug === slug);
}

export function getNewsByDate(): NewsPost[] {
  return [...NEWS].sort((a, b) => b.date.localeCompare(a.date));
}
