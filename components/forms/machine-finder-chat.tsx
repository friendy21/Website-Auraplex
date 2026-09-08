'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Send } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import {
  machineFinderRecommend,
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
 * Streaming chat UI for the Machine Finder.
 *
 *   - Assistant bubble enters with clip-path mask wipe (top → bottom)
 *   - User bubble slides in from the right (springy)
 *   - While waiting, three signal dots bounce in stagger above the bubble
 *   - Input has cerulean focus underline + glow halo on focus
 *   - Auto-scroll to bottom on new message
 *   - Enter to send · Shift+Enter for newline
 *
 * Backend swapped from Anthropic streamText to the self-hosted /recommend
 * endpoint (single-shot). The visual "typing…" phase now spans the whole
 * request instead of tokens-as-they-arrive; feels identical for < 10s
 * responses which is where warm requests land.
 */
export function MachineFinderChat() {
  const t = useTranslations('forms');
  const locale = useLocale() as 'en' | 'ms' | 'zh';
  const starters = t.raw('machineFinderStarters') as string[];

  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      content: t('machineFinderWelcome'),
    },
  ]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null,
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [seedCount] = useState(() => messages.length);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, recommendation, pending]);

  async function send(override?: string) {
    const text = (override ?? input).trim();
    if (!text || pending) return;

    const userMsg: Msg = { role: 'user', content: text };
    const history = [...messages, userMsg];
    // Add an empty assistant bubble immediately so the ThinkingDots render
    // in place of the incoming reply (matches the old streaming UX).
    setMessages([...history, { role: 'assistant', content: '' }]);
    setInput('');
    setPending(true);

    try {
      const result = await machineFinderRecommend(
        // Only user/assistant turns go to the backend, and the seeded welcome
        // isn't a real turn — trim it.
        history.filter((_, i) => i > 0 || history[0].role === 'user'),
        locale,
      );

      if (!result.ok) {
        setMessages([
          ...history,
          { role: 'assistant', content: t('machineFinderError') },
        ]);
        return;
      }

      // If the model produced only a recommendation (empty reply), synthesize
      // a short intro line so the transcript reads naturally. Backend prompt
      // is tuned to include a preamble but qwen occasionally jumps straight
      // to JSON — this is the client-side safety net.
      const replyText =
        result.reply.trim() ||
        (result.recommendation
          ? t('machineFinderRecommendationIntro')
          : t('machineFinderError'));

      setMessages([...history, { role: 'assistant', content: replyText }]);

      if (result.recommendation) {
        const rawMachine = getMachine(result.recommendation.recommendedSlug);
        const machine = rawMachine ? localizeMachine(rawMachine, locale) : null;

        if (machine) {
          setRecommendation({
            slug: machine.slug,
            name: machine.name,
            reasons: result.recommendation.reasons,
            confidence: result.recommendation.confidence,
          });
          void recordMachineFinderLead({
            recommendedSlug: machine.slug,
            locale,
            transcript: [
              ...history,
              { role: 'assistant', content: replyText },
            ],
          });
        }
      }
    } catch {
      setMessages([
        ...history,
        { role: 'assistant', content: t('machineFinderError') },
      ]);
    } finally {
      setPending(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="flex flex-col h-[70vh] border border-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-800)]/40 relative overflow-hidden">
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
        {messages.map((m, i) => (
          <MessageBubble
            key={i}
            role={m.role}
            content={m.content}
            isLast={i === messages.length - 1}
            pending={pending && i === messages.length - 1}
            animateIn={i >= seedCount}
          />
        ))}

        {messages.length === 1 && !pending && starters.length > 0 && (
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

        {recommendation && !pending && (
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

      <div className="relative border-t border-[color:var(--color-neutral-700)] p-4 flex items-end gap-3 bg-[color:var(--color-ink)]">
        <ComposerInput
          value={input}
          onChange={setInput}
          onSubmit={send}
          inputRef={inputRef}
          disabled={pending}
        />
        <Button
          onClick={() => send()}
          disabled={pending || !input.trim()}
          size="sm"
          aria-label={t('send')}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function MessageBubble({
  role,
  content,
  isLast,
  pending,
  animateIn,
}: {
  role: 'user' | 'assistant';
  content: string;
  isLast: boolean;
  pending: boolean;
  animateIn: boolean;
}) {
  const isUser = role === 'user';
  const empty = content === '';

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
        {empty && isLast && pending ? (
          <ThinkingDots />
        ) : (
          <div className="whitespace-pre-wrap prose-editorial text-sm leading-relaxed">
            {content}
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
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="chat-dot inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-signal)]"
        />
      ))}
    </div>
  );
}

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
      <div className="absolute left-0 right-0 bottom-0 h-px bg-[color:var(--color-neutral-700)]" />
      <div
        className="chat-composer__rule absolute left-0 right-0 bottom-0 h-px bg-[color:var(--color-signal)]"
        aria-hidden
      />
      <div
        className="chat-composer__glow absolute inset-x-0 -bottom-2 h-3 bg-[color:var(--color-signal)] blur-md pointer-events-none"
        aria-hidden
      />
    </div>
  );
}
