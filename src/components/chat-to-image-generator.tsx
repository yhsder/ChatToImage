'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import AutoPlay from 'embla-carousel-autoplay';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  ImagePlus,
  LoaderCircle,
  LockKeyhole,
  Sparkles,
  Upload,
  WandSparkles,
  X,
  Zap,
} from 'lucide-react';

import { useSession } from '@/core/auth/client';
import { tDynamic } from '@/core/i18n/dynamic';
import { Link } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { useImageGeneration } from '@/hooks/use-image-generation';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const EXAMPLE_PROMPT =
  'A tiny astronaut tending a glowing garden on the moon, cinematic lighting, detailed digital art';

const EXAMPLE_IMAGE = '/generated/moon-garden.png';

// Showcase examples shown in the idle result panel before the first generation.
const PANEL_EXAMPLES = [
  { id: 1, image: '/generated/moon-garden.png' },
  { id: 2, image: '/generated/portrait.png' },
  { id: 3, image: '/generated/nature.png' },
  { id: 4, image: '/generated/poster.png' },
] as const;

type GeneratorStatus = 'example' | 'auth' | 'loading' | 'success' | 'failed';

const RATIOS = [
  { label: '1:1', className: 'aspect-square' },
  { label: '9:16', className: 'aspect-[9/16]' },
  { label: '16:9', className: 'aspect-[16/9]' },
  { label: '3:2', className: 'aspect-[3/2]' },
  { label: '2:3', className: 'aspect-[2/3]' },
] as const;

const QUALITIES = [
  { label: 'standard', message: 'landing.chatImage.standard' },
  { label: 'medium', message: 'landing.chatImage.medium' },
  { label: 'high', message: 'landing.chatImage.high' },
] as const;

const MODELS = [
  {
    id: 'gpt-image-2-image-to-image',
    name: 'GPT Image 2',
    description: 'Generate from text, or edit with an optional reference',
    Icon: Sparkles,
    accent: 'text-amber-300',
  },
  {
    id: 'nano-banana-pro',
    name: 'nano-banana-pro',
    description: 'Fast generation, optional multi-reference (up to 8 images)',
    Icon: Zap,
    accent: 'text-violet-400',
  },
] as const;

function focusGenerator() {
  document.querySelector('#generator')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
  window.setTimeout(() => {
    document.querySelector<HTMLTextAreaElement>('#image-prompt')?.focus();
  }, 450);
}

export function focusChatToImageGenerator() {
  focusGenerator();
}

export function requestPrompt(prompt: string) {
  window.dispatchEvent(
    new CustomEvent('chat-to-image:prompt', { detail: prompt })
  );
  focusGenerator();
}

export function ChatToImageGenerator() {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState('');
  const [ratio, setRatio] = useState('1:1');
  const [quality, setQuality] = useState('standard');
  const [modelId, setModelId] = useState<string>(MODELS[0].id);
  const [image, setImage] = useState<{
    preview: string;
    name: string;
    file: File;
  } | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const [formHeight, setFormHeight] = useState(0);

  const {
    status: genStatus,
    resultUrl,
    generate,
    retry,
    reset,
  } = useImageGeneration();

  const selectedModel =
    MODELS.find((model) => model.id === modelId) ?? MODELS[0];

  // Derive the display state: the auth prompt, the example preview, or the
  // generation state machine (loading / success / failed) held by the hook.
  const displayStatus: GeneratorStatus = showAuth
    ? 'auth'
    : genStatus === 'idle'
      ? 'example'
      : genStatus;

  const isBusy = genStatus === 'loading';
  const canGenerate = prompt.trim().length > 0 && !isBusy;

  useLayoutEffect(() => {
    const el = formRef.current;
    if (!el) return;
    const sync = () => setFormHeight(el.getBoundingClientRect().height);
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem('chat-to-image:generator');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as {
          prompt?: string;
          ratio?: string;
          modelId?: string;
        };
        if (parsed.prompt) setPrompt(parsed.prompt);
        if (
          parsed.ratio &&
          RATIOS.some((item) => item.label === parsed.ratio)
        ) {
          setRatio(parsed.ratio);
        }
        if (
          parsed.modelId &&
          MODELS.some((item) => item.id === parsed.modelId)
        ) {
          setModelId(parsed.modelId);
        }
      } catch {
        sessionStorage.removeItem('chat-to-image:generator');
      }
    }

    const handlePrompt = (event: Event) => {
      const nextPrompt = (event as CustomEvent<string>).detail;
      if (!nextPrompt) return;
      setPrompt(nextPrompt);
      setShowAuth(false);
      reset();
    };

    window.addEventListener('chat-to-image:prompt', handlePrompt);
    return () => {
      window.removeEventListener('chat-to-image:prompt', handlePrompt);
    };
  }, [reset]);

  function handleGenerate() {
    if (!canGenerate) return;

    sessionStorage.setItem(
      'chat-to-image:generator',
      JSON.stringify({ prompt, ratio, modelId })
    );

    if (!session?.user) {
      setShowAuth(true);
      return;
    }

    void generate({
      prompt,
      image: image?.file ?? null,
      model: modelId,
      quality,
      ratio,
    });
  }

  function handleRetry() {
    void retry();
  }

  function handleImageSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setImage((prev) => {
      if (prev?.preview.startsWith('blob:')) URL.revokeObjectURL(prev.preview);
      return { preview: URL.createObjectURL(file), name: file.name, file };
    });
    event.target.value = '';
  }

  function handleRemoveImage() {
    setImage((prev) => {
      if (prev?.preview.startsWith('blob:')) URL.revokeObjectURL(prev.preview);
      return null;
    });
  }

  return (
    <section
      id="generator"
      className="chat-section relative overflow-hidden border-b border-white/10 pt-8 pb-20 sm:pt-12 sm:pb-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(900px_420px_at_50%_0,rgba(250,204,66,0.14),transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="chat-eyebrow">{m['landing.chatImage.eyebrow']()}</p>
          <h1 className="mt-4 text-4xl leading-[1.1] font-black tracking-[-0.045em] text-slate-50 sm:text-6xl lg:text-7xl">
            {m['landing.chatImage.title']()}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            {m['landing.chatImage.subheadline']()}
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-xl border border-white/10 bg-[#11141c] px-3 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.22)] sm:px-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-amber-300/25 bg-amber-300/10 text-amber-300">
              <Sparkles className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold tracking-[0.16em] text-amber-300 uppercase">
                {m['landing.chatImage.free_credits']()}
              </p>
              <p className="truncate text-xs text-slate-400 sm:text-sm">
                {m['landing.chatImage.failure_reassurance']()}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid items-start gap-4 lg:grid-cols-[minmax(330px,0.9fr)_minmax(0,1.1fr)] lg:gap-5">
          <div
            ref={formRef}
            className="chat-surface relative overflow-hidden p-4 sm:p-5"
          >
            <div className="chat-surface-line" />
            <div className="relative z-10 space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="chat-label">
                    <span className="chat-label-mark" />
                    {m['landing.chatImage.model']()}
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex h-14 w-full items-center justify-between rounded-xl border border-white/10 bg-slate-950/45 px-4 text-left transition-all hover:border-amber-300/40 hover:bg-slate-950/65">
                    <span className="flex min-w-0 items-center">
                      <span className="mr-3 flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 p-1.5">
                        <selectedModel.Icon
                          className={cn('size-5', selectedModel.accent)}
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-base leading-tight font-medium text-slate-50">
                          {selectedModel.name}
                        </span>
                        <span className="mt-0.5 block truncate text-sm leading-tight text-slate-400">
                          {selectedModel.description}
                        </span>
                      </span>
                    </span>
                    <ChevronDown className="ml-3 size-4 shrink-0 text-slate-400" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    sideOffset={6}
                    className="bg-slate-900/95 p-1.5 text-slate-100 ring-white/10"
                  >
                    {MODELS.map((model) => {
                      const selected = model.id === modelId;
                      return (
                        <DropdownMenuItem
                          key={model.id}
                          onClick={() => setModelId(model.id)}
                          className={cn(
                            'flex items-center gap-3 rounded-lg py-2.5 focus:bg-slate-800/70 focus:text-slate-100',
                            selected && 'bg-slate-800/70'
                          )}
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 p-1">
                            <model.Icon
                              className={cn('size-4', model.accent)}
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-slate-100">
                              {model.name}
                            </span>
                            <span className="block truncate text-xs text-slate-400">
                              {model.description}
                            </span>
                          </span>
                          {selected && (
                            <Check className="size-4 shrink-0 text-amber-300" />
                          )}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="chat-label">
                    <span className="chat-label-mark" />
                    {m['landing.chatImage.image_label']()}
                  </span>
                </div>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                {image ? (
                  <div className="group relative overflow-hidden rounded-xl border border-white/10">
                    <img
                      src={image.preview}
                      alt={image.name}
                      className="h-32 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      aria-label={m['landing.chatImage.image_remove']()}
                      className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-slate-950/70 text-slate-200 backdrop-blur transition hover:bg-slate-950/90 hover:text-white"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="group relative flex h-28 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/15 bg-slate-950/30 transition-all duration-300 hover:border-amber-300/40 hover:bg-slate-900/50"
                  >
                    <span className="mb-2 flex size-9 items-center justify-center rounded-full bg-amber-300/10 transition-all duration-200">
                      <Upload className="size-5 text-amber-300" />
                    </span>
                    <span className="text-sm font-medium text-slate-300">
                      {m['landing.chatImage.image_upload_hint']()}
                    </span>
                    <span className="mt-1 text-xs text-slate-400">
                      {m['landing.chatImage.image_upload_formats']()}
                    </span>
                  </button>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="image-prompt" className="chat-label">
                    <span className="chat-label-mark" />
                    {m['landing.chatImage.prompt_label']()}
                  </label>
                  <button
                    type="button"
                    onClick={() => requestPrompt(EXAMPLE_PROMPT)}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-amber-300"
                  >
                    <WandSparkles className="size-3.5 text-amber-300/80" />
                    {m['landing.chatImage.try_examples']()}
                  </button>
                </div>
                <textarea
                  id="image-prompt"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder={m['landing.chatImage.prompt_placeholder']()}
                  maxLength={5000}
                  className="chat-input min-h-32 w-full resize-none"
                />
                <div className="mt-2 flex items-start justify-between gap-4 text-xs text-slate-500">
                  <span>{m['landing.chatImage.prompt_helper']()}</span>
                  <span className="shrink-0 tabular-nums">
                    {prompt.length}/5000
                  </span>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="chat-label">
                    <span className="chat-label-mark" />
                    {m['landing.chatImage.aspect_ratio']()}
                  </span>
                  <span className="rounded-full border border-white/10 bg-slate-950/60 px-2.5 py-1 text-[11px] text-slate-400">
                    {m['landing.chatImage.standard']()}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {RATIOS.map((item) => {
                    const selected = ratio === item.label;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setRatio(item.label)}
                        className={cn(
                          'relative flex aspect-square min-w-0 flex-col items-center justify-center rounded-xl border px-1 text-center transition-all',
                          selected
                            ? 'border-amber-300 bg-amber-300/10 text-amber-100 shadow-[0_0_0_1px_rgba(250,204,66,0.2)]'
                            : 'border-white/10 bg-slate-950/55 text-slate-400 hover:border-amber-300/40 hover:text-slate-200'
                        )}
                      >
                        {selected && (
                          <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-amber-300 text-slate-950">
                            <Check className="size-2.5" />
                          </span>
                        )}
                        <span
                          className={cn(
                            'mb-1.5 block rounded border-2',
                            item.className,
                            selected
                              ? 'border-amber-300 bg-amber-300/20'
                              : 'border-slate-600 bg-slate-700/40'
                          )}
                          style={{ width: '1.1rem', maxHeight: '1.35rem' }}
                        />
                        <span className="text-[11px] font-medium">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="chat-label">
                    <span className="chat-label-mark" />
                    {m['landing.chatImage.quality']()}
                  </span>
                  <span className="text-xs text-slate-500">
                    {m['landing.chatImage.credits']({ count: 5 })}
                  </span>
                </div>
                <div className="flex gap-2">
                  {QUALITIES.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setQuality(item.label)}
                      className={cn(
                        'chat-choice',
                        quality === item.label && 'is-selected'
                      )}
                    >
                      {tDynamic(item.message)}
                    </button>
                  ))}
                </div>
              </div>

              {displayStatus === 'auth' && (
                <div className="rounded-xl border border-amber-300/25 bg-amber-300/10 p-3 text-sm text-amber-100">
                  <div className="flex items-start gap-2">
                    <LockKeyhole className="mt-0.5 size-4 shrink-0 text-amber-300" />
                    <div>
                      <p className="font-semibold">
                        {m['landing.chatImage.auth_title']()}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-amber-100/70">
                        {m['landing.chatImage.auth_message']()}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Link href="/sign-up" className="chat-mini-button">
                          {m['landing.chatImage.create_account']()}
                          <ArrowRight className="size-3.5" />
                        </Link>
                        <Link href="/sign-in" className="chat-text-link">
                          {m['landing.chatImage.sign_in']()}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="button"
                  disabled={!canGenerate}
                  onClick={handleGenerate}
                  className="chat-primary-button w-full"
                >
                  {isBusy ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Zap className="size-4" />
                  )}
                  <span>{m['landing.chatImage.generate_my_image']()}</span>
                </button>
                <p className="mt-2 text-center text-xs text-slate-500">
                  {m['landing.chatImage.failure_reassurance']()}
                </p>
              </div>
            </div>
          </div>

          <div
            className="chat-surface relative flex min-h-[420px] flex-col overflow-hidden px-4 pt-4 pb-5 sm:px-6 lg:h-[var(--form-h)] lg:min-h-0"
            style={
              formHeight
                ? ({ '--form-h': `${formHeight}px` } as CSSProperties)
                : undefined
            }
          >
            <div className="chat-surface-line" />
            <div className="relative flex min-h-0 flex-1 flex-col">
              {displayStatus === 'loading' ? (
                <div className="flex min-h-[280px] flex-1 flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-950/45 p-6 text-center lg:min-h-0">
                  <div className="flex size-14 items-center justify-center rounded-full border border-amber-300/20 bg-amber-300/10 text-amber-300">
                    <LoaderCircle className="size-6 animate-spin" />
                  </div>
                  <h2 className="mt-5 text-lg font-semibold text-slate-100">
                    {m['landing.chatImage.creating_title']()}
                  </h2>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
                    {m['landing.chatImage.creating_message']()}
                  </p>
                </div>
              ) : displayStatus === 'auth' ? (
                <div className="flex min-h-[280px] flex-1 flex-col items-center justify-center rounded-2xl border border-amber-300/15 bg-amber-300/[0.04] p-6 text-center lg:min-h-0">
                  <LockKeyhole className="size-8 text-amber-300" />
                  <h2 className="mt-5 text-lg font-semibold text-slate-100">
                    {m['landing.chatImage.auth_title']()}
                  </h2>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                    {m['landing.chatImage.auth_message']()}
                  </p>
                </div>
              ) : displayStatus === 'failed' ? (
                <div className="flex min-h-[280px] flex-1 flex-col items-center justify-center rounded-2xl border border-red-300/15 bg-red-300/[0.04] p-6 text-center lg:min-h-0">
                  <ImagePlus className="size-8 text-amber-300" />
                  <h2 className="mt-5 text-lg font-semibold text-slate-100">
                    {m['landing.chatImage.failure_title']()}
                  </h2>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                    {m['landing.chatImage.failure_message']()}
                  </p>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="chat-secondary-button mt-5"
                  >
                    {m['landing.chatImage.try_again']()}
                  </button>
                </div>
              ) : displayStatus === 'success' ? (
                <>
                  <div className="relative min-h-[280px] flex-1 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/45 lg:min-h-0">
                    <img
                      src={resultUrl ?? EXAMPLE_IMAGE}
                      alt={prompt}
                      className="absolute inset-0 size-full object-cover"
                    />
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <a
                      href={resultUrl ?? EXAMPLE_IMAGE}
                      download="chat-to-image-result.png"
                      className="chat-secondary-button"
                    >
                      <Download className="size-4" />
                      {m['landing.chatImage.download']()}
                    </a>
                  </div>
                </>
              ) : (
                <IdleExamplesCarousel />
              )}
            </div>
            <p className="mt-5 text-center text-xs text-slate-500">
              {m['landing.chatImage.preview_disclosure']()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function IdleExamplesCarousel() {
  const autoplay = useRef(
    AutoPlay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on('select', onSelect);
    onSelect();
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <div className="flex min-h-[360px] flex-1 flex-col lg:min-h-0">
      <Carousel
        opts={{ loop: true }}
        plugins={[autoplay.current]}
        setApi={setApi}
        className="h-full min-h-0 w-full flex-1 [&>[data-slot=carousel-content]]:size-full"
      >
        <CarouselContent className="-ml-0 h-full items-stretch">
          {PANEL_EXAMPLES.map((example) => {
            const prompt = tDynamic(`landing.examples.${example.id}.prompt`);
            const title = tDynamic(`landing.examples.${example.id}.title`);
            return (
              <CarouselItem
                key={example.id}
                className="relative min-h-[320px] self-stretch pl-0 lg:min-h-0"
              >
                <button
                  type="button"
                  onClick={() => requestPrompt(prompt)}
                  className="group absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/45 text-left"
                >
                  <img
                    src={example.image}
                    alt={title}
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-white">
                        {title}
                      </h3>
                      <p className="mt-1 line-clamp-1 text-xs text-slate-300/80">
                        {prompt}
                      </p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-300/30 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold text-amber-300 backdrop-blur transition group-hover:bg-amber-300 group-hover:text-slate-950">
                      <WandSparkles className="size-3.5" />
                      {m['landing.examples.try_prompt']()}
                    </span>
                  </div>
                </button>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => api?.scrollPrev()}
          aria-label="Previous example"
          className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-slate-950/60 text-slate-300 transition hover:border-amber-300/40 hover:text-amber-300"
        >
          <ChevronLeft className="size-4" />
        </button>
        <div className="flex items-center gap-1.5">
          {PANEL_EXAMPLES.map((example, index) => (
            <button
              key={example.id}
              type="button"
              aria-label={`Example ${index + 1}`}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                'h-1.5 rounded-full transition-all',
                index === selected
                  ? 'w-5 bg-amber-300'
                  : 'w-1.5 bg-white/25 hover:bg-white/50'
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => api?.scrollNext()}
          aria-label="Next example"
          className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-slate-950/60 text-slate-300 transition hover:border-amber-300/40 hover:text-amber-300"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
