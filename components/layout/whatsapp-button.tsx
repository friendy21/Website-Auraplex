import { MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { whatsappLink } from '@/lib/utils';


/**
 * Floating WhatsApp FAB.
 *
 * Ink text on WhatsApp green — white on #25D366 is only 1.9:1 (hard WCAG
 * fail); ink (#181b20) on the same green is ~8.5:1. Dark-on-green also
 * matches WhatsApp's own brand buttons.
 *
 * Server Component: the entrance, hover and press states are now CSS
 * (styles/motion/whatsapp-button.css), so nothing here needs state, effects or
 * handlers — next-intl's useTranslations is server-safe, same as <Footer/>.
 * This component lives in the root layout, so dropping 'use client' takes its
 * framer-motion, lucide and next-intl-client cost off every route on the site.
 *
 * The `wa-fab*` classes also DECLARE the pill's box (see the CSS): it is
 * right-anchored and `font-mono`, and the mono face swaps in after first paint,
 * so a contents-sized box was measured shifting layout by 0.015.
 */
export function WhatsAppButton({ message }: { message?: string }) {
  const t = useTranslations('common');
  return (
    <a
      href={whatsappLink(message ?? t('whatsappDefaultMsg'))}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-fab fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-[#25D366] text-[color:var(--color-ink)] px-5 py-4 rounded-full shadow-2xl font-mono text-sm uppercase tracking-wider font-semibold"
      aria-label={t('whatsappAria')}
    >
      <MessageCircle className="wa-fab__icon h-5 w-5" />
      <span className="wa-fab__label hidden sm:inline">{t('whatsapp')}</span>
    </a>
  );
}
