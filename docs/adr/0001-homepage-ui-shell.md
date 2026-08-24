# ADR-0001: Ship the homepage as a UI shell before the generation backend exists

**Status:** Accepted
**Date:** 2026-08-24

## Context

The product homepage (`/`) must move from the generic ShipAny template to the product-specific ChatToImage homepage specified in `docs/designs/homepage-cro-plan.md` and prototyped in `src/routes/prototype/finalized.html`.

The image-generation backend does **not** exist yet: AI providers (`src/core/ai/*`) are implemented but never registered (`aiManager.addProvider` has no callers), the `ai-tasks` service has zero callers, and no API route generates an image. Free signup credits are admin-configurable (`initial_credits_enabled` / `initial_credits_amount`) and default to 0/off.

## Decision

Deliver the homepage as a **marketing page + generator UI shell**: full visual, copy, and interactivity, with the actual generation API call stubbed and the backend pipeline deferred to a later phase.

1. **Depth** — UI shell, not wired generation. The generator plays a local `creating → ready` animation; all five result states are implemented but error/timeout/rejection are only reachable via a dev toggle.
2. **i18n** — English complete + Chinese in sync, under a **new `home.*` namespace** (per the "own translation namespace" rule in AGENTS.md). Upstream `landing.*` keys are never edited.
3. **Example images** — CSS/placeholder art for now (matching the prototype). Real reproducible outputs are a pre-launch requirement, not this phase.
4. **Theme scope** — Instant Canvas visual is applied to the homepage only, via a `.home-root` scope and a dedicated stylesheet. `globals.css` and all internal pages (auth/settings/admin) stay untouched.
5. **Prototype-only features** — the reference-picture upload bay, style shortcuts (Auto/Photo/Illustration), and the "Settings" button are kept as **pure visual stubs** (no real upload, no effect on generation).
6. **Free credits copy** — no hardcoded number. Every `{free_credit_amount}` placeholder becomes "starter credits". The public-config API is not modified.
7. **Auth round-trip** — clicking Generate while signed out persists `{prompt, ratio, style}` to localStorage, redirects to `/sign-in`, and restores the inputs on return, before playing the local animation. (Auth itself is already wired.)

## Consequences

Deferred (out of scope here, still required before production launch): the generation backend pipeline (API route → provider → poll → credit consume/revoke → storage), analytics instrumentation (the 13-event funnel), real example images, self-hosted WOFF2 fonts, and a concrete free-credit number.

Code stays inside `src/blocks/custom/`, `src/components/custom/`, a new `src/styles/home.css`, and a rewritten `src/routes/index.tsx`. No upstream-owned `blocks/*` / `components/*` files, `globals.css`, DB schema, or `landing.*` keys are modified.
