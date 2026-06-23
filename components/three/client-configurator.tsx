'use client';

// Client-side dynamic import wrapper. Next 16 disallows `dynamic({ ssr: false })`
// inside Server Components; hosting it here keeps the 3D bundle code-split out of
// the server graph while letting the page server-render its shell.
// https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading
import dynamic from 'next/dynamic';

const Configurator = dynamic(
  () =>
    import('@/components/three/product-configurator').then(
      (m) => m.ProductConfigurator,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[100dvh] flex items-center justify-center font-mono text-sm text-[color:var(--color-steel)]">
        Loading 3D viewer…
      </div>
    ),
  },
);

export function ClientConfigurator(props: {
  modelUrl: string;
  productName: string;
  hasModel: boolean;
}) {
  return <Configurator {...props} />;
}
