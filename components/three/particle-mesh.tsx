'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { lenisScrollVel } from '@/components/providers/lenis-provider';

/**
 * ParticleMesh — a Canvas2D-like grid of signal-cerulean points rendered
 * via R3F. Reacts to:
 *
 *   1. Time (ambient sine breathing — slow drift across the field)
 *   2. Scroll velocity (read from lenisScrollVel ref — no re-renders)
 *   3. Cursor proximity (particles flee the cursor inside an 0.8u radius)
 *
 * Replaces ShaderGrid as the ambient hero background. Sized 80×50 = 4000
 * particles; cheap enough for desktop GPUs but disabled on small screens
 * via the `sm:block` / `hidden` Tailwind utility at the call site.
 *
 * The component is mounted with `next/dynamic` and ssr:false at the call
 * site so Three.js never enters the server bundle.
 */

const COLS = 80;
const ROWS = 50;
const SPACING = 0.14;

function Particles({
  mouseRef,
}: {
  mouseRef: React.MutableRefObject<THREE.Vector2>;
}) {
  const ref = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const { positions, basePositions } = useMemo(() => {
    const pos = new Float32Array(COLS * ROWS * 3);
    const base = new Float32Array(COLS * ROWS * 3);
    let i = 0;
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const x = (col - COLS / 2) * SPACING;
        const y = (row - ROWS / 2) * SPACING;
        pos[i] = base[i] = x;
        pos[i + 1] = base[i + 1] = y;
        pos[i + 2] = base[i + 2] = 0;
        i += 3;
      }
    }
    return { positions: pos, basePositions: base };
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const t = clock.elapsedTime;
    const vel = Math.min(Math.abs(lenisScrollVel.current) * 0.003, 0.8);
    const mx = mouseRef.current.x * (viewport.width / 2);
    const my = mouseRef.current.y * (viewport.height / 2);

    for (let i = 0; i < COLS * ROWS; i++) {
      const bi = i * 3;
      const bx = basePositions[bi];
      const by = basePositions[bi + 1];

      // Ambient sine wave — the field "breathes"
      const wave =
        Math.sin(bx * 2.5 + t * 0.4) * Math.cos(by * 2.5 + t * 0.3) * 0.06;

      // Scroll-velocity ripple — kicks in when scrolling fast
      const scrollRipple = Math.sin(by * 4 + t * 6) * vel * 0.15;

      // Cursor repulsion — particles flee inside an 0.8u radius
      const dx = bx - mx;
      const dy = by - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repulse = dist < 0.8 ? (0.8 - dist) * 0.12 : 0;
      const denom = dist + 0.001;

      pos[bi] = bx + (dx / denom) * repulse;
      pos[bi + 1] = by + wave + scrollRipple + (dy / denom) * repulse;
      pos[bi + 2] = wave * 0.3;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        {/* R3F v9 requires `args` for primitive constructors. The tuple
            maps to new THREE.BufferAttribute(array, itemSize). */}
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color="#2796df"
        transparent
        opacity={0.45}
        sizeAttenuation
      />
    </points>
  );
}

export function ParticleMesh({
  opacity = 1,
  className,
}: {
  opacity?: number;
  className?: string;
}) {
  const mouseRef = useRef(new THREE.Vector2(0, 0));

  return (
    <div
      className={`absolute inset-0 pointer-events-auto ${className ?? ''}`}
      style={{ opacity }}
      onPointerMove={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        mouseRef.current.set(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1,
        );
      }}
      onPointerLeave={() => mouseRef.current.set(0, 0)}
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 60 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        dpr={[1, 1.5]}
      >
        <Particles mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
}
