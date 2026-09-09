import { tDynamic } from '@/core/i18n/dynamic';
import {
  FREE_TRIAL,
  LIVE_IMAGE_MODELS,
  maxImagesForCredits,
  REFERENCE_IMAGE_COST,
} from '@/config/image-credits';
import { pricingCatalog, type PricingProduct } from '@/config/pricing';
import { m } from '@/paraglide/messages.js';
import {
  PricingPlans,
  type PricingCardData,
  type PricingGroupData,
} from '@/components/pricing-plans';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const YEARLY_SAVE_PERCENT = 17;
const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'] as const;

const PLAN_KEYS = [
  {
    id: 'starter',
    monthly: 'starter_monthly',
    yearly: 'starter_yearly',
    pack: 'pack_small',
    packName: 'small',
    featured: false,
    badge: undefined as string | undefined,
  },
  {
    id: 'creator',
    monthly: 'creator_monthly',
    yearly: 'creator_yearly',
    pack: 'pack_medium',
    packName: 'medium',
    featured: true,
    badge: 'most_popular',
  },
  {
    id: 'pro',
    monthly: 'pro_monthly',
    yearly: 'pro_yearly',
    pack: 'pack_large',
    packName: 'large',
    featured: false,
    badge: 'best_value',
  },
] as const;

function formatUsd(cents: number): string {
  const value = cents / 100;
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatCount(count: number): string {
  return count.toLocaleString('en-US');
}

function catalogProduct(id: string): PricingProduct {
  const product = pricingCatalog[id];
  if (!product) throw new Error(`Missing pricing product: ${id}`);
  return product;
}

function modelBreakdown(credits: number) {
  return LIVE_IMAGE_MODELS.map((model) => ({
    name: model.name,
    lines: (['1K', '2K', '4K'] as const).map((resolution) =>
      m['landing.pricing.model_cost']({
        resolution,
        cost: model.costs[resolution],
        count: formatCount(
          maxImagesForCredits(credits, model.costs[resolution])
        ),
      })
    ),
  }));
}

function paidFeatures(kind: 'subscription' | 'pack'): string[] {
  const items = [
    m['landing.pricing.all_models'](),
    m['landing.pricing.cost_varies'](),
    m['landing.pricing.failed_refund'](),
  ];
  if (kind === 'subscription') {
    items.push(
      m['landing.pricing.rollover'](),
      m['landing.pricing.cancel_anytime']()
    );
  } else {
    items.push(m['landing.pricing.valid_365']());
  }
  return items;
}

function subscriptionCard(
  product: PricingProduct,
  options: {
    id: string;
    yearly: boolean;
    featured?: boolean;
    badge?: string;
  }
): PricingCardData {
  const monthlyCents = options.yearly
    ? Math.round(product.priceInCents / 12)
    : product.priceInCents;
  const monthlyListPrice =
    pricingCatalog[`${options.id}_monthly`]?.priceInCents ?? 0;
  const originalYearlyCents = options.yearly ? monthlyListPrice * 12 : 0;
  const saveCents = originalYearlyCents - product.priceInCents;

  return {
    id: product.productId,
    productId: product.productId,
    name: tDynamic(`landing.pricing.${options.id}`),
    description: tDynamic(`landing.pricing.${options.id}_desc`),
    price: formatUsd(monthlyCents),
    priceSuffix: m['landing.pricing.per_month'](),
    billedHint: options.yearly
      ? m['landing.pricing.billed_yearly']({
          amount: formatUsd(product.priceInCents),
        })
      : undefined,
    originalPrice:
      options.yearly && monthlyListPrice > 0
        ? formatUsd(monthlyListPrice)
        : undefined,
    badge: options.badge
      ? tDynamic(`landing.pricing.${options.badge}`)
      : undefined,
    discountBadge:
      options.yearly && saveCents > 0
        ? m['landing.pricing.save_badge']({
            percent: YEARLY_SAVE_PERCENT,
            amount: formatUsd(saveCents),
          })
        : undefined,
    featured: options.featured,
    cta: m['landing.pricing.subscribe'](),
    creditsLabel: options.yearly
      ? m['landing.pricing.credits_yearly']({
          count: formatCount(product.credits),
        })
      : m['landing.pricing.credits_month']({
          count: formatCount(product.credits),
        }),
    imagesLabel: m['landing.pricing.up_to_images']({
      count: formatCount(
        maxImagesForCredits(product.credits, REFERENCE_IMAGE_COST)
      ),
    }),
    models: modelBreakdown(product.credits),
    features: paidFeatures('subscription'),
  };
}

function packCard(product: PricingProduct, packName: string): PricingCardData {
  return {
    id: product.productId,
    productId: product.productId,
    name: tDynamic(`landing.pricing.pack_${packName}`),
    description: m['landing.pricing.pack_desc'](),
    price: formatUsd(product.priceInCents),
    featured: false,
    cta: m['landing.pricing.buy_once'](),
    creditsLabel: m['landing.pricing.credits_once']({
      count: formatCount(product.credits),
    }),
    imagesLabel: m['landing.pricing.up_to_images']({
      count: formatCount(
        maxImagesForCredits(product.credits, REFERENCE_IMAGE_COST)
      ),
    }),
    models: modelBreakdown(product.credits),
    features: paidFeatures('pack'),
  };
}

function freeCard(): PricingCardData {
  return {
    id: 'free',
    name: m['landing.pricing.free'](),
    description: m['landing.pricing.free_desc'](),
    price: m['landing.pricing.free_credits']({ count: FREE_TRIAL.credits }),
    cta: m['landing.pricing.start_free'](),
    href: '/sign-up',
    creditsLabel: m['landing.pricing.free_trial']({ days: FREE_TRIAL.days }),
    imagesLabel: m['landing.pricing.up_to_images']({
      count: formatCount(
        maxImagesForCredits(FREE_TRIAL.credits, REFERENCE_IMAGE_COST)
      ),
    }),
    models: [],
    features: [
      m['landing.pricing.no_payment'](),
      m['landing.pricing.all_models'](),
      m['landing.pricing.cost_varies'](),
      m['landing.pricing.failed_refund'](),
    ],
  };
}

function buildGroups(): PricingGroupData[] {
  const yearlyCards = PLAN_KEYS.map((plan) =>
    subscriptionCard(catalogProduct(plan.yearly), {
      id: plan.id,
      yearly: true,
      featured: plan.featured,
      badge: plan.badge,
    })
  );
  const monthlyCards = PLAN_KEYS.map((plan) =>
    subscriptionCard(catalogProduct(plan.monthly), {
      id: plan.id,
      yearly: false,
      featured: plan.featured,
      badge: plan.badge,
    })
  );
  const packCards = PLAN_KEYS.map((plan) =>
    packCard(catalogProduct(plan.pack), plan.packName)
  );

  const free = freeCard();

  return [
    {
      key: 'yearly',
      label: m['landing.pricing.yearly'](),
      saveLabel: m['landing.pricing.save_percent']({
        percent: YEARLY_SAVE_PERCENT,
      }),
      trustLine: m['landing.pricing.trust_line'](),
      cards: [...yearlyCards, free],
    },
    {
      key: 'monthly',
      label: m['landing.pricing.monthly'](),
      trustLine: m['landing.pricing.trust_line'](),
      cards: [...monthlyCards, free],
    },
    {
      key: 'onetime',
      label: m['landing.pricing.one_time'](),
      trustLine: m['landing.pricing.pack_trust'](),
      cards: [...packCards, free],
    },
  ];
}

export function PricingFull() {
  const groups = buildGroups();

  return (
    <section className="chat-section px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-[-0.035em] text-slate-50 sm:text-5xl">
          {m['landing.pricing.headline']()}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
          {m['landing.pricing.subheadline']()}
        </p>
      </div>

      <div className="mt-10">
        <PricingPlans
          groups={groups}
          processingLabel={m['common.pricing.processing']()}
        />
      </div>

      <div className="mx-auto mt-24 max-w-4xl">
        <p className="chat-eyebrow mx-auto w-fit">
          {m['landing.pricing.faq_kicker']()}
        </p>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-[-0.035em] text-slate-50 sm:text-4xl">
          {m['landing.pricing.faq_title']()}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-6 text-slate-400">
          {m['landing.pricing.faq_description']()}
        </p>
        <Accordion className="mt-8 rounded-2xl border border-white/10 bg-[#11141c] px-5 sm:px-7">
          {FAQ_KEYS.map((key) => (
            <AccordionItem key={key} value={key} className="border-white/10">
              <AccordionTrigger className="py-5 text-left text-sm font-semibold text-slate-100 hover:no-underline sm:text-base">
                {tDynamic(`landing.pricing.faq.${key}`)}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-7 text-slate-400">
                {tDynamic(`landing.pricing.faq.a${key.slice(1)}`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
