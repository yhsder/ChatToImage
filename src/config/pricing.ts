/**
 * Authoritative pricing catalog.
 *
 * The checkout API uses this as the SOURCE OF TRUTH for price/credits/duration.
 * Any price, credits, or plan info sent by the client is IGNORED — only the
 * product_id is honored, and everything else is looked up here.
 *
 * To change pricing, edit this file and redeploy. Admin UI cannot alter prices.
 */

import { PaymentInterval, PaymentType } from '@/core/payment/types';

export type PricingPlanInfo = {
  name: string;
  interval: PaymentInterval;
  intervalCount: number;
};

export type PricingProduct = {
  productId: string;
  productName: string;
  planName: string;
  description: string;
  type: PaymentType;
  priceInCents: number;
  currency: string;
  credits: number;
  creditsValidDays?: number;
  plan?: PricingPlanInfo;
};

const USD = 'usd';

export const pricingCatalog: Record<string, PricingProduct> = {
  starter_monthly: {
    productId: 'starter_monthly',
    productName: 'Starter',
    planName: 'Starter',
    description: 'Starter Monthly',
    type: PaymentType.SUBSCRIPTION,
    priceInCents: 990,
    currency: USD,
    credits: 300,
    creditsValidDays: 31,
    plan: {
      name: 'Starter',
      interval: PaymentInterval.MONTH,
      intervalCount: 1,
    },
  },
  creator_monthly: {
    productId: 'creator_monthly',
    productName: 'Creator',
    planName: 'Creator',
    description: 'Creator Monthly',
    type: PaymentType.SUBSCRIPTION,
    priceInCents: 1990,
    currency: USD,
    credits: 750,
    creditsValidDays: 31,
    plan: {
      name: 'Creator',
      interval: PaymentInterval.MONTH,
      intervalCount: 1,
    },
  },
  pro_monthly: {
    productId: 'pro_monthly',
    productName: 'Pro',
    planName: 'Pro',
    description: 'Pro Monthly',
    type: PaymentType.SUBSCRIPTION,
    priceInCents: 4990,
    currency: USD,
    credits: 2500,
    creditsValidDays: 31,
    plan: {
      name: 'Pro',
      interval: PaymentInterval.MONTH,
      intervalCount: 1,
    },
  },
  starter_yearly: {
    productId: 'starter_yearly',
    productName: 'Starter',
    planName: 'Starter',
    description: 'Starter Yearly',
    type: PaymentType.SUBSCRIPTION,
    priceInCents: 9900,
    currency: USD,
    credits: 3600,
    creditsValidDays: 365,
    plan: {
      name: 'Starter',
      interval: PaymentInterval.YEAR,
      intervalCount: 1,
    },
  },
  creator_yearly: {
    productId: 'creator_yearly',
    productName: 'Creator',
    planName: 'Creator',
    description: 'Creator Yearly',
    type: PaymentType.SUBSCRIPTION,
    priceInCents: 19900,
    currency: USD,
    credits: 9000,
    creditsValidDays: 365,
    plan: {
      name: 'Creator',
      interval: PaymentInterval.YEAR,
      intervalCount: 1,
    },
  },
  pro_yearly: {
    productId: 'pro_yearly',
    productName: 'Pro',
    planName: 'Pro',
    description: 'Pro Yearly',
    type: PaymentType.SUBSCRIPTION,
    priceInCents: 49900,
    currency: USD,
    credits: 30000,
    creditsValidDays: 365,
    plan: {
      name: 'Pro',
      interval: PaymentInterval.YEAR,
      intervalCount: 1,
    },
  },
  pack_small: {
    productId: 'pack_small',
    productName: 'Small',
    planName: 'Small',
    description: 'Small Credit Pack',
    type: PaymentType.ONE_TIME,
    priceInCents: 1490,
    currency: USD,
    credits: 300,
    creditsValidDays: 365,
  },
  pack_medium: {
    productId: 'pack_medium',
    productName: 'Medium',
    planName: 'Medium',
    description: 'Medium Credit Pack',
    type: PaymentType.ONE_TIME,
    priceInCents: 2990,
    currency: USD,
    credits: 750,
    creditsValidDays: 365,
  },
  pack_large: {
    productId: 'pack_large',
    productName: 'Large',
    planName: 'Large',
    description: 'Large Credit Pack',
    type: PaymentType.ONE_TIME,
    priceInCents: 7490,
    currency: USD,
    credits: 2500,
    creditsValidDays: 365,
  },
};

export function getPricingProduct(productId: string): PricingProduct | null {
  if (!productId) return null;
  return pricingCatalog[productId] ?? null;
}

export function listPricingProducts(): PricingProduct[] {
  return Object.values(pricingCatalog);
}
