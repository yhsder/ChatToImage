import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Check, ChevronDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { useSession } from '@/core/auth/client';
import { Link, useRouter } from '@/core/i18n/navigation';
import { ApiError, apiPost } from '@/lib/api-client';
import { currentPathWithQuery } from '@/lib/redirect';
import { cn } from '@/lib/utils';
import { usePublicConfig } from '@/hooks/use-public-config';
import {
  PaymentProviderModal,
  type PaymentProvider,
} from '@/components/payment-provider-modal';

export type PricingModelBreakdown = {
  name: string;
  lines: string[];
};

export type PricingCardData = {
  id: string;
  productId?: string;
  name: string;
  description: string;
  price: string;
  priceSuffix?: string;
  billedHint?: string;
  originalPrice?: string;
  badge?: string;
  discountBadge?: string;
  featured?: boolean;
  cta: string;
  href?: string;
  creditsLabel: string;
  imagesLabel: string;
  models: PricingModelBreakdown[];
  features: string[];
};

export type PricingGroupData = {
  key: string;
  label: string;
  saveLabel?: string;
  trustLine: string;
  cards: PricingCardData[];
};

const PROVIDERS: PaymentProvider[] = ['stripe', 'creem', 'alipay', 'wechat'];

function enabledProviders(config: Record<string, string>): PaymentProvider[] {
  return PROVIDERS.filter((id) => config[`${id}_enabled`] === 'true');
}

export function PricingPlans({
  groups,
  processingLabel,
}: {
  groups: PricingGroupData[];
  processingLabel: string;
}) {
  const [activeGroup, setActiveGroup] = useState(groups[0]?.key || '');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [pendingCard, setPendingCard] = useState<PricingCardData | null>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const publicConfig = usePublicConfig();
  const config = publicConfig.data ?? {};

  const currentGroup = groups.find((g) => g.key === activeGroup) || groups[0];
  const providers = enabledProviders(config);
  const showPicker =
    config.select_payment_enabled === 'true' && providers.length > 1;

  const checkoutMutation = useMutation({
    mutationFn: (vars: { card: PricingCardData; provider?: PaymentProvider }) =>
      apiPost<{ checkout_url?: string }>('/api/payment/checkout', {
        product_id: vars.card.productId,
        payment_provider: vars.provider || config.default_payment_provider,
        redirect: currentPathWithQuery('/settings/billing'),
      }),
    onSuccess: (data) => {
      if (data?.checkout_url) {
        window.location.href = data.checkout_url;
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
      if (error instanceof ApiError && error.message === 'Unauthorized') {
        router.push(`/sign-in?redirect=${encodeURIComponent('/pricing')}`);
      }
    },
    onSettled: () => {
      setLoadingId(null);
      setPendingCard(null);
    },
  });

  function startCheckout(card: PricingCardData) {
    if (!card.productId) return;
    if (!session?.user) {
      router.push(`/sign-in?redirect=${encodeURIComponent('/pricing')}`);
      return;
    }
    if (showPicker) {
      setPendingCard(card);
      return;
    }
    setLoadingId(card.id);
    checkoutMutation.mutate({ card });
  }

  return (
    <div className="space-y-8">
      {groups.length > 1 && (
        <div className="flex justify-center px-2">
          <div className="inline-flex max-w-full flex-wrap items-center justify-center rounded-full border border-white/10 bg-white/5 p-1">
            {groups.map((group) => (
              <button
                key={group.key}
                type="button"
                onClick={() => setActiveGroup(group.key)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  activeGroup === group.key
                    ? 'bg-amber-300 text-slate-950'
                    : 'text-slate-300 hover:text-white'
                )}
              >
                {group.label}
                {group.saveLabel && (
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase',
                      activeGroup === group.key
                        ? 'bg-slate-950/15 text-slate-950'
                        : 'bg-amber-300/15 text-amber-200'
                    )}
                  >
                    {group.saveLabel}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="px-4 text-center text-sm text-slate-400">
        {currentGroup?.trustLine}
      </p>

      <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {currentGroup?.cards.map((card) => (
          <PricingCard
            key={card.id}
            card={card}
            loading={loadingId === card.id}
            processingLabel={processingLabel}
            onCheckout={startCheckout}
          />
        ))}
      </div>

      <PaymentProviderModal
        open={!!pendingCard}
        onOpenChange={(open) => {
          if (!open) setPendingCard(null);
        }}
        providers={providers}
        loadingProvider={
          pendingCard && loadingId === pendingCard.id
            ? (checkoutMutation.variables?.provider ?? null)
            : null
        }
        onSelect={(provider) => {
          if (!pendingCard) return;
          setLoadingId(pendingCard.id);
          checkoutMutation.mutate({ card: pendingCard, provider });
        }}
        planName={pendingCard?.name}
        price={pendingCard?.price}
      />
    </div>
  );
}

function PricingCard({
  card,
  loading,
  processingLabel,
  onCheckout,
}: {
  card: PricingCardData;
  loading: boolean;
  processingLabel: string;
  onCheckout: (card: PricingCardData) => void;
}) {
  const [openModel, setOpenModel] = useState<string | null>(null);

  return (
    <article
      className={cn(
        'chat-surface relative flex flex-col p-6',
        card.featured &&
          'border-amber-300/45 shadow-[0_12px_32px_rgba(250,204,66,0.08)]'
      )}
    >
      {(card.badge || card.discountBadge) && (
        <div className="mb-3 flex flex-wrap gap-2">
          {card.badge && (
            <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] text-amber-200 uppercase">
              {card.badge}
            </span>
          )}
          {card.discountBadge && (
            <span className="rounded-full bg-amber-300/15 px-2.5 py-1 text-[11px] font-semibold text-amber-200">
              {card.discountBadge}
            </span>
          )}
        </div>
      )}

      <h3 className="text-lg font-bold text-slate-100">{card.name}</h3>
      <p className="mt-1 text-sm text-slate-400">{card.description}</p>

      <div className="mt-5 flex items-baseline gap-1">
        <span className="text-4xl font-bold tracking-tight text-slate-50">
          {card.price}
        </span>
        {card.priceSuffix && (
          <span className="text-sm text-slate-400">{card.priceSuffix}</span>
        )}
      </div>
      {(card.originalPrice || card.billedHint) && (
        <p className="mt-1 text-xs text-slate-500">
          {card.originalPrice && (
            <span className="mr-2 line-through">{card.originalPrice}</span>
          )}
          {card.billedHint}
        </p>
      )}

      {card.href ? (
        <Link
          href={card.href}
          className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-amber-300 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
        >
          {card.cta}
        </Link>
      ) : (
        <button
          type="button"
          disabled={loading || !card.productId}
          onClick={() => onCheckout(card)}
          className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-amber-300 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:opacity-60"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? processingLabel : card.cta}
        </button>
      )}

      <ul className="mt-6 space-y-2.5 text-sm text-slate-300">
        <li className="flex items-start gap-2">
          <Check className="mt-0.5 size-4 shrink-0 text-amber-300" />
          {card.creditsLabel}
        </li>
        <li className="flex items-start gap-2">
          <Check className="mt-0.5 size-4 shrink-0 text-amber-300" />
          {card.imagesLabel}
        </li>
      </ul>

      {card.models.length > 0 && (
        <div className="mt-3 space-y-1">
          {card.models.map((model) => {
            const open = openModel === model.name;
            return (
              <div key={model.name}>
                <button
                  type="button"
                  onClick={() => setOpenModel(open ? null : model.name)}
                  className="flex w-full items-center justify-between rounded-lg px-1 py-1.5 text-left text-sm text-slate-300 hover:text-white"
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs">
                      {model.name}
                    </span>
                  </span>
                  <ChevronDown
                    className={cn(
                      'size-4 text-slate-500 transition',
                      open && 'rotate-180'
                    )}
                  />
                </button>
                {open && (
                  <ul className="mb-2 space-y-1 pl-1 text-xs text-slate-400">
                    {model.lines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
        {card.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-amber-300" />
            {feature}
          </li>
        ))}
      </ul>
    </article>
  );
}
