'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
import { Suspense, useState, useMemo } from 'react';
import { MachineModel } from './machine-model';
import { FactoryEnvironment } from './factory-environment';
import { Button } from '@/components/primitives/button';
import { formatRM } from '@/lib/utils';

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

const BASE_PRICE_MONTHLY = 1800;
const ADD_COST = { vision: 400, rejectStation: 300, lineIntegration: 500 };

export function ProductConfigurator({ modelUrl, productName }: { modelUrl: string; productName: string }) {
  const [config, setConfig] = useState<Config>(DEFAULTS);

  const monthlyPrice = useMemo(() => {
    let p = BASE_PRICE_MONTHLY;
    if (config.throughput > 120) p += (config.throughput - 120) * 8;
    if (config.vision) p += ADD_COST.vision;
    if (config.rejectStation) p += ADD_COST.rejectStation;
    if (config.lineIntegration) p += ADD_COST.lineIntegration;
    return Math.round(p);
  }, [config]);

  const update = <K extends keyof Config>(k: K, v: Config[K]) => setConfig((c) => ({ ...c, [k]: v }));

  return (
    <div className="grid grid-cols-12 gap-0 h-[100dvh] bg-[color:var(--color-ink)]">
      <aside className="col-span-12 md:col-span-3 border-r border-[color:var(--color-steel)]/30 p-6 overflow-y-auto">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-2">— Configure</div>
        <h2 className="font-display text-2xl mb-8">{productName}</h2>

        <Group label="Container shape">
          {(['round', 'oval', 'square'] as const).map((s) => (
            <Pill key={s} active={config.containerShape === s} onClick={() => update('containerShape', s)}>
              {s}
            </Pill>
          ))}
        </Group>

        <Group label={`Container size · ${config.containerSize}mm`}>
          <input
            type="range"
            min={30}
            max={250}
            value={config.containerSize}
            onChange={(e) => update('containerSize', Number(e.target.value))}
            className="w-full accent-[color:var(--color-signal)]"
          />
        </Group>

        <Group label={`Throughput · ${config.throughput} units/min`}>
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

        <Group label="Add-ons">
          <Toggle checked={config.vision} onChange={(v) => update('vision', v)}>Vision system</Toggle>
          <Toggle checked={config.rejectStation} onChange={(v) => update('rejectStation', v)}>Reject station</Toggle>
          <Toggle checked={config.lineIntegration} onChange={(v) => update('lineIntegration', v)}>Line integration</Toggle>
        </Group>
      </aside>

      <main className="col-span-12 md:col-span-6 relative">
        <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
          <PerspectiveCamera makeDefault position={[3, 2, 5]} fov={35} />
          <OrbitControls enablePan={false} minDistance={3} maxDistance={10} maxPolarAngle={Math.PI / 2} />
          <Suspense fallback={<Html center><span className="font-mono text-sm">Loading model…</span></Html>}>
            <FactoryEnvironment />
            <MachineModel url={modelUrl} autoRotate={false} highlightPart={config.vision ? 'vision-system' : null} />
            <EffectComposer>
              <Bloom intensity={0.4} luminanceThreshold={0.8} mipmapBlur />
              <ToneMapping />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </main>

      <aside className="col-span-12 md:col-span-3 border-l border-[color:var(--color-steel)]/30 p-6 overflow-y-auto flex flex-col">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-2">— Spec sheet</div>
        <div className="space-y-3 font-mono text-sm py-4">
          <Spec k="Shape" v={config.containerShape} />
          <Spec k="Diameter" v={`${config.containerSize}mm`} />
          <Spec k="Throughput" v={`${config.throughput}/min`} />
          <Spec k="Vision" v={config.vision ? 'Yes' : '—'} />
          <Spec k="Reject" v={config.rejectStation ? 'Yes' : '—'} />
          <Spec k="Integration" v={config.lineIntegration ? 'Yes' : '—'} />
        </div>

        <div className="mt-auto pt-8 border-t border-[color:var(--color-steel)]/30">
          <div className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-steel)] mb-1">From</div>
          <div className="font-display text-4xl text-[color:var(--color-signal)] mb-1">{formatRM(monthlyPrice)}</div>
          <div className="font-mono text-xs text-[color:var(--color-steel)] mb-6">/month · 60 mo · MIDA financing</div>

          <Button className="w-full mb-3">Request quote</Button>
          <Button variant="ghost" className="w-full">Share configuration</Button>
        </div>
      </aside>
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
