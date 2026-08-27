import { createFileRoute } from '@tanstack/react-router';

import { AIMediaType } from '@/core/ai';
import { getAuth } from '@/core/auth';
import {
  AITaskStatus,
  createTask,
  findTask,
  updateTask,
} from '@/modules/ai-tasks/service';
import { getAiManager } from '@/modules/ai/service';
import { respData, respErr } from '@/lib/resp';

// Flat cost for every image generation (quality maps to resolution, not price).
const IMAGE_COST_CREDITS = 5;

// quality → KIE resolution. Both supported image models accept 1K/2K/4K.
const QUALITY_TO_RESOLUTION: Record<string, string> = {
  standard: '1K',
  medium: '2K',
  high: '4K',
};

/**
 * POST /api/ai/image — submit an image-to-image generation.
 * Body: { prompt, image_url, model, quality?, ratio? }
 * Returns the internal task id; the client polls GET with it.
 */
async function POST({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const body = await request.json().catch(() => ({}));
    const prompt = String(body?.prompt ?? '').trim();
    const imageUrl = String(body?.image_url ?? '').trim();
    const model = String(body?.model ?? '').trim();
    const quality = String(body?.quality ?? 'standard');
    const ratio = String(body?.ratio ?? '1:1');

    if (!prompt) return respErr('prompt is required');
    if (!imageUrl) return respErr('image_url is required');
    if (!model) return respErr('model is required');

    const resolution = QUALITY_TO_RESOLUTION[quality] ?? '1K';

    const manager = await getAiManager();
    const kie = manager.getProvider('kie');
    if (!kie) return respErr('KIE is not configured');

    // Deduct credits and persist the task in one transaction.
    const task = await createTask({
      userId: session.user.id,
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

      return respData({ taskId: task.id, status: 'processing' });
    } catch (error: any) {
      // Refund credits when the provider call fails before producing a task.
      await updateTask({ taskId: task.id, status: AITaskStatus.FAILED }).catch(
        () => {}
      );
      return respErr(error?.message || 'generate image failed');
    }
  } catch (error: any) {
    return respErr(error?.message || 'generate image failed');
  }
}

/**
 * GET /api/ai/image?taskId=<internal task id> — poll generation result.
 * Returns { status, images? } where status ∈ pending|processing|success|failed.
 */
async function GET({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    if (!taskId) return respErr('taskId is required');

    const task = await findTask(taskId);
    if (!task || task.userId !== session.user.id) {
      return respErr('Task not found');
    }
    if (!task.taskId) return respErr('Task has no provider task id');

    const manager = await getAiManager();
    const kie = manager.getProvider('kie');
    if (!kie || !kie.query) return respErr('KIE is not configured');

    const result = await kie.query({
      taskId: task.taskId,
      mediaType: AIMediaType.IMAGE,
    });

    const status = String(result.taskStatus);
    switch (status) {
      case 'success': {
        const images = (result.taskInfo?.images ?? [])
          .map((image) => image.imageUrl)
          .filter((url): url is string => Boolean(url));
        await updateTask({
          taskId,
          status: AITaskStatus.SUCCESS,
          taskResult: { images },
        });
        return respData({ status, images });
      }
      case 'failed': {
        const errorMessage = result.taskInfo?.errorMessage;
        await updateTask({
          taskId,
          status: AITaskStatus.FAILED,
          taskResult: { errorMessage },
        });
        return respData({ status, errorMessage });
      }
      default:
        return respData({ status });
    }
  } catch (error: any) {
    return respErr(error?.message || 'query image failed');
  }
}

export const Route = createFileRoute('/api/ai/image')({
  server: {
    handlers: { POST, GET },
  },
});
