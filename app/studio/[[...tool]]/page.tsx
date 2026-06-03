'use client';

// `export const dynamic` is not allowed with cacheComponents; the Studio is a
// client component (NextStudio sets its own runtime), so no segment hint is needed.
import { NextStudio } from 'next-sanity/studio';
import config from '@/sanity/sanity.config';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
