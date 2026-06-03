'use client';

import { useActionState, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/primitives/dialog';
import { Button } from '@/components/primitives/button';
import { requestSpecSheet, type ActionState } from '@/actions/request-spec-sheet';
import { Download } from 'lucide-react';

const initial: ActionState = { ok: false };

export function SpecSheetGate({ productSlug, locale }: { productSlug: string; locale: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(requestSpecSheet, initial);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Download className="h-4 w-4" /> Download spec sheet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="font-display text-3xl">Get the spec sheet</DialogTitle>
        <p className="text-sm text-[color:var(--color-steel-soft)] mt-2 mb-6 prose-editorial">
          We'll email the full PDF — dimensions, throughput curves, container chart, installation requirements.
        </p>
        {state.ok ? (
          <div className="font-mono text-sm text-[color:var(--color-signal)]">→ Sent. Check your inbox.</div>
        ) : (
          <form action={action} className="space-y-5">
            <input type="hidden" name="productSlug" value={productSlug} />
            <input type="hidden" name="locale" value={locale} />
            <Input label="Name" name="name" required />
            <Input label="Company" name="company" required />
            <Input label="Email" name="email" type="email" required />
            <Input label="Phone" name="phone" required />
            {state.error && <p className="text-[color:var(--color-alert)] font-mono text-xs">{state.error}</p>}
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? '…' : 'Send me the PDF'} →
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Input({ label, name, type = 'text', required }: any) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-steel)] block mb-1">
        {label}{required && ' *'}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full bg-transparent border-b border-[color:var(--color-steel)]/40 focus:border-[color:var(--color-signal)] outline-none py-2 font-body"
      />
    </label>
  );
}
