# Homepage Implementation Spec — ChatToImage (UI Shell)

**Status:** Approved (decisions in `docs/adr/0001-homepage-ui-shell.md`)
**Page:** `/` (homepage)
**Last updated:** 2026-08-24

This is the operative spec for implementing the homepage as a **marketing page + generator UI shell**. A fresh session should be able to build from this file plus the referenced sources, without re-grilling.

## 1. Source of truth

Read these before/while building:

- **Visual + layout:** `src/routes/prototype/finalized.html` — the committed `/design-html` preview. This is the exact visual to reproduce (section order, spacing, typography, the generator, result stage, 8 example cards, steps, benefits, pricing rows, FAQ, final CTA, footer, responsive breakpoints).
- **Design tokens:** `DESIGN.md` (Instant Canvas / "Bright Editorial Utility").
- **Approved copy + structure:** `docs/designs/homepage-cro-plan.md`.
- **Hero copy + SEO:** `docs/copy/homepage-hero.md`.

Where the preview and the CRO plan disagree, the **CRO plan / hero copy wins** for wording; the **preview wins** for visual layout. Deviations are listed in §8.

## 2. Delivery boundary

**In scope:** all 10 sections of the homepage, real copy, full interactivity of the generator UI (minus the real API call), scoped Instant Canvas theme, `home.*` i18n (en + zh), auth round-trip.

**Out of scope (deferred):** real generation backend; real reference-image upload; analytics; real example images; self-hosted WOFF2 fonts; a concrete free-credit number.

## 3. Constraints

- Add files, never edit upstream files. New code goes in `src/blocks/custom/`, `src/components/custom/`, `src/styles/home.css`. Rewrite `src/routes/index.tsx` (composition only).
- Do **not** touch `globals.css`, `src/blocks/*` (non-custom), `src/components/*` (non-custom), DB schema, or `landing.*` keys.
- i18n namespace is `home.*` only.
- Do not show a model selector, Features, Blog, dashboard CTA, or the floating support widget.

## 4. File plan

```
src/blocks/custom/
  home-header.tsx          # header: brand + anchors + Sign In (+ Fontshare <link> for Cabinet Grotesk)
  home-hero.tsx            # hero heading/subheadline + renders <HomeGenerator/>
  home-generator.tsx       # generator + result stage + credit note + state machine + auth round-trip
  home-examples.tsx        # 8 example cards (CSS-art placeholders)
  home-how-it-works.tsx    # 3 steps + Try It Now CTA
  home-benefits.tsx        # 3 benefits
  home-pricing.tsx         # compact 3-row pricing + CTA to /pricing
  home-faq.tsx             # 6-question accordion
  home-final-cta.tsx       # final CTA back to generator
  home-footer.tsx          # footer: brand + product/legal links + Sign In + copyright

src/components/custom/
  home-section-heading.tsx # prop-driven: (index, eyebrow, heading, lead) — reused by 5 sections
  home-brand-mark.tsx      # prop-driven: the small square logo mark (header + footer)

src/styles/home.css        # .home-root-scoped Instant Canvas tokens + all homepage component styles

src/routes/index.tsx       # rewritten: compose the blocks, wrapped in .home-root; update head meta
```

`index.tsx` returns roughly:

```tsx
<div className="home-root">
  <HomeHeader />
  <main>
    <HomeHero /> {/* heading + subheadline + <HomeGenerator/> inside */}
    <HomeExamples />
    <HomeHowItWorks />
    <HomeBenefits />
    <HomePricing />
    <HomeFAQ />
    <HomeFinalCta />
  </main>
  <HomeFooter />
</div>
```

Blocks read i18n (`m['home.*']()`); the two components under `components/custom/` take all content via props.

## 5. Theme & fonts (scoped to homepage)

Create `src/styles/home.css`. Scope every selector under `.home-root`. Import it from `index.tsx` (or a home block) so it stays in the homepage bundle only.

**Light tokens** (set as CSS custom properties on `.home-root`):

| var                | value     | var              | value     |
| ------------------ | --------- | ---------------- | --------- |
| `--canvas`         | `#F3F0E8` | `--line`         | `#CFC9BB` |
| `--surface`        | `#FFFDF7` | `--line-strong`  | `#9E9788` |
| `--surface-raised` | `#FFFFFF` | `--signal`       | `#FF5A1F` |
| `--surface-alt`    | `#E9E5DA` | `--signal-hover` | `#E9470C` |
| `--ink`            | `#151511` | `--on-signal`    | `#151511` |
| `--muted`          | `#69675F` | `--success`      | `#18865A` |
| `--faint`          | `#8B877D` | `--error`        | `#C83E32` |
|                    |           | `--info`         | `#2857C5` |

**Dark tokens** under `@media (prefers-color-scheme: dark)` (scoped the same way) — copy the values from the preview `<style>` (lines 50–71).

**Fonts:**

- Display: `'Cabinet Grotesk'` — loaded via a Fontshare `<link>` rendered in `home-header.tsx` (prototype-style; self-host WOFF2 is a pre-launch TODO). Fallback `'Arial Black', sans-serif`.
- Body: `'Source Sans 3'` — `@fontsource/source-sans-3` (add dep, import in a home block). Fallback `'Noto Sans SC', sans-serif`.
- Meta: `'JetBrains Mono'` — `@fontsource/jetbrains-mono` (add dep).

**Other tokens:** page width `1240px`, gutters `20px`/side desktop (8–12px <680px), breakpoints `820px` and `480px`, radii `4px` (controls) / `8px` (frames) / `9999px` (status chips only), base spacing `4px`, easing `cubic-bezier(0.22, 1, 0.36, 1)`. **Only the generator** gets the orange `8px 8px 0 var(--signal)` offset shadow. Honor `prefers-reduced-motion: reduce`.

Port the prototype's component CSS (`.generator`, `.generator-controls`, `.result-stage`, `.example-card` + the 8 `.art-*` placeholder art classes, `.steps`, `.benefit`, `.price-row`, `.faq-item`, `.final-cta`, `.site-footer`, `.toast`, and all `@media` blocks) into `home.css` under `.home-root`.

## 6. Generator: state machine + auth round-trip

### State machine

```ts
type ResultState =
  | 'example'
  | 'creating'
  | 'ready'
  | 'error'
  | 'timeout'
  | 'rejected';
```

- `example` — initial state: labelled "Example output", shows the astronaut placeholder SVG + `Try This Prompt`.
- `creating` — loading overlay with progress bar.
- `ready` — success preview + `Download Image` / `Generate Another`.
- `error` / `timeout` / `rejected` — implemented (copy in §7) but only reachable via a dev toggle (e.g. read `?result=error|timeout|rejected` on mount). Default stub never lands here.

**Stub flow:** Generate (valid prompt) → `creating` for ~1.3s → `ready` (matches the prototype JS, lines 2338–2359). The real API call replaces this animation later.

### Auth round-trip

1. On Generate click, check `useSession()` from `@/core/auth/client`.
2. If signed out: `localStorage.setItem('cti.home-draft', JSON.stringify({ prompt, ratio, style }))`, then navigate to `/sign-in` (locale-aware). Verify the post-auth redirect target in `src/routes/(auth)/sign-in.tsx`; if it defaults to `/settings`, pass a `redirect`/`returnTo` param so the user returns to `/`.
3. On homepage mount (in `home-generator.tsx`), if `cti.home-draft` exists: parse, restore `prompt`/`ratio`/`style`, `removeItem`, focus the prompt.
4. If signed in: play the local animation directly.

### Controls (from the preview)

- Prompt `<textarea>` (maxlength 3000, live counter `n / 3000`, auto-grow, disable Generate when empty).
- Aspect ratio `<select>`: `1:1` / `4:3` / `3:4` / `16:9` (real control).
- Style shortcuts (Auto/Photo/Illustration): visual stub — toggle `is-active`, no other effect.
- Reference-picture bay: visual stub — drag/drop or "+" adds placeholder thumbnails (max 4, with remove), no upload.
- Settings button: visual stub — clicking shows a "stays collapsed" toast.
- `Generate My Image` button + the free-credit / failure-reassurance note below it.
- All page CTAs (`Try It Now`, final CTA, `focus-generator` links) smooth-scroll to and focus the prompt; `Try This Prompt` copies a prompt into the generator.

## 7. i18n — `home.*` keys (add the SAME key set to `en.json` AND `zh.json`)

EN values are authoritative copy; ZH is a faithful translation of each (keep `ChatToImage` untranslated). Button labels may localize naturally.

**nav / header**

- `home.nav.examples` = `Examples`
- `home.nav.how_it_works` = `How It Works`
- `home.nav.pricing` = `Pricing`
- `home.nav.faq` = `FAQ`
- `home.nav.sign_in` = `Sign In`

**hero**

- `home.hero.eyebrow` = `Plain words in · usable image out`
- `home.hero.headline` = `Chat to Image: Turn Text Into AI Images` (split across 3 lines in JSX, not in the message)
- `home.hero.subheadline` = `Describe what you want to see in plain language, choose an aspect ratio, then generate and download your image.`
- `home.hero.cta_support` = `Create a free account to get starter credits.`
- `home.hero.failed_free` = `Failed generations won’t cost you credits.` (rendered strong/green)
- `home.hero.prompt_label` = `Describe your image`
- `home.hero.prompt_helper` = `Include the subject, setting, lighting, and style you want.`
- `home.hero.prompt_placeholder` = `A tiny astronaut tending a glowing garden on the moon, cinematic lighting, detailed digital art`

**generator**

- `home.generator.ratio_label` = `Shape`
- `home.generator.settings_label` = `Settings`
- `home.generator.settings_value` = `Auto · Smart defaults`
- `home.generator.style_label` = `Optional style`
- `home.generator.style_auto` = `Auto`
- `home.generator.style_photo` = `Photo`
- `home.generator.style_illustration` = `Illustration`
- `home.generator.ratio_square` = `1 : 1 · Square`
- `home.generator.ratio_landscape` = `4 : 3 · Landscape`
- `home.generator.ratio_portrait` = `3 : 4 · Portrait`
- `home.generator.ratio_wide` = `16 : 9 · Wide`
- `home.generator.generate` = `Generate My Image`
- `home.generator.creating` = `Creating · please wait`
- `home.generator.reference_limit` = `You can add up to four reference pictures.`
- `home.generator.settings_stub` = `Advanced settings stay collapsed until the user asks for them.`

**result**

- `home.result.example_label` = `Example output`
- `home.result.example_title` = `See the result before you begin.`
- `home.result.prompt_used` = `Prompt used`
- `home.result.try_this` = `Try This Prompt`
- `home.result.loading_title` = `Creating your image`
- `home.result.loading_msg` = `We’re creating your image. Keep this page open while it finishes.`
- `home.result.success_title` = `Your image is ready`
- `home.result.download` = `Download Image`
- `home.result.generate_another` = `Generate Another`
- `home.result.error_title` = `We couldn’t complete this image`
- `home.result.error_msg` = `This attempt won’t cost you any credits. Try again now or adjust your prompt.`
- `home.result.try_again` = `Try Again`
- `home.result.edit_prompt` = `Edit Prompt`
- `home.result.timeout_title` = `This image took too long`
- `home.result.timeout_msg` = `This attempt won’t cost you any credits. Try the same prompt again when you’re ready.`
- `home.result.reject_title` = `This prompt can’t be generated`
- `home.result.reject_msg` = `This attempt won’t cost you any credits. Revise your prompt and try again.`

**examples** (8 categories + 8 prompts — verbatim from the preview)

- `home.examples.heading` = `See What You Can Create`
- `home.examples.lead` = `Explore eight images made with this generator—and see the exact prompt behind each one. Browse product shots, portraits, posters, fantasy scenes, and more.`
- `home.examples.scaffold_left` = `Layout preview only`
- `home.examples.scaffold_right` = `Replace every tile with a verified production output before launch`
- `home.examples.cat_product` = `Product` / `home.examples.prompt_product` = `A sculptural orange chair in a quiet sunlit room, editorial product photography.`
- `home.examples.cat_portrait` = `Portrait` / `home.examples.prompt_portrait` = `A cinematic portrait of a ceramic artist in a deep green studio, soft window light.`
- `home.examples.cat_fantasy` = `Fantasy` / `home.examples.prompt_fantasy` = `A lone traveler approaching a white tower beneath two moons, quiet cinematic fantasy.`
- `home.examples.cat_illustration` = `Illustration` / `home.examples.prompt_illustration` = `A cheerful orange cat riding a bicycle, bold ink shapes and warm editorial colors.`
- `home.examples.cat_poster` = `Poster` / `home.examples.prompt_poster` = `A modern exhibition poster for “FORM / LIGHT,” strict Swiss grid, orange and black.`
- `home.examples.cat_interior` = `Interior` / `home.examples.prompt_interior` = `A calm reading room with a green sofa, linen curtains, warm afternoon light, architectural photography.`
- `home.examples.cat_nature` = `Nature` / `home.examples.prompt_nature` = `Morning mist over layered mountain ridges, a single hiker, muted film photography.`
- `home.examples.cat_complex` = `Complex Scene` / `home.examples.prompt_complex` = `A glass greenhouse café on Mars at sunset, visitors, plants, reflections, detailed wide scene.`

**how it works**

- `home.how.heading` = `From Prompt to Picture in Three Steps`
- `home.how.lead` = `Go from a plain-language prompt to a downloadable image in three simple steps.`
- `home.how.step1_label` = `Describe` / `home.how.step1_title` = `Say what you see.` / `home.how.step1_body` = `Write what you want to see in plain language. Add the subject, setting, lighting, and style when those details matter.`
- `home.how.step2_label` = `Generate` / `home.how.step2_title` = `Choose a shape.` / `home.how.step2_body` = `Choose an aspect ratio, then generate a new image from your prompt.`
- `home.how.step3_label` = `Download` / `home.how.step3_title` = `Keep what works.` / `home.how.step3_body` = `Save the result you like, or adjust your prompt and generate a new version.`
- `home.how.cta` = `Try It Now`

**benefits**

- `home.benefits.heading` = `From Prompt to Download—Without the Learning Curve`
- `home.benefits.lead` = `Create an image without learning complex prompt syntax or digging through dozens of settings.`
- `home.benefits.b1_title` = `Describe It Naturally` / `home.benefits.b1_body` = `Describe the image you want in everyday words. Add the subject, setting, lighting, and style when those details matter.`
- `home.benefits.b2_title` = `Just the Controls That Matter` / `home.benefits.b2_body` = `Choose an aspect ratio without navigating a professional design workflow or a wall of model settings.`
- `home.benefits.b3_title` = `Credits Protected on Failed Attempts` / `home.benefits.b3_body` = `Failed generations won’t reduce your final credit balance.`

**pricing**

- `home.pricing.heading` = `Start Free. Choose How You Pay for More.`
- `home.pricing.lead` = `Create a free account and get starter credits to try the generator. No payment method is required.`
- `home.pricing.free_kicker` = `Start here` / `home.pricing.free_title` = `Free to Try` / `home.pricing.free_body` = `Use your signup credits to create your first images before choosing a paid option.` / `home.pricing.free_action` = `Create an image`
- `home.pricing.sub_kicker` = `For regular use` / `home.pricing.sub_title` = `Subscription` / `home.pricing.sub_body` = `Generate regularly with a recurring plan and a fresh credit allowance each billing period.` / `home.pricing.sub_action` = `Compare plans`
- `home.pricing.pack_kicker` = `For occasional use` / `home.pricing.pack_title` = `One-Time Credit Pack` / `home.pricing.pack_body` = `Need images only now and then? Buy credits once without starting a subscription.` / `home.pricing.pack_action` = `View credit packs`
- `home.pricing.cta` = `Compare Plans and Credit Packs`

**faq** (6 Q/A — verbatim from CRO plan §8)

- `home.faq.heading` = `What You Need to Know`
- `home.faq.lead` = `Clear answers on cost, failed attempts, product limits, and commercial use.`
- `home.faq.q1` = `What is chat to image?` / `home.faq.a1` = `Chat to image means describing a picture in natural language and using AI to create it. With ChatToImage, enter one prompt, choose an aspect ratio, and generate a downloadable image.`
- `home.faq.q2` = `Can I generate images for free?` / `home.faq.a2` = `Yes. New accounts receive starter credits, with no payment method required. When those credits run out, you can choose a subscription or buy a one-time credit pack.`
- `home.faq.q3` = `Does ChatToImage support conversational image editing?` / `home.faq.a3` = `ChatToImage accepts natural-language prompts, but each submission is a separate image request. It does not remember earlier messages or revise images from conversation history.`
- `home.faq.q4` = `What happens if a generation fails?` / `home.faq.a4` = `Failed generations do not reduce your final credit balance. We show what happened and whether you can retry the same prompt or need to revise it.`
- `home.faq.q5` = `Can I use generated images commercially?` / `home.faq.a5` = `Commercial use depends on the model license, our Terms of Service, and any rights that apply to your prompt and output. Review the current terms before using an image in paid work, advertising, merchandise, or client projects.`
- `home.faq.q6` = `Who is ChatToImage for?` / `home.faq.a6` = `ChatToImage is for anyone who wants a direct path from a plain-language prompt to a downloadable image without a complex design workflow. It is not designed for multi-turn editing, batch production, or model comparison.`

**final CTA**

- `home.final.heading` = `Create Your First AI Image`
- `home.final.body` = `Describe your idea, generate your first image with free credits, and download the result you like.`
- `home.final.note` = `Not sure what to write? Start with one of the prompts above.`

**footer**

- `home.footer.brand_line` = `Turn plain-language ideas into downloadable AI images.`
- `home.footer.product_label` = `Product`
- `home.footer.company_label` = `Company`
- `home.footer.privacy` = `Privacy Policy`
- `home.footer.terms` = `Terms of Service`
- `home.footer.tagline` = `One sentence to a usable image.`
- `home.footer.copyright` = `© {year} ChatToImage. All rights reserved.` (year rendered at runtime via `new Date().getFullYear()`)

**meta**

- `home.meta.title` = `Chat to Image: Free AI Text-to-Image Generator`
- `home.meta.description` = `Turn text into AI images online. Describe your idea, choose an aspect ratio, then generate and download your image with free credits.`

## 8. Recorded deviations (preview vs CRO plan — CRO plan/hero copy wins)

- **Hero subheadline**: use the hero-copy sentence as-is; do NOT append the preview's bold `No prompt syntax required.`
- **Hero CTA support**: `Create a free account to get starter credits.` (plan wording), not the preview's `…receive starter credits. No payment method required.`
- **Loading message**: use CRO plan `We’re creating your image. Keep this page open while it finishes.` (not the preview's prototype-only wording).
- **Step bodies**: use CRO plan wording (drop the preview's `Smart defaults handle the rest.` flourish).
- **Benefit 3 body**: `Failed generations won’t reduce your final credit balance.` (drop the preview's trailing sentence).
- **Compact pricing**: rows + a section CTA `Compare Plans and Credit Packs` → `/pricing` (the preview's row-level links to `#pricing` are an internal inconsistency; follow the plan).
- **Footer columns**: `Product` (4 anchors) + `Company` (Privacy, Terms, Sign In) — the plan lists these as "Product links" and "Legal links" + "Account link"; use the preview's two-column layout with `Company` as the second label.
- **Scaffolding markers to remove before launch** (kept for now, honest placeholder labelling): `home.examples.scaffold_left/right`, the hero result-facts `REPLACE BEFORE LAUNCH` row, and the `Preview artwork · verify with production model` tag.

## 9. Verification

- `pnpm build` must pass.
- No changes to upstream files, `globals.css`, DB, or `landing.*`.
- `home.*` keys present in **both** `messages/en.json` and `messages/zh.json` (identical key sets).
- Optional: `pnpm dev` and a visual smoke-check against the prototype at `/`.
