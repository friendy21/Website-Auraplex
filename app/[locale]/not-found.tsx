import Link from 'next/link';
import { Button } from '@/components/primitives/button';

export default function NotFound() {
  return (
    <section className="min-h-[80dvh] flex flex-col items-center justify-center px-6 text-center">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">— 404</div>
      <h1 className="font-display text-[clamp(3rem,10vw,8rem)] tracking-[-0.03em] leading-[0.92]">Off the line.</h1>
      <p className="mt-6 max-w-md prose-editorial text-[color:var(--color-steel-soft)]">
        That page isn't here. Either it never was, or it's been retired. Let's get you back to a working machine.
      </p>
      <Button asChild className="mt-10"><Link href="/">Return home →</Link></Button>
    </section>
  );
}
