'use client';

import { useState } from 'react';
import { readStreamableValue } from 'ai/rsc';
import { machineFinderStream } from '@/actions/machine-finder';
import { Button } from '@/components/primitives/button';
import { Send } from 'lucide-react';

type Msg = { role: 'user' | 'assistant'; content: string };

export function MachineFinderChat() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Tell me about what you make and how fast your line runs.' },
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);

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
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="flex flex-col h-[70vh] border border-[color:var(--color-steel)]/30">
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-steel)] mb-2">
              {m.role === 'user' ? '— You' : '— Auraplex AI'}
            </div>
            <div
              className={`inline-block max-w-[80%] p-4 ${
                m.role === 'user'
                  ? 'bg-[color:var(--color-signal)]/10 border border-[color:var(--color-signal)]/30 text-left'
                  : 'bg-[color:var(--color-ink-soft)]'
              }`}
            >
              <div className="whitespace-pre-wrap prose-editorial text-sm">{m.content || '…'}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-[color:var(--color-steel)]/30 p-4 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Describe your product and line…"
          className="flex-1 bg-transparent border-b border-[color:var(--color-steel)]/40 focus:border-[color:var(--color-signal)] outline-none py-2 font-body"
        />
        <Button onClick={send} disabled={streaming || !input.trim()} size="sm">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
