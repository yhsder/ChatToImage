import { createFileRoute } from '@tanstack/react-router';

import { AIMediaType } from '@/core/ai';
import { getAuth } from '@/core/auth';
import { getTasks } from '@/modules/ai-tasks/service';
import { respData, respErr } from '@/lib/resp';

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
 * GET /api/ai/tasks — list the current user's image generations (history page).
 * No pagination/filter: minimal list of recent image tasks with parsed results.
 */
async function GET({ request }: { request: Request }) {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return respErr('Unauthorized');

  const tasks = await getTasks({
    userId: session.user.id,
    mediaType: AIMediaType.IMAGE,
  });

  const items = tasks.map((task) => ({
    id: task.id,
    model: task.model,
    prompt: task.prompt,
    status: task.status,
    costCredits: task.costCredits,
    createdAt: task.createdAt,
    ...parseTaskResult(task.taskResult),
  }));

  return respData(items);
}

export const Route = createFileRoute('/api/ai/tasks')({
  server: {
    handlers: { GET },
  },
});
