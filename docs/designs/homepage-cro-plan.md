# Homepage CRO Plan

**Status:** COPY REVIEWED — PENDING PRODUCT VERIFICATION
**Last updated:** 2026-08-21
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

#### Approved page copy

> **Logo:** ChatToImage
>
> **Navigation:** Examples · How It Works · Pricing · FAQ
>
> **Account action:** Sign In

The header keeps one quiet account action and lets the generator remain the page's primary action. This applies Hick's Law by avoiding competing CTAs.

Implementation requirements:

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

The Hero and generator form one above-the-fold experience. The following copy is reproduced from the reviewed source at `docs/copy/homepage-hero.md`; keep the two documents synchronized if it changes.

#### Approved page copy

> **Headline**
>
> Chat to Image: Turn Text Into AI Images
>
> **Subheadline**
>
> Describe what you want to see in plain language, choose an aspect ratio, then generate and download your image.
>
> **Primary CTA:** Generate My Image
>
> **CTA supporting copy:** Create a free account to get `{free_credit_amount}` credits. Failed generations won’t cost you credits.
>
> **Prompt label:** Describe your image
>
> **Prompt helper text:** Include the subject, setting, lighting, and style you want.
>
> **Prompt placeholder:** A tiny astronaut tending a glowing garden on the moon, cinematic lighting, detailed digital art

This puts the tool and immediate reward in the first viewport, reducing activation energy and satisfying present bias.

Generator requirements:

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

#### Approved page copy

> **Initial label:** Example output
>
> **Prompt label:** Prompt used
>
> **Prompt value:** `{verified_example_prompt}`
>
> **Initial action:** Try This Prompt
>
> **Loading title:** Creating your image
>
> **Loading message:** We’re creating your image. Keep this page open while it finishes.
>
> **Success title:** Your image is ready
>
> **Success actions:** Download Image · Generate Another
>
> **Retryable error title:** We couldn’t complete this image
>
> **Retryable error message:** This attempt won’t cost you any credits. Try again now or adjust your prompt.
>
> **Retryable error actions:** Try Again · Edit Prompt
>
> **Timeout title:** This image took too long
>
> **Timeout message:** This attempt won’t cost you any credits. Try the same prompt again when you’re ready.
>
> **Timeout action:** Try Again
>
> **Content rejection title:** This prompt can’t be generated
>
> **Content rejection message:** This attempt won’t cost you any credits. Revise your prompt and try again.
>
> **Content rejection action:** Edit Prompt

The labelled example makes the outcome easy to imagine through the availability heuristic. Explicit credit protection and recovery actions use ethical risk reversal to reduce regret aversion.

The result area must support:

- Loading progress or clear waiting feedback
- Successful preview
- Download
- Generate again
- Retryable provider or timeout failure
- Non-retryable content rejection
- Clear confirmation that unsuccessful attempts do not consume credits

### 4. Examples

#### Approved page copy

> **Heading:** See What You Can Create
>
> **Supporting copy:** Explore eight images made with this generator—and see the exact prompt behind each one. Browse product shots, portraits, posters, fantasy scenes, and more.
>
> **Prompt label:** Prompt used
>
> **Card action:** Try This Prompt
>
> **Card categories:** Product · Portrait · Fantasy · Illustration · Poster · Interior · Nature · Complex Scene

Real outputs and visible prompts substitute product evidence for unavailable testimonials. The `Try This Prompt` action also lowers activation energy by giving visitors a useful starting point.

Requirements:

- Show eight model-tested examples.
- Cover product imagery, people, fantasy, anime or illustration, posters, interiors, nature, and complex compositions.
- Display or reveal the source prompt for every example.
- Let visitors copy an example prompt into the Hero generator.
- Only use outputs from prompts that pass the repeatability criteria in the SEO MVP release plan.
- Never use stock or externally generated examples that the production model cannot reproduce reliably.

### 5. How It Works

#### Approved page copy

> **Heading:** From Prompt to Picture in Three Steps
>
> **Supporting copy:** Go from a plain-language prompt to a downloadable image in three simple steps.
>
> **Step 1 — Describe:** Write what you want to see in plain language. Add the subject, setting, lighting, and style when those details matter.
>
> **Step 2 — Generate:** Choose an aspect ratio, then generate a new image from your prompt.
>
> **Step 3 — Download:** Save the result you like, or adjust your prompt and generate a new version.
>
> **Section CTA:** Try It Now

Three concrete steps use chunking to increase perceived ability in the BJ Fogg Behavior Model. The CTA scrolls to and focuses the Hero prompt instead of opening authentication directly.

### 6. Product Benefits

Use three conversion-focused benefits instead of a generic feature grid.

#### Approved page copy

> **Heading:** From Prompt to Download—Without the Learning Curve
>
> **Supporting copy:** Create an image without learning complex prompt syntax or digging through dozens of settings.
>
> **Describe It Naturally:** Describe the image you want in everyday words. Add the subject, setting, lighting, and style when those details matter.
>
> **Just the Controls That Matter:** Choose an aspect ratio without navigating a professional design workflow or a wall of model settings.
>
> **Credits Protected on Failed Attempts:** Failed generations won’t reduce your final credit balance.

These benefits follow Jobs to Be Done: they focus on reaching a usable image with less learning, fewer decisions, and lower financial risk.

Do not claim superior image quality, speed, price, or unlimited usage without supporting evidence.

### 7. Compact Pricing

#### Approved page copy

> **Heading:** Start Free. Choose How You Pay for More.
>
> **Supporting copy:** Create a free account and get `{free_credit_amount}` credits to try the generator. No payment method is required.
>
> **Free to Try:** Use your signup credits to create your first images before choosing a paid option.
>
> **Subscription:** Generate regularly with a recurring plan and a fresh credit allowance each billing period.
>
> **One-Time Credit Pack:** Need images only now and then? Buy credits once without starting a subscription.
>
> **Section CTA:** Compare Plans and Credit Packs

The free starting point uses the zero-price effect and reciprocity, while two clearly separated paid paths reduce choice anxiety. The wording avoids artificial urgency and makes the recurring commitment explicit.

Requirements:

- Show the exact signup credit amount before launch.
- Link to the full `/pricing` page for plan details and checkout.
- Keep the distinction between subscriptions and credit packs clear.
- Do not use vague unlimited-generation claims.

### 8. FAQ

#### Approved page copy

> **What is chat to image?**
>
> Chat to image means describing a picture in natural language and using AI to create it. With ChatToImage, enter one prompt, choose an aspect ratio, and generate a downloadable image.
>
> **Can I generate images for free?**
>
> Yes. New accounts receive `{free_credit_amount}` credits, with no payment method required. When those credits run out, you can choose a subscription or buy a one-time credit pack.
>
> **Does ChatToImage support conversational image editing?**
>
> ChatToImage accepts natural-language prompts, but each submission is a separate image request. It does not remember earlier messages or revise images from conversation history.
>
> **What happens if a generation fails?**
>
> Failed generations do not reduce your final credit balance. We show what happened and whether you can retry the same prompt or need to revise it.
>
> **Can I use generated images commercially?**
>
> Commercial use depends on the model license, our Terms of Service, and any rights that apply to your prompt and output. Review the current terms before using an image in paid work, advertising, merchandise, or client projects.
>
> **Who is ChatToImage for?**
>
> ChatToImage is for anyone who wants a direct path from a plain-language prompt to a downloadable image without a complex design workflow. It is not designed for multi-turn editing, batch production, or model comparison.

The FAQ answers price, effort, failure, rights, and product-boundary objections at the point of decision. The candid fit statement uses the Pratfall Effect without diminishing the product's core job.

Commercial-use wording must follow the selected provider’s confirmed license. Add a data-retention FAQ only after the retention period, deletion behavior, privacy policy, and provider requirements are implemented and verified.

### 9. Final CTA

#### Approved page copy

> **Heading:** Create Your First AI Image
>
> **Supporting copy:** Describe your idea, generate your first image with free credits, and download the result you like.
>
> **CTA:** Generate My Image
>
> **CTA supporting copy:** Not sure what to write? Start with one of the prompts above.

The repeated action uses mere exposure and consistency, while prompt reuse removes the last blank-page barrier.

The CTA scrolls to and focuses the Hero prompt. It does not send a visitor directly to signup.

### 10. Footer

#### Approved page copy

> **Brand:** ChatToImage
>
> **Brand line:** Turn plain-language ideas into downloadable AI images.
>
> **Product links:** Examples · How It Works · Pricing · FAQ
>
> **Legal links:** Privacy Policy · Terms of Service
>
> **Account link:** Sign In
>
> **Copyright:** © `{current_year}` ChatToImage. All rights reserved.

The concise footer ends with access to pricing, policies, and an existing account, reinforcing transparency at the page's final decision point.

Do not show the Blog or a floating support widget in the SEO MVP homepage.

## Trust Strategy

The MVP has no customer logos, testimonials, ratings, or usage metrics. Do not fabricate a conventional social-proof section.

Use product evidence instead:

- Reproducible examples with source prompts
- Transparent free-credit disclosure
- Verified credit reversal for every failure state promised on the page
- Clear commercial-use guidance
- Data-retention guidance only after the policy and deletion behavior are implemented
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
