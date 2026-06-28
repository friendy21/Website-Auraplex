import Image from 'next/image';
import { Reveal } from '@/components/motion/reveal';

type Props = { eyebrow: string; footnote: string };

// Real client logos synced from autolabellermalaysia.com (the same Auraplex
// SDN BHD entity, same "OUR CLIENT / OUR PARTNER" wall) into /public/clients/.
const CLIENTS = [
  { name: 'PentaMaster', src: '/clients/pentamaster.jpg' },
  { name: 'EcoWorld', src: '/clients/ecoworld.jpg' },
  { name: 'SIRIM', src: '/clients/sirim.jpg' },
  { name: 'Honda', src: '/clients/honda.jpg' },
  { name: 'Perodua', src: '/clients/perodua.jpg' },
  { name: 'Schmaco', src: '/clients/schmaco.jpg' },
  { name: 'FGV', src: '/clients/fgv.jpg' },
  { name: 'Hextar', src: '/clients/hextar.jpg' },
];

/**
 * ClientLogoWall — the real partner/client logo wall, extracted so it can live
 * on every page where buyers look for proof (About + the case-studies proof
 * hub), per the audit's "organise proof where buyers expect it." Grayscale →
 * colour on hover keeps the wall quiet while staying unmistakably the real
 * names.
 */
export function ClientLogoWall({ eyebrow, footnote }: Props) {
  return (
    <section className="border-y border-[color:var(--color-neutral-700)]">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-20">
        <Reveal variant="up">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-10 flex items-center gap-3">
            <span className="h-px w-12 bg-[color:var(--color-signal)]" />
            {eyebrow}
          </div>
        </Reveal>
        <Reveal variant="up" delay={100}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 items-center">
            {CLIENTS.map((client) => (
              <div key={client.name} className="relative h-14 md:h-16 group">
                <Image
                  src={client.src}
                  alt={client.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition duration-500"
                />
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal variant="up" delay={200}>
          <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)] text-center">
            {footnote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
