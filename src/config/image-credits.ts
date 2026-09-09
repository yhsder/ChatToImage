/**
 * Image generation Credit costs. Shared by the server (charge) and the
 * client (preview). Values come from docs/pricing-strategy.md.
 */

export type ImageResolution = '1K' | '2K' | '4K';

export const QUALITY_TO_RESOLUTION: Record<string, ImageResolution> = {
  standard: '1K',
  medium: '2K',
  high: '4K',
};

const GPT_IMAGE_2_COSTS: Record<ImageResolution, number> = {
  '1K': 3,
  '2K': 5,
  '4K': 8,
};
const NANO_BANANA_PRO_COSTS: Record<ImageResolution, number> = {
  '1K': 8,
  '2K': 8,
  '4K': 14,
};

const MODEL_COSTS: Record<string, Record<ImageResolution, number>> = {
  'gpt-image-2-image-to-image': GPT_IMAGE_2_COSTS,
  'gpt-image-2-text-to-image': GPT_IMAGE_2_COSTS,
  'nano-banana-pro': NANO_BANANA_PRO_COSTS,
};

export const LIVE_IMAGE_MODELS = [
  { id: 'gpt-image-2', name: 'GPT Image 2', costs: GPT_IMAGE_2_COSTS },
  {
    id: 'nano-banana-pro',
    name: 'Nano Banana Pro',
    costs: NANO_BANANA_PRO_COSTS,
  },
] as const;

export const REFERENCE_IMAGE_COST = GPT_IMAGE_2_COSTS['1K'];
export const FREE_TRIAL = { credits: 8, days: 7 } as const;

export function resolveImageResolution(
  qualityOrResolution: string
): ImageResolution {
  if (qualityOrResolution in QUALITY_TO_RESOLUTION) {
    return QUALITY_TO_RESOLUTION[qualityOrResolution];
  }
  if (
    qualityOrResolution === '1K' ||
    qualityOrResolution === '2K' ||
    qualityOrResolution === '4K'
  ) {
    return qualityOrResolution;
  }
  return '1K';
}

export function getImageCreditCost(
  model: string,
  qualityOrResolution: string
): number {
  const costs = MODEL_COSTS[model];
  if (!costs) {
    throw new Error(`Unknown image model: ${model}`);
  }
  return costs[resolveImageResolution(qualityOrResolution)];
}

export function maxImagesForCredits(credits: number, cost: number): number {
  if (cost <= 0) return 0;
  return Math.floor(credits / cost);
}
