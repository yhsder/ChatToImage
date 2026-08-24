import {
  ArrowRight,
  Download,
  MessageSquareText,
  Sparkles,
} from 'lucide-react';

import { tDynamic } from '@/core/i18n/dynamic';
import { Link } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { buttonVariants } from '@/components/ui/button';

const STEPS = [
  { key: 'describe', icon: MessageSquareText },
  { key: 'generate', icon: Sparkles },
  { key: 'download', icon: Download },
] as const;

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="chat-section border-b border-white/10 px-4 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl sm:px-2 lg:px-4">
        <div className="mb-10 max-w-2xl">
          <p className="chat-eyebrow">{m['landing.nav.how_it_works']()}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-slate-50 sm:text-5xl">
            {m['landing.how.title']()}
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-400 sm:text-base">
            {m['landing.how.description']()}
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {STEPS.map(({ key, icon: Icon }, index) => (
            <div key={key} className="relative">
              <div className="chat-surface h-full p-5 sm:p-6">
                <div className="flex size-11 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/10 text-amber-300">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-100">
                  {tDynamic(`landing.how.${key}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {tDynamic(`landing.how.${key}.body`)}
                </p>
              </div>
              {index < STEPS.length - 1 && (
                <ArrowRight className="absolute top-1/2 -right-3 z-10 hidden size-5 -translate-y-1/2 text-amber-300/50 md:block" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/#generator"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'chat-primary-button h-11 rounded-lg px-5'
            )}
          >
            {m['landing.how.cta']()}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
