'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

/**
 * Auraplex FAQ Chat — floating support widget.
 *
 * Style contract:
 *   · Cerulean signal (--color-signal) as the ONE accent — same rule as Machine Finder.
 *   · Neutral-800/700 surfaces, paper text — same rule as the rest of the site.
 *   · Composer field carries the same focus underline + glow (chat-composer* classes
 *     already live in styles/motion/chat.css; if this widget is used on a page where
 *     that stylesheet isn't loaded, the fallback still reads correctly).
 *   · Entrance animation is a one-shot CSS keyframe on the panel — no motion lib.
 *
 * Placement:
 *   Mount ONCE in app/[locale]/layout.tsx after <StickyCta />. The FAB sits at
 *   bottom-44 (lg:bottom-48) / right-6 — the THIRD tier of the bottom-right
 *   stack, above WhatsAppButton (bottom-6) and above StickyCta, which in this
 *   repo occupies bottom-24 right-6 / lg:bottom-28 lg:right-10. The original
 *   draft of this file placed the FAB at bottom-24 believing StickyCta sat
 *   lower; that put the cerulean FAB directly on top of the cerulean "Get a
 *   quote" pill. Keep this above StickyCta if either component moves.
 *
 * Backend:
 *   POSTs to NEXT_PUBLIC_CHAT_API_URL + '/chat'. Auto-detects locale from
 *   next-intl (en | ms | zh). Session id persisted in localStorage.
 *
 * i18n:
 *   Reads strings from messages/{en,ms,zh}.json under the `faqChat` key.
 *   See the JSON patch below the component.
 */

const API_URL =
  process.env.NEXT_PUBLIC_CHAT_API_URL ?? 'https://chat-api.auraplex.info';

type Source = {
  filename: string;
  product_line: string;
  product_id: string;
  score: number;
};

type Msg = {
  role: 'user' | 'bot' | 'error';
  content: string;
  sources?: Source[];
};

export function AuraplexFaqChat() {
  const t = useTranslations('faqChat');
  const locale = useLocale(); // 'en' | 'ms' | 'zh'

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  // Lazy initialiser rather than a restore-in-useEffect: this repo's
  // react-hooks/set-state-in-effect rule (correctly) rejects the latter, and
  // sessionId is never rendered, so reading it during the first render cannot
  // cause a hydration mismatch.
  const [sessionId, setSessionId] = useState<string | null>(() =>
    typeof window === 'undefined'
      ? null
      : window.localStorage.getItem('auraplex-faq-session'),
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Persist session
  useEffect(() => {
    if (sessionId) localStorage.setItem('auraplex-faq-session', sessionId);
  }, [sessionId]);

  // Autoscroll on new messages / typing state
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      // Slight delay for the panel entrance animation
      const t = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;

    setMessages((m) => [...m, { role: 'user', content: text }]);
    setInput('');
    setBusy(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text,
          session_id: sessionId,
          locale,
        }),
      });

      if (res.status === 429) {
        const j = await res.json().catch(() => ({}));
        setMessages((m) => [
          ...m,
          { role: 'error', content: j.detail || t('errorGeneric') },
        ]);
        return;
      }
      if (!res.ok) {
        setMessages((m) => [...m, { role: 'error', content: t('errorGeneric') }]);
        return;
      }

      const data = await res.json();
      if (data.session_id) setSessionId(data.session_id);
      setMessages((m) => [
        ...m,
        { role: 'bot', content: data.answer, sources: data.sources ?? [] },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'error', content: t('errorConnection') },
      ]);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  // Open + seed the welcome message. Seeding here rather than in an effect
  // keeps the same behaviour (welcome appears on first open, and only once)
  // while satisfying react-hooks/set-state-in-effect.
  function openPanel() {
    setOpen(true);
    setMessages((m) => (m.length ? m : [{ role: 'bot', content: t('welcome') }]));
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      {/* FAB — third tier of the bottom-right stack: above WhatsAppButton
          (bottom-6) AND above StickyCta (bottom-24 / lg:bottom-28). */}
      {!open && (
        <button
          type="button"
          onClick={openPanel}
          aria-label={t('openAria')}
          className="fixed bottom-44 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--color-signal)] text-[color:var(--color-ink)] shadow-2xl transition-transform hover:scale-105 hover:bg-[color:var(--color-signal-bright)] lg:bottom-48"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label={t('title')}
          className="faq-chat-panel fixed bottom-44 right-6 z-40 flex h-[600px] max-h-[calc(100vh-220px)] w-[400px] max-w-[calc(100vw-48px)] flex-col overflow-hidden border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] shadow-2xl lg:bottom-48"
          style={
            {
              // subtle grid backdrop, echoing the machine-finder page
              backgroundImage: `linear-gradient(color-mix(in oklab, var(--color-signal) 20%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--color-signal) 20%, transparent) 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
              backgroundBlendMode: 'multiply',
            } as CSSProperties
          }
        >
          {/* Header */}
          <div className="relative flex items-center justify-between border-b border-[color:var(--color-neutral-700)] bg-[color:var(--color-ink)] px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-signal)]"
                aria-hidden
              />
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-paper)]">
                  {t('title')}
                </div>
                <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[color:var(--color-steel)]">
                  {t('subtitle')}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t('closeAria')}
              className="p-1 text-[color:var(--color-steel)] transition-colors hover:text-[color:var(--color-signal)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            role="log"
            aria-live="polite"
            aria-atomic="false"
            className="relative flex-1 space-y-4 overflow-y-auto p-4"
          >
            {messages.map((m, i) => (
              <MessageBubble key={i} msg={m} sourcesLabel={t('sources')} />
            ))}
            {busy && (
              <div className="max-w-[85%]">
                <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-[color:var(--color-steel)]">
                  {t('assistantLabel')}
                </div>
                <div className="inline-block border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)] p-3">
                  <div className="flex items-center gap-1.5" aria-label={t('thinking')}>
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="chat-dot inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-signal)]"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="relative flex items-end gap-2 border-t border-[color:var(--color-neutral-700)] bg-[color:var(--color-ink)] p-3">
            <div className="chat-composer relative flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                rows={1}
                placeholder={t('placeholder')}
                aria-label={t('placeholder')}
                aria-keyshortcuts="Enter"
                disabled={busy}
                maxLength={500}
                className="chat-composer__field w-full resize-none bg-transparent py-2 pr-2 font-body text-sm text-[color:var(--color-paper)] outline-none placeholder:text-[color:var(--color-neutral-400)] disabled:opacity-50"
              />
              <div className="absolute inset-x-0 bottom-0 h-px bg-[color:var(--color-neutral-700)]" />
              <div
                className="chat-composer__rule absolute inset-x-0 bottom-0 h-px bg-[color:var(--color-signal)]"
                aria-hidden
              />
              <div
                className="chat-composer__glow pointer-events-none absolute inset-x-0 -bottom-2 h-3 bg-[color:var(--color-signal)] blur-md"
                aria-hidden
              />
            </div>
            <button
              type="button"
              onClick={send}
              disabled={busy || !input.trim()}
              aria-label={t('send')}
              className="flex h-9 w-9 shrink-0 items-center justify-center border border-[color:var(--color-signal)] bg-[color:var(--color-signal)]/10 text-[color:var(--color-signal)] transition-colors hover:bg-[color:var(--color-signal)] hover:text-[color:var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function MessageBubble({
  msg,
  sourcesLabel,
}: {
  msg: Msg;
  sourcesLabel: string;
}) {
  const t = useTranslations('faqChat');
  const isUser = msg.role === 'user';
  const isError = msg.role === 'error';

  return (
    <div className={isUser ? 'text-right' : ''}>
      <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-[color:var(--color-steel)]">
        {isUser ? t('userLabel') : t('assistantLabel')}
      </div>
      <div
        className={`inline-block max-w-[85%] border p-3 text-left ${
          isUser
            ? 'border-[color:var(--color-signal)]/30 bg-[color:var(--color-signal)]/10'
            : isError
              ? 'border-red-500/40 bg-red-500/10 text-red-300'
              : 'border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]'
        }`}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-[color:var(--color-paper)]">
          {msg.content}
        </div>
        {msg.sources && msg.sources.length > 0 && (
          <div className="mt-2 border-t border-[color:var(--color-neutral-700)] pt-2 font-mono text-[10px] uppercase tracking-wider text-[color:var(--color-steel)]">
            {sourcesLabel}:{' '}
            {Array.from(
              new Set(msg.sources.map((s) => s.filename).filter(Boolean)),
            ).join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}
