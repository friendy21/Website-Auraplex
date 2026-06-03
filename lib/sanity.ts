import { createClient, type SanityClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

// Project ID and dataset are configured via env. Until the real Sanity project
// is connected we keep this lazy: the client is only constructed on first use,
// so missing env vars don't break unrelated build steps (sitemap, OG, etc).
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = '2025-01-01';

export const sanityConfigured = Boolean(projectId);

let _sanity: SanityClient | null = null;
function getClient(): SanityClient {
  if (!sanityConfigured) {
    throw new Error(
      'Sanity is not configured: set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local',
    );
  }
  if (!_sanity) {
    _sanity = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: 'published',
    });
  }
  return _sanity;
}

export const sanity = new Proxy({} as SanityClient, {
  get(_t, prop) {
    const client = getClient() as unknown as Record<string | symbol, unknown>;
    return client[prop];
  },
});

export const urlFor = (src: unknown) => {
  if (!sanityConfigured) {
    // Returns a chainable stub so calling .url() doesn't blow up at render time.
    const stub = {
      url: () => '',
      width: () => stub,
      height: () => stub,
      fit: () => stub,
      auto: () => stub,
      quality: () => stub,
    };
    return stub as unknown as ReturnType<ReturnType<typeof imageUrlBuilder>['image']>;
  }
  return imageUrlBuilder({ projectId, dataset }).image(src as never);
};

export async function sanityFetch<T>(opts: {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
}): Promise<T> {
  // Throws if Sanity isn't configured — callers already wrap in .catch()
  // to fall back to empty data during dev / pre-launch.
  return getClient().fetch<T>(opts.query, opts.params ?? {}, {
    next: { tags: opts.tags },
  });
}

export const queries = {
  allProducts: `*[_type == "product"] | order(featured desc, name asc) {
    _id, name, slug, category, image, speed, monthlyPrice, featured, summary
  }`,
  productBySlug: `*[_type == "product" && slug.current == $slug][0] {
    _id, name, slug, category, image, gallery, speed, monthlyPrice, summary, body,
    specs, features, faq, relatedCaseStudies[]-> { _id, slug, title, image }
  }`,
  allCaseStudies: `*[_type == "caseStudy"] | order(publishedAt desc) {
    _id, title, slug, hero, customer, summary, outcomes, publishedAt
  }`,
  caseStudyBySlug: `*[_type == "caseStudy" && slug.current == $slug][0]`,
  settings: `*[_type == "settings"][0]`,
};
