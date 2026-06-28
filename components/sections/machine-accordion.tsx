'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePerfTier } from '@/lib/hooks';

export type AccordionItem = {
  slug: string;
  name: string;
  image: string;
  category: string;
  label: string;
  summary: string;
  photos: number;
};
type Props = { items: AccordionItem[] };

// Family accents — drawn from the brand palette (cerulean signal + two
// tasteful companions), one per engineering family. Replaces the pen's neon.
const ACCENT: Record<string, string> = {
  labelling: '#3FA9E0',
  packaging: '#E0A23F',
  automation: '#8B7DF0',
};
const accentOf = (cat: string) => ACCENT[cat] ?? '#3FA9E0';
const hexA = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

/**
 * MachineAccordion — a cinematic expanding-panel showcase of the featured
 * machines, adapted from ash1198/ZYOWOpm ("Neon Launch Gallery"). A row of
 * panels; click one and it expands, with its number, family, name, summary,
 * honest meta (family · photos · local support) and a "View machine" CTA
 * animating in on a stagger. The active panel's image gets a soft
 * mouse-parallax; prev/next + arrow keys move between machines, and an accent
 * LED in the status bar syncs to the active family.
 *
 * Rebranded from neon to the site's dark-industrial ink with per-family
 * accents; no fabricated spec bars (the catalogue has none yet) — every line
 * shown is real. Product photos sit object-contain over an accent-tinted
 * panel so nothing is cropped. Mobile / reduced-motion gets a static grid.
 */
export function MachineAccordion({ items }: Props) {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const tier = usePerfTier();

  const go = (dir: number) =>
    setActive((i) => (i + dir + items.length) % items.length);

  // Arrow-key nav — only while the section is on screen, so it never
  // hijacks the page elsewhere.
  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec || tier === 'minimal') return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.4,
    });
    io.observe(sec);
    return () => io.disconnect();
  }, [tier]);

  useEffect(() => {
    if (!inView) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, items.length]);

  if (!items.length) return null;

  const accent = accentOf(items[active]?.category ?? 'labelling');

  // ── Mobile / minimal fallback: static stacked cards ──
  if (tier === 'minimal') {
    return (
      <section className="bg-[color:var(--color-ink)] text-[color:var(--color-paper)] py-20 px-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">
          — Launch gallery
        </div>
        <div className="space-y-4">
          {items.map((m) => (
            <Link
              key={m.slug}
              href={`/products/${m.slug}`}
              className="flex items-center gap-4 rounded-xl border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] p-4"
            >
              <div className="relative h-20 w-20 shrink-0">
                <Image src={m.image} alt={m.name} fill sizes="80px" className="object-contain" />
              </div>
              <div className="min-w-0">
                <div className="font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: accentOf(m.category) }}>
                  {m.label}
                </div>
                <div className="font-display text-lg leading-tight truncate">{m.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="bg-[color:var(--color-ink)] text-[color:var(--color-paper)] py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]/60 backdrop-blur-md rounded-2xl px-5 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="h-2.5 w-2.5 rounded-full transition-all duration-500"
              style={{ background: accent, boxShadow: `0 0 16px ${hexA(accent, 0.6)}` }}
            />
            <div className="min-w-0">
              <div className="font-display text-sm font-bold tracking-tight truncate">
                {items[active]?.name}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-steel)]">
                Launch gallery · {items[active]?.label}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous machine"
              className="nav-prev h-9 w-9 grid place-items-center rounded-full border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] hover:border-[color:var(--color-signal)] hover:-translate-y-px transition"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next machine"
              className="nav-next h-9 w-9 grid place-items-center rounded-full border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] hover:border-[color:var(--color-signal)] hover:-translate-y-px transition"
            >
              →
            </button>
          </div>
        </div>

        {/* Stage */}
        <div className="relative mt-4 rounded-2xl overflow-hidden border border-[color:var(--color-neutral-700)] shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
          <div className="absolute z-10 top-4 left-4 flex items-center gap-2.5 rounded-full bg-[color:var(--color-ink)]/50 backdrop-blur-md border border-[color:var(--color-neutral-700)] px-3 py-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: accent, boxShadow: `0 0 14px ${hexA(accent, 0.6)}` }}
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-steel-soft)]">
              {String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')} · click a panel
            </span>
          </div>

          <div className="flex h-[clamp(420px,62vh,640px)]">
            {items.map((m, i) => {
              const a = i === active;
              const acc = accentOf(m.category);
              return (
                <Panel
                  key={m.slug}
                  m={m}
                  index={i}
                  active={a}
                  accent={acc}
                  parallax={tier === 'full'}
                  onSelect={() => setActive(i)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Panel({
  m,
  index,
  active,
  accent,
  parallax,
  onSelect,
}: {
  m: AccordionItem;
  index: number;
  active: boolean;
  accent: string;
  parallax: boolean;
  onSelect: () => void;
}) {
  const imgRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (!parallax || !active || !imgRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    imgRef.current.style.transform = `scale(1.08) translate(${x * 14}px, ${y * 10}px)`;
  };
  const onLeave = () => {
    if (imgRef.current) imgRef.current.style.transform = '';
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      aria-label={`${m.name} — ${m.label}`}
      className="group relative overflow-hidden text-left cursor-pointer min-w-0 outline-none"
      style={{
        flex: active ? '2.7 1 0%' : '1 1 0%',
        transition: 'flex 720ms cubic-bezier(0.2,0.8,0.2,1), filter 720ms cubic-bezier(0.2,0.8,0.2,1)',
        filter: active ? 'none' : 'saturate(0.7) brightness(0.78)',
        borderLeft: index === 0 ? 'none' : '1px solid var(--color-neutral-700)',
      }}
    >
      {/* Accent-tinted backdrop + product image */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 90% at 60% 15%, ${hexA(accent, 0.2)}, transparent 60%), var(--color-neutral-800)`,
        }}
      />
      <div
        ref={imgRef}
        className="absolute inset-0 transition-transform duration-700 ease-out"
        style={{ transform: 'scale(1.02)' }}
      >
        <Image
          src={m.image}
          alt={m.name}
          fill
          sizes="(max-width: 1024px) 60vw, 40vw"
          className="object-contain p-8"
        />
      </div>
      {/* Vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.05), rgba(5,7,12,0.88)), linear-gradient(90deg, transparent, rgba(5,7,12,0.5))',
        }}
      />

      {/* Big ghost number */}
      <div
        className="absolute font-display font-light pointer-events-none transition-all duration-700"
        style={{
          left: 18,
          top: active ? 14 : 'auto',
          bottom: active ? 'auto' : -6,
          fontSize: active ? 52 : 64,
          color: active ? hexA(accent, 0.5) : 'rgba(255,255,255,0.18)',
          letterSpacing: '-2px',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Content */}
      <div className="absolute left-5 right-5 bottom-5 z-[2]">
        <div
          className="flex gap-2 mb-3 transition-all duration-500"
          style={{
            opacity: active ? 1 : 0,
            transform: active ? 'translateY(0)' : 'translateY(10px)',
            transitionDelay: active ? '140ms' : '0ms',
          }}
        >
          <span
            className="font-mono text-[10px] uppercase tracking-[0.2em] rounded-full px-2.5 py-1 border"
            style={{ borderColor: hexA(accent, 0.5), color: accent, background: hexA(accent, 0.1) }}
          >
            {m.label}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] rounded-full px-2.5 py-1 border border-[color:var(--color-neutral-700)] text-[color:var(--color-steel-soft)] bg-[color:var(--color-ink)]/40">
            Selangor-built
          </span>
        </div>

        <h3
          className="font-display text-2xl md:text-3xl font-bold tracking-tight transition-all duration-500"
          style={{
            opacity: active ? 1 : 0,
            transform: active ? 'translateY(0)' : 'translateY(18px)',
            transitionDelay: active ? '220ms' : '0ms',
          }}
        >
          {m.name}
        </h3>

        <p
          className="mt-2 max-w-[520px] text-sm leading-relaxed text-[color:var(--color-steel-soft)] transition-all duration-500"
          style={{
            opacity: active ? 1 : 0,
            transform: active ? 'translateY(0)' : 'translateY(18px)',
            transitionDelay: active ? '300ms' : '0ms',
          }}
        >
          {m.summary}
        </p>

        {/* Honest meta + CTA */}
        <div
          className="mt-4 flex flex-wrap items-center gap-2.5 transition-all duration-500"
          style={{
            opacity: active ? 1 : 0,
            transform: active ? 'translateY(0)' : 'translateY(18px)',
            transitionDelay: active ? '380ms' : '0ms',
          }}
        >
          <Meta k="Family" v={m.label} />
          <Meta k="Photos" v={String(m.photos)} />
          <Meta k="Support" v="Local" />
          <Link
            href={`/products/${m.slug}`}
            data-cursor="caliper"
            className="font-mono text-[10px] uppercase tracking-[0.2em] rounded-full px-4 py-2 text-[color:var(--color-ink)] font-bold hover:-translate-y-px transition"
            style={{ background: accent }}
            onClick={(e) => e.stopPropagation()}
          >
            View machine →
          </Link>
        </div>
      </div>
    </div>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <span className="rounded-full border border-[color:var(--color-neutral-700)] bg-[color:var(--color-ink)]/40 px-3 py-1.5 text-[11px]">
      <span className="text-[color:var(--color-steel)]">{k} </span>
      <span className="font-bold">{v}</span>
    </span>
  );
}
