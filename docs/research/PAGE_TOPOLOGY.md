# ChatToImage Homepage Topology

The reference structure is adapted to the approved homepage CRO sequence. Product copy comes from `/Users/yangjilin/Desktop/homepage-cro-plan.md`, not from pixmira.ai.

1. Sticky header
2. Hero and generator
3. Examples
4. How It Works
5. Product benefits
6. Compact pricing
7. FAQ
8. Final CTA
9. Footer

The generator is the primary interaction surface and the destination for all repeated CTAs. No blog, support widget, testimonial strip, model selector, or fabricated usage metrics are included.

Interaction model:

- Header: sticky and click-driven.
- Generator controls: click-driven local state.
- Authentication gate: appears only after an unauthenticated visitor clicks Generate. Prompt, style, and ratio are stored in session storage.
- Result state: demo example by default, then loading/success/failure state transitions in the generator component.
- Examples: click-driven prompt reuse.
- FAQ: click-driven accordion.
- Other sections: static with reveal-on-intersection motion.
