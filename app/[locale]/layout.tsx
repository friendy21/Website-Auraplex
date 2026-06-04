import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
// next/font/google self-hosts the font binaries at build time, no runtime CDN hop.
// https://nextjs.org/docs/app/api-reference/components/font
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { locales, type Locale } from '@/lib/i18n';
import { buildMetadata, organizationSchema } from '@/lib/seo';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WhatsAppButton } from '@/components/layout/whatsapp-button';
// CustomCursor is wired as a VISUAL OVERLAY only — native cursor stays
// visible underneath. To switch to full-replacement mode, uncomment the
// `body { cursor: none }` rule in styles/globals.css.
import { CustomCursor } from '@/components/motion/custom-cursor';
import { TransitionWipe } from '@/components/layout/transition-wipe';
import { LenisProvider } from '@/components/providers/lenis-provider';
import { AtmosphereProvider } from '@/components/providers/atmosphere-provider';
import { ScrollProgress } from '@/components/layout/scroll-progress';
import { PageLoader } from '@/components/layout/page-loader';
import { StickyCta } from '@/components/layout/sticky-cta';
import '@/styles/globals.css';

// Placeholder font stack until licensed PP Editorial New + Berkeley Mono are provided.
// Fraunces (variable serif) approximates the editorial display feel; JetBrains Mono
// approximates Berkeley Mono. Inter is the spec body face. Swap to next/font/local
// when .woff2 files arrive.
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
});
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
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
    en: 'Self-adhesive labelling machines, packaging machinery, 3D printing and custom automation — engineered in Shah Alam, Selangor.',
    ms: 'Mesin pelabel pelekat sendiri, mesin pembungkusan, cetakan 3D dan automasi khusus — direka di Shah Alam, Selangor.',
    zh: '自粘标签机、包装机械、3D 打印与定制自动化 — 马来西亚雪兰莪莎阿南设计制造。',
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
        <link rel="preconnect" href="https://cdn.sanity.io" />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <PageLoader />
          <ScrollProgress />
          <LenisProvider>
            <AtmosphereProvider>
              <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-[color:var(--color-signal)] focus:text-[color:var(--color-ink)] focus:p-3">
                Skip to content
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
              <CustomCursor />
              <TransitionWipe />
            </AtmosphereProvider>
          </LenisProvider>
        </NextIntlClientProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
