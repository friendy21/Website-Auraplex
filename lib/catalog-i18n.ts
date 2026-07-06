/**
 * Localized (ms/zh) overlay for the machine catalog.
 *
 * The canonical catalog (lib/catalog.ts) is English — it is the source of
 * truth for slugs, regex-derived tags (machineTags), and the SEO fallback.
 * This module provides Malay + Chinese translations of the *display* fields
 * (name, summary, spec labels/values) keyed by slug, applied at render time
 * via `localizeMachine`. English requests pass through unchanged.
 *
 * IMPORTANT: slugs/URLs never change; only display text does. `localizeMachine`
 * preserves the English name on `nameEn` so machineTags() keeps matching.
 */
import type { Machine, Category } from './catalog';

type Spec = { label: string; value: string; unit?: string };
type MachineI18n = { name?: string; summary?: string; specs?: Spec[] };

// Category-level summary fallback (mirrors CATEGORY_SUMMARY in catalog.ts) for
// the machines that carry no machine-specific summary.
const CATEGORY_SUMMARY_I18N: Record<string, Record<Category, string>> = {
  ms: {
    labelling:
      'Aplikator berpresisi yang direka untuk bentuk bekas ASEAN. Pemasangan dan sokongan alat ganti tempatan.',
    packaging:
      'Pengedapan operasi berterusan yang dibina untuk barisan pengeluaran Malaysia. Pemasangan dan sokongan alat ganti tempatan.',
    automation:
      'Pembuatan tambahan siri AR untuk prototaip, jig dan pengeluaran jangka pendek.',
  },
  zh: {
    labelling: '专为东盟容器形状设计的精密施贴器。提供本地安装与备件支持。',
    packaging: '为马来西亚生产线打造的连续作业封口设备。提供本地安装与备件支持。',
    automation: 'AR 系列增材制造，适用于原型、夹具与小批量生产。',
  },
};

const MS: Record<string, MachineI18n> = {
  'continuous-band-sealing-machine': {
    name: 'Mesin Pengedap Jalur Berterusan',
    summary: 'Sesuai untuk mengedap sebarang pembungkusan plastik ringan pada jalur berterusan.',
  },
  'continuous-band-sealing-machine-v2': {
    name: 'Mesin Pengedap Jalur Berterusan V2',
    summary: 'Sesuai untuk mengedap sebarang pembungkusan plastik ringan pada jalur berterusan.',
  },
  'flexy-applicator': {
    name: 'Aplikator Flexy',
  },
  'semi-auto-wrap-around-labelling-machine': {
    name: 'Mesin Pelabelan Balut Keliling Separa Auto',
  },
  'two-side-labelling-machine': {
    name: 'Mesin Pelabelan Dua Sisi',
  },
  'custom-top-labelling-machine-with-checking-system': {
    name: 'Mesin Pelabelan Atas Tersuai dengan Sistem Pemeriksaan',
  },
  'two-in-one-wrap-around-side-labelling-machine': {
    name: 'Mesin Pelabelan Sisi Balut Keliling Dua Dalam Satu',
  },
  'print-apply-top-labelling-machine': {
    name: 'Mesin Pelabelan Atas Cetak & Tampal',
  },
  'one-side-wrap-around-side-labelling-machine': {
    name: 'Mesin Pelabelan Sisi Balut Keliling Satu Sisi',
  },
  'top-labelling-machine-with-thermal-transfer-printer-auto-feeder': {
    name: 'Mesin Pelabelan Atas dengan Pencetak Pindah Terma & Penyuap Auto',
  },
  'bottom-labelling-machine': {
    name: 'Mesin Pelabelan Bawah',
    summary: 'Menampal label pada bahagian bawah produk — penyelesaian pelabelan bawah tersuai.',
  },
  'print-apply-labeller': {
    name: 'Pelabel Cetak & Tampal',
  },
  'flat-labelling-machine': {
    name: 'Mesin Pelabelan Rata',
  },
  'top-labelling-machine': {
    name: 'Mesin Pelabelan Atas',
    summary: 'Untuk menampal label pada permukaan rata di bahagian atas kotak unit atau karton beralun.',
  },
  'top-labelling-machine-with-thermal-transfer-printer-auto-feeder-v2': {
    name: 'Mesin Pelabelan Atas dengan Pencetak Pindah Terma & Penyuap Auto V2',
  },
  'customized-bottom-labelling-machine': {
    name: 'Mesin Pelabelan Bawah Tersuai',
    summary: 'Pelabelan bawah dibuat khas — cth. untuk pembungkusan sayur.',
  },
  'egg-tray-labelling-machine': {
    name: 'Mesin Pelabelan Dulang Telur',
    summary: 'Untuk menampal label pada dulang telur — boleh dikonfigurasi untuk dulang 4, 6, 10, 15 atau 30 biji telur.',
  },
  'three-side-labelling-machine': {
    name: 'Mesin Pelabelan Tiga Sisi',
    summary: 'Untuk menampal label tiga sisi pada bekas segi empat sama atau segi empat tepat.',
  },
  'body-neck-labelling-machine': {
    name: 'Mesin Pelabelan Badan & Leher',
    summary: 'Untuk menampal label badan dan label leher pada botol bulat berleher tirus.',
  },
  'top-labelling-machine-v2': {
    name: 'Mesin Pelabelan Atas V2',
  },
  'top-labelling-machine-with-corner-press-device': {
    name: 'Mesin Pelabelan Atas dengan Peranti Tekan Sudut',
    summary: 'Mesin pelabelan atas dengan peranti tekan sudut — menampal label keselamatan anti-pemalsuan yang ditekan kemas di atas sudut.',
  },
  'front-back-labelling-machine': {
    name: 'Mesin Pelabelan Depan & Belakang',
    summary: 'Untuk menampal label depan dan belakang pada bekas bujur atau segi empat tepat.',
  },
  'vertical-wrap-around-labelling-machine': {
    name: 'Mesin Pelabelan Balut Keliling Menegak',
    summary: 'Mesin separa automatik untuk menampal label balut keliling pada botol bulat.',
  },
  'two-side-labelling-machine-with-corner-press': {
    name: 'Mesin Pelabelan Dua Sisi dengan Tekan Sudut',
    summary: 'Untuk menampal label sudut sisi depan pada kotak unit atau karton beralun, ditekan sekeliling sudut.',
  },
  'customized-top-labelling-machine': {
    name: 'Mesin Pelabelan Atas Tersuai',
    summary: 'Mesin pelabelan atas tersuai untuk produk berpermukaan tidak rata pada barisan pengeluaran pelanggan.',
  },
  'semi-auto-round-bottle-labelling-machine': {
    name: 'Mesin Pelabelan Botol Bulat Separa Auto',
    summary: 'Untuk menampal label balut keliling pada bekas berbentuk bulat.',
  },
  'standard-top-labelling-machine': {
    name: 'Mesin Pelabelan Atas Standard',
    summary: 'Untuk menampal label pada permukaan rata di atas kotak unit — digunakan untuk label hologram, penutup aiskrim dan beg paket.',
  },
  'ar600-3d-printer': {
    name: 'Pencetak 3D AR600',
    summary: 'Pencetak 3D yang dibina dan disokong tempatan dengan penapisan HEPA, pelarasan dulang automatik, sambung semula selepas gangguan kuasa, skrin sentuh warna dan penggera kehabisan filamen.',
    specs: [
      { label: 'Pelarasan dulang', value: 'Automatik (BLTouch)' },
      { label: 'Penapisan', value: 'HEPA' },
      { label: 'Sambung semula gangguan kuasa', value: 'Ya (LLRP)' },
      { label: 'Paparan', value: 'Skrin sentuh warna + USB' },
      { label: 'Filamen', value: 'Penggera kehabisan + suapan auto' },
    ],
  },
  'ar320-3d-printer': {
    name: 'Pencetak 3D AR320',
    summary: 'Pencetak 3D yang dibina dan disokong tempatan dengan penapisan HEPA, pelarasan dulang automatik, sambung semula selepas gangguan kuasa, skrin sentuh warna dan penggera kehabisan filamen.',
    specs: [
      { label: 'Pelarasan dulang', value: 'Automatik (BLTouch)' },
      { label: 'Penapisan', value: 'HEPA' },
      { label: 'Sambung semula gangguan kuasa', value: 'Ya (LLRP)' },
      { label: 'Paparan', value: 'Skrin sentuh warna + USB' },
      { label: 'Filamen', value: 'Penggera kehabisan + suapan auto' },
    ],
  },
  'ar220-3d-printer': {
    name: 'Pencetak 3D AR220',
    summary: 'Pencetak 3D yang dibina dan disokong tempatan dengan fungsi jeda, muncung berpemanas dan kipas penyejuk, serta suapan filamen automatik.',
    specs: [
      { label: 'Jeda / sambung', value: 'Ya' },
      { label: 'Hujung panas', value: 'Muncung berpemanas + kipas penyejuk' },
      { label: 'Filamen', value: 'Suapan auto' },
    ],
  },
};

const ZH: Record<string, MachineI18n> = {
  'continuous-band-sealing-machine': {
    name: '连续封口机',
    summary: '适用于在连续输送带上封合各种轻质塑料包装。',
  },
  'continuous-band-sealing-machine-v2': {
    name: '连续封口机 V2',
    summary: '适用于在连续输送带上封合各种轻质塑料包装。',
  },
  'flexy-applicator': {
    name: 'Flexy 施贴器',
  },
  'semi-auto-wrap-around-labelling-machine': {
    name: '半自动环绕贴标机',
  },
  'two-side-labelling-machine': {
    name: '双面贴标机',
  },
  'custom-top-labelling-machine-with-checking-system': {
    name: '带检测系统的定制顶部贴标机',
  },
  'two-in-one-wrap-around-side-labelling-machine': {
    name: '二合一环绕侧面贴标机',
  },
  'print-apply-top-labelling-machine': {
    name: '打印贴标顶部贴标机',
  },
  'one-side-wrap-around-side-labelling-machine': {
    name: '单面环绕侧面贴标机',
  },
  'top-labelling-machine-with-thermal-transfer-printer-auto-feeder': {
    name: '带热转印打印机与自动送料器的顶部贴标机',
  },
  'bottom-labelling-machine': {
    name: '底部贴标机',
    summary: '将标签贴于产品底部 — 定制底部贴标解决方案。',
  },
  'print-apply-labeller': {
    name: '打印贴标机',
  },
  'flat-labelling-machine': {
    name: '平面贴标机',
  },
  'top-labelling-machine': {
    name: '顶部贴标机',
    summary: '用于在单件盒或瓦楞纸箱顶部的平面上贴标。',
  },
  'top-labelling-machine-with-thermal-transfer-printer-auto-feeder-v2': {
    name: '带热转印打印机与自动送料器的顶部贴标机 V2',
  },
  'customized-bottom-labelling-machine': {
    name: '定制底部贴标机',
    summary: '定制底部贴标 — 例如用于蔬菜包装。',
  },
  'egg-tray-labelling-machine': {
    name: '蛋托贴标机',
    summary: '用于在蛋托上贴标 — 可配置为 4、6、10、15 或 30 枚装蛋托。',
  },
  'three-side-labelling-machine': {
    name: '三面贴标机',
    summary: '用于在方形或矩形容器上贴三面标签。',
  },
  'body-neck-labelling-machine': {
    name: '瓶身瓶颈贴标机',
    summary: '用于在带锥形瓶颈的圆瓶上贴瓶身标签和瓶颈标签。',
  },
  'top-labelling-machine-v2': {
    name: '顶部贴标机 V2',
  },
  'top-labelling-machine-with-corner-press-device': {
    name: '带压角装置的顶部贴标机',
    summary: '带压角装置的顶部贴标机 — 贴附防伪安全标签并沿边角平整压合。',
  },
  'front-back-labelling-machine': {
    name: '前后贴标机',
    summary: '用于在椭圆形或矩形容器上贴前后标签。',
  },
  'vertical-wrap-around-labelling-machine': {
    name: '立式环绕贴标机',
    summary: '半自动机器，用于在圆瓶上贴环绕标签。',
  },
  'two-side-labelling-machine-with-corner-press': {
    name: '带压角的双面贴标机',
    summary: '用于在单件盒或瓦楞纸箱上贴前侧边角标签，并沿边角压合。',
  },
  'customized-top-labelling-machine': {
    name: '定制顶部贴标机',
    summary: '为客户生产线上表面不平整的产品定制的顶部贴标机。',
  },
  'semi-auto-round-bottle-labelling-machine': {
    name: '半自动圆瓶贴标机',
    summary: '用于在圆形容器上贴环绕标签。',
  },
  'standard-top-labelling-machine': {
    name: '标准顶部贴标机',
    summary: '用于在单件盒顶部的平面上贴标 — 适用于全息标签、雪糕盖和软包袋。',
  },
  'ar600-3d-printer': {
    name: 'AR600 3D 打印机',
    summary: '本地制造并提供支持的 3D 打印机，配备 HEPA 过滤、自动调平、断电续打、彩色触摸屏及耗材用尽报警。',
    specs: [
      { label: '床身调平', value: '自动 (BLTouch)' },
      { label: '过滤', value: 'HEPA' },
      { label: '断电续打', value: '支持 (LLRP)' },
      { label: '显示屏', value: '彩色触摸屏 + USB' },
      { label: '耗材', value: '缺料报警 + 自动送料' },
    ],
  },
  'ar320-3d-printer': {
    name: 'AR320 3D 打印机',
    summary: '本地制造并提供支持的 3D 打印机，配备 HEPA 过滤、自动调平、断电续打、彩色触摸屏及耗材用尽报警。',
    specs: [
      { label: '床身调平', value: '自动 (BLTouch)' },
      { label: '过滤', value: 'HEPA' },
      { label: '断电续打', value: '支持 (LLRP)' },
      { label: '显示屏', value: '彩色触摸屏 + USB' },
      { label: '耗材', value: '缺料报警 + 自动送料' },
    ],
  },
  'ar220-3d-printer': {
    name: 'AR220 3D 打印机',
    summary: '本地制造并提供支持的 3D 打印机，具备暂停功能、加热喷嘴与冷却风扇，以及自动送料。',
    specs: [
      { label: '暂停 / 继续', value: '支持' },
      { label: '热端', value: '加热喷嘴 + 冷却风扇' },
      { label: '耗材', value: '自动送料' },
    ],
  },
};

const OVERLAYS: Record<string, Record<string, MachineI18n>> = { ms: MS, zh: ZH };

// Short category labels (mirror of products.categories.* in the message files)
// as a self-contained map so server components can localize the category chip
// without threading a translations function through every call site.
const CATEGORY_LABEL_I18N: Record<string, Record<Category, string>> = {
  en: { labelling: 'Labelling', packaging: 'Packaging', automation: 'Automation' },
  ms: { labelling: 'Pelabel', packaging: 'Pembungkus', automation: 'Automasi' },
  zh: { labelling: '贴标', packaging: '包装', automation: '自动化' },
};

/** Locale-aware short category label ("Labelling" / "Pelabel" / "贴标"). */
export function localizedCategoryLabel(category: Category, locale: string): string {
  return CATEGORY_LABEL_I18N[locale]?.[category] ?? CATEGORY_LABEL_I18N.en[category];
}

/**
 * Return a machine with its display fields (name/summary/specs) translated for
 * `locale`. English (or any locale without an overlay) passes through, but the
 * canonical English name is always preserved on `nameEn` so machineTags() and
 * other name-parsing logic keep working regardless of the active locale.
 */
export function localizeMachine(m: Machine, locale: string): Machine {
  const overlay = OVERLAYS[locale]?.[m.slug];
  const localizedSummary =
    overlay?.summary ?? CATEGORY_SUMMARY_I18N[locale]?.[m.category] ?? m.summary;
  return {
    ...m,
    nameEn: m.nameEn ?? m.name,
    name: overlay?.name ?? m.name,
    summary: locale === 'en' ? m.summary : localizedSummary,
    specs: overlay?.specs ?? m.specs,
  };
}

/** Localize a list of machines. */
export function localizeMachines(list: Machine[], locale: string): Machine[] {
  return list.map((m) => localizeMachine(m, locale));
}
