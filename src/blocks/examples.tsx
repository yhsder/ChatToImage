import { ArrowUpRight, WandSparkles } from 'lucide-react';

import { tDynamic } from '@/core/i18n/dynamic';
import { m } from '@/paraglide/messages.js';
import { requestPrompt } from '@/components/chat-to-image-generator';

const EXAMPLES = [
  {
    id: 1,
    image: '/generated/use-cases/ecommerce-product.webp',
    className: 'md:col-span-2 md:row-span-2',
    position: 'center',
  },
  {
    id: 2,
    image: '/generated/use-cases/lifestyle-product.webp',
    className: '',
    position: 'center',
  },
  {
    id: 3,
    image: '/generated/use-cases/social-ad.webp',
    className: '',
    position: 'center',
  },
  {
    id: 4,
    image: '/generated/use-cases/video-thumbnail.webp',
    className: '',
    position: 'center',
  },
  {
    id: 5,
    image: '/generated/use-cases/blog-hero.webp',
    className: '',
    position: 'center',
  },
  {
    id: 6,
    image: '/generated/use-cases/local-promo.webp',
    className: '',
    position: 'center',
  },
  {
    id: 7,
    image: '/generated/use-cases/interior-preview.webp',
    className: '',
    position: 'center',
  },
  {
    id: 8,
    image: '/generated/use-cases/game-character.webp',
    className: 'md:col-span-2',
    position: 'center',
  },
] as const;

export function Examples() {
  return (
    <section
      id="examples"
      className="chat-section border-b border-white/10 px-4 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl sm:px-2 lg:px-4">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="chat-eyebrow">{m['landing.nav.examples']()}</p>
            <h2 className="mt-3 max-w-2xl text-3xl leading-[1.1] font-bold tracking-[-0.035em] text-slate-50 sm:text-5xl">
              {m['landing.examples.title']()}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              {m['landing.examples.description']()}
            </p>
          </div>
          <span className="text-xs font-medium tracking-[0.12em] text-slate-500 uppercase">
            {m['landing.examples.tested_directions']()}
          </span>
        </div>

        <div className="grid auto-rows-[210px] gap-3 sm:auto-rows-[220px] sm:grid-cols-2 lg:grid-cols-4">
          {EXAMPLES.map((example) => {
            const prompt = tDynamic(`landing.examples.${example.id}.prompt`);
            const title = tDynamic(`landing.examples.${example.id}.title`);
            return (
              <article
                key={example.id}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 ${example.className}`}
              >
                <img
                  src={example.image}
                  alt={title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  style={{ objectPosition: example.position }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
                <div className="relative flex h-full flex-col justify-end p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-semibold tracking-[0.15em] text-amber-300 uppercase">
                      {tDynamic(`landing.examples.${example.id}.category`)}
                    </span>
                    <ArrowUpRight className="size-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <h3 className="mt-2 text-base font-bold text-white sm:text-lg">
                    {title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-300/80">
                    {tDynamic(`landing.examples.${example.id}.outcome`)}
                  </p>
                  <button
                    type="button"
                    onClick={() => requestPrompt(prompt)}
                    className="mt-3 inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-amber-300 transition hover:text-amber-200"
                  >
                    <WandSparkles className="size-3.5" />
                    {m['landing.examples.try_prompt']()}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
