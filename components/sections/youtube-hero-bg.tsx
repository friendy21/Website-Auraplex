'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  /** YouTube video ID (the 11-char value from youtu.be/<ID> URLs). */
  id: string;
  /** Optional caption for assistive tech — defaults to "Background video". */
  title?: string;
  /**
   * Milliseconds to wait for the player to reach PLAYING state before we
   * declare the embed unavailable and fade out. Defaults to 6000ms — long
   * enough for slow networks, short enough that visitors never read the
   * "Sign in to confirm you're not a bot" screen.
   */
  failTimeoutMs?: number;
};

// Module-level promise so multiple instances of this component don't each
// inject their own copy of the IFrame Player API script.
let ytApiPromise: Promise<typeof window.YT> | null = null;

function loadYouTubeApi(): Promise<typeof window.YT> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('SSR: no window'));
  }
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve, reject) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      if (window.YT?.Player) resolve(window.YT);
      else reject(new Error('YT API loaded but Player missing'));
    };
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.async = true;
    s.onerror = () => reject(new Error('Failed to load YouTube IFrame API'));
    document.head.appendChild(s);
  });
  return ytApiPromise;
}

/**
 * YouTube hero background.
 *
 * Embeds a YouTube video as a full-bleed background layer via the IFrame
 * Player API. The IFrame API (rather than a plain <iframe>) gives us the
 * one thing a plain embed can't: signal. We can tell whether YouTube
 * actually started playing the video, or whether it returned an error
 * (101/150 = embed disallowed, 100 = not found, 2/5 = parameter/HTML5),
 * or whether it served the "Sign in to confirm you're not a bot" wall
 * (which keeps state at -1 forever).
 *
 * On any failure mode we fade ourselves to opacity 0 and stay hidden.
 * The deeper hero layer (HeroParticles) carries the visual instead —
 * the viewer never sees a broken embed.
 *
 * The iframe is sized via CSS `max(vh, vw)` math to behave like
 * `object-fit: cover` so it always overflows the container.
 */
export function YoutubeHeroBg({
  id,
  title = 'Background video',
  failTimeoutMs = 6000,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const [status, setStatus] = useState<'pending' | 'playing' | 'failed'>(
    'pending',
  );

  useEffect(() => {
    let cancelled = false;
    let watchdog: ReturnType<typeof setTimeout> | null = null;

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !mountRef.current) return;

        // Create a child div for YT to replace — YT.Player mutates its target,
        // and React doesn't like its own DOM nodes being swapped out.
        const target = document.createElement('div');
        target.style.width = '100%';
        target.style.height = '100%';
        mountRef.current.innerHTML = '';
        mountRef.current.appendChild(target);

        watchdog = setTimeout(() => {
          if (!cancelled) setStatus('failed');
        }, failTimeoutMs);

        playerRef.current = new YT.Player(target, {
          videoId: id,
          host: 'https://www.youtube-nocookie.com',
          playerVars: {
            autoplay: 1,
            mute: 1,
            loop: 1,
            playlist: id,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            iv_load_policy: 3,
            disablekb: 1,
            fs: 0,
            playsinline: 1,
            cc_load_policy: 0,
          },
          events: {
            onReady: (e) => {
              try {
                e.target.mute();
                e.target.playVideo();
              } catch {
                /* swallow — onStateChange / watchdog will catch real failures */
              }
            },
            onStateChange: (e) => {
              // 1 = PLAYING. Once we hit it, the embed is healthy.
              if (e.data === 1 && !cancelled) {
                if (watchdog) clearTimeout(watchdog);
                setStatus('playing');
              }
            },
            onError: () => {
              // 2 = bad parameter, 5 = HTML5 error,
              // 100 = not found, 101/150 = embed disallowed (Shorts hit this).
              if (!cancelled) {
                if (watchdog) clearTimeout(watchdog);
                setStatus('failed');
              }
            },
          },
        });
      })
      .catch(() => {
        if (!cancelled) setStatus('failed');
      });

    return () => {
      cancelled = true;
      if (watchdog) clearTimeout(watchdog);
      try {
        playerRef.current?.destroy();
      } catch {
        /* destroy can throw if iframe was already torn down */
      }
    };
  }, [id, failTimeoutMs]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-700"
      aria-hidden="true"
      data-yt-status={status}
      style={{ opacity: status === 'failed' ? 0 : 1 }}
      title={title}
    >
      {/* Sizing styles for the YT-injected iframe — global because we don't
          control the iframe element's className. Scoped via the data attr
          on the mount node. */}
      <style jsx>{`
        div[data-yt-status] :global(iframe) {
          position: absolute;
          left: 50%;
          top: 50%;
          width: max(177.78vh, 100vw);
          height: max(100vh, 56.25vw);
          transform: translate(-50%, -50%);
          border: 0;
        }
      `}</style>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Minimal YT IFrame API typings — we only use what we touch.
// Full surface area: https://developers.google.com/youtube/iframe_api_reference
// ────────────────────────────────────────────────────────────────────────
declare global {
  interface Window {
    YT?: typeof YT;
    onYouTubeIframeAPIReady?: () => void;
  }
  namespace YT {
    interface Player {
      destroy(): void;
      playVideo(): void;
      mute(): void;
    }
    interface PlayerEvent {
      target: Player;
    }
    interface OnStateChangeEvent {
      data: number;
      target: Player;
    }
    interface PlayerOptions {
      videoId: string;
      host?: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (event: PlayerEvent) => void;
        onStateChange?: (event: OnStateChangeEvent) => void;
        onError?: (event: { data: number }) => void;
      };
    }
    interface PlayerConstructor {
      new (element: HTMLElement | string, options: PlayerOptions): Player;
    }
    const Player: PlayerConstructor;
  }
}
