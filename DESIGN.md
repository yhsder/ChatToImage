# Design System — ChatToImage

## Product Context

- **What this is:** A focused AI image generator that turns one plain-language sentence into a downloadable, usable image.
- **Who it is for:** English-speaking Google search visitors who want a useful image without learning prompt syntax or operating a professional creative suite.
- **Project type:** SEO marketing homepage with the product workflow embedded above the fold.
- **Primary conversion:** `generate_intent`; account creation, successful generation, download, and purchase are downstream conversions.
- **Product promise:** The fastest path from one sentence to a usable image.
- **CRO source of truth:** `docs/designs/homepage-cro-plan.md`. Visual styling must not weaken its approved section order, copy hierarchy, or interaction requirements.

## Aesthetic Direction

- **Name:** Instant Canvas.
- **Direction:** Bright Editorial Utility.
- **Mood:** Immediate, capable, tactile, and calm. The interface should feel like a well-made creative instrument, not a model marketplace or an enterprise dashboard.
- **Decoration level:** Restrained. Structure comes from typography, one-pixel rules, compact metadata, and a single signal color rather than gradients, glows, or floating glass panels.
- **Homepage surface:** Warm paper with near-white working surfaces, carbon ink, and signal orange.
- **Dark mode:** Optional supporting theme, not the public homepage identity. Recompose surfaces and lower accent saturation instead of mechanically inverting colors.
- **Interaction reference:** Fotor's unified generator composition informs the reference-image, prompt, model, ratio, settings, counter, and generate flow. Reimplement the interaction pattern independently; do not copy its source code, DOM, icons, copy, assets, or visual identity.

### Visual Principles

1. **The shortest path is the identity.** The prompt and Generate action must be visible without scrolling on common desktop and mobile viewports.
2. **One sentence stays dominant.** Reference images, model choice, and settings support the prompt rather than competing with it.
3. **Complexity appears only when requested.** Choose sensible defaults, show recommended models first, and keep advanced settings collapsed.
4. **Structure replaces decoration.** Use strong typography, hard edges, one-pixel dividers, and compact metadata. Avoid ornamental gradients, glows, and excessive pills.
5. **Signal orange means action.** Reserve it for generation, active drop targets, and the small brand signal mark.
6. **Evidence beats spectacle.** Use verified outputs from production models with their exact prompts. Do not imply capabilities the selected model cannot deliver.

## Signature Element

The **Instant Canvas generator** is a two-tier input instrument:

- The upper tier pairs a dedicated reference-image bay with a large prompt field.
- The lower tier contains model, aspect ratio, settings, character count, and Generate.
- The generator uses a carbon outline with a small orange offset shadow.
- The entire upper tier becomes a clear upload target during file drag.
- Generated output appears directly below the same instrument so the prompt-to-result relationship remains spatially obvious.

This composition is the product's recognizable motif. Do not reuse the orange offset shadow on ordinary cards.

## Typography

- **Display/Hero:** Cabinet Grotesk 700–800. Its compact, editorial silhouette makes the promise memorable without feeling like generic SaaS.
- **Body:** Source Sans 3 400–600. It keeps guidance, forms, and longer explanations direct and highly readable.
- **UI:** Source Sans 3 600–700. Actions and controls use sentence case.
- **Metadata/Data:** JetBrains Mono 500–700 with tabular numerals. Use for counters, dimensions, credits, statuses, step indexes, and compact labels.
- **Chinese fallback:** Noto Sans SC.
- **Loading:** Self-host production WOFF2 files. External font services are acceptable only in design prototypes.

### Type Scale

| Token            |                        Size | Line height | Usage                            |
| ---------------- | --------------------------: | ----------: | -------------------------------- |
| `display-xl`     | `clamp(60px, 7.2vw, 102px)` |      `0.87` | Desktop homepage promise         |
| `display-mobile` | `clamp(42px, 11.5vw, 56px)` |      `0.90` | Mobile homepage promise          |
| `display-md`     |  `clamp(38px, 4.5vw, 60px)` |      `0.96` | Major section headings           |
| `heading-lg`     |                      `32px` |      `1.08` | Pricing and FAQ headings         |
| `heading-md`     |                      `22px` |      `1.20` | Result and card headings         |
| `body-lg`        |                      `18px` |      `1.45` | Hero support copy                |
| `body`           |                      `16px` |      `1.55` | Default copy and inputs          |
| `body-sm`        |                      `13px` |      `1.45` | Supporting guidance              |
| `meta`           |                   `10–12px` |      `1.40` | Monospace labels and system data |

- Display tracking: `-0.065em` at large sizes; reduce tightening on smaller headings.
- Body tracking: normal.
- All caps is reserved for short monospace metadata, never headlines or primary actions.

## Color

### Light Foundation

| Token            | Value     | Usage                                      |
| ---------------- | --------- | ------------------------------------------ |
| `canvas`         | `#F3F0E8` | Page background and reference bay          |
| `surface`        | `#FFFDF7` | Generator, cards, and working surfaces     |
| `surface-raised` | `#FFFFFF` | Menus and elevated controls                |
| `ink`            | `#151511` | Primary text and strong outlines           |
| `muted`          | `#69675F` | Supporting text                            |
| `faint`          | `#8B877D` | Quiet metadata                             |
| `line`           | `#CFC9BB` | Default dividers                           |
| `line-strong`    | `#9E9788` | Control outlines and dashed upload borders |

### Brand and Semantic Colors

- **Signal orange:** `#FF5A1F` — Generate, active drag target, active creative state, and the brand signal mark.
- **Signal hover:** `#E9470C`.
- **On signal:** `#151511` for large bold actions when contrast permits; otherwise `#FFFFFF`.
- **Success:** `#18865A`; soft background `#E2F2E9`.
- **Warning:** `#A66700`; soft background `#F7ECD5`.
- **Error:** `#C83E32`; soft background `#FAE7E3`.
- **Info:** `#2857C5`; soft background `#E6ECFA`.

### Color Usage Rules

- Keep at least 85% of each viewport neutral.
- Do not introduce purple as a generic AI signifier.
- Do not use gradients on interface surfaces or primary actions. Abstract generated-image placeholders may use gradients because they represent image content.
- Orange must not represent success, safety, or credit protection.
- Focus indicators use a visible `3px` orange-tinted outline with `2px` offset.

## Spacing

- **Base unit:** `4px`.
- **Density:** Spacious in marketing sections, compact inside the generator and menus.
- **Scale:** `2xs 2px`, `xs 4px`, `sm 8px`, `md 16px`, `lg 24px`, `xl 32px`, `2xl 48px`, `3xl 64px`, `4xl 80px`, `5xl 104px`.
- Form controls use `12–16px` internal padding.
- Generator subpanels use `14–18px` internal padding.
- Major homepage sections use `72px` vertical padding on mobile and `104px` on desktop.

## Layout

- **Approach:** Grid-disciplined editorial layout.
- **Grid:** 12 columns on desktop, 6 on tablet, and a single content flow on mobile.
- **Max content width:** `1240px`.
- **Page gutters:** `20px` per side on desktop and `8–12px` below `680px`.
- **Breakpoints:** `820px` for generator and marketing collapse; `480px` for narrow-mobile refinements.
- **Border radius:** `2px` for marks, `4px` for controls, `8px` for primary frames, and `9999px` only for status chips.
- **Borders:** Prefer visible one-pixel dividers over independent floating cards.
- **Shadows:** Use neutral shadows for menus. Only the generator may use the orange `5–8px` offset shadow.

### Homepage Composition

1. Quiet header with product name, section links, and Sign In.
2. Direct product promise and supporting copy.
3. Instant Canvas generator in the first viewport.
4. Compact credit and failure protection note attached to the generator.
5. Generated result or example result immediately below.
6. Verified example gallery.
7. Literal three-step explanation.
8. Compact pricing and FAQ.
9. Final action that returns focus to the hero prompt.

On mobile, preserve this order: promise, supporting copy, reference/prompt input, controls, Generate, credit protection, then result.

## Components

### Buttons

- Primary Generate button is orange, at least `44px` high, `4px` radius, and uses Cabinet Grotesk or Source Sans 3 at `700–800`.
- Secondary buttons use a neutral surface with a visible one-pixel border.
- Ghost buttons receive a fill only on hover or active state.
- Hover lift is limited to `1px`.
- Disabled Generate retains its label but switches to a neutral surface and clearly communicates why generation is unavailable.
- Primary workflow targets must be at least `44px` on touch devices.

### Instant Canvas Generator

#### Base Composition

- Desktop uses one framed panel with an upper input tier and lower control tier.
- The upper tier uses a fixed reference bay on the left and a flexible prompt field on the right.
- The lower tier orders controls as Model, Shape, Setting, character count, then Generate.
- Keep the empty desktop panel approximately `200–250px` high.
- Mobile keeps reference and prompt side by side, places compact controls below, and gives Generate the full row.

#### Prompt

- Label the field literally: `Describe your image`.
- Accept plain language without requiring prompt syntax.
- Display a live `current / 3000` counter.
- Preserve the prompt through sign-in, model changes, and retryable failures.
- Disable Generate when the prompt is empty. If reference-only generation becomes a supported product mode, change this validation deliberately and document it.

#### Reference Images

- Support up to four references when the selected model permits it.
- Empty state shows `0 / 4`, an add tile, `Add picture`, and drag guidance.
- Clicking the bay opens upload; dragging anywhere over the upper tier activates a full-width upload overlay.
- Added images appear as compact thumbnails with an updated count.
- Production thumbnails must expose remove and reorder actions through keyboard and pointer input.
- Validate file type, file size, dimensions, upload progress, failure, and model compatibility.
- If a model supports fewer references, explain the limit before discarding any selected image.

#### Model Selection

- With one active model, hide the selector and use the model automatically.
- With two or more models, show the currently recommended model in the control row.
- Describe models by user outcome first: Speed, Balanced, Detail, Typography, Portrait, or Illustration. Provider/model names may appear as secondary technical information.
- Initially show no more than four recommended models.
- When more than four models are available, provide `View all models` and open a searchable, scrollable model browser.
- Each option may show strength, credit cost, and typical generation time. Avoid quality claims that are not measured.
- Changing the model must revalidate reference limits, aspect ratios, and advanced settings without silently losing user input.

#### Aspect Ratio

- Keep common ratios directly available: `1:1`, `4:3`, `3:4`, and `16:9` as supported.
- Use the last successful ratio as the next-session default when appropriate.
- Disable unsupported ratios with an explanation rather than removing them without notice.

#### Settings

- Display `Auto · Smart defaults` in the collapsed state.
- Keep advanced settings closed by default.
- Available options update with the selected model.
- Initial settings may include prompt assist, output count, and seed behavior.
- Put specialist parameters behind an additional Advanced disclosure; do not lengthen the main control row.

#### Responsive Menus

- Desktop uses anchored popovers that remain inside the page shell.
- Mobile uses fixed bottom sheets with `12px` viewport gutters and a scrollable maximum height.
- Opening Model closes Setting and vice versa.
- Escape, outside click, and focus return must work in production.

#### Generation and Results

- Generate immediately changes to an explicit creating state and prevents duplicate submission.
- Support example, empty, uploading, creating, success, retryable failure, timeout, content rejection, and insufficient-credit states.
- Failed generation never consumes credits and must say so near the action.
- The result is visually dominant; download, revise, and retry actions appear only when relevant.
- Show dimensions, cost, task status, and ID as compact metadata.

### Model Browser

- Recommended options appear first.
- Use capability filters only when the catalog is large enough to need them.
- Keep search, filters, and full provider information outside the default generator surface.
- Never force a new visitor to understand model architecture before generating a first image.

### Example Cards

- Use verified production images with their exact prompts.
- Favor an editorial mosaic over a uniform SaaS card grid.
- Hover may lift the card `4px` and strengthen its border; do not scale every card simultaneously.
- Provide the same prompt action through keyboard focus.

### FAQ

- Use native `details` and `summary` semantics.
- Separate rows with one-pixel rules rather than independent rounded cards.
- Rotate the plus marker by `45deg` over `180–220ms` when opened.
- Content must remain usable without JavaScript.

## Motion

- **Approach:** Minimal-functional.
- **Primary easing:** `cubic-bezier(0.22, 1, 0.36, 1)` for entrances; standard `ease` for small state changes.
- **Duration:** micro `80–120ms`, short `140–220ms`, medium `260–360ms`.
- Use motion to explain drag acceptance, menu opening, generation progress, and result arrival.
- Do not animate decorative background elements continuously.
- A subtle progress line may appear only while generation is active.
- Under `prefers-reduced-motion: reduce`, remove smooth scrolling, transforms, progress sweeps, and reveal hiding.

## Accessibility

- Maintain WCAG AA contrast for body copy and actionable text.
- Do not encode state through color alone; pair state colors with labels or icons.
- Keep visible keyboard focus on every interactive element.
- Reference thumbnails require accessible names and remove controls.
- Model and Setting popovers must manage focus, close on Escape, and return focus to their trigger.
- Drag-and-drop must always have an equivalent file-picker action.
- Live generation, upload progress, and errors require appropriate live-region announcements.
- Keep touch targets at least `44px` in the primary workflow.

## Content and Imagery

- Copy is direct and literal. Prefer `Describe your image`, `Add picture`, and `Generate image` over branded feature names.
- Reinforce the promise that one natural sentence is enough.
- Avoid unverified speed, quality, price, and unlimited-use claims.
- Examples must be generated by production models and display their exact prompts.
- Generated imagery may be expressive; the surrounding interface remains neutral and controlled.

## Implementation Guardrails

- Implement the approved interaction patterns independently. Do not copy Fotor code, DOM structure, CSS class names, icons, copy, or branded assets.
- Keep provider capabilities in data rather than hardcoding model-specific branches throughout components.
- Derive visible controls from model capabilities such as supported ratios, maximum references, output count, and advanced options.
- Preserve user input before authentication and across compatible model changes.
- Do not add a visible control until the underlying capability exists.

## Decisions Log

| Date       | Decision                                                | Rationale                                                                                                                      |
| ---------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 2026-08-21 | Precision Tech Hybrid was explored                      | The dark technical direction established an initial product identity but did not express the desired immediacy clearly enough. |
| 2026-08-22 | Replaced the previous direction with Instant Canvas     | A bright editorial utility system makes the shortest prompt-to-result path feel tangible and distinctive.                      |
| 2026-08-22 | Made the generator the signature element                | The product should be remembered as the fastest way to turn one sentence into a usable image.                                  |
| 2026-08-22 | Adopted warm paper, carbon ink, and signal orange       | The palette is recognizable without relying on generic AI purple, gradients, or glow.                                          |
| 2026-08-22 | Adopted Fotor's unified generator interaction framework | Its compact reference, prompt, model, ratio, settings, and action composition supports a short generation path.                |
| 2026-08-22 | Reimplemented the reference pattern independently       | The useful interaction can be retained without copying Fotor's visual identity, source, assets, or copy.                       |
| 2026-08-22 | Added progressive model disclosure                      | Automatic defaults preserve speed today while recommended and full-model views support future catalog growth.                  |
| 2026-08-22 | Kept advanced settings collapsed by default             | Power remains available without turning the primary workflow into a professional tool panel.                                   |
