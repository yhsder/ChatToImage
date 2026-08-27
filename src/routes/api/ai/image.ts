import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import { pollImage, submitImage } from '@/modules/ai/service';
import { respData, respErr } from '@/lib/resp';

/**
 * POST /api/ai/image — submit an image generation. Body:
 * { prompt, image_url?, model, quality?, ratio? } — `image_url` is optional;
 * omitting it means text-to-image. Returns the internal task id; the client
 * polls GET with it.
 */
async function POST({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const body = await request.json().catch(() => ({}));

    const result = await submitImage({
      userId: session.user.id,
      prompt: String(body?.prompt ?? '').trim(),
      imageUrl: String(body?.image_url ?? '').trim(),
      model: String(body?.model ?? '').trim(),
      quality: String(body?.quality ?? 'standard'),
      ratio: String(body?.ratio ?? '1:1'),
    });

    return respData(result);
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

    const result = await pollImage({ taskId, userId: session.user.id });
    return respData(result);
  } catch (error: any) {
    return respErr(error?.message || 'query image failed');
  }
}

export const Route = createFileRoute('/api/ai/image')({
  server: {
    handlers: { POST, GET },
  },
});
