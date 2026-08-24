import { ArrowUp } from 'lucide-react';

import { m } from '@/paraglide/messages.js';
import { focusChatToImageGenerator } from '@/components/chat-to-image-generator';

export function CTA() {
  return (
    <section className="chat-section px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl rounded-3xl border border-amber-300/20 bg-[radial-gradient(60%_80%_at_50%_0,rgba(250,204,66,0.12),transparent_70%)] px-6 py-12 text-center sm:px-10 sm:py-16">
        <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-[-0.04em] text-slate-50 sm:text-5xl">
          {m['landing.finalCta.title']()}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
          {m['landing.finalCta.description']()}
        </p>
        <button
          type="button"
          onClick={focusChatToImageGenerator}
          className="chat-primary-button mt-8 min-h-11 px-5"
        >
          {m['landing.finalCta.button']()}
          <ArrowUp className="size-4" />
        </button>
        <p className="mt-4 text-xs text-slate-500">
          {m['landing.finalCta.helper']()}
        </p>
      </div>
    </section>
  );
}
