'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useIsClient } from '@/lib/hooks';

/**
 * SoundToggle — optional ambient room-tone for the site.
 *
 * OFF by default. Remembers the visitor's choice in localStorage. When
 * enabled, a soft, low, filtered drone is synthesised live via the Web Audio
 * API (no audio asset shipped) and faded in — it reads as distant factory
 * room-tone, never a melody. Toggling off fades it back out.
 *
 * Autoplay policy compliant: the AudioContext is only created/resumed inside
 * the click handler (a user gesture). Fully keyboard accessible.
 */
export function SoundToggle() {
  const ready = useIsClient();
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const build = useCallback(() => {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AC();

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // Two detuned low oscillators + a gentle lowpass = warm room drone.
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 320;
    filter.Q.value = 0.6;
    filter.connect(master);

    const freqs = [55, 82.5, 110];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 2 ? 'triangle' : 'sine';
      osc.frequency.value = f;
      osc.detune.value = (i - 1) * 6;
      const g = ctx.createGain();
      g.gain.value = i === 2 ? 0.04 : 0.09;
      osc.connect(g);
      g.connect(filter);
      osc.start();
    });

    // Slow LFO on the filter for a breathing quality.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.06;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 90;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    ctxRef.current = ctx;
    gainRef.current = master;
  }, []);

  const toggle = useCallback(async () => {
    if (!on) {
      if (!ctxRef.current) build();
      const ctx = ctxRef.current!;
      if (ctx.state === 'suspended') await ctx.resume();
      const g = gainRef.current!;
      g.gain.cancelScheduledValues(ctx.currentTime);
      g.gain.setValueAtTime(g.gain.value, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 1.2);
      setOn(true);
      try {
        localStorage.setItem('auraplex-sound', '1');
      } catch {}
    } else {
      const ctx = ctxRef.current;
      const g = gainRef.current;
      if (ctx && g) {
        g.gain.cancelScheduledValues(ctx.currentTime);
        g.gain.setValueAtTime(g.gain.value, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
      }
      setOn(false);
      try {
        localStorage.setItem('auraplex-sound', '0');
      } catch {}
    }
  }, [on, build]);

  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  if (!ready) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Mute ambient sound' : 'Enable ambient sound'}
      className="group flex items-center gap-2 text-[color:var(--color-steel)] hover:text-[color:var(--color-signal)] transition-colors"
      title={on ? 'Sound on' : 'Sound off'}
    >
      {/* Equaliser bars — animate only when on */}
      <span className="flex items-end gap-[2px] h-3.5" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="w-[2px] bg-current"
            style={{
              height: on ? undefined : '3px',
              animation: on
                ? `eq-bar 0.9s ease-in-out ${i * 0.12}s infinite alternate`
                : 'none',
            }}
          />
        ))}
      </span>
      <span className="hidden 2xl:inline font-mono text-[10px] uppercase tracking-[0.2em]">
        {on ? 'Sound' : 'Silent'}
      </span>
    </button>
  );
}
