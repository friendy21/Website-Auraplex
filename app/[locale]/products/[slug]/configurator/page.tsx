import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import { getMachine, MACHINES } from '@/lib/catalog';
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
  const p = getMachine(slug);
  return buildMetadata({
    title: `Configure ${p?.name ?? 'machine'} — Auraplex`,
    description:
      'Configure your machine in 3D. Adjust container, throughput, add-ons. Get a quote with your spec.',
    path: `/${locale}/products/${slug}/configurator`,
  });
}

export default async function ConfiguratorPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const p = getMachine(slug);
  if (!p) notFound();

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
    />
  );
}
