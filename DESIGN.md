# Design System — ChatToImage

## Product Context

- **What this is:** A tool-led AI image generator that turns one plain-language prompt into a downloadable image.
- **Who it is for:** English-speaking Google search visitors who want a useful image without learning prompt syntax or a professional design tool.
- **Space/industry:** Consumer AI image generation; peers reviewed include DeepAI, PicLumen, and Fotor.
- **Project type:** SEO marketing homepage with an embedded product workflow.
- **Primary conversion:** `generate_intent`; signup, successful generation, and purchase are downstream conversions.
- **Memorable thing:** A usable image comes from one sentence, without a complex workflow.
- **CRO source of truth:** `docs/designs/homepage-cro-plan.md`. Visual styling must not weaken its approved section order, copy hierarchy, or interaction requirements.

## Aesthetic Direction

- **Direction:** Precision Tech Hybrid.
- **Decoration level:** Intentional. Use technical grids, thin borders, compact metadata, controlled violet glow, and occasional scan or signal details. Every decorative element must clarify that generation is active or make generated work feel tangible.
- **Mood:** Precise, capable, and alive. The product should feel like a focused generation engine rather than a multi-tool creative suite.
- **Homepage surface:** Matte near-black with cool graphite layers. The dark surface is the product identity, not only a dark-mode inversion.
- **Supporting surface:** Cool cloud neutrals may be used for design documentation, account pages, or quiet utility contexts, but the public homepage remains dark-first.
- **Reference sites:** [DeepAI](https://deepai.org/machine-learning-model/text2img), [PicLumen](https://www.piclumen.com/), and [Fotor](https://www.fotor.com/features/ai-image-generator/). A user-provided motion reference informed the reveal, hover, layered-image, and FAQ behaviors.

### Visual Principles

1. **The generator is the hero.** Keep it in the first viewport; do not place a competing hero CTA above or beside it.
2. **Technology is communicated through behavior.** Live status, generated-output movement, and precise metadata create the AI feeling. Avoid decorative sci-fi chrome with no product meaning.
3. **Violet means creation; mint means operation.** Violet belongs to generate actions and creative emphasis. Mint belongs to system readiness, credit protection, success, and safe completion.
4. **Evidence beats spectacle.** Use verified production-model outputs and their exact prompts. Never ship stock imagery or outputs the selected model cannot reproduce as product evidence.
5. **Keep the product literal.** One prompt, necessary controls, one generation action, and an obvious result. Do not add a model selector while only one model is available.

## Typography

- **Display/Hero:** General Sans 600–700. Its compact geometry gives the page a technical silhouette without looking like developer tooling.
- **Body:** Instrument Sans 400–600. Its readable proportions keep long explanations and form guidance human rather than mechanical.
- **UI/Labels:** Instrument Sans 600–700. Use sentence case for actions and normal labels.
- **Metadata/Data:** IBM Plex Mono 400–600 with tabular numerals. Use for prompt counters, dimensions, system state, categories, prices, and step indexes.
- **Code:** IBM Plex Mono.
- **Loading:** Prefer self-hosted WOFF2 assets for production. During prototyping, General Sans may load from Fontshare and Instrument Sans / IBM Plex Mono from Google Fonts.

### Type Scale

| Token        |                       Size | Line height | Usage                                       |
| ------------ | -------------------------: | ----------: | ------------------------------------------- |
| `display-xl` |   `clamp(52px, 7vw, 88px)` |      `0.94` | Design statements and rare campaign moments |
| `display-lg` |   `clamp(46px, 6vw, 76px)` |      `0.96` | Homepage hero                               |
| `display-md` | `clamp(36px, 4.5vw, 56px)` |      `1.00` | Major section headings                      |
| `heading-lg` |                     `32px` |      `1.08` | Pricing and FAQ headlines                   |
| `heading-md` |                     `22px` |      `1.20` | Card and result headings                    |
| `body-lg`    |                     `18px` |      `1.55` | Hero support and section introductions      |
| `body`       |                     `16px` |      `1.55` | Default copy and controls                   |
| `body-sm`    |                     `13px` |      `1.50` | Helper and supporting copy                  |
| `meta`       |                  `11–12px` |      `1.40` | Monospace labels and state information      |

- Display tracking: `-0.055em`; body tracking: normal; large body copy may use `-0.02em`.
- Do not use all caps for headlines or actions. All caps is reserved for short monospace metadata.

## Color

- **Approach:** Balanced and role-based. The homepage is neutral-dark; two accents have separate meanings.
- **Creative primary:** `#655CFF` — generation actions, creative emphasis, selected creative controls, and active navigation.
- **Creative hover:** `#7B73FF`.
- **Creative secondary:** `#928CFF` — small labels, links, and supporting highlights.
- **Operational signal:** `#61E6B3` — system-ready indicators, safe credit messaging, completed generation, and focused operational controls.
- **Operational hover:** `#3BCB95` on light surfaces; `#7DF0C4` on dark surfaces.
- **Accessible link blue:** `#3157D5` on light surfaces; `#6E91FF` on dark surfaces.

### Dark Homepage Neutrals

| Token            | Value     | Usage                             |
| ---------------- | --------- | --------------------------------- |
| `canvas`         | `#05060A` | Page background                   |
| `surface`        | `#0B0C12` | Primary cards and generator shell |
| `surface-raised` | `#11121A` | Raised or active panels           |
| `ink`            | `#F5F7F6` | Primary text                      |
| `muted`          | `#A3A7B5` | Supporting text                   |
| `faint`          | `#737887` | Quiet metadata                    |
| `border`         | `#20212B` | Default dividers                  |
| `border-strong`  | `#343644` | Controls and primary containers   |

### Light Supporting Neutrals

| Token            | Value     | Usage                           |
| ---------------- | --------- | ------------------------------- |
| `canvas`         | `#F2F5F4` | Utility-page background         |
| `surface`        | `#FCFEFD` | Cards and inputs                |
| `surface-raised` | `#FFFFFF` | Elevated content                |
| `ink`            | `#0B0F0E` | Primary text                    |
| `muted`          | `#5D6865` | Supporting text                 |
| `faint`          | `#82908C` | Quiet metadata                  |
| `border`         | `#CBD5D1` | Default dividers                |
| `border-strong`  | `#97A7A1` | Controls and primary containers |

### Semantic Colors

- **Success:** `#1F9C6D`; soft background `#E1F5EC`. On dark surfaces use `#68D5A7` over `#173528`.
- **Warning:** `#A66B00`; soft background `#F9EFD7`. On dark surfaces use `#E0AA4F` over `#3C301A`.
- **Error:** `#C74455`; soft background `#FAE7EB`. On dark surfaces use `#EB7A88` over `#402329`.
- **Info:** `#3E68E8`; soft background `#E6ECFF`. On dark surfaces use `#82A1FF` over `#202C55`.

### Color Usage Rules

- Keep most surfaces neutral. Accent color should occupy less than roughly 10% of a viewport.
- A restrained blue-violet gradient from `#4F5DFF` to `#745CFF` is allowed only on the primary generation CTA and generation-progress treatments. All other buttons are flat.
- Do not use violet for success, system health, or credit protection.
- Use glow as a soft depth cue around the generator or hovered creative output, never as a text effect.
- In dark mode, redesign surface values rather than mechanically inverting the light palette.

## Spacing

- **Base unit:** `4px`.
- **Density:** Comfortable around marketing content; compact inside the generator and metadata panels.
- **Scale:** `2xs 2px`, `xs 4px`, `sm 8px`, `md 16px`, `lg 24px`, `xl 32px`, `2xl 48px`, `3xl 64px`, `4xl 80px`, `5xl 104px`.
- Form fields use `12–16px` internal padding. Generator panels use `16px` on mobile and `24–32px` on larger screens.
- Major sections use `72px` vertical padding on mobile and `104px` on desktop.

## Layout

- **Approach:** Hybrid. Marketing hierarchy can be asymmetric, but the generator, evidence, and pricing content remain grid-disciplined.
- **Grid:** 12 columns on desktop, 6 on tablet, and a single stacked flow on mobile.
- **Max content width:** `1200px`.
- **Page gutters:** `20px` per side on desktop; `12px` per side below `680px`. Internal homepage sections use `32px` on desktop and `18px` on mobile.
- **Breakpoints:** `900px` for large layout collapse and `680px` for mobile navigation and single-column content.
- **Border radius:** `2px` for marks, `4px` for controls and alerts, `8px` for dense shells, `12px` for primary frames and major cards, `9999px` only for chips and status pills.
- **Borders:** Prefer one-pixel dividers and visible structure over floating rounded cards.
- **Shadows:** Use neutral shadows for elevation and a low-opacity violet shadow only around creative output or the generator frame.

### Homepage Composition

1. Quiet sticky header with anchors and Sign In.
2. Hero copy and generator as one first-viewport experience.
3. Three compact trust/benefit statements attached to the generator.
4. Verified example gallery before How It Works.
5. Literal three-step explanation.
6. Compact pricing beside FAQ.
7. One final CTA that returns focus to the hero prompt.

On mobile, order hero content as copy, input, controls, CTA, then result. Do not hide essential credit or failure-state explanations.

## Components

### Buttons

- Primary generation button: full-width inside the generator, at least `44px` high, General/Instrument Sans 600–700, `4px` radius.
- Secondary button: transparent or raised neutral surface with a visible border.
- Ghost button: no filled background until hover.
- Hover lift is at most `1px`; focus uses a visible `3px` mint-tinted outline with `2px` offset.
- Disabled states must reduce contrast without removing the label or progress explanation.

### Generator

- Split prompt and result panels on desktop; stack on mobile.
- Use thin technical grid lines only inside or immediately behind the generator.
- Keep system state, prompt index, aspect ratio, dimensions, and credit guard in IBM Plex Mono.
- Preserve prompt and control state through authentication.
- Support explicit example, loading, success, retryable failure, timeout, and content-rejection states from the CRO plan.

### Example Cards

- Use verified production images with a dark caption strip containing category and `Try This Prompt`.
- Favor an editorial mosaic over a uniform card grid.
- On hover: lift `6px`, scale the image to `1.025`, strengthen the violet border, and add a restrained creative shadow.
- Provide the same prompt action through keyboard focus; hover must not be the only affordance.

### Layered Output Cards

- Up to two small generated-output cards may overlap a hero result image to imply variety.
- At rest, rotate cards approximately `±7deg`; on hover or focus-within, fan to approximately `±10deg` with a small `5–6px` translation.
- These cards are a creative-output motif, not decoration for unrelated sections. They must not cover result actions or critical image content on mobile.

### FAQ

- Use native `details` and `summary` semantics.
- Separate rows with one-pixel borders; avoid independent rounded FAQ cards.
- Rotate the plus marker by `45deg` over `220ms` when opened.
- Animate content height and opacity only when supported; the content must remain usable without JavaScript.

## Motion

- **Approach:** Intentional. Motion explains generation, reveals hierarchy, or makes output feel tangible.
- **Primary easing:** `cubic-bezier(0.22, 1, 0.36, 1)` for entrances; standard `ease` for small UI state changes.
- **Duration:** micro `80–120ms`, short `140–240ms`, medium `260–400ms`, reveal `620ms`.
- **Viewport reveal:** Start at `opacity: 0`, `translateY(28px)`, and `scale(0.985)`; animate once to the resting state. Stagger grouped items by `70ms`, capped at four positions.
- **Card hover:** `220–320ms`, with `4–6px` vertical lift. Do not apply hover motion to every container.
- **Layered output fan:** `260ms`.
- **FAQ marker:** `220ms`.
- **Generation scan:** A subtle scan line may cross the result only while generation is active. It must stop when the state settles.
- **Reduced motion:** Under `prefers-reduced-motion: reduce`, remove smooth scrolling, transforms, transitions, scan animation, and reveal hiding. Content must render immediately.

Do not reproduce the reference video's camera tilt, device perspective, or full-screen purple presentation grid in the website. Those belong to the video wrapper, not the product UI.

## Accessibility

- Maintain WCAG AA contrast for body copy and actionable text. The approved light-surface signal blue is `#3157D5`, which exceeds 4.5:1 on the cloud canvas.
- Do not encode state through color alone; pair state color with labels or icons.
- Keep interactive targets at least `44px` in the primary workflow.
- Preserve native keyboard and screen-reader behavior for links, controls, and FAQ details.
- Keep visible focus states on dark and light surfaces.
- Never leave below-the-fold content hidden if `IntersectionObserver` is unavailable.

## Content and Imagery

- Copy is direct and literal. Prefer “Describe your image” over branded feature names.
- Avoid claims about superior quality, speed, price, or unlimited use without verified evidence.
- Image examples must come from the production model and show their exact prompt.
- The interface may feel technical; the writing should remain plain-language and reassuring.

## Decisions Log

| Date       | Decision                                                                   | Rationale                                                                                                                    |
| ---------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 2026-08-21 | Created the Precision Tech Hybrid system                                   | A focused technical interface reinforces the one-prompt workflow without adding professional-tool complexity.                |
| 2026-08-21 | Made the public homepage dark-first                                        | The approved video reference showed that matte dark surfaces make generated imagery and live states feel more tangible.      |
| 2026-08-21 | Split violet and mint into creative and operational roles                  | Clear color semantics keep the AI aesthetic from weakening trust and credit-safety messaging.                                |
| 2026-08-21 | Adopted viewport reveal, layered-output hover, and animated FAQ disclosure | These extracted reference behaviors make the page feel alive while preserving literal navigation and reduced-motion support. |
| 2026-08-21 | Kept the generator above the fold with no model selector                   | This preserves the approved CRO path and avoids adding choices the product does not yet need.                                |
