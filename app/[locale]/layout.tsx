import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
// next/font/google self-hosts the font binaries at build time, no runtime CDN hop.
// https://nextjs.org/docs/app/api-reference/components/font
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import { locales, type Locale } from '@/lib/i18n';
import { buildMetadata, organizationSchema } from '@/lib/seo';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WhatsAppButton } from '@/components/layout/whatsapp-button';
import { AuraplexFaqChat } from '@/components/forms/auraplex-faq-chat';
// CustomCursor is wired as a VISUAL OVERLAY only — native cursor stays
// visible underneath. To switch to full-replacement mode, uncomment the
// `body { cursor: none }` rule in styles/globals.css.
import { CustomCursor } from '@/components/motion/custom-cursor';
import { TransitionWipe } from '@/components/layout/transition-wipe';
import { LeanProvider } from '@/components/providers/lean-provider';
import { AtmosphereProvider } from '@/components/providers/atmosphere-provider';
import { ScrollProgress } from '@/components/layout/scroll-progress';
import { StickyCta } from '@/components/layout/sticky-cta';
import '@/styles/globals.css';

// Placeholder font stack until licensed PP Editorial New + Berkeley Mono are provided.
// Fraunces (variable serif) approximates the editorial display feel; JetBrains Mono
// approximates Berkeley Mono. Inter is the spec body face. Swap to next/font/local
// when .woff2 files arrive.
// FONT DIET (perf): the display face is the LCP-critical resource, so it is the
// only one we preload.
//   · Fraunces previously requested the SOFT/WONK/opsz axes. Those axes were
//     never varied anywhere in the codebase, but each one enlarges the variable
//     font binary. The `wght` axis is kept implicitly — the REGISTER weight
//     bloom (200→700) depends on it — so nothing visual is lost.
//   · Inter + JetBrains Mono are NOT preloaded: they are body/label faces that
//     can swap in one RTT later against their fallback metrics, which is
//     imperceptible at 10–16px. This removes ~125KB from the critical path.
// `adjustFontFallback` (default true) generates the metric-override @font-face
// that holds CLS at 0 across the swap — do not disable it.
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  preload: true,
});
// Inter MUST stay preloaded: it is the body face for the whole document, so a
// late swap reflows every text block at once. Measured: dropping its preload
// produced a single 0.1505 layout shift on <main> (CLS 0 -> 0.15). The display
// and body faces are the two that gate layout; the mono face is not.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  preload: false,
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#181b20',
  width: 'device-width',
  initialScale: 1,
};

function asLocale(locale: string): Locale {
  return (locales as readonly string[]).includes(locale)
    ? (locale as Locale)
    : 'en';
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = asLocale(raw);
  const titles: Record<Locale, string> = {
    en: 'Auraplex — Precision labelling machines, engineered in Malaysia',
    ms: 'Auraplex — Mesin pelabel presisi, direka di Malaysia',
    zh: 'Auraplex — 马来西亚精密贴标机',
  };
  const descriptions: Record<Locale, string> = {
    en: 'Self-adhesive labelling machines, packaging machinery, 3D printing and custom automation — engineered in Seri Kembangan, Selangor.',
    ms: 'Mesin pelabel pelekat sendiri, mesin pembungkusan, cetakan 3D dan automasi khusus — direka di Seri Kembangan, Selangor.',
    zh: '自粘标签机、包装机械、3D 打印与定制自动化 — 马来西亚雪兰莪史里肯邦安设计制造。',
  };
  return buildMetadata({
    title: titles[locale],
    description: descriptions[locale],
    locale: locale === 'en' ? 'en_MY' : locale === 'ms' ? 'ms_MY' : 'zh_MY',
    path: `/${locale}`,
  });
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!(locales as readonly string[]).includes(raw)) notFound();
  const locale = raw as Locale;
  setRequestLocale(locale);
  const messages = await getMessages();
  const tc = await getTranslations('common');

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* v2 perf: the PageLoader "overture" was removed. It server-rendered
              an opaque `fixed inset-0 z-[100]` panel OVER the hero H1 that could
              only be dismissed by a useEffect — i.e. after the whole bundle had
              downloaded, parsed and hydrated, plus a 1.9s timer. That single
              interaction was the mechanical cause of the FCP 1.2s → LCP 5.3s gap.
              The brand entrance now lives in the hero's own CSS arrival (which
              paints from server HTML) and in the POWER-ON route transition. */}
                    <ScrollProgress />
          <LeanProvider>
            <AtmosphereProvider>
              <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-[color:var(--color-signal)] focus:text-[color:var(--color-ink)] focus:p-3">
                {tc('skipToContent')}
              </a>
              {/* cacheComponents: request-scoped client components (locale hooks,
                  translations) must be wrapped in Suspense so the static shell
                  can stream before they resolve.
                  https://nextjs.org/docs/app/getting-started/cache-components */}
              <Suspense fallback={null}>
                <Header />
              </Suspense>
              <main id="main">{children}</main>
              <Suspense fallback={null}>
                <Footer />
              </Suspense>
              <Suspense fallback={null}>
                <WhatsAppButton />
              </Suspense>
              <Suspense fallback={null}>
                <StickyCta />
              </Suspense>
              <Suspense fallback={null}>
                <AuraplexFaqChat />
              </Suspense>
              <CustomCursor />
              <TransitionWipe />
            </AtmosphereProvider>
          </LeanProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
