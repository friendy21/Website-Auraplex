'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { readStreamableValue } from 'ai/rsc';
import { ArrowRight, Send } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import {
  machineFinderStream,
  recordMachineFinderLead,
} from '@/actions/machine-finder';
import { getMachine } from '@/lib/catalog';
import { localizeMachine } from '@/lib/catalog-i18n';
import { Button } from '@/components/primitives/button';

type Msg = { role: 'user' | 'assistant'; content: string };

type Confidence = 'high' | 'medium' | 'low';
type Recommendation = {
  slug: string;
  name: string;
  reasons: string[];
  confidence?: Confidence;
};

/**
 * Pull the model's trailing ```json {recommendedSlug, confidence, reasons}```
 * block. The model's *reasoning* is the whole point of an AI recommendation —
 * the previous version parsed only the slug and discarded confidence + reasons.
 */
function extractRecommendation(text: string): {
  slug: string;
  reasons: string[];
  confidence?: Confidence;
} | null {
  const match = text.match(/```json\s*([\s\S]*?)```/i);
  if (!match) return null;
  try {
    const obj = JSON.parse(match[1].trim());
    if (typeof obj?.recommendedSlug !== 'string') return null;
    const reasons = Array.isArray(obj.reasons)
      ? obj.reasons.filter((r: unknown): r is string => typeof r === 'string').slice(0, 4)
      : [];
    const confidence =
      obj.confidence === 'high' || obj.confidence === 'medium' || obj.confidence === 'low'
        ? (obj.confidence as Confidence)
        : undefined;
    return { slug: obj.recommendedSlug, reasons, confidence };
  } catch {
    return null;
  }
}

/** Hide the machine-readable JSON block from the human-facing transcript. */
function stripJsonBlock(text: string): string {
  return text.replace(/```json[\s\S]*?```/gi, '').trimEnd();
}

/**
 * Streaming chat UI for the Machine Finder.
 *
 *   - Assistant bubble enters with clip-path mask wipe (top → bottom)
 *   - User bubble slides in from the right (springy)
 *   - When streaming, three signal dots bounce in stagger above the bubble
 *   - Input has cerulean focus underline + glow halo on focus
 *   - Auto-scroll to bottom on new message
 *   - Enter to send · Shift+Enter for newline
 *
 * All of the above is CSS — see styles/motion/chat.css (wired centrally from
 * globals.css). This component holds no animation library.
 */
export function MachineFinderChat() {
  const t = useTranslations('forms');
  const locale = useLocale();
  const starters = t.raw('machineFinderStarters') as string[];
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      content: t('machineFinderWelcome'),
    },
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null,
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  /**
   * How many messages existed on the very first render (the seed welcome
   * message). Anything at or past this index mounted later and therefore gets
   * an entrance animation; index 0 does not.
   *
   * This is the CSS equivalent of the old `<AnimatePresence initial={false}>`:
   * framer skipped the entrance for children already present at mount, and the
   * welcome bubble must stay un-animated so the server-rendered transcript is
   * painted at full opacity on first frame.
   *
   * `messages` only ever grows (send() appends; the error path appends too),
   * so an index is a stable identity here — same assumption the `key={i}`
   * below already makes.
   *
   * Held in state with a lazy initialiser rather than a ref: the value IS used
   * for rendering, and reading `ref.current` during render is a lint error
   * (react-hooks/refs). The setter is discarded — it never changes.
   */
  const [seedCount] = useState(() => messages.length);

  // Auto-scroll to latest message
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, recommendation]);

  async function send(override?: string) {
    const text = (override ?? input).trim();
    if (!text || streaming) return;
    const userMsg: Msg = { role: 'user', content: text };
    const history = [...messages, userMsg];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setInput('');
    setStreaming(true);

    try {
      const { output } = await machineFinderStream(history);
      let acc = '';
      for await (const chunk of readStreamableValue(output)) {
        acc += chunk;
        setMessages([...history, { role: 'assistant', content: acc }]);
      }

      // If the model emitted a recommendation, surface it as a real CTA and
      // record the session as a lead (best-effort).
      const rec = extractRecommendation(acc);
      const rawMachine = rec ? getMachine(rec.slug) : null;
      const machine = rawMachine ? localizeMachine(rawMachine, locale) : null;
      if (machine && rec) {
        setRecommendation({
          slug: machine.slug,
          name: machine.name,
          reasons: rec.reasons,
          confidence: rec.confidence,
        });
        void recordMachineFinderLead({
          recommendedSlug: machine.slug,
          locale,
          transcript: [...history, { role: 'assistant', content: acc }],
        });
      }
    } catch {
      setMessages([
        ...history,
        {
          role: 'assistant',
          content: t('machineFinderError'),
        },
      ]);
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="flex flex-col h-[70vh] border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]/40 relative overflow-hidden">
      {/* Decorative grid background — subtle */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(color-mix(in oklab, var(--color-signal) 30%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--color-signal) 30%, transparent) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden
      />

      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-atomic="false"
        aria-label={t('machineFinderAiLabel')}
        className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 relative"
      >
        {/* No <AnimatePresence>: messages are only ever appended, never
            removed, and no bubble ever had an `exit` prop — so the wrapper was
            only supplying `initial={false}`, which `animateIn` now covers. */}
        {messages.map((m, i) => (
          <MessageBubble
            key={i}
            role={m.role}
            content={m.role === 'assistant' ? stripJsonBlock(m.content) : m.content}
            isLast={i === messages.length - 1}
            streaming={streaming && i === messages.length - 1}
            animateIn={i >= seedCount}
          />
        ))}

        {/* Starter prompts — concrete examples so users know what to say. */}
        {messages.length === 1 && !streaming && starters.length > 0 && (
          <div className="pt-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)] mb-3">
              {t('machineFinderStarterLabel')}
            </div>
            <div className="flex flex-col gap-2">
              {starters.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => send(s)}
                  className="group text-left border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]/60 hover:border-[color:var(--color-signal)] hover:bg-[color:var(--color-signal)]/5 transition-colors px-4 py-3 text-sm text-[color:var(--color-steel-soft)] flex items-center justify-between gap-3"
                >
                  <span>{s}</span>
                  <Send className="h-3.5 w-3.5 shrink-0 text-[color:var(--color-steel)] group-hover:text-[color:var(--color-signal)] transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {recommendation && !streaming && (
          <div className="chat-rec border border-[color:var(--color-signal)]/40 bg-[color:var(--color-signal)]/5 p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-signal)] mb-2">
              {t('machineFinderRecommendation')}
            </div>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="font-display text-xl tracking-[-0.01em]">
                {recommendation.name}
              </div>
              <Button asChild size="sm">
                <Link href={`/${locale}/products/${recommendation.slug}`}>
                  {t('machineFinderViewMachine')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            {recommendation.reasons.length > 0 && (
              <ul className="mt-4 space-y-1.5 border-t border-[color:var(--color-signal)]/20 pt-4">
                {recommendation.reasons.map((r, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 text-sm text-[color:var(--color-steel-soft)] leading-relaxed"
                  >
                    <span className="text-[color:var(--color-signal)] mt-0.5 shrink-0" aria-hidden>
                      →
                    </span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="relative border-t border-[color:var(--color-neutral-700)] p-4 flex items-end gap-3 bg-[color:var(--color-ink)]">
        <ComposerInput
          value={input}
          onChange={setInput}
          onSubmit={send}
          inputRef={inputRef}
          disabled={streaming}
        />
        <Button
          onClick={() => send()}
          disabled={streaming || !input.trim()}
          size="sm"
          aria-label={t('send')}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Message bubble — clip-path reveal for assistant, slide-in for user
// ────────────────────────────────────────────────────────────────────────

function MessageBubble({
  role,
  content,
  isLast,
  streaming,
  animateIn,
}: {
  role: 'user' | 'assistant';
  content: string;
  isLast: boolean;
  streaming: boolean;
  /** False for messages present at first render — see `seedCount` above. */
  animateIn: boolean;
}) {
  const isUser = role === 'user';
  const empty = content === '';

  // The entrance is a one-shot CSS keyframe applied at mount (user: spring
  // slide from the right; assistant: clip-path wipe, top → bottom). It runs
  // once per mounted bubble, exactly like the old `initial`/`animate` pair —
  // content updates during streaming do not restart it.
  const enter = animateIn
    ? isUser
      ? 'chat-msg--enter-user'
      : 'chat-msg--enter-ai'
    : '';

  return (
    <div className={`${isUser ? 'text-right ' : ''}${enter}`.trim()}>
      <RoleLabel isUser={isUser} />

      <div
        className={`inline-block max-w-[85%] p-4 border ${
          isUser
            ? 'bg-[color:var(--color-signal)]/10 border-[color:var(--color-signal)]/30 text-left'
            : 'bg-[color:var(--color-neutral-800)] border-[color:var(--color-neutral-700)]'
        }`}
      >
        {empty && isLast && streaming ? (
          <ThinkingDots />
        ) : (
          <div className="whitespace-pre-wrap prose-editorial text-sm leading-relaxed">
            {content}
            {streaming && isLast && !isUser && (
              <span className="inline-block w-1.5 h-4 bg-[color:var(--color-signal)] ml-0.5 align-middle animate-pulse" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function RoleLabel({ isUser }: { isUser: boolean }) {
  const t = useTranslations('forms');
  return (
    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-steel)] mb-2 flex items-center gap-2 justify-start">
      {isUser ? (
        <span className="ml-auto flex items-center gap-2">
          — {t('machineFinderUserLabel')}
          <span className="h-1 w-1 bg-[color:var(--color-signal)] rounded-full" />
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <span className="h-1 w-1 bg-[color:var(--color-signal)] rounded-full" />
          {t('machineFinderAiLabel')}
        </span>
      )}
    </div>
  );
}

function ThinkingDots() {
  const t = useTranslations('common');
  return (
    <div className="flex items-center gap-1.5 py-1" aria-label={t('thinking')}>
      {/* Infinite bounce + fade, staggered 150ms apart. Both the loop and the
          stagger live in styles/motion/chat.css — `animation-delay` is valid
          there because this is a wall-clock animation, not a scroll timeline. */}
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="chat-dot inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-signal)]"
        />
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Composer — autosize textarea with focus glow
// ────────────────────────────────────────────────────────────────────────

function ComposerInput({
  value,
  onChange,
  onSubmit,
  disabled,
  inputRef,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const t = useTranslations('forms');

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  }

  // Focus is read straight off the textarea in CSS (`:focus ~ …`), so the old
  // `focused` state and its onFocus/onBlur handlers are gone — that is two
  // fewer renders of this subtree per focus change. The two decorations MUST
  // stay after the textarea in source order for the sibling combinator to
  // reach them.
  return (
    <div className="chat-composer relative flex-1">
      <textarea
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        rows={1}
        placeholder={t('machineFinderPlaceholder')}
        aria-label={t('machineFinderPlaceholder')}
        aria-keyshortcuts="Enter"
        disabled={disabled}
        className="chat-composer__field w-full bg-transparent outline-none py-2 pr-2 font-body text-[color:var(--color-paper)] resize-none placeholder:text-[color:var(--color-neutral-400)] disabled:opacity-50"
      />

      {/* Static base border */}
      <div className="absolute left-0 right-0 bottom-0 h-px bg-[color:var(--color-neutral-700)]" />
      {/* Active border — draws in on focus */}
      <div
        className="chat-composer__rule absolute left-0 right-0 bottom-0 h-px bg-[color:var(--color-signal)]"
        aria-hidden
      />
      {/* Soft glow halo on focus */}
      <div
        className="chat-composer__glow absolute inset-x-0 -bottom-2 h-3 bg-[color:var(--color-signal)] blur-md pointer-events-none"
        aria-hidden
      />
    </div>
  );
}
