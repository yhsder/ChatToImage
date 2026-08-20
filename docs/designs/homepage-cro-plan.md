# Homepage CRO Plan

**Status:** APPROVED  
**Last updated:** 2026-08-20  
**Page:** Homepage `/`  
**Traffic source:** United States English Google organic search

## Conversion Strategy

The homepage is a tool-led SEO landing page. Its primary job is to move a cold search visitor from an idea to generation intent as quickly as possible.

The conversion sequence is:

1. The visitor enters a prompt and selects any necessary controls.
2. The visitor clicks `Generate My Image`.
3. An unauthenticated visitor signs in or creates an account without losing the prompt or controls.
4. The visitor submits the real generation with free credits.
5. The visitor downloads the result or modifies the prompt and starts a new generation.
6. After free credits are exhausted, the visitor can subscribe or buy a one-time credit pack.

The primary page conversion is `generate_intent`. Signup, successful generation, and purchase are downstream conversions.

## Approved Decisions

- Place Examples before How It Works so real output addresses quality concerns early.
- Show a tested image labelled `Example output` in the initial Hero result state instead of an empty placeholder.
- Show compact pricing on the homepage and keep the full plan comparison on `/pricing`.
- Keep the generator in the first viewport and use it as the destination for repeated page CTAs.
- Do not show a model selector while only one model is available.

These CRO decisions supersede the section order and empty result state shown in the initial grayscale wireframe. The wireframe remains a layout reference for the rest of the page.

## Page Structure

### 1. Header

Include:

- ChatToImage logo
- Examples
- How It Works
- Pricing
- FAQ
- Sign In

Requirements:

- Use page anchors for Examples, How It Works, Pricing, and FAQ.
- Treat Sign In as a returning-user action, not the primary page CTA.
- A compact sticky state may remain visible after scrolling.
- Do not include demo-template links such as Features, Blog, or Dashboard.

### 2. Hero and Generator

The Hero and generator form one above-the-fold experience. Use the approved copy from `docs/copy/homepage-hero.md`.

The generator includes:

- Prompt textarea
- Prompt helper text
- Verified style shortcuts, if the selected model supports them reliably
- Aspect ratio control
- `Generate My Image` button
- Sign-in and free-credit disclosure
- Failed-generation credit reassurance

Requirements:

- Do not show a model selector for a single-model product.
- If styles are not reliably supported, launch with only the prompt and aspect ratio.
- Trigger authentication only after the visitor clicks Generate.
- Preserve the prompt, selected style, and aspect ratio through authentication and return.
- On mobile, order the content as copy, input, controls, CTA, then result.

### 3. Hero Result State

Before generation, show a real, reproducible image labelled:

> Example output

Show its source prompt and provide a `Try this prompt` action. After submission, replace the example with an explicit loading state and then the generated result.

The result area must support:

- Loading progress or clear waiting feedback
- Successful preview
- Download
- Generate again
- Retryable provider or timeout failure
- Non-retryable content rejection
- Clear confirmation that unsuccessful attempts do not consume credits

### 4. Examples

**Recommended heading:**

> See What You Can Create

**Supporting copy:**

> Explore images generated from real prompts using the same AI image generator.

Requirements:

- Show eight model-tested examples.
- Cover product imagery, people, fantasy, anime or illustration, posters, interiors, nature, and complex compositions.
- Display or reveal the source prompt for every example.
- Let visitors copy an example prompt into the Hero generator.
- Only use outputs from prompts that pass the repeatability criteria in the SEO MVP release plan.
- Never use stock or externally generated examples that the production model cannot reproduce reliably.

### 5. How It Works

**Heading:**

> From Prompt to Picture in Three Steps

Steps:

1. **Describe** — Write what you want to see in plain language.
2. **Generate** — Choose a style and aspect ratio, then create your image.
3. **Download** — Save your result or adjust the prompt and try again.

End with `Try It Now`, which scrolls to and focuses the Hero prompt instead of opening authentication directly.

### 6. Product Benefits

Use three conversion-focused benefits instead of a generic feature grid.

**Section heading:**

> Simple From Prompt to Download

**Plain Language In**

> Describe the image you want without learning complex prompt syntax.

**Only the Controls You Need**

> Choose a style and aspect ratio without navigating a professional workflow.

**Credits You Can Trust**

> Failed, rejected, or timed-out generations won’t reduce your credit balance.

Do not claim superior image quality, speed, price, or unlimited usage without supporting evidence.

### 7. Compact Pricing

**Heading:**

> Start Free. Choose How You Pay for More.

Explain the three paths without reproducing the complete pricing table:

- Free credits for new users
- Subscription for ongoing generation
- One-time credit pack for occasional generation

Requirements:

- Show the exact signup credit amount before launch.
- Link to the full `/pricing` page for plan details and checkout.
- Keep the distinction between subscriptions and credit packs clear.
- Do not use vague unlimited-generation claims.

### 8. FAQ

Answer these objections:

1. What is chat to image?
2. Can I generate images for free?
3. Do I need to write complex prompts?
4. What happens if a generation fails?
5. Can I use generated images commercially?
6. How long are my prompts and images stored?
7. Is ChatToImage a conversational image editor?

Commercial-use wording must follow the selected provider’s confirmed license. Storage wording must match the final privacy policy and provider retention requirements.

### 9. Final CTA

**Heading:**

> Create Your First AI Image

**Supporting copy:**

> Describe your idea in plain language and start with free credits.

**CTA:**

> Generate My Image

The CTA scrolls to and focuses the Hero prompt. It does not send a visitor directly to signup.

### 10. Footer

Include:

- Pricing
- Privacy Policy
- Terms of Service
- Refund Policy
- Content Policy
- Support
- Sign In

Do not show the Blog or a floating support widget in the SEO MVP homepage. Support remains accessible from the footer and relevant error states.

## Trust Strategy

The MVP has no customer logos, testimonials, ratings, or usage metrics. Do not fabricate a conventional social-proof section.

Use product evidence instead:

- Reproducible examples with source prompts
- Transparent free-credit disclosure
- No net credit consumption for unsuccessful generation
- Clear commercial-use and data-retention answers
- Explicit error reasons and recovery actions

Only add customer or performance proof after real data exists and can be verified.

## Tracking Plan

Track at least:

1. `organic_session`
2. `generate_intent`
3. `auth_started`
4. `signup_completed`
5. `generation_submitted`
6. `generation_success`
7. `generation_rejected`
8. `generation_failed`
9. `image_downloaded`
10. `generate_again`
11. `pricing_viewed`
12. `checkout_started`
13. `purchase_success`

Record first-generation status, traffic source, device category, and normalized failure reason where relevant. Do not send raw prompts to general-purpose analytics tools.

## Quick Wins

- Remove the model selector for the single-model launch.
- Replace the empty result placeholder with a labelled, reproducible example.
- Place Examples before How It Works.
- Route every main page CTA back to the same generator.
- Disclose the authentication requirement beside the Generate button.
- Remove demo Features, Blog, Dashboard CTA, and the floating support widget.
- Avoid logos, testimonials, ratings, or generation counts until real proof exists.

## High-Impact Requirements

- Preserve all generator input through the authentication round trip.
- Use only tested, reproducible outputs in Examples.
- Publish exact free-credit and paid-pricing information before production launch.
- Distinguish success, content rejection, retryable failure, and timeout states.
- Verify credit net balance for every task outcome.
- Instrument the complete organic-session-to-purchase funnel.

## Test Ideas

Run experiments only after the baseline funnel has enough traffic to support a meaningful comparison.

- Examples before versus after How It Works
- `Generate My Image` versus `Create My First Image`
- A single example output versus a set of prompt inspiration cards in the Hero result state
- Exact free-credit quantity beside the CTA versus in the Pricing section only
- Compact homepage pricing versus linking directly to the full pricing page

The first 100 organic sessions are suitable for detecting major funnel failures, not for drawing reliable A/B-test conclusions.

## Current Implementation Impact

The existing demo homepage composition should eventually change from generic template blocks to this product-specific sequence:

1. Header
2. Hero and Generator
3. Examples
4. How It Works
5. Product Benefits
6. Compact Pricing
7. FAQ
8. Final CTA
9. Footer

The existing Blog and Support Widget are outside the SEO MVP homepage scope.
