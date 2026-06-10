'use client';

import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { whatsappLink } from '@/lib/utils';

// Ink text on WhatsApp green — white on #25D366 is only 1.9:1 (hard WCAG
// fail); ink (#181b20) on the same green is ~8.5:1. Dark-on-green also
// matches WhatsApp's own brand buttons.
export function WhatsAppButton({ message }: { message?: string }) {
  const t = useTranslations('common');
  return (
    <motion.a
      href={whatsappLink(message ?? t('whatsappDefaultMsg'))}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-[#25D366] text-[color:var(--color-ink)] px-5 py-4 rounded-full shadow-2xl font-mono text-sm uppercase tracking-wider font-semibold"
      aria-label={t('whatsappAria')}
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">{t('whatsapp')}</span>
    </motion.a>
  );
}
