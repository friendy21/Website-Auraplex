// Public navigation API. `Link` is the intent-prefetching wrapper (see
// lib/intent-link.tsx); everything else comes straight from next-intl.
export { routing, redirect, usePathname, useRouter, getPathname } from './navigation-base';
export { Link, PlainLink } from './intent-link';
