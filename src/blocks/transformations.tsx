import { ImgComparisonSlider } from '@img-comparison-slider/react';
import { Check } from 'lucide-react';

import { tDynamic } from '@/core/i18n/dynamic';
import { m } from '@/paraglide/messages.js';
import { focusChatToImageGenerator } from '@/components/chat-to-image-generator';

// Each case shows a before/after pair via the drag slider. Asset paths follow
// the convention /generated/transformations/<id>-before.png and <id>-after.png.
const TRANSFORMATIONS = [
  'figurine',
  'anime',
  'restore',
  'background',
  'age',
  'outfit',
] as const;

const FEATURES = [1, 2, 3] as const;

// Placeholder images so the section renders before real before/after assets
// exist. Swap back to `/generated/transformations/${id}-${side}.png` later.
const placeholder = (id: string, side: 'before' | 'after') =>
  `https://picsum.photos/seed/${id}-${side}/800/600`;

export function Transformations() {
  return (
    <section
      id="transformations"
      className="chat-section border-b border-white/10 px-4 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl sm:px-2 lg:px-4">
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="chat-eyebrow">
              {m['landing.transformations.eyebrow']()}
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl leading-[1.1] font-bold tracking-[-0.035em] text-slate-50 sm:text-5xl">
              {m['landing.transformations.title']()}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              {m['landing.transformations.description']()}
            </p>
          </div>
        </div>

        <div className="space-y-16 md:space-y-24">
          {TRANSFORMATIONS.map((id, index) => {
            const title = tDynamic(`landing.transformations.${id}.title`);
            const description = tDynamic(
              `landing.transformations.${id}.description`
            );
            // Alternate the image column: even index = image left, odd = right.
            const flip = index % 2 === 1;
            return (
              <article
                key={id}
                className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16"
              >
                <div
                  className={`flex flex-col justify-center space-y-4 ${
                    flip ? 'md:order-1' : 'md:order-2'
                  }`}
                >
                  <h3 className="text-xl font-bold text-slate-100 md:text-3xl">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400 md:text-base">
                    {description}
                  </p>
                  <ul className="space-y-2">
                    {FEATURES.map((n) => (
                      <li key={n} className="flex items-start">
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-amber-300/40 bg-amber-300/10">
                          <Check className="size-3 text-amber-300" />
                        </span>
                        <span className="ml-3 text-slate-400">
                          {tDynamic(
                            `landing.transformations.${id}.feature${n}`
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={focusChatToImageGenerator}
                      className="chat-primary-button min-h-11 px-5"
                    >
                      {m['landing.transformations.try']()} {title}
                    </button>
                  </div>
                </div>

                <div className={flip ? 'md:order-2' : 'md:order-1'}>
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
                    <ImgComparisonSlider
                      className="block h-full w-full"
                      value={50}
                    >
                      <img
                        slot="first"
                        src={placeholder(id, 'before')}
                        alt={m['landing.transformations.before']()}
                        className="h-full w-full object-cover"
                      />
                      <img
                        slot="second"
                        src={placeholder(id, 'after')}
                        alt={m['landing.transformations.after']()}
                        className="h-full w-full object-cover"
                      />
                    </ImgComparisonSlider>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
