'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
import { Component, Suspense, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { MachineModel } from './machine-model';
import { FactoryEnvironment } from './factory-environment';
import { Button } from '@/components/primitives/button';
import { usePerfTier } from '@/lib/hooks';

/**
 * Catches GLTF load/parse failures inside the Canvas so a bad or missing
 * model degrades to a quiet fallback instead of crashing the whole page to
 * the route error boundary.
 */
class ModelErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

type Config = {
  containerShape: 'round' | 'oval' | 'square';
  containerSize: number;
  throughput: number;
  vision: boolean;
  rejectStation: boolean;
  lineIntegration: boolean;
};

const DEFAULTS: Config = {
  containerShape: 'round',
  containerSize: 80,
  throughput: 120,
  vision: false,
  rejectStation: false,
  lineIntegration: false,
};

export function ProductConfigurator({
  modelUrl,
  productName,
  hasModel,
  slug,
  locale,
}: {
  modelUrl: string;
  productName: string;
  hasModel: boolean;
  slug: string;
  locale: string;
}) {
  const t = useTranslations('configurator');
  const [config, setConfig] = useState<Config>(DEFAULTS);
  const [copied, setCopied] = useState(false);
  const tier = usePerfTier();
  // Bloom + tone-mapping post-processing is expensive; skip it on phone-class
  // / low-power devices and when the user prefers reduced motion.
  const heavyEffects = tier === 'full';

  const update = <K extends keyof Config>(k: K, v: Config[K]) => setConfig((c) => ({ ...c, [k]: v }));

  // Localized shape labels — mapped explicitly (rather than a dynamic
  // t(`shapes.${x}`)) so the message keys stay statically checkable.
  const shapeLabels: Record<Config['containerShape'], string> = {
    round: t('shapes.round'),
    oval: t('shapes.oval'),
    square: t('shapes.square'),
  };

  // A one-line, human-readable summary of the requirements the buyer entered.
  // This is a *requirements request*, not a price estimate — Auraplex quotes
  // every line individually. The summary rides along to the product page's
  // quote form (?spec=…) so an engineer sees the line spec with the enquiry.
  const specSummary = [
    t('summaryContainer', { shape: shapeLabels[config.containerShape] }),
    `${config.containerSize}mm`,
    t('summaryThroughput', { n: config.throughput }),
    config.vision && t('vision'),
    config.rejectStation && t('reject'),
    config.lineIntegration && t('integration'),
  ]
    .filter(Boolean)
    .join(' · ');

  const quoteHref = `/${locale}/products/${slug}?spec=${encodeURIComponent(
    specSummary,
  )}#quote`;

  const shareConfig = async () => {
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}${window.location.pathname}?config=${encodeURIComponent(
      JSON.stringify(config),
    )}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context / permissions) — no-op; the button
      // simply doesn't confirm rather than throwing.
    }
  };

  return (
    <div className="grid grid-cols-12 gap-0 h-[100dvh] bg-[color:var(--color-ink)]">
      <aside className="col-span-12 md:col-span-3 border-r border-[color:var(--color-steel)]/30 p-6 overflow-y-auto">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-2">— {t('eyebrowConfigure')}</div>
        <h2 className="font-display text-2xl mb-8">{productName}</h2>

        <Group label={t('containerShape')}>
          {(['round', 'oval', 'square'] as const).map((s) => (
            <Pill key={s} active={config.containerShape === s} onClick={() => update('containerShape', s)}>
              {shapeLabels[s]}
            </Pill>
          ))}
        </Group>

        <Group label={`${t('containerSize')} · ${config.containerSize}mm`}>
          <input
            type="range"
            min={30}
            max={250}
            value={config.containerSize}
            onChange={(e) => update('containerSize', Number(e.target.value))}
            className="w-full accent-[color:var(--color-signal)]"
          />
        </Group>

        <Group label={`${t('throughput')} · ${config.throughput} ${t('unitsPerMin')}`}>
          <input
            type="range"
            min={60}
            max={240}
            step={10}
            value={config.throughput}
            onChange={(e) => update('throughput', Number(e.target.value))}
            className="w-full accent-[color:var(--color-signal)]"
          />
        </Group>

        <Group label={t('addOns')}>
          <Toggle checked={config.vision} onChange={(v) => update('vision', v)}>{t('vision')}</Toggle>
          <Toggle checked={config.rejectStation} onChange={(v) => update('rejectStation', v)}>{t('reject')}</Toggle>
          <Toggle checked={config.lineIntegration} onChange={(v) => update('lineIntegration', v)}>{t('integration')}</Toggle>
        </Group>
      </aside>

      <main className="col-span-12 md:col-span-6 relative">
        {hasModel ? (
          <Canvas shadows dpr={heavyEffects ? [1, 2] : [1, 1.5]} gl={{ antialias: true }}>
            <PerspectiveCamera makeDefault position={[3, 2, 5]} fov={35} />
            <OrbitControls enablePan={false} minDistance={3} maxDistance={10} maxPolarAngle={Math.PI / 2} />
            <Suspense fallback={<Html center><span className="font-mono text-sm">{t('loadingModel')}</span></Html>}>
              <FactoryEnvironment />
              <ModelErrorBoundary fallback={null}>
                <MachineModel url={modelUrl} autoRotate={false} highlightPart={config.vision ? 'vision-system' : null} />
              </ModelErrorBoundary>
              {heavyEffects && (
                <EffectComposer>
                  <Bloom intensity={0.4} luminanceThreshold={0.8} mipmapBlur />
                  <ToneMapping />
                </EffectComposer>
              )}
            </Suspense>
          </Canvas>
        ) : (
          <ModelPlaceholder productName={productName} />
        )}
      </main>

      <aside className="col-span-12 md:col-span-3 border-l border-[color:var(--color-steel)]/30 p-6 overflow-y-auto flex flex-col">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-2">— {t('eyebrowSpec')}</div>
        <div className="space-y-3 font-mono text-sm py-4">
          <Spec k={t('specShape')} v={shapeLabels[config.containerShape]} />
          <Spec k={t('specDiameter')} v={`${config.containerSize}mm`} />
          <Spec k={t('specThroughput')} v={`${config.throughput}/min`} />
          <Spec k={t('specVision')} v={config.vision ? t('yes') : '—'} />
          <Spec k={t('specReject')} v={config.rejectStation ? t('yes') : '—'} />
          <Spec k={t('specIntegration')} v={config.lineIntegration ? t('yes') : '—'} />
        </div>

        <div className="mt-auto pt-8 border-t border-[color:var(--color-steel)]/30">
          <div className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-steel)] mb-1">{t('pricingLabel')}</div>
          <div className="font-display text-2xl text-[color:var(--color-paper)] mb-1 leading-tight">
            {t('pricingValue')}
          </div>
          <div className="font-mono text-xs text-[color:var(--color-steel)] mb-6">
            {t('pricingNote')}
          </div>

          <Button asChild className="w-full mb-3">
            <Link href={quoteHref}>{t('sendSpec')}</Link>
          </Button>
          <Button variant="ghost" className="w-full" onClick={shareConfig}>
            {copied ? t('linkCopied') : t('copyLink')}
          </Button>
        </div>
      </aside>
    </div>
  );
}

function ModelPlaceholder({ productName }: { productName: string }) {
  const t = useTranslations('configurator');
  return (
    <div className="h-full min-h-[50vh] md:min-h-[100dvh] flex flex-col items-center justify-center gap-4 p-8 text-center bg-[color:var(--color-neutral-800)]/30">
      <div
        className="h-16 w-16 rounded-full border border-[color:var(--color-signal)]/40 flex items-center justify-center font-mono text-xl text-[color:var(--color-signal)]"
        aria-hidden="true"
      >
        ◇
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)]">
        {t('previewSoonBadge')}
      </div>
      <p className="max-w-xs font-mono text-xs text-[color:var(--color-steel)] leading-relaxed">
        {t('previewSoonBody', { productName })}
      </p>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <div className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-steel)] mb-3">{label}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 font-mono text-xs uppercase tracking-wider border transition ${
        active
          ? 'border-[color:var(--color-signal)] text-[color:var(--color-signal)] bg-[color:var(--color-signal)]/10'
          : 'border-[color:var(--color-steel)]/30 text-[color:var(--color-steel-soft)] hover:border-[color:var(--color-steel)]'
      }`}
    >
      {children}
    </button>
  );
}

function Toggle({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer w-full py-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-[color:var(--color-signal)]"
      />
      <span className="font-mono text-xs uppercase tracking-wider">{children}</span>
    </label>
  );
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-[color:var(--color-steel)]/20 pb-2">
      <span className="text-[color:var(--color-steel)] uppercase text-[10px] tracking-widest">{k}</span>
      <span className="text-[color:var(--color-paper)]">{v}</span>
    </div>
  );
}
