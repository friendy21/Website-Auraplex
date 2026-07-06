/**
 * Localized (ms/zh) overlay for the static news posts.
 *
 * Mirrors the pattern in catalog-i18n.ts: lib/news.ts stays English (source of
 * truth for slugs/dates/images), and this module translates the display fields
 * (title, summary, body paragraphs, ctaLabel, imageAlt) at render time. The
 * `category` enum value is unchanged; use `localizedNewsCategory` for its chip.
 *
 * Proper event names (e.g. "Malaysia International Machinery Fair 2023") are
 * intentionally left as-is where a post's title is purely that name.
 */
import type { NewsPost } from './news';

type NewsI18n = {
  title?: string;
  summary?: string;
  body?: string[];
  ctaLabel?: string;
  imageAlt?: string;
};

const CATEGORY_CHIP_I18N: Record<string, Record<NewsPost['category'], string>> = {
  ms: {
    Cohort: 'Kohort',
    Exhibition: 'Pameran',
    Build: 'Pembinaan',
    Review: 'Pengiktirafan',
    Service: 'Servis',
  },
  zh: {
    Cohort: '实习期',
    Exhibition: '展会',
    Build: '研发',
    Review: '荣誉',
    Service: '服务',
  },
};

const MS: Record<string, NewsI18n> = {
  'mimf-best-company-for-innovation': {
    title: 'Diiktiraf sebagai syarikat terbaik untuk inovasi di MIMF',
    summary:
      'Auraplex SDN BHD telah diiktiraf sebagai syarikat terbaik untuk inovasi di Malaysia International Machinery Fair (MITEC, Kuala Lumpur).',
    body: [
      'Auraplex SDN BHD telah diiktiraf sebagai syarikat terbaik untuk inovasi di Malaysia International Machinery Fair, yang diadakan di MITEC, Kuala Lumpur.',
      'Auraplex pakar dalam pembuatan mesin pelabelan, mesin pembungkusan, pencetak 3D dan mesin tersuai, serta komited untuk menyampaikan penyelesaian automasi berkualiti tinggi yang disesuaikan dengan keperluan anda.',
    ],
    ctaLabel: 'Lihat mesin',
    imageAlt: 'Auraplex di Malaysia International Machinery Fair, MITEC Kuala Lumpur',
  },
  'metaltech-hybrid-exhibition-2024': {
    title: 'Pameran Hibrid Metaltech 2024 — MITEC',
    summary:
      'Auraplex menyertai salah satu pameran peralatan terbesar di MITEC, Kuala Lumpur, memperkenalkan mesin kami kepada orang ramai dalam industri pembuatan.',
    body: [
      'Auraplex Sdn Bhd menyertai salah satu pameran peralatan terbesar, yang diadakan di MITEC, Kuala Lumpur, memperkenalkan syarikat dan mesin kami kepada orang ramai.',
      'Pengunjung melihat sendiri mesin pelabelan, pembungkusan dan automasi kami serta membincangkan keperluan barisan mereka dengan jurutera yang membinanya.',
    ],
    ctaLabel: 'Hubungi kami',
    imageAlt: 'Gerai Auraplex di Pameran Hibrid Metaltech 2024, MITEC',
  },
  'malaysia-international-machinery-fair-2023': {
    summary:
      'Auraplex Sdn Bhd menyertai MIMF 2023 di MITEC, Kuala Lumpur, 13–15 Julai 2023, memperkenalkan syarikat kami kepada orang ramai.',
    body: [
      'Auraplex Sdn Bhd telah menyertai salah satu pameran peralatan terbesar, Malaysia International Machinery Fair 2023, yang diadakan di MITEC, Kuala Lumpur dari 13 hingga 15 Julai 2023.',
      'Pameran ini merupakan peluang untuk memperkenalkan syarikat dan mesin kami kepada orang ramai serta bertemu pengeluar dari seluruh rantau.',
    ],
    ctaLabel: 'Lihat mesin',
    imageAlt: 'Auraplex di Malaysia International Machinery Fair 2023, MITEC',
  },
  'malaysia-international-machinery-fair-2022': {
    summary:
      'Auraplex mempamerkan di Malaysia International Machinery Fair 2022, membawa mesin kami ke lantai pembuatan.',
    body: [
      'Auraplex Sdn Bhd mempamerkan di Malaysia International Machinery Fair 2022, memperkenalkan mesin pelabelan, pembungkusan dan automasi kami kepada orang ramai.',
      'Ia merupakan peluang awal untuk bertemu pengeluar dan memahami cabaran barisan yang kini kami bina mesin untuk menyelesaikannya.',
    ],
    ctaLabel: 'Lihat mesin',
    imageAlt: 'Auraplex di Malaysia International Machinery Fair 2022',
  },
  'metaltech-hybrid-exhibition-2022': {
    title: 'Pameran Hibrid Metaltech 2022 — MITEC',
    summary: 'Auraplex menyertai Pameran Hibrid Metaltech 2022 di MITEC, Kuala Lumpur.',
    body: [
      'Auraplex Sdn Bhd menyertai Pameran Hibrid Metaltech 2022, yang diadakan di MITEC, Kuala Lumpur.',
      'Pameran ini mendedahkan mesin kami kepada komuniti pembuatan dan kejuruteraan di Lembah Klang dan sekitarnya.',
    ],
    ctaLabel: 'Hubungi kami',
    imageAlt: 'Auraplex di Pameran Hibrid Metaltech 2022, MITEC',
  },
  'agro-job-fair-maha-2022': {
    title: 'Karnival Kerjaya Agro di Pameran MAHA 2022',
    summary:
      'Auraplex mengambil bahagian dalam Karnival Kerjaya Agro di pameran MAHA pada 2022, bertemu pengeluar pemprosesan pertanian.',
    body: [
      'Auraplex Sdn Bhd mengambil bahagian dalam Karnival Kerjaya Agro di pameran MAHA (Malaysia Agriculture, Horticulture & Agrotourism) pada 2022.',
      'Ia merupakan peluang untuk bertemu pengeluar pemprosesan pertanian yang barisan pembungkusan dan pelabelan mereka dilayani oleh mesin kami.',
    ],
    imageAlt: 'Auraplex di Karnival Kerjaya Agro, Pameran MAHA 2022',
  },
};

const ZH: Record<string, NewsI18n> = {
  'mimf-best-company-for-innovation': {
    title: '在 MIMF 荣获最佳创新企业认可',
    summary:
      'Auraplex SDN BHD 在马来西亚国际机械展（MITEC，吉隆坡）荣获最佳创新企业认可。',
    body: [
      'Auraplex SDN BHD 在吉隆坡 MITEC 举办的马来西亚国际机械展上荣获最佳创新企业认可。',
      'Auraplex 专注于制造贴标机、包装机、3D 打印机及定制机器，致力于提供量身定制的高质量自动化解决方案。',
    ],
    ctaLabel: '浏览机器',
    imageAlt: 'Auraplex 于吉隆坡 MITEC 马来西亚国际机械展',
  },
  'metaltech-hybrid-exhibition-2024': {
    title: '2024 年 Metaltech 混合展 — MITEC',
    summary:
      'Auraplex 参加了在吉隆坡 MITEC 举办的大型设备展之一，向制造业公众介绍我们的机器。',
    body: [
      'Auraplex Sdn Bhd 参加了在吉隆坡 MITEC 举办的大型设备展之一，向公众介绍我们的公司与机器。',
      '参观者亲身了解了我们的贴标、包装与自动化机器，并与打造这些机器的工程师讨论了各自的生产线需求。',
    ],
    ctaLabel: '联系我们',
    imageAlt: 'Auraplex 于 2024 年 Metaltech 混合展的展位，MITEC',
  },
  'malaysia-international-machinery-fair-2023': {
    summary:
      'Auraplex Sdn Bhd 于 2023 年 7 月 13 至 15 日参加了在吉隆坡 MITEC 举办的 MIMF 2023，向公众介绍我们的公司。',
    body: [
      'Auraplex Sdn Bhd 参加了大型设备展之一 —— 于 2023 年 7 月 13 日至 15 日在吉隆坡 MITEC 举办的马来西亚国际机械展 2023。',
      '此次展会是我们向公众介绍公司与机器、并结识区域内制造商的良机。',
    ],
    ctaLabel: '浏览机器',
    imageAlt: 'Auraplex 于马来西亚国际机械展 2023，MITEC',
  },
  'malaysia-international-machinery-fair-2022': {
    summary: 'Auraplex 参展了马来西亚国际机械展 2022，将我们的机器带到制造现场。',
    body: [
      'Auraplex Sdn Bhd 参展了马来西亚国际机械展 2022，向公众展示我们的贴标、包装与自动化机器。',
      '这是我们早期结识制造商、了解生产线难题的机会 —— 如今我们正为解决这些难题而打造机器。',
    ],
    ctaLabel: '浏览机器',
    imageAlt: 'Auraplex 于马来西亚国际机械展 2022',
  },
  'metaltech-hybrid-exhibition-2022': {
    title: '2022 年 Metaltech 混合展 — MITEC',
    summary: 'Auraplex 参加了在吉隆坡 MITEC 举办的 2022 年 Metaltech 混合展。',
    body: [
      'Auraplex Sdn Bhd 参加了在吉隆坡 MITEC 举办的 2022 年 Metaltech 混合展。',
      '此次展会让我们的机器展现在巴生谷及周边地区的制造与工程界面前。',
    ],
    ctaLabel: '联系我们',
    imageAlt: 'Auraplex 于 2022 年 Metaltech 混合展，MITEC',
  },
  'agro-job-fair-maha-2022': {
    title: '2022 年 MAHA 展农业招聘会',
    summary:
      'Auraplex 参加了 2022 年 MAHA 展的农业招聘会，结识农产品加工制造商。',
    body: [
      'Auraplex Sdn Bhd 参加了 2022 年 MAHA（马来西亚农业、园艺与农业旅游展）的农业招聘会。',
      '这是结识农产品加工制造商的机会 —— 我们的机器正是为服务他们的包装与贴标生产线而打造。',
    ],
    imageAlt: 'Auraplex 于 2022 年 MAHA 展农业招聘会',
  },
};

const OVERLAYS: Record<string, Record<string, NewsI18n>> = { ms: MS, zh: ZH };

/** Locale-aware category chip label ("Exhibition" / "Pameran" / "展会"). */
export function localizedNewsCategory(category: NewsPost['category'], locale: string): string {
  return CATEGORY_CHIP_I18N[locale]?.[category] ?? category;
}

/** Return a news post with its display fields translated for `locale`. */
export function localizeNewsPost(post: NewsPost, locale: string): NewsPost {
  const overlay = OVERLAYS[locale]?.[post.slug];
  if (!overlay) return post;
  return {
    ...post,
    title: overlay.title ?? post.title,
    summary: overlay.summary ?? post.summary,
    body: overlay.body ?? post.body,
    ctaLabel: overlay.ctaLabel ?? post.ctaLabel,
    imageAlt: overlay.imageAlt ?? post.imageAlt,
  };
}

/** Localize a list of news posts. */
export function localizeNewsPosts(list: NewsPost[], locale: string): NewsPost[] {
  return list.map((p) => localizeNewsPost(p, locale));
}
