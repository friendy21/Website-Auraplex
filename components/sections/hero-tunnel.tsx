'use client';

import { useEffect, useRef } from 'react';
import { getPerfTier } from '@/lib/hooks';

/**
 * HeroTunnel — the bespoke hero background: a receding perspective corridor
 * of concentric square rings on ink, with signal-coloured motes drifting
 * toward the vanishing point. It reads as "the mouth of the machine tunnel"
 * so the hero flows directly into the MachineHyperscroll beat below.
 *
 * One canvas, transform-cheap: rings are stroked rects scaled around centre;
 * motes are small additive dots. No video, no shader, no O(n²) connections.
 *
 * Perf tiers:
 *   full    — 14 rings + 70 motes, mouse parallax
 *   lite    — 8 rings + 24 motes, no parallax
 *   minimal — renders nothing (a static CSS gradient shows through instead)
 */
const SIGNAL = { r: 39, g: 150, b: 223 };

export function HeroTunnel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const tier = getPerfTier();
    if (tier === 'minimal') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const RING_COUNT = tier === 'lite' ? 8 : 14;
    const MOTE_COUNT = tier === 'lite' ? 24 : 70;
    const parallax = tier === 'full';

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const motes = Array.from({ length: MOTE_COUNT }, () => ({
      a: Math.random() * Math.PI * 2, // angle around centre
      r: Math.random(), // 0..1 distance from centre (normalised)
      speed: Math.random() * 0.0016 + 0.0006,
      size: Math.random() * 1.6 + 0.4,
    }));

    let t0 = performance.now();

    function frame(now: number) {
      const dt = Math.min(now - t0, 50);
      t0 = now;
      ctx!.clearRect(0, 0, w, h);

      // Vanishing point drifts slightly toward the cursor.
      if (parallax) {
        mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.04;
        mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.04;
      }
      const cx = w / 2 + mouse.current.x * 40;
      const cy = h * 0.52 + mouse.current.y * 30;
      const time = now * 0.0001;

      // Receding rings — concentric squares scaling out from the vanishing
      // point. Each ring's phase cycles so the corridor appears to move.
      const maxDim = Math.hypot(w, h);
      for (let i = 0; i < RING_COUNT; i++) {
        const phase = ((i / RING_COUNT + time) % 1);
        const scale = phase * phase; // ease-in so rings accelerate outward
        const size = scale * maxDim;
        const alpha = Math.min(phase * 1.4, 1) * (1 - phase) * 0.5;
        if (alpha <= 0.002) continue;
        ctx!.strokeStyle = `rgba(${SIGNAL.r}, ${SIGNAL.g}, ${SIGNAL.b}, ${alpha})`;
        ctx!.lineWidth = 1;
        ctx!.strokeRect(cx - size / 2, cy - size / 2, size, size);
      }

      // Motes drifting outward from the vanishing point.
      for (const m of motes) {
        m.r += m.speed * dt;
        if (m.r > 1) {
          m.r = 0;
          m.a = Math.random() * Math.PI * 2;
        }
        const ease = m.r * m.r;
        const dist = ease * maxDim * 0.55;
        const x = cx + Math.cos(m.a) * dist;
        const y = cy + Math.sin(m.a) * dist * 0.7;
        const alpha = Math.min(m.r * 2, 1) * (1 - m.r) * 0.9;
        const sz = m.size * (0.4 + ease * 1.6);
        ctx!.beginPath();
        ctx!.arc(x, y, sz, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${SIGNAL.r}, ${SIGNAL.g}, ${SIGNAL.b}, ${alpha})`;
        ctx!.fill();
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    function onMove(e: PointerEvent) {
      mouse.current.tx = e.clientX / window.innerWidth - 0.5;
      mouse.current.ty = e.clientY / window.innerHeight - 0.5;
    }

    resize();
    window.addEventListener('resize', resize);
    if (parallax) window.addEventListener('pointermove', onMove);
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
