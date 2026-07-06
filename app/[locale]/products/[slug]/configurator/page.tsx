import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import { getMachine, MACHINES } from '@/lib/catalog';
import { localizeMachine } from '@/lib/catalog-i18n';
import { hasMachineModel } from '@/lib/models';
import { ClientConfigurator } from '@/components/three/client-configurator';

export async function generateStaticParams() {
  return MACHINES.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const raw = getMachine(slug);
  const p = raw ? localizeMachine(raw, locale) : null;
  const t = await getTranslations({ locale, namespace: 'configurator' });
  return buildMetadata({
    title: t('metaTitle', { name: p?.name ?? 'machine' }),
    description: t('metaDescription'),
    path: `/${locale}/products/${slug}/configurator`,
    // Requirements-capture tool, not indexable content: noindex until a real
    // 3D model + verified capability envelopes exist for the machine.
    noindex: !hasMachineModel(slug),
  });
}

export default async function ConfiguratorPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const raw = getMachine(slug);
  if (!raw) notFound();
  const p = localizeMachine(raw, locale);

  // Per-machine GLTF asset. `hasModel` is false until a real
  // /public/models/<slug>.glb is produced — the configurator then renders a
  // graceful placeholder viewport instead of crashing on a 404 model.
  const modelUrl = `/models/${slug}.glb`;
  const hasModel = hasMachineModel(slug);

  return (
    <ClientConfigurator
      modelUrl={modelUrl}
      productName={p.name}
      hasModel={hasModel}
      slug={slug}
      locale={locale}
    />
  );
}
