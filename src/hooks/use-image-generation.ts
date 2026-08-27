import { useCallback, useEffect, useRef, useState } from 'react';

import { apiGet, apiPost, apiUpload } from '@/lib/api-client';

export type GenerationStatus = 'idle' | 'loading' | 'success' | 'failed';

export interface GenerateImageInput {
  prompt: string;
  image: File;
  model: string;
  quality: string;
  ratio: string;
}

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 100;

async function uploadImageFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('files', file);

  const result = await apiUpload<{ urls: string[] }>(
    '/api/storage/upload-image',
    formData
  );
  if (!result.urls?.length) {
    throw new Error('Upload failed');
  }
  return result.urls[0];
}

async function pollImageResult(
  taskId: string,
  signal: AbortSignal
): Promise<string[]> {
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    if (signal.aborted) throw new Error('Canceled');

    const result = await apiGet<{ status: string; images?: string[] }>(
      `/api/ai/image?taskId=${encodeURIComponent(taskId)}`,
      { signal }
    );
    if (result.status === 'success') return result.images ?? [];
    if (result.status === 'failed') throw new Error('Generation failed');

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
  throw new Error('Generation timed out');
}

/**
 * Owns the image-generation state machine: upload → submit → poll → result,
 * including abort and retry. Returns the generation status, the result URL, and
 * the actions a caller (the generator form) needs. The caller decides when to
 * run `generate` (e.g. only after an auth check) — the hook stays UI-agnostic.
 */
export function useImageGeneration() {
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const lastInputRef = useRef<GenerateImageInput | null>(null);

  const generate = useCallback(async (input: GenerateImageInput) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    lastInputRef.current = input;

    setStatus('loading');
    setResultUrl(null);

    try {
      const imageUrl = await uploadImageFile(input.image);
      const { taskId } = await apiPost<{ taskId: string }>('/api/ai/image', {
        prompt: input.prompt,
        image_url: imageUrl,
        model: input.model,
        quality: input.quality,
        ratio: input.ratio,
      });
      const images = await pollImageResult(taskId, controller.signal);
      if (images.length === 0) throw new Error('No image returned');
      setResultUrl(images[0]);
      setStatus('success');
    } catch (error) {
      if (controller.signal.aborted) return;
      console.error('generate image failed:', error);
      setStatus('failed');
    }
  }, []);

  const retry = useCallback(() => {
    if (lastInputRef.current) void generate(lastInputRef.current);
  }, [generate]);

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    lastInputRef.current = null;
    setStatus('idle');
    setResultUrl(null);
  }, []);

  useEffect(() => {
    return () => controllerRef.current?.abort();
  }, []);

  return { status, resultUrl, generate, retry, reset };
}
