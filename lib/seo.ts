import type { Metadata } from 'next';

// Single source of truth for the production origin. Override per-environment
// with NEXT_PUBLIC_SITE_URL; defaults to the verified live business domain.
// Consumed by every canonical, hreflang alternate, OG/Twitter URL, JSON-LD
// entity URL, sitemap and robots entry — change it here (or via env) and the
// whole site follows.
export const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://auraplex.com.my';

// ── Localized page metadata ──────────────────────────────────────────────
// Per-page title/description in all three locales. Kept here (not in the big
// messages/*.json bundles) so it lives next to buildMetadata and each page's
// generateMetadata is a one-line lookup. ms/zh pages previously emitted the
// English title/description — weak localization signals + duplicate titles
// across the three locale trees.
type MetaLocale = 'en' | 'ms' | 'zh';
type MetaText = { title: string; description: string };

const PAGE_META: Record<string, Record<MetaLocale, MetaText>> = {
  products: {
    en: { title: 'Machines — Auraplex', description: 'Browse the full Auraplex catalogue of labelling, packaging and custom automation machines — built in Selangor.' },
    ms: { title: 'Mesin — Auraplex', description: 'Layari katalog penuh mesin pelabel, pembungkusan dan automasi tersuai Auraplex — dibina di Selangor.' },
    zh: { title: '机器 — Auraplex', description: '浏览 Auraplex 完整的贴标机、包装机与定制自动化设备目录 — 雪兰莪制造。' },
  },
  about: {
    en: { title: 'About — Auraplex', description: 'Engineered in Malaysia. Built to outlast the line. Inside the Auraplex factory floor in Seri Kembangan.' },
    ms: { title: 'Tentang — Auraplex', description: 'Direka di Malaysia. Dibina untuk bertahan. Menyelami lantai kilang Auraplex di Seri Kembangan.' },
    zh: { title: '关于 — Auraplex', description: '马来西亚设计制造,经久耐用。走进 Auraplex 位于史里肯邦安的工厂车间。' },
  },
  contact: {
    en: { title: 'Contact — Auraplex', description: 'Talk to an Auraplex engineer. Quotes, factory tours, service requests, technical questions. Seri Kembangan, Selangor.' },
    ms: { title: 'Hubungi — Auraplex', description: 'Bercakap dengan jurutera Auraplex. Sebut harga, lawatan kilang, permintaan servis, soalan teknikal. Seri Kembangan, Selangor.' },
    zh: { title: '联系 — Auraplex', description: '与 Auraplex 工程师洽谈。报价、工厂参观、服务需求、技术咨询。雪兰莪史里肯邦安。' },
  },
  services: {
    en: { title: 'Services — Auraplex', description: 'Installation, maintenance, training and custom automation — delivered by Auraplex engineers from Seri Kembangan.' },
    ms: { title: 'Perkhidmatan — Auraplex', description: 'Pemasangan, penyelenggaraan, latihan dan automasi tersuai — disampaikan oleh jurutera Auraplex dari Seri Kembangan.' },
    zh: { title: '服务 — Auraplex', description: '安装、维护、培训与定制自动化 — 由史里肯邦安的 Auraplex 工程师提供。' },
  },
  machineFinder: {
    en: { title: 'Machine Finder — Auraplex', description: 'AI-powered machine recommendation. Describe your line and we will match the right Auraplex machine.' },
    ms: { title: 'Pencari Mesin — Auraplex', description: 'Cadangan mesin berkuasa AI. Terangkan barisan pengeluaran anda dan kami akan padankan mesin Auraplex yang sesuai.' },
    zh: { title: '机器查找器 — Auraplex', description: 'AI 智能机器推荐。描述您的生产线,我们为您匹配合适的 Auraplex 机器。' },
  },
  news: {
    en: { title: 'News & Events — Auraplex', description: 'Auraplex news, industry awards, exhibition updates and announcements from the Seri Kembangan floor.' },
    ms: { title: 'Berita & Acara — Auraplex', description: 'Berita Auraplex, anugerah industri, kemas kini pameran dan pengumuman dari lantai kilang Seri Kembangan.' },
    zh: { title: '新闻与活动 — Auraplex', description: 'Auraplex 新闻、行业奖项、展会动态与来自史里肯邦安车间的公告。' },
  },
  caseStudies: {
    en: { title: 'Recognition & Milestones — Auraplex', description: 'Auraplex SDN BHD — recognised as a best company for innovation at MIMF 2024, and on the floor at Malaysia International Machinery Fair and Metaltech (MITEC, Kuala Lumpur).' },
    ms: { title: 'Pengiktirafan & Pencapaian — Auraplex', description: 'Auraplex SDN BHD — diiktiraf sebagai syarikat terbaik untuk inovasi di MIMF 2024, dan hadir di Malaysia International Machinery Fair serta Metaltech (MITEC, Kuala Lumpur).' },
    zh: { title: '荣誉与里程碑 — Auraplex', description: 'Auraplex SDN BHD — 在 MIMF 2024 荣获最佳创新企业,并亮相马来西亚国际机械展及 Metaltech(吉隆坡 MITEC)。' },
  },
  internship: {
    en: { title: 'Internship — Auraplex', description: 'Paid internships at Auraplex Seri Kembangan — mechanical, electrical, controls, software, industrial design, and service. 3–6 months on the factory floor.' },
    ms: { title: 'Latihan Amali — Auraplex', description: 'Latihan amali bergaji di Auraplex Seri Kembangan — mekanikal, elektrik, kawalan, perisian, reka bentuk industri dan servis. 3–6 bulan di lantai kilang.' },
    zh: { title: '实习 — Auraplex', description: 'Auraplex 史里肯邦安带薪实习 — 机械、电气、控制、软件、工业设计与服务。工厂车间实战 3–6 个月。' },
  },
  yearReview: {
    en: { title: '2026 on the floor — Auraplex', description: 'A year in machines — the Auraplex 2026 year in review. The full catalogue of thirty labelling, packaging and automation machines, engineered in Selangor.' },
    ms: { title: '2026 di lantai kilang — Auraplex', description: 'Setahun dalam mesin — tinjauan tahun 2026 Auraplex. Katalog penuh tiga puluh mesin pelabel, pembungkusan dan automasi, direka di Selangor.' },
    zh: { title: '2026 车间纪实 — Auraplex', description: '机器里的一年 — Auraplex 2026 年度回顾。三十台贴标机、包装机与自动化设备的完整目录,雪兰莪制造。' },
  },
  privacy: {
    en: { title: 'Privacy Policy — Auraplex', description: 'How Auraplex SDN BHD collects, uses and protects your personal data under Malaysia’s Personal Data Protection Act 2010 (PDPA).' },
    ms: { title: 'Dasar Privasi — Auraplex', description: 'Bagaimana Auraplex SDN BHD mengumpul, menggunakan dan melindungi data peribadi anda di bawah Akta Perlindungan Data Peribadi 2010 (PDPA) Malaysia.' },
    zh: { title: '隐私政策 — Auraplex', description: 'Auraplex SDN BHD 如何依据马来西亚《2010 年个人资料保护法》(PDPA)收集、使用和保护您的个人资料。' },
  },
  terms: {
    en: { title: 'Terms of Use — Auraplex', description: 'The terms governing your use of auraplex.com.my and the information it provides about Auraplex SDN BHD machines and services.' },
    ms: { title: 'Terma Penggunaan — Auraplex', description: 'Terma yang mengawal penggunaan auraplex.com.my dan maklumat yang disediakannya tentang mesin dan perkhidmatan Auraplex SDN BHD.' },
    zh: { title: '使用条款 — Auraplex', description: '规范您使用 auraplex.com.my 及其提供的 Auraplex SDN BHD 机器与服务信息的条款。' },
  },
};

/** OG locale tag (en_MY / ms_MY / zh_MY) for a given app locale. */
export function ogLocale(locale: string): string {
  return locale === 'ms' ? 'ms_MY' : locale === 'zh' ? 'zh_MY' : 'en_MY';
}

/** Localized title/description for a page; falls back to English. */
export function localizedMeta(page: string, locale: string): MetaText {
  const entry = PAGE_META[page];
  const loc: MetaLocale = locale === 'ms' || locale === 'zh' ? locale : 'en';
  return entry?.[loc] ?? entry?.en ?? { title: 'Auraplex', description: '' };
}

export function buildMetadata(opts: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  locale?: string;
  /** Set for thin/unfinished pages that should not be indexed (still crawled). */
  noindex?: boolean;
}): Metadata {
  const path = opts.path ?? '';
  const url = `${SITE}${path}`;
  // Callers pass a locale-prefixed path (e.g. "/en/about"). Strip the leading
  // locale segment so the hreflang alternates point at the correct sibling
  // URLs (…/ms/about, …/zh/about) instead of double-prefixing (…/en/en/about).
  const bare = path.replace(/^\/(en|ms|zh)(?=\/|$)/, '');
  return {
    metadataBase: new URL(SITE),
    title: opts.title,
    description: opts.description,
    alternates: {
      canonical: url,
      languages: {
        'en-MY': `${SITE}/en${bare}`,
        'ms-MY': `${SITE}/ms${bare}`,
        'zh-MY': `${SITE}/zh${bare}`,
        'x-default': `${SITE}/en${bare}`,
      },
    },
    openGraph: {
      type: 'website',
      url,
      title: opts.title,
      description: opts.description,
      siteName: 'Auraplex',
      locale: opts.locale ?? 'en_MY',
      // Default OG image is dynamic — generated per request by /api/og with
      // the page title encoded as a query param. No static /og/default.png
      // dependency.
      images: [
        {
          url:
            opts.image ??
            `/api/og?title=${encodeURIComponent(opts.title)}&subtitle=${encodeURIComponent(opts.description)}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images: [
        opts.image ??
          `/api/og?title=${encodeURIComponent(opts.title)}&subtitle=${encodeURIComponent(opts.description)}`,
      ],
    },
    robots: opts.noindex
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE}/#organization`,
    name: 'Auraplex SDN BHD',
    legalName: 'Auraplex Sdn Bhd',
    url: SITE,
    logo: `${SITE}/brand/auraplex-logo.png`,
    foundingDate: '2021-05-12',
    // Companies Commission of Malaysia (SSM) registration number.
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'SSM',
      value: '202101018075',
    },
    // Real profiles verified against the live autolabellermalaysia.com
    // footer (canonical URLs, tracking params stripped).
    sameAs: [
      'https://www.facebook.com/p/Auraplex-100068561114645',
      'https://www.instagram.com/auraplex_/',
      'https://www.youtube.com/@auraplex5219',
      'https://www.tiktok.com/@auraplex_',
      'https://www.linkedin.com/company/auraplex/',
      'https://shopee.com.my/auraplex',
    ],
    // Full street address as published on the live autolabellermalaysia.com
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'No 5, Jalan BS9/7B, Taman Bukit Serdang, Seksyen 9',
      postalCode: '43300',
      addressLocality: 'Seri Kembangan',
      addressRegion: 'Selangor',
      addressCountry: 'MY',
    },
    telephone: '+60389407709',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: '1700-82-6502',
      areaServed: 'ASEAN',
      availableLanguage: ['English', 'Malay', 'Chinese'],
    },
  };
}

export function productSchema(p: {
  name: string;
  description: string;
  image: string | null;
  monthlyPrice: number | null;
  slug: string;
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    // Absolute URL. Falls back to the dynamic OG image (there is no static
    // /og/default.png) for machines without photography.
    image: p.image
      ? `${SITE}${p.image}`
      : `${SITE}/api/og?title=${encodeURIComponent(p.name)}`,
    brand: { '@type': 'Brand', name: 'Auraplex' },
  };

  // Only emit an Offer when a real published price exists. Auraplex sells on
  // "quote on request", so most machines have no price — emitting price: 0 +
  // InStock produced invalid, misleading Product markup.
  if (p.monthlyPrice != null && p.monthlyPrice > 0) {
    schema.offers = {
      '@type': 'Offer',
      url: `${SITE}/products/${p.slug}`,
      priceCurrency: 'MYR',
      price: p.monthlyPrice,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: p.monthlyPrice,
        priceCurrency: 'MYR',
        referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitText: 'MONTH' },
      },
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Auraplex SDN BHD' },
    };
  }

  return schema;
}

export function articleSchema(a: {
  title: string;
  description: string;
  datePublished: string;
  image: string | null;
  slug: string;
  locale: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: a.title,
    description: a.description,
    datePublished: a.datePublished,
    dateModified: a.datePublished,
    image: a.image
      ? `${SITE}${a.image}`
      : `${SITE}/api/og?title=${encodeURIComponent(a.title)}`,
    mainEntityOfPage: `${SITE}/${a.locale}/news/${a.slug}`,
    author: {
      '@type': 'Organization',
      name: 'Auraplex SDN BHD',
      '@id': `${SITE}/#organization`,
    },
    publisher: { '@id': `${SITE}/#organization` },
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
