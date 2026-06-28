type Props = {
  family: string;
  photos: number;
  hasModel: boolean;
};

/**
 * MachineQuickSpec — a scannable "at a glance" strip for the product-detail
 * page. The audit flagged that detail pages collapse into a thin template with
 * no scannable facts. The catalogue carries no real throughput/price/dimension
 * numbers (and we never invent them), so this surfaces the facts that ARE
 * true for every machine — family, origin, photography state, support model,
 * and whether an interactive 3D model exists — in a quick, honest grid.
 */
export function MachineQuickSpec({ family, photos, hasModel }: Props) {
  const cells: { k: string; v: string }[] = [
    { k: 'Family', v: family },
    { k: 'Origin', v: 'Seri Kembangan, MY' },
    { k: 'Photography', v: photos > 0 ? `${photos} shots` : 'Pending' },
    { k: 'Lead time', v: 'On request' },
    { k: 'Support', v: 'Local install & parts' },
    { k: '3D model', v: hasModel ? 'Interactive' : 'On request' },
  ];

  return (
    <dl className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-px bg-[color:var(--color-neutral-700)] border border-[color:var(--color-neutral-700)]">
      {cells.map((c) => (
        <div key={c.k} className="bg-[color:var(--color-ink)] px-4 py-4">
          <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-steel)]">
            {c.k}
          </dt>
          <dd className="mt-1.5 font-display text-sm md:text-base tracking-tight text-[color:var(--color-paper)] leading-snug">
            {c.v}
          </dd>
        </div>
      ))}
    </dl>
  );
}
