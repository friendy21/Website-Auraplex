export default function Loading() {
  return (
    <div className="min-h-[60dvh] flex flex-col items-center justify-center gap-4">
      <div className="h-1 w-32 bg-[color:var(--color-steel)]/30 overflow-hidden">
        <div className="h-full w-1/3 bg-[color:var(--color-signal)] animate-[loading_1.2s_ease-in-out_infinite]" />
      </div>
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-steel)]">Loading</div>
      <style>{`@keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }`}</style>
    </div>
  );
}
