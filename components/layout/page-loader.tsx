'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

/**
 * First-mount brand wipe. Renders a full-bleed ink panel with the Auraplex
 * mark, then slides up & away on next tick. Persists ~600ms total.
 *
 * Subsequent client-side navigations don't re-trigger it (component is
 * mounted once at the root layout and tracks its own done flag).
 */
export function PageLoader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Allow the first paint to land, then animate out.
    const t = setTimeout(() => setDone(true), 650);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] bg-[color:var(--color-ink)] flex items-center justify-center"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1], delay: 0.05 }}
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex items-center gap-3"
          >
            <span className="h-2 w-2 bg-[color:var(--color-signal)]" />
            <span className="font-mono uppercase tracking-[0.4em] text-sm text-[color:var(--color-paper)]">
              Auraplex
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
