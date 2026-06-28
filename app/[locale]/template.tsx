import { PageTransition } from '@/components/motion/page-transition';

/**
 * Route template — re-mounts on every navigation, which is exactly where the
 * PageTransition reveal hooks in. Stays a Server Component so `children`
 * (the route's server-rendered tree) is never gated behind client JS.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
