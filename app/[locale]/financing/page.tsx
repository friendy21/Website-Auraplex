import { setRequestLocale, getTranslations } from 'next-intl/server';
import { RoiCalculator } from '@/components/sections/roi-calculator';
import { Reveal } from '@/components/motion/reveal';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({
    title: 'Financing — Auraplex',
    description: 'OPEX, not CAPEX. Spread the cost from RM 1,800/month with MIDA-approved financing partners.',
    path: `/${locale}/financing`,
  });
}

export default async function FinancingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('financing');

  return (
    <>
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 pt-40 pb-24">
        <Reveal variant="up">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-6">
            — Financing / MIDA-approved
          </div>
          <h1 className="font-display text-[clamp(3rem,9vw,8rem)] tracking-[-0.03em] leading-[0.92]">
            {t('title')}
          </h1>
          <p className="mt-8 max-w-2xl text-2xl prose-editorial text-[color:var(--color-steel-soft)]">
            {t('subtitle')}
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-24">
        <RoiCalculator />
      </section>

      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-24">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-12">
          — Compare options
        </div>
        <table className="w-full font-mono text-sm border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-steel)]/30">
              <th className="text-left p-4 text-[color:var(--color-steel)] uppercase text-[10px] tracking-widest">Option</th>
              <th className="text-left p-4 text-[color:var(--color-steel)] uppercase text-[10px] tracking-widest">Upfront</th>
              <th className="text-left p-4 text-[color:var(--color-steel)] uppercase text-[10px] tracking-widest">Monthly</th>
              <th className="text-left p-4 text-[color:var(--color-steel)] uppercase text-[10px] tracking-widest">Ownership</th>
            </tr>
          </thead>
          <tbody>
            <Row label="Outright purchase" upfront="RM 95,000" monthly="—" ownership="Day 1" />
            <Row label="MIDA financing · 60mo" upfront="RM 0" monthly="RM 1,800" ownership="Month 60" />
            <Row label="Operating lease · 36mo" upfront="RM 0" monthly="RM 2,400" ownership="Return option" />
          </tbody>
        </table>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 lg:px-12 py-24 flex items-center gap-8 border-y border-[color:var(--color-steel)]/20">
        <div className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-steel)]">Approved partners</div>
        <div className="flex gap-12 items-center text-[color:var(--color-steel-soft)]">
          <span className="font-display text-2xl">MIDA</span>
          <span className="font-display text-2xl">SME Bank</span>
          <span className="font-display text-2xl">CGC</span>
        </div>
      </section>
    </>
  );
}

function Row({ label, upfront, monthly, ownership }: { label: string; upfront: string; monthly: string; ownership: string }) {
  return (
    <tr className="border-b border-[color:var(--color-steel)]/20 hover:bg-[color:var(--color-ink-soft)] transition">
      <td className="p-4 text-[color:var(--color-paper)]">{label}</td>
      <td className="p-4">{upfront}</td>
      <td className="p-4 text-[color:var(--color-signal)]">{monthly}</td>
      <td className="p-4">{ownership}</td>
    </tr>
  );
}
