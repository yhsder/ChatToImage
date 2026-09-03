import { ArrowUpRight, WandSparkles } from 'lucide-react';

import { tDynamic } from '@/core/i18n/dynamic';
import { m } from '@/paraglide/messages.js';
import { requestPrompt } from '@/components/chat-to-image-generator';

const EXAMPLES = [
  {
    id: 1,
    image: '/generated/moon-garden.png',
    className: 'md:col-span-2 md:row-span-2',
    position: 'center',
  },
  {
    id: 2,
    image: '/generated/portrait.png',
    className: '',
    position: 'center top',
  },
  {
    id: 3,
    image: '/generated/nature.png',
    className: '',
    position: 'left center',
  },
  { id: 4, image: '/generated/poster.png', className: '', position: 'center' },
  { id: 5, image: '/generated/product.png', className: '', position: 'center' },
  {
    id: 6,
    image: '/generated/night-orchard.png',
    className: '',
    position: 'right center',
  },
  {
    id: 7,
    image: '/generated/quiet-workspace.png',
    className: '',
    position: 'right bottom',
  },
  {
    id: 8,
    image: '/generated/city-in-the-clouds.png',
    className: '',
    position: 'left center',
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
            return (
              <article
                key={example.id}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 ${example.className}`}
              >
                <img
                  src={example.image}
                  alt={tDynamic(`landing.examples.${example.id}.title`)}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  style={{ objectPosition: example.position }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
                <div className="relative flex h-full flex-col justify-end p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-semibold tracking-[0.15em] text-amber-300 uppercase">
                      {tDynamic(
                        `landing.examples.${example.id === 1 ? 'complex_scene' : ['portrait', 'nature', 'poster', 'product', 'fantasy', 'interior', 'illustration'][example.id - 2]}`
                      )}
                    </span>
                    <ArrowUpRight className="size-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <h3 className="mt-2 text-base font-bold text-white sm:text-lg">
                    {tDynamic(`landing.examples.${example.id}.title`)}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-300/80">
                    <span className="font-medium text-slate-200">
                      {m['landing.examples.prompt_used']()}:{' '}
                    </span>
                    {prompt}
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
