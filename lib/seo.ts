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
  home: {
    en: { title: 'Labelling Machine Manufacturer Malaysia | Auraplex Selangor', description: 'Auraplex Sdn Bhd (Auto Labeller Malaysia) builds automatic & semi-auto labelling machines, sticker label applicators, packaging and band sealing machines in Seri Kembangan, Selangor. Installation, spare parts and service across Malaysia — KL, Penang, Johor & beyond.' },
    ms: { title: 'Pengeluar Mesin Pelabel Malaysia | Auraplex Selangor', description: 'Auraplex Sdn Bhd mengeluarkan mesin pelabel automatik & separa automatik, aplikator label pelekat, mesin pembungkusan dan pengedap di Seri Kembangan, Selangor. Pemasangan, alat ganti dan servis di seluruh Malaysia.' },
    zh: { title: '马来西亚贴标机制造商 | Auraplex 雪兰莪', description: 'Auraplex Sdn Bhd 在雪兰莪史里肯邦安设计制造全自动/半自动贴标机、不干胶贴标机、包装机与封口机。提供全马安装、零件与售后服务 — 吉隆坡、槟城、柔佛等地。' },
  },
  products: {
    en: { title: 'Labelling Machines & Packaging Machines Malaysia | Auraplex', description: 'Top, side, wrap-around, round bottle, front & back, bottom and print & apply labelling machines, plus band sealers and 3D printers — 30 machines built in Selangor, Malaysia. Get a quote.' },
    ms: { title: 'Mesin Pelabel & Mesin Pembungkusan Malaysia | Auraplex', description: 'Mesin pelabel atas, sisi, balut keliling, botol bulat, depan & belakang, bawah serta cetak & lekat, pengedap jalur dan pencetak 3D — 30 mesin dibina di Selangor, Malaysia.' },
    zh: { title: '马来西亚贴标机与包装机 | Auraplex', description: '平面、侧面、圆瓶缠绕、正反面、底部与打印贴标机,以及连续封口机与 3D 打印机 — 30 款机器,马来西亚雪兰莪制造。立即询价。' },
  },
  about: {
    en: { title: 'About Auraplex — Malaysian Labelling Machine Maker, Selangor', description: 'Engineered in Malaysia, built to outlast the line. Auraplex designs and builds labelling and packaging machines on its own factory floor in Seri Kembangan, Selangor, with local parts and engineers.' },
    ms: { title: 'Tentang Auraplex — Pembuat Mesin Pelabel Malaysia', description: 'Direka di Malaysia, dibina untuk bertahan. Auraplex mereka dan membina mesin pelabel dan pembungkusan di kilangnya sendiri di Seri Kembangan, Selangor.' },
    zh: { title: '关于 Auraplex — 马来西亚本土贴标机制造商', description: '马来西亚设计制造,经久耐用。Auraplex 在雪兰莪史里肯邦安自有工厂设计并制造贴标机与包装机,本地零件与工程师支持。' },
  },
  contact: {
    en: { title: 'Contact Auraplex — Labelling Machine Quote Malaysia', description: 'Get a labelling machine quote, book a factory tour or request service. Auraplex, Seri Kembangan, Selangor — near Kuala Lumpur, Puchong and Putrajaya. Call 1700-82-6502.' },
    ms: { title: 'Hubungi Auraplex — Sebut Harga Mesin Pelabel Malaysia', description: 'Dapatkan sebut harga mesin pelabel, tempah lawatan kilang atau minta servis. Auraplex, Seri Kembangan, Selangor — berhampiran Kuala Lumpur dan Puchong. Hubungi 1700-82-6502.' },
    zh: { title: '联系 Auraplex — 马来西亚贴标机报价', description: '获取贴标机报价、预约工厂参观或申请维修服务。Auraplex 位于雪兰莪史里肯邦安,邻近吉隆坡、蒲种与布城。热线 1700-82-6502。' },
  },
  services: {
    en: { title: 'Labelling Machine Service, Repair & Installation Malaysia | Auraplex', description: 'Installation, maintenance, repair, spare parts, operator training and custom automation for labelling and packaging machines — Auraplex engineers across Malaysia.' },
    ms: { title: 'Servis, Pembaikan & Pemasangan Mesin Pelabel Malaysia | Auraplex', description: 'Pemasangan, penyelenggaraan, pembaikan, alat ganti, latihan operator dan automasi tersuai untuk mesin pelabel dan pembungkusan — jurutera Auraplex di seluruh Malaysia.' },
    zh: { title: '马来西亚贴标机维修、安装与保养 | Auraplex', description: '贴标机与包装机的安装、保养、维修、零件、操作培训与定制自动化 — Auraplex 工程师服务全马。' },
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

// ── Search keywords ──────────────────────────────────────────────────────
// What Malaysian buyers actually type: machine type × "Malaysia"/state/city,
// in all three site languages. Emitted as <meta name="keywords"> on every
// page (Bing/Baidu still read it) and reused for visible copy and JSON-LD.
const PLACES = [
  'Malaysia', 'Selangor', 'Kuala Lumpur', 'KL', 'Seri Kembangan', 'Puchong',
  'Shah Alam', 'Klang', 'Petaling Jaya', 'Subang Jaya', 'Putrajaya', 'Cyberjaya',
  'Penang', 'Johor Bahru', 'Ipoh', 'Melaka', 'Seremban', 'Kuantan',
  'Kuching', 'Kota Kinabalu', 'Sabah', 'Sarawak',
] as const;

/** Cities/states listed in the visible "areas we serve" copy and areaServed. */
export const SERVICE_AREAS = [
  'Selangor', 'Kuala Lumpur', 'Putrajaya', 'Negeri Sembilan', 'Melaka', 'Johor',
  'Penang', 'Perak', 'Kedah', 'Perlis', 'Pahang', 'Terengganu', 'Kelantan',
  'Sabah', 'Sarawak', 'Labuan',
] as const;

const KEYWORDS: Record<MetaLocale, string[]> = {
  en: [
    'labelling machine Malaysia', 'labeling machine Malaysia', 'labelling machine manufacturer Malaysia',
    'labelling machine supplier Malaysia', 'label machine Malaysia', 'labeller Malaysia',
    'auto labeller Malaysia', 'automatic labelling machine', 'semi automatic labelling machine',
    'sticker labelling machine', 'self-adhesive labelling machine', 'label applicator',
    'bottle labelling machine', 'round bottle labelling machine', 'top labelling machine',
    'side labelling machine', 'two side labelling machine', 'three side labelling machine',
    'wrap around labelling machine', 'front and back labelling machine', 'bottom labelling machine',
    'flat labelling machine', 'print and apply labelling machine', 'egg tray labelling machine',
    'custom labelling machine', 'labelling machine price Malaysia', 'labelling machine rental Malaysia',
    'food labelling machine', 'beverage labelling machine', 'pharmaceutical labelling machine',
    'cosmetic labelling machine', 'packaging machine Malaysia', 'packaging machinery supplier Malaysia',
    'band sealing machine Malaysia', 'continuous band sealer', 'industrial 3D printer Malaysia',
    'factory automation Malaysia', 'labelling machine repair Malaysia',
    ...PLACES.filter((p) => p !== 'Malaysia').map((p) => `labelling machine ${p}`),
    'Auraplex', 'Auraplex Sdn Bhd', 'Auto Labeller Malaysia',
  ],
  ms: [
    'mesin pelabel Malaysia', 'mesin label Malaysia', 'mesin pelabel automatik',
    'mesin pelabel separa automatik', 'mesin label pelekat', 'mesin pelekat label',
    'mesin pelabel botol', 'mesin pelabel botol bulat', 'mesin pelabel atas', 'mesin pelabel sisi',
    'mesin pelabel balut keliling', 'pengeluar mesin pelabel Malaysia', 'pembekal mesin pelabel',
    'harga mesin pelabel', 'sewa mesin pelabel', 'mesin pembungkusan Malaysia',
    'mesin pengedap', 'mesin pengedap jalur', 'pencetak 3D industri', 'automasi kilang',
    'mesin pelabel Selangor', 'mesin pelabel Kuala Lumpur', 'mesin pelabel Johor', 'mesin pelabel Pulau Pinang',
    'Auraplex', 'Auraplex Sdn Bhd',
  ],
  zh: [
    '马来西亚贴标机', '贴标机', '贴标机厂家', '贴标机制造商', '自动贴标机', '半自动贴标机',
    '不干胶贴标机', '圆瓶贴标机', '平面贴标机', '侧面贴标机', '双面贴标机', '缠绕贴标机',
    '打印贴标机', '贴标机价格', '贴标机租赁', '马来西亚包装机', '包装机械', '封口机', '连续封口机',
    '工业 3D 打印机', '工厂自动化', '雪兰莪贴标机', '吉隆坡贴标机', '槟城贴标机', '柔佛贴标机',
    'labelling machine Malaysia', 'Auraplex',
  ],
};

/** Base keyword set for a locale, plus page-specific extras first. */
export function seoKeywords(locale: string, extra: string[] = []): string[] {
  const loc: MetaLocale = locale === 'ms' || locale === 'zh' ? locale : 'en';
  return [...new Set([...extra, ...KEYWORDS[loc]])];
}

/** Product-page keywords: the machine name crossed with "Malaysia" + key places. */
export function machineKeywords(name: string, locale: string): string[] {
  const n = name.toLowerCase();
  return seoKeywords(locale, [
    name,
    `${n} Malaysia`,
    `${n} price Malaysia`,
    `${n} supplier`,
    `${n} Selangor`,
    `${n} Kuala Lumpur`,
  ]);
}

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
  /** Page-specific keywords; defaults to the locale's base set. */
  keywords?: string[];
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
    keywords: opts.keywords ?? seoKeywords(path.match(/^\/(ms|zh)(?=\/|$)/)?.[1] ?? 'en'),
    applicationName: 'Auraplex',
    authors: [{ name: 'Auraplex Sdn Bhd', url: SITE }],
    creator: 'Auraplex Sdn Bhd',
    publisher: 'Auraplex Sdn Bhd',
    category: 'Industrial machinery',
    formatDetection: { telephone: true, address: true, email: true },
    other: {
      'geo.region': 'MY-10',
      'geo.placename': 'Seri Kembangan, Selangor, Malaysia',
    },
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
    alternateName: ['Auraplex', 'Auto Labeller Malaysia', 'Auraplex Labelling Machine'],
    description:
      'Malaysian manufacturer of automatic and semi-automatic labelling machines, sticker label applicators, packaging and band sealing machines, based in Seri Kembangan, Selangor.',
    slogan: 'Your factory automation solution. Engineered in Selangor.',
    url: SITE,
    email: 'sales.auraplex@gmail.com',
    logo: `${SITE}/brand/auraplex-logo.png`,
    image: `${SITE}/brand/auraplex-logo.png`,
    areaServed: [
      { '@type': 'Country', name: 'Malaysia' },
      ...SERVICE_AREAS.map((name) => ({ '@type': 'State', name })),
      { '@type': 'Country', name: 'Singapore' },
      { '@type': 'Country', name: 'Brunei' },
    ],
    knowsAbout: [
      'Labelling machines', 'Self-adhesive label applicators', 'Bottle labelling',
      'Wrap-around labelling', 'Print and apply labelling', 'Packaging machinery',
      'Band sealing machines', 'Industrial 3D printing', 'Factory automation',
    ],
    makesOffer: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Labelling machine design, installation, servicing and spare parts',
        areaServed: { '@type': 'Country', name: 'Malaysia' },
      },
    },
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

/** WebSite entity — lets search engines tie the brand name to this domain. */
export function websiteSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE}/#website`,
    url: SITE,
    name: 'Auraplex',
    alternateName: ['Auraplex Sdn Bhd', 'Auto Labeller Malaysia'],
    inLanguage: locale === 'ms' ? 'ms-MY' : locale === 'zh' ? 'zh-MY' : 'en-MY',
    publisher: { '@id': `${SITE}/#organization` },
  };
}

export function productSchema(p: {
  name: string;
  description: string;
  image: string | null;
  monthlyPrice: number | null;
  slug: string;
  locale?: string;
  category?: string;
}) {
  const url = `${SITE}/${p.locale ?? 'en'}/products/${p.slug}`;
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    url,
    sku: p.slug,
    mpn: p.slug,
    name: p.name,
    description: p.description,
    category: p.category,
    countryOfOrigin: { '@type': 'Country', name: 'Malaysia' },
    manufacturer: { '@id': `${SITE}/#organization` },
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
      url,
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
