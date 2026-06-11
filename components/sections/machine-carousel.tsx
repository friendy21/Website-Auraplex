'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/motion/reveal';
import { getMachinesWithCover } from '@/lib/catalog';

/**
 * MachineCarousel — a true 3D rotating ring of machine photography.
 *
 * The classic "million-dollar CodePen" carousel, built the cheap way:
 * eight panels positioned with rotateY(i*45°) translateZ(R) inside a
 * preserve-3d ring that spins via ONE CSS keyframe on transform —
 * compositor-driven, zero main-thread cost, zero layout shift (the
 * stage has a fixed height and everything inside is 3D-transformed).
 * Hovering the stage pauses the spin so visitors can inspect a machine;
 * every panel is a real link into the catalogue.
 *
 * Geometry: panel width 280px, 8 panels → ring radius
 * R = (280/2) / tan(π/8) ≈ 338px. The stage is given enough height for
 * the ring's apparent depth at perspective 1400px.
 *
 * Mobile: the ring scales down via a wrapper transform so the same
 * geometry works at small viewports. Reduced-motion: the global rule in
 * globals.css freezes the spin — the ring becomes a static fan of
 * machines, which still reads well.
 */
const PANEL_W = 280;
const PANEL_COUNT = 8;
const RADIUS = Math.round(PANEL_W / 2 / Math.tan(Math.PI / PANEL_COUNT));

export function MachineCarousel() {
  const t = useTranslations('home.carousel');
  const machines = getMachinesWithCover().slice(0, PANEL_COUNT);
  if (machines.length < 3) return null;

  const step = 360 / machines.length;

  return (
    <section className="relative py-32 overflow-hidden border-y border-[color:var(--color-neutral-700)] bg-[color:var(--color-ink)]">
      {/* Section heading */}
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 mb-4">
        <Reveal variant="up">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4 flex items-center gap-3">
            <span className="h-px w-12 bg-[color:var(--color-signal)]" />
            {t('eyebrow')}
          </div>
          <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.02em] leading-[1] max-w-3xl">
            {t('h2')}
          </h2>
        </Reveal>
      </div>

      {/* 3D stage — fixed height, ring spins inside */}
      <div
        className="carousel-stage relative mx-auto h-[420px] md:h-[480px] w-full max-w-[1600px]"
        style={{ perspective: '1400px' }}
      >
        <div
          className="carousel-ring absolute left-1/2 top-1/2 scale-[0.55] sm:scale-75 lg:scale-100"
          style={{
            width: PANEL_W,
            height: 340,
            marginLeft: -PANEL_W / 2,
            marginTop: -170,
          }}
        >
          {machines.map((m, i) =>
            m.image ? (
              <Link
                key={m.id}
                href={`/products/${m.slug}`}
                className="card-shine group absolute inset-0 border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]/90 hover:border-[color:var(--color-signal)] transition-colors"
                style={{
                  transform: `rotateY(${i * step}deg) translateZ(${RADIUS}px)`,
                  backfaceVisibility: 'hidden',
                }}
              >
                <div className="relative h-[260px] m-3 mb-0">
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    sizes="280px"
                    className="object-contain transition-transform duration-500 group-hover:scale-[1.06]"
                  />
                </div>
                <div className="px-4 py-3 flex items-baseline justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[color:var(--color-steel-soft)] truncate">
                    {m.name}
                  </span>
                  <span className="font-mono text-[10px] text-[color:var(--color-signal)] shrink-0">
                    0{i + 1}
                  </span>
                </div>
              </Link>
            ) : null,
          )}
        </div>

        {/* Floor glow under the ring */}
        <div
          className="absolute left-1/2 bottom-4 h-16 w-[60%] -translate-x-1/2 rounded-[100%] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse, color-mix(in oklab, var(--color-signal) 14%, transparent) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Hint row */}
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 mt-2 flex items-center justify-between flex-wrap gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)]">
          {t('hint')}
        </span>
        <Link
          href="/products"
          className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--color-signal)] hover:text-[color:var(--color-paper)] transition-colors"
        >
          {t('cta')} →
        </Link>
      </div>
    </section>
  );
}
