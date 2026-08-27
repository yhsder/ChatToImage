import { ArrowRight, Check, Coins, RefreshCw, Sparkles } from 'lucide-react';

import { tDynamic } from '@/core/i18n/dynamic';
import { Link } from '@/core/i18n/navigation';
import { m } from '@/paraglide/messages.js';

const PLANS = [
  { key: 'free', icon: Sparkles, accent: false },
  { key: 'subscription', icon: RefreshCw, accent: true },
  { key: 'pack', icon: Coins, accent: false },
] as const;

export function Pricing() {
  return (
    <section
      id="pricing"
      className="chat-section border-b border-white/10 px-4 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl sm:px-2 lg:px-4">
        <div className="mb-10 max-w-2xl">
          <p className="chat-eyebrow">{m['landing.nav.pricing']()}</p>
          <h2 className="mt-3 text-3xl leading-[1.1] font-bold tracking-[-0.035em] text-slate-50 sm:text-5xl">
            {m['landing.compactPricing.title']()}
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-400 sm:text-base">
            {m['landing.compactPricing.description']()}
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {PLANS.map(({ key, icon: Icon, accent }) => (
            <article
              key={key}
              className={`chat-surface flex min-h-56 flex-col p-5 sm:p-6 ${accent ? 'border-amber-300/45 shadow-[0_12px_32px_rgba(250,204,66,0.08)]' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/10 text-amber-300">
                  <Icon className="size-5" />
                </div>
                {accent && (
                  <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-amber-200 uppercase">
                    {m['landing.compactPricing.regular_use']()}
                  </span>
                )}
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-100">
                {tDynamic(`landing.compactPricing.${key}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {tDynamic(`landing.compactPricing.${key}.body`)}
              </p>
              <div className="mt-auto flex items-center gap-2 pt-6 text-xs text-slate-300">
                <Check className="size-4 text-amber-300" />
                {key === 'free'
                  ? m['landing.compactPricing.no_payment']()
                  : m['landing.compactPricing.clear_pricing']()}
              </div>
            </article>
          ))}
        </div>

        <Link
          href="/pricing"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-amber-300 transition hover:text-amber-200"
        >
          {m['landing.compactPricing.cta']()}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
