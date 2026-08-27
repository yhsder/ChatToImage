import { tDynamic } from '@/core/i18n/dynamic';
import { m } from '@/paraglide/messages.js';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const;

export function FAQ() {
  return (
    <section
      id="faq"
      className="chat-section border-b border-white/10 px-4 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-4xl sm:px-2">
        <div className="mb-10 text-center">
          <p className="chat-eyebrow">{m['landing.nav.faq']()}</p>
          <h2 className="mt-3 text-3xl leading-[1.1] font-bold tracking-[-0.035em] text-slate-50 sm:text-5xl">
            {m['landing.chatFaq.title']()}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            {m['landing.chatFaq.description']()}
          </p>
        </div>

        <Accordion className="rounded-2xl border border-white/10 bg-[#11141c] px-5 sm:px-7">
          {FAQ_KEYS.map((key) => (
            <AccordionItem key={key} value={key} className="border-white/10">
              <AccordionTrigger className="py-5 text-left text-sm font-semibold text-slate-100 hover:no-underline sm:text-base">
                {tDynamic(`landing.chatFaq.${key}`)}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-7 text-slate-400">
                {tDynamic(`landing.chatFaq.a${key.slice(1)}`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
