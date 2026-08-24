# PixMira Reference Behaviors

The reference page was inspected at 1440px and 390px. This file records the visual and interaction model used as the implementation contract.

## Global

- Background is a deep navy near `rgb(11, 16, 30)` with slate text and a single amber accent.
- Body uses a system sans stack. Headings are bold, compact, and tightly tracked.
- Content is centered in a `max-width: 1280px` container with 16px to 32px horizontal padding.
- Surfaces use a translucent navy gradient, a 1px white border at roughly 10% opacity, and 14px to 16px radii.
- Accent buttons use a vertical amber gradient from about `#facc42` to `#f6b11e`, dark text, and a restrained shadow.
- Sections are separated by low-contrast horizontal rules and large vertical spacing.

## Header

- Header remains sticky while scrolling.
- Desktop layout has brand left, nav center, and account/action controls right.
- Mobile collapses to brand plus menu icon. The nav becomes a full-width vertical panel.

## Hero and Generator

- Hero has a centered title and supporting copy above a wide generator workspace.
- Generator is a two-column card on desktop and a vertical stack on mobile.
- The left column contains model, optional image, prompt, aspect ratio, resolution, quality, and the primary CTA.
- The right column contains a labeled result/gallery state with a large media frame and navigation controls.
- Initial state shows a real Example output. It is not an empty placeholder.
- CTA is disabled until the prompt is non-empty.
- A prompt example control can replace the current prompt. Aspect ratio buttons switch the active border/accent state.
- Loading state uses a centered spinner/progress message. Success state exposes download and generate-again actions. Failure states include a retry action and explicit credit protection copy.

## Sections

- Examples use a dense asymmetric media grid with prompt labels and a `Try This Prompt` action.
- How It Works uses three connected cards with direct verb labels.
- Benefits use an asymmetric two-column layout instead of an equal three-card row.
- Pricing uses three compact cards: free, subscription, and one-time pack.
- FAQ uses an accordion with a single open answer at a time.
- Final CTA is a bordered surface that scrolls to and focuses the generator prompt.
- Footer is compact and grouped into product, legal, and account links.

## Motion

- Use short opacity and translate transitions for sections entering view.
- Use 200ms to 300ms hover transitions on buttons, borders, and cards.
- Do not add scroll hijacking, parallax, or auto-playing carousels.
- Respect `prefers-reduced-motion`.

## Responsive

- Desktop breakpoint is approximately 768px.
- At 390px the generator, examples, benefit rows, pricing cards, and FAQ all stack vertically.
- Maintain readable 16px page gutters on mobile and avoid horizontal overflow.
