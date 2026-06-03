'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { KineticHeading } from '@/components/motion/kinetic-heading';
import { Button } from '@/components/primitives/button';
import { Magnetic } from '@/components/motion/magnetic';
import { CursorSpotlight } from '@/components/motion/cursor-spotlight';
import { ShaderGrid } from '@/components/three/shader-grid';
import { getFeaturedMachines } from '@/lib/catalog';
import { whatsappLink } from '@/lib/utils';

// Cinematic hero — designed around the assets we actually have (real machine
// photography + WebGL grid shader). The factory floor video can be dropped in
// later at /public/video/factory-hero.mp4 by uncommenting the <video> block
// below; until then the layered shader + product collage carries the section.
export function HeroCinematic() {
  const t = useTranslations('home');
  const machines = getFeaturedMachines().slice(0, 3);

  return (
    <section className="relative h-[100dvh] w-full overflow-hidden bg-[color:var(--color-ink)]">
      {/* Cursor-tracking cerulean halo — pure visual accent */}
      <CursorSpotlight size={420} intensity={0.22} />

      {/* Background WebGL grid — cerulean ripple reactive to cursor */}
      <div className="absolute inset-0 opacity-60">
        <ShaderGrid />
      </div>

      {/* Diagonal sweep gradient for editorial weight */}
      <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-ink)] via-transparent to-[color:var(--color-ink)]" />
      <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[color:var(--color-ink)] via-[color:var(--color-ink)]/70 to-transparent" />

      {/* Floating machine collage — bottom-right, parallax-floating */}
      <div
        className="pointer-events-none absolute right-0 bottom-0 w-full max-w-[55vw] h-[80%] hidden lg:block"
        aria-hidden="true"
      >
        {machines.map((m, i) => {
          if (!m.image) return null;
          const positions = [
            { right: '8%', bottom: '12%', size: 380, rotate: -4, delay: 0.4, depth: 30 },
            { right: '28%', bottom: '32%', size: 280, rotate: 6, delay: 0.8, depth: 50 },
            { right: '2%', bottom: '52%', size: 220, rotate: -2, delay: 1.2, depth: 70 },
          ];
          const p = positions[i];
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 60, rotate: p.rotate * 2 }}
              animate={{ opacity: 1, y: 0, rotate: p.rotate }}
              transition={{ duration: 1.2, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
              className="absolute"
              style={{
                right: p.right,
                bottom: p.bottom,
                width: p.size,
                height: p.size,
              }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 6 + i,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.7,
                }}
                className="relative w-full h-full"
              >
                <div className="absolute inset-0 bg-[color:var(--color-neutral-800)]/80 backdrop-blur-sm border border-[color:var(--color-neutral-700)]" />
                <Image
                  src={m.image}
                  alt=""
                  fill
                  sizes="380px"
                  className="object-contain p-8 mix-blend-luminosity opacity-90"
                />
                <div className="absolute bottom-2 left-2 right-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[color:var(--color-neutral-400)]">
                  {m.name}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Final ink fade on the right edge so text never collides with imagery */}
      <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[color:var(--color-ink)] via-[color:var(--color-ink)]/40 to-transparent hidden lg:block pointer-events-none" />

      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 pb-24 lg:px-12 lg:pb-32">
        <div className="grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6 flex items-center gap-3"
            >
              <span className="h-px w-12 bg-[color:var(--color-signal)]" />
              Auraplex · MY · 2026
            </motion.div>

            <KineticHeading className="text-[clamp(3rem,8vw,7.5rem)]">
              {t('heroH1')}
            </KineticHeading>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="mt-8 max-w-2xl prose-editorial text-[color:var(--color-steel-soft)]"
            >
              {t('heroSub')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.7 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Magnetic>
                <Button asChild size="lg">
                  <Link href="/products">{t('ctaPrimary')} →</Link>
                </Button>
              </Magnetic>
              <Magnetic>
                <Button asChild variant="ghost" size="lg">
                  <a
                    href={whatsappLink('Hi Auraplex, I saw your site and want to talk.')}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t('ctaSecondary')} →
                  </a>
                </Button>
              </Magnetic>
            </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="col-span-12 lg:col-span-4 lg:col-start-9 border-l border-[color:var(--color-signal)] pl-6 py-2"
          >
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-[color:var(--color-steel)] mb-2">
              Live spec
            </div>
            <div className="font-mono text-lg text-[color:var(--color-paper)] leading-relaxed">
              {t('heroCallout')}
            </div>
          </motion.aside>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-widest text-[color:var(--color-steel)] flex flex-col items-center gap-2 z-20"
      >
        <span>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="h-6 w-px bg-[color:var(--color-steel)]"
        />
      </motion.div>
    </section>
  );
}
