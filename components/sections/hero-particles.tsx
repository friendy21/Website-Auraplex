'use client';

import { useEffect, useRef } from 'react';

/**
 * HeroParticles — procedural Canvas2D constellation.
 *
 * 120 slowly drifting particles form a sparse network. When two particles
 * are within 140px they connect with a thin signal-coloured line whose
 * opacity fades with distance. Particles also brighten and enlarge when
 * the cursor is nearby, giving the hero a living, reactive depth.
 *
 * This replaces the YouTube video background with a generative,
 * precision-engineered aesthetic that never loops or feels like stock
 * footage. It is intentionally subtle so the typography remains primary.
 */

const PARTICLE_COUNT = 120;
const CONNECTION_DIST = 140;
const MOUSE_RADIUS = 220;
const SIGNAL = { r: 39, g: 150, b: 223 }; // #2796df

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  alpha: number;
  pulse: number;
  pulseSpeed: number;
}

export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initParticles() {
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(Math.random() * 0.15 + 0.05), // drift upward slowly
        radius: Math.random() * 1.5 + 0.5,
        baseRadius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      }));
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      const particles = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Update + draw connections first (behind particles)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Drift
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        // Wrap edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Mouse proximity glow
        const dxm = mx - p.x;
        const dym = my - p.y;
        const distMouse = Math.hypot(dxm, dym);
        let mouseBoost = 0;
        if (distMouse < MOUSE_RADIUS) {
          mouseBoost = 1 - distMouse / MOUSE_RADIUS;
          p.vx += dxm * 0.00005;
          p.vy += dym * 0.00005;
        }

        // Dampen velocity
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.vy = Math.max(p.vy, -0.35);
        p.vy = Math.min(p.vy, 0.35);

        // Connections
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < CONNECTION_DIST) {
            const opacity = (1 - dist / CONNECTION_DIST) * 0.18 * (p.alpha + q.alpha) * 0.5;
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(q.x, q.y);
            ctx!.strokeStyle = `rgba(${SIGNAL.r}, ${SIGNAL.g}, ${SIGNAL.b}, ${opacity})`;
            ctx!.lineWidth = 0.8;
            ctx!.stroke();
          }
        }

        // Draw particle
        const pulseR = p.baseRadius + Math.sin(p.pulse) * 0.4 + mouseBoost * 1.2;
        const alpha = p.alpha + Math.sin(p.pulse * 0.7) * 0.1 + mouseBoost * 0.3;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, Math.max(0.5, pulseR), 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${SIGNAL.r}, ${SIGNAL.g}, ${SIGNAL.b}, ${Math.min(alpha, 1)})`;
        ctx!.fill();

        // Subtle glow on larger particles
        if (pulseR > 1.2) {
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, pulseR * 3, 0, Math.PI * 2);
          const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulseR * 3);
          grad.addColorStop(0, `rgba(${SIGNAL.r}, ${SIGNAL.g}, ${SIGNAL.b}, ${alpha * 0.25})`);
          grad.addColorStop(1, `rgba(${SIGNAL.r}, ${SIGNAL.g}, ${SIGNAL.b}, 0)`);
          ctx!.fillStyle = grad;
          ctx!.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    function onMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    }
    function onLeave() {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    }

    // Pause the RAF loop when the canvas is offscreen — the hero is only
    // visible for the first viewport-height of scroll; running 60fps
    // canvas updates afterward is pure waste. visibilitychange also
    // covers the user switching tabs.
    let running = false;
    function start() {
      if (running) return;
      running = true;
      rafRef.current = requestAnimationFrame(draw);
    }
    function stop() {
      if (!running) return;
      running = false;
      cancelAnimationFrame(rafRef.current);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas!);

    function onVisibility() {
      if (document.hidden) stop();
      else if (canvas!.getBoundingClientRect().bottom > 0) start();
    }
    document.addEventListener('visibilitychange', onVisibility);

    resize();
    initParticles();

    window.addEventListener('resize', resize);
    canvas!.addEventListener('pointermove', onMove);
    canvas!.addEventListener('pointerleave', onLeave);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', resize);
      canvas!.removeEventListener('pointermove', onMove);
      canvas!.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      aria-hidden="true"
      style={{ opacity: 0.85 }}
    />
  );
}
