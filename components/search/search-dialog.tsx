'use client';

import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/primitives/dialog';

type Result = {
  id: string;
  url: string;
  excerpt: string;
  meta?: { title?: string };
};

declare global {
  interface Window {
    pagefind?: {
      search: (q: string) => Promise<{ results: { data: () => Promise<Result> }[] }>;
    };
  }
}

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    // Pagefind is generated post-build into /public/pagefind/ and is not present
    // at compile time, so we bypass the bundler with a runtime URL string.
    // Using Function() ensures Turbopack/webpack never see the specifier.
    if (!window.pagefind) {
      const path = '/pagefind/pagefind.js';
      new Function('p', 'return import(p)')(path)
        .then((p: Window['pagefind']) => {
          window.pagefind = p;
        })
        .catch(() => {
          /* Pagefind not built yet (dev) — silently ignore. */
        });
    }
  }, [open]);

  useEffect(() => {
    // React 19's set-state-in-effect rule: when the query is empty we just
    // return without scheduling a search. The empty-results state is owned by
    // onChange (setQuery clears, see below).
    if (!query.trim() || !window.pagefind) return;
    const t = setTimeout(async () => {
      const search = await window.pagefind!.search(query);
      const data = await Promise.all(search.results.slice(0, 8).map((r) => r.data()));
      setResults(data);
    }, 150);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          aria-label="Search"
          className="flex items-center gap-2 text-[color:var(--color-steel)] hover:text-[color:var(--color-paper)] transition"
        >
          <Search className="h-4 w-4" />
          <span className="font-mono text-xs uppercase tracking-wider">Search</span>
          <kbd className="hidden md:inline-block font-mono text-[10px] border border-[color:var(--color-steel)]/30 px-1.5 py-0.5">⌘K</kbd>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <div className="flex items-center gap-3 border-b border-[color:var(--color-steel)]/30 p-4">
          <Search className="h-5 w-5 text-[color:var(--color-steel)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              const v = e.target.value;
              setQuery(v);
              if (!v.trim()) setResults([]);
            }}
            placeholder="Search machines, case studies…"
            className="flex-1 bg-transparent outline-none font-body text-lg"
          />
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {results.map((r) => (
            <a
              key={r.id}
              href={r.url}
              className="block px-4 py-3 hover:bg-[color:var(--color-ink-soft)] border-b border-[color:var(--color-steel)]/10"
            >
              <div className="font-display text-lg">{r.meta?.title ?? r.url}</div>
              <div className="text-sm text-[color:var(--color-steel-soft)] mt-1" dangerouslySetInnerHTML={{ __html: r.excerpt }} />
            </a>
          ))}
          {query && !results.length && (
            <div className="px-4 py-8 font-mono text-xs uppercase tracking-widest text-[color:var(--color-steel)] text-center">
              No matches
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
