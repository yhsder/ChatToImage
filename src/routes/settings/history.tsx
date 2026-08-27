import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Download, ImagePlus, LoaderCircle } from 'lucide-react';

import { apiGet } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type HistoryItem = {
  id: string;
  model: string;
  prompt: string;
  status: string;
  costCredits: number;
  createdAt: string;
  images: string[];
  errorMessage?: string;
};

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

function statusLabel(status: string): string {
  switch (status) {
    case 'success':
      return m['settings.history.status_success']();
    case 'failed':
      return m['settings.history.status_failed']();
    case 'processing':
      return m['settings.history.status_processing']();
    case 'pending':
      return m['settings.history.status_pending']();
    default:
      return status;
  }
}

function statusVariant(status: string): BadgeVariant {
  switch (status) {
    case 'success':
      return 'default';
    case 'failed':
      return 'destructive';
    default:
      return 'secondary';
  }
}

function HistoryCard({ item }: { item: HistoryItem }) {
  const thumb = item.images[0];

  return (
    <Card className="overflow-hidden">
      <div className="bg-muted relative aspect-square">
        {thumb ? (
          <img
            src={thumb}
            alt={item.prompt}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            <ImagePlus className="size-8" />
          </div>
        )}
        <Badge
          variant={statusVariant(item.status)}
          className="absolute top-2 left-2"
        >
          {statusLabel(item.status)}
        </Badge>
      </div>
      <CardContent className="space-y-3 pt-4">
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {item.prompt}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs">
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
          {thumb && (
            <a
              href={thumb}
              download
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'gap-1.5'
              )}
            >
              <Download className="size-3.5" />
              {m['settings.history.download']()}
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function HistoryPage() {
  const query = useQuery({
    queryKey: ['ai-tasks', 'image'],
    queryFn: () => apiGet<HistoryItem[]>('/api/ai/tasks'),
  });

  const items = query.data ?? [];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">{m['settings.history.title']()}</h1>
        <p className="text-muted-foreground">
          {m['settings.history.description']()}
        </p>
      </div>

      {query.isPending ? (
        <div className="text-muted-foreground flex items-center gap-2">
          <LoaderCircle className="size-4 animate-spin" />
          {m['settings.history.loading']()}
        </div>
      ) : items.length === 0 ? (
        <div className="text-muted-foreground rounded-xl border border-dashed p-10 text-center">
          {m['settings.history.empty']()}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute('/settings/history')({
  component: HistoryPage,
});
