import { createRouter } from '@tanstack/react-router';

import { deLocalizeUrl, localizeUrl } from '@/paraglide/runtime.js';

import { routeTree } from './routeTree.gen';

// Tracks whether the router has finished its first render, so scroll
// restoration can skip the initial page load (see scrollRestoration below).
let hasRenderedOnce = false;

export function getRouter() {
  const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: () => {
      // Skip scroll restoration on the first render: the browser already
      // starts at the top, and forcing scrollTo(0,0) after hydration would
      // yank a user who has already scrolled back to the top.
      if (hasRenderedOnce) return true;
      hasRenderedOnce = true;
      return false;
    },
    // Paraglide owns locale prefixes: incoming URLs are de-localized before
    // matching (routes are locale-free), outgoing hrefs get re-localized.
    rewrite: {
      input: ({ url }) => deLocalizeUrl(url),
      output: ({ url }) => localizeUrl(url),
    },
  });
  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
