import { CircleCheck, SlidersHorizontal, TextCursorInput } from 'lucide-react';

import { tDynamic } from '@/core/i18n/dynamic';
import { m } from '@/paraglide/messages.js';

const BENEFITS = [
  { key: 'natural', icon: TextCursorInput },
  { key: 'controls', icon: SlidersHorizontal },
  { key: 'protection', icon: CircleCheck },
] as const;

export function Benefits() {
  return (
    <section className="chat-section border-b border-white/10 px-4 py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 sm:px-2 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20 lg:px-4">
        <div>
          <p className="chat-eyebrow">{m['landing.benefits.eyebrow']()}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-slate-50 sm:text-5xl">
            {m['landing.benefits.title']()}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
            {m['landing.benefits.description']()}
          </p>
        </div>

        <div className="grid gap-3">
          {BENEFITS.map(({ key, icon: Icon }) => (
            <article
              key={key}
              className="chat-surface grid gap-4 p-5 sm:grid-cols-[48px_1fr] sm:items-start sm:p-6"
            >
              <div className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-slate-950/45 text-amber-300">
                <Icon className="size-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">
                  {tDynamic(`landing.benefits.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {tDynamic(`landing.benefits.${key}.body`)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
