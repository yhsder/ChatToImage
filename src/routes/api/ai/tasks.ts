import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import { listImages } from '@/modules/ai/service';
import { respData, respErr } from '@/lib/resp';

/**
 * GET /api/ai/tasks — list the current user's image generations (history page).
 */
async function GET({ request }: { request: Request }) {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return respErr('Unauthorized');

  const items = await listImages(session.user.id);
  return respData(items);
}

export const Route = createFileRoute('/api/ai/tasks')({
  server: {
    handlers: { GET },
  },
});
