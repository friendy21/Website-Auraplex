'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useMediaQuery, useReducedMotion } from '@/lib/hooks';

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
// tasteful companions), one per engineering family.
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
 * machines, adapted from ash1198/ZYOWOpm ("Neon Launch Gallery") but rebuilt
 * for isolated product photography rather than full-bleed atmosphere:
 *
 *   • Collapsed panels show a vertical machine name over a ghosted silhouette
 *     of the machine + a thin family-accent rail — clean, never a tiny lost
 *     image.
 *   • Click a panel and it expands: the machine resolves to full size and the
 *     family pill, name, summary, honest meta and "View machine" CTA fade in
 *     on a stagger.
 *   • Prev/next + arrow keys move between machines (arrow nav gated to when
 *     the section is on screen); an accent LED in the status bar syncs to the
 *     active family. Active panel gets a soft mouse-parallax (pointer devices,
 *     motion allowed).
 *
 * The accordion is an INTERACTION, so it renders for everyone on wide screens
 * — reduced-motion only shortens the transition and drops the parallax. Real
 * small screens get a clean two-up card grid. No fabricated specs: every line
 * shown is real catalogue data.
 */
export function MachineAccordion({ items }: Props) {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isNarrow = useMediaQuery('(max-width: 860px)');
  const reduced = useReducedMotion();

  const go = (dir: number) =>
    setActive((i) => (i + dir + items.length) % items.length);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.3,
    });
    io.observe(sec);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || isNarrow) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, isNarrow, items.length]);

  if (!items.length) return null;

  const accent = accentOf(items[active]?.category ?? 'labelling');

  return (
    <section
      ref={sectionRef}
      className="bg-[color:var(--color-ink)] text-[color:var(--color-paper)] py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-4 flex items-center gap-3">
              <span className="h-px w-12 bg-[color:var(--color-signal)]" />
              Launch gallery
            </div>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] tracking-[-0.02em] leading-[1]">
              The featured five.
            </h2>
          </div>

          {!isNarrow && (
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-steel)] hidden lg:block">
                Click a panel · ← → to step
              </span>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous machine"
                className="h-10 w-10 grid place-items-center rounded-full border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] hover:border-[color:var(--color-signal)] hover:-translate-y-px transition"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next machine"
                className="h-10 w-10 grid place-items-center rounded-full border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] hover:border-[color:var(--color-signal)] hover:-translate-y-px transition"
              >
                →
              </button>
            </div>
          )}
        </div>

        {isNarrow ? (
          <MobileGrid items={items} />
        ) : (
          <div className="relative rounded-2xl overflow-hidden border border-[color:var(--color-neutral-700)] shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
            {/* Status bar */}
            <div className="absolute z-10 top-4 left-4 flex items-center gap-2.5 rounded-full bg-[color:var(--color-ink)]/55 backdrop-blur-md border border-[color:var(--color-neutral-700)] px-3 py-2">
              <span
                className="h-2 w-2 rounded-full transition-all duration-500"
                style={{ background: accent, boxShadow: `0 0 14px ${hexA(accent, 0.6)}` }}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-steel-soft)]">
                {String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')} · {items[active]?.label}
              </span>
            </div>

            <div className="flex h-[clamp(460px,64vh,640px)]">
              {items.map((m, i) => (
                <Panel
                  key={m.slug}
                  m={m}
                  index={i}
                  active={i === active}
                  first={i === 0}
                  accent={accentOf(m.category)}
                  parallax={!reduced}
                  reduced={reduced}
                  onSelect={() => setActive(i)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Panel({
  m,
  index,
  active,
  first,
  accent,
  parallax,
  reduced,
  onSelect,
}: {
  m: AccordionItem;
  index: number;
  active: boolean;
  first: boolean;
  accent: string;
  parallax: boolean;
  reduced: boolean;
  onSelect: () => void;
}) {
  const imgRef = useRef<HTMLDivElement>(null);
  const ease = 'cubic-bezier(0.2,0.8,0.2,1)';
  const dur = reduced ? 1 : 720;

  const onMove = (e: React.MouseEvent) => {
    if (!parallax || !active || !imgRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    imgRef.current.style.transform = `translate(${x * 16}px, ${y * 12}px)`;
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
      className="group relative overflow-hidden cursor-pointer min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-signal)] focus-visible:ring-inset"
      style={{
        flex: active ? '3.4 1 0%' : '1 1 0%',
        transition: `flex ${dur}ms ${ease}`,
        borderLeft: first ? 'none' : '1px solid var(--color-neutral-700)',
        background:
          'linear-gradient(180deg, var(--color-neutral-800), var(--color-ink) 92%)',
      }}
    >
      {/* Accent wash + top rail */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: active ? 1 : 0.5,
          background: `radial-gradient(130% 80% at 50% 0%, ${hexA(accent, 0.18)}, transparent 60%)`,
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-[3px] transition-opacity duration-500"
        style={{ background: accent, opacity: active ? 1 : 0.25 }}
      />

      {/* Machine image — ghosted when collapsed, full + parallax when active */}
      <div
        ref={imgRef}
        className="absolute inset-0 transition-transform duration-300 ease-out"
      >
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{ opacity: active ? 1 : 0.16, transform: active ? 'scale(1)' : 'scale(1.04)' }}
        >
          <Image
            src={m.image}
            alt={m.name}
            fill
            sizes="(max-width: 1024px) 70vw, 50vw"
            className="object-contain p-8 md:p-12"
            style={{ objectPosition: active ? 'center 38%' : 'center' }}
          />
        </div>
      </div>

      {/* Collapsed: vertical name */}
      <div
        className="absolute inset-0 grid place-items-center pointer-events-none transition-opacity duration-500"
        style={{ opacity: active ? 0 : 1 }}
      >
        <span
          className="font-display text-lg tracking-[0.04em] text-[color:var(--color-steel-soft)] whitespace-nowrap"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          {m.name}
        </span>
      </div>

      {/* Index number */}
      <div
        className="absolute left-5 top-4 font-display font-light pointer-events-none transition-all duration-500"
        style={{
          fontSize: active ? 40 : 30,
          color: active ? hexA(accent, 0.55) : 'rgba(255,255,255,0.16)',
          letterSpacing: '-1px',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Bottom scrim so info reads over any imagery */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 transition-opacity duration-500"
        style={{
          opacity: active ? 1 : 0,
          background: 'linear-gradient(180deg, transparent, rgba(5,7,12,0.92))',
        }}
      />

      {/* Active content */}
      <div
        className="absolute left-6 right-6 bottom-6 z-[2]"
        style={{ pointerEvents: active ? 'auto' : 'none' }}
      >
        <Stagger active={active} delay={120} reduced={reduced}>
          <div className="flex gap-2 mb-3">
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
        </Stagger>

        <Stagger active={active} delay={200} reduced={reduced}>
          <h3 className="font-display text-2xl md:text-4xl font-bold tracking-tight">
            {m.name}
          </h3>
        </Stagger>

        <Stagger active={active} delay={280} reduced={reduced}>
          <p className="mt-2 max-w-[560px] text-sm leading-relaxed text-[color:var(--color-steel-soft)]">
            {m.summary}
          </p>
        </Stagger>

        <Stagger active={active} delay={360} reduced={reduced}>
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
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
        </Stagger>
      </div>
    </div>
  );
}

function Stagger({
  active,
  delay,
  reduced,
  children,
}: {
  active: boolean;
  delay: number;
  reduced: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        opacity: active ? 1 : 0,
        transform: active ? 'translateY(0)' : 'translateY(16px)',
        transition: reduced
          ? 'opacity 1ms'
          : `opacity 500ms cubic-bezier(0.2,0.8,0.2,1), transform 500ms cubic-bezier(0.2,0.8,0.2,1)`,
        transitionDelay: active && !reduced ? `${delay}ms` : '0ms',
      }}
    >
      {children}
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

/** Clean two-up card grid for real small screens. */
function MobileGrid({ items }: { items: AccordionItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((m) => {
        const accent = accentOf(m.category);
        return (
          <Link
            key={m.slug}
            href={`/products/${m.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]"
          >
            <div className="h-[2px] w-full" style={{ background: accent }} />
            <div
              className="relative aspect-[4/3]"
              style={{ background: `radial-gradient(120% 80% at 50% 0%, ${hexA(accent, 0.16)}, transparent 60%)` }}
            >
              <Image src={m.image} alt={m.name} fill sizes="(max-width:640px) 100vw, 50vw" className="object-contain p-6" />
            </div>
            <div className="p-5 border-t border-[color:var(--color-neutral-700)]">
              <div className="font-mono text-[9px] uppercase tracking-[0.25em]" style={{ color: accent }}>
                {m.label}
              </div>
              <div className="font-display text-xl leading-tight mt-1">{m.name}</div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-steel)] group-hover:text-[color:var(--color-signal)] transition">
                View machine →
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
