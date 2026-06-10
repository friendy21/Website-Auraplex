'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { readStreamableValue } from 'ai/rsc';
import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { machineFinderStream } from '@/actions/machine-finder';
import { Button } from '@/components/primitives/button';

type Msg = { role: 'user' | 'assistant'; content: string };

/**
 * Streaming chat UI for the Machine Finder.
 *
 *   - Assistant bubble enters with clip-path mask wipe (top → bottom)
 *   - User bubble slides in from the right (springy)
 *   - When streaming, three signal dots bounce in stagger above the bubble
 *   - Input has cerulean focus underline + glow halo on focus
 *   - Auto-scroll to bottom on new message
 *   - Enter to send · Shift+Enter for newline
 */
export function MachineFinderChat() {
  const t = useTranslations('forms');
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      content: t('machineFinderWelcome'),
    },
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  async function send() {
    if (!input.trim() || streaming) return;
    const userMsg: Msg = { role: 'user', content: input };
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
        className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 relative"
      >
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <MessageBubble
              key={i}
              role={m.role}
              content={m.content}
              isLast={i === messages.length - 1}
              streaming={streaming && i === messages.length - 1}
            />
          ))}
        </AnimatePresence>
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
          onClick={send}
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
}: {
  role: 'user' | 'assistant';
  content: string;
  isLast: boolean;
  streaming: boolean;
}) {
  const isUser = role === 'user';
  const empty = content === '';

  return (
    <motion.div
      initial={
        isUser
          ? { opacity: 0, x: 40 }
          : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }
      }
      animate={
        isUser
          ? { opacity: 1, x: 0 }
          : { opacity: 1, clipPath: 'inset(0 0 0% 0)' }
      }
      transition={
        isUser
          ? { type: 'spring', stiffness: 280, damping: 24 }
          : { duration: 0.6, ease: [0.65, 0, 0.35, 1] }
      }
      className={isUser ? 'text-right' : ''}
    >
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
    </motion.div>
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
  return (
    <div className="flex items-center gap-1.5 py-1" aria-label="Thinking">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 1.0,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
          className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-signal)]"
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
  const [focused, setFocused] = useState(false);

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  }

  return (
    <div className="relative flex-1">
      <textarea
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={1}
        placeholder={t('machineFinderPlaceholder')}
        disabled={disabled}
        className="w-full bg-transparent outline-none py-2 pr-2 font-body text-[color:var(--color-paper)] resize-none placeholder:text-[color:var(--color-neutral-400)] disabled:opacity-50"
      />

      {/* Static base border */}
      <div className="absolute left-0 right-0 bottom-0 h-px bg-[color:var(--color-neutral-700)]" />
      {/* Active border — draws in on focus */}
      <motion.div
        initial={false}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
        style={{ originX: 0 }}
        className="absolute left-0 right-0 bottom-0 h-px bg-[color:var(--color-signal)]"
      />
      {/* Soft glow halo on focus */}
      <motion.div
        initial={false}
        animate={{ opacity: focused ? 0.25 : 0 }}
        className="absolute inset-x-0 -bottom-2 h-3 bg-[color:var(--color-signal)] blur-md pointer-events-none"
      />
    </div>
  );
}
