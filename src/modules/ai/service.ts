import {
  aiManager,
  AIMediaType,
  AITaskStatus,
  KieProvider,
  type AIFile,
  type AIManager,
  type SaveFilesFunction,
} from '@/core/ai';
import {
  createTask,
  findTask,
  getTasks,
  updateTask,
} from '@/modules/ai-tasks/service';
import { getAllConfigs, type ConfigMap } from '@/modules/config/service';
import { getStorage } from '@/modules/storage/service';

/**
 * KIE image-to-image wiring. The API key is DB/env-driven (the admin "AI"
 * setting overrides the KIE_API_KEY env fallback), and successful result
 * images are transferred into custom storage (R2/S3) when configured.
 */
export function isKieConfigured(configs: ConfigMap): boolean {
  return Boolean(configs.kie_api_key);
}

/**
 * Transfer remote AI result files into custom storage via download-and-upload.
 * Returns undefined when storage is not configured, so the provider falls back
 * to the original remote URLs.
 */
function buildSaveFiles(): SaveFilesFunction {
  return async (files: AIFile[]): Promise<AIFile[] | undefined> => {
    const storage = await getStorage();
    if (!storage) return undefined;

    const uploaded: AIFile[] = [];
    for (const file of files) {
      if (!file.url) continue;
      const result = await storage.downloadAndUpload({
        url: file.url,
        key: file.key,
        contentType: file.contentType,
      });
      if (result.success && result.url) {
        uploaded.push({ ...file, url: result.url });
      }
    }
    return uploaded.length ? uploaded : undefined;
  };
}

/**
 * Initialize the global AI manager with the KIE image-to-image provider:
 * register it with its API key and wire result-image transfer into custom
 * storage. Idempotent — safe to call per request.
 */
export async function getAiManager(): Promise<AIManager> {
  if (!aiManager.getProvider('kie')) {
    const configs = await getAllConfigs();
    if (isKieConfigured(configs)) {
      const saveFiles = buildSaveFiles();
      aiManager.setSaveFiles(saveFiles);
      aiManager.addProvider(
        new KieProvider({
          apiKey: configs.kie_api_key,
          customStorage: true,
          saveFiles,
        }),
        true
      );
    }
  }
  return aiManager;
}

// Flat cost for every image generation (quality maps to resolution, not price).
const IMAGE_COST_CREDITS = 5;

// quality → KIE resolution. Both supported image models accept 1K/2K/4K.
const QUALITY_TO_RESOLUTION: Record<string, string> = {
  standard: '1K',
  medium: '2K',
  high: '4K',
};

export interface SubmitImageInput {
  userId: string;
  prompt: string;
  imageUrl: string;
  model: string;
  quality?: string;
  ratio?: string;
}

export interface ImageTaskItem {
  id: string;
  model: string;
  prompt: string;
  status: string;
  costCredits: number;
  createdAt: Date;
  images: string[];
  errorMessage?: string;
}

// Parse a task's JSON `taskResult` into the fields the history page renders.
function parseTaskResult(taskResult: string | null): {
  images: string[];
  errorMessage?: string;
} {
  if (!taskResult) return { images: [] };
  try {
    const parsed = JSON.parse(taskResult);
    const images = Array.isArray(parsed.images)
      ? parsed.images.filter((url: unknown) => typeof url === 'string')
      : [];
    const errorMessage =
      typeof parsed.errorMessage === 'string' ? parsed.errorMessage : undefined;
    return { images, ...(errorMessage ? { errorMessage } : {}) };
  } catch {
    return { images: [] };
  }
}

/**
 * Submit an image-to-image generation: resolve cost, deduct credits and
 * persist the task atomically, then hand off to the KIE provider. Refunds the
 * credits if the provider call fails before producing a task.
 */
export async function submitImage(input: SubmitImageInput): Promise<{
  taskId: string;
  status: string;
}> {
  const {
    userId,
    prompt,
    imageUrl,
    model,
    quality = 'standard',
    ratio = '1:1',
  } = input;

  if (!prompt) throw new Error('prompt is required');
  if (!imageUrl) throw new Error('image_url is required');
  if (!model) throw new Error('model is required');

  const resolution = QUALITY_TO_RESOLUTION[quality] ?? '1K';

  const manager = await getAiManager();
  const kie = manager.getProvider('kie');
  if (!kie) throw new Error('KIE is not configured');

  const task = await createTask({
    userId,
    mediaType: AIMediaType.IMAGE,
    provider: 'kie',
    model,
    prompt,
    costCredits: IMAGE_COST_CREDITS,
  });

  try {
    const generated = await kie.generate({
      params: {
        mediaType: AIMediaType.IMAGE,
        prompt,
        model,
        options: {
          image_input: [imageUrl],
          aspect_ratio: ratio,
          resolution,
        },
      },
    });

    await updateTask({
      taskId: task.id,
      status: AITaskStatus.PROCESSING,
      providerTaskId: generated.taskId,
    });

    return { taskId: task.id, status: 'processing' };
  } catch (error) {
    await updateTask({ taskId: task.id, status: AITaskStatus.FAILED }).catch(
      () => {}
    );
    throw error;
  }
}

/**
 * Poll an image generation's result: verify ownership, query the provider,
 * map the status, and persist the outcome.
 */
export async function pollImage(input: {
  taskId: string;
  userId: string;
}): Promise<{ status: string; images?: string[]; errorMessage?: string }> {
  const { taskId, userId } = input;

  const task = await findTask(taskId);
  if (!task || task.userId !== userId) throw new Error('Task not found');
  if (!task.taskId) throw new Error('Task has no provider task id');

  const manager = await getAiManager();
  const kie = manager.getProvider('kie');
  if (!kie || !kie.query) throw new Error('KIE is not configured');

  const result = await kie.query({
    taskId: task.taskId,
    mediaType: AIMediaType.IMAGE,
  });

  if (result.taskStatus === AITaskStatus.SUCCESS) {
    const images = (result.taskInfo?.images ?? [])
      .map((image) => image.imageUrl)
      .filter((url): url is string => Boolean(url));
    await updateTask({
      taskId,
      status: AITaskStatus.SUCCESS,
      taskResult: { images },
    });
    return { status: 'success', images };
  }

  if (result.taskStatus === AITaskStatus.FAILED) {
    const errorMessage = result.taskInfo?.errorMessage;
    await updateTask({
      taskId,
      status: AITaskStatus.FAILED,
      taskResult: { errorMessage },
    });
    return { status: 'failed', errorMessage };
  }

  return { status: result.taskStatus };
}

/**
 * List the user's image generations with parsed results (history page).
 */
export async function listImages(userId: string): Promise<ImageTaskItem[]> {
  const tasks = await getTasks({ userId, mediaType: AIMediaType.IMAGE });
  return tasks.map((task) => ({
    id: task.id,
    model: task.model,
    prompt: task.prompt,
    status: task.status,
    costCredits: task.costCredits,
    createdAt: task.createdAt,
    ...parseTaskResult(task.taskResult),
  }));
}
