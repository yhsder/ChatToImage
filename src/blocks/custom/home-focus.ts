/**
 * Shared generator-focus helpers. The prompt textarea carries a stable id so
 * sibling blocks can scroll to it and push a prompt in without lifting state
 * or threading refs across blocks.
 */
export const GENERATOR_ID = 'generator';
export const PROMPT_ID = 'home-prompt';
export const PROMPT_EVENT = 'cti:set-prompt';

export function focusGenerator() {
  document.getElementById(GENERATOR_ID)?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });
  window.setTimeout(() => document.getElementById(PROMPT_ID)?.focus(), 480);
}

/** Copy a prompt into the generator from a sibling block (e.g. the examples grid). */
export function setGeneratorPrompt(prompt: string) {
  window.dispatchEvent(new CustomEvent(PROMPT_EVENT, { detail: prompt }));
  focusGenerator();
}
