import { m } from '@/paraglide/messages.js';

import { HomeGenerator } from './home-generator';

/** Split a headline into three balanced lines (words for Latin, chars for CJK). */
function splitHeadline(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const words = trimmed.split(/\s+/);
  if (words.length > 1) {
    const per = Math.ceil(words.length / 3);
    const lines: string[] = [];
    for (let i = 0; i < words.length; i += per) {
      lines.push(words.slice(i, i + per).join(' '));
    }
    return lines;
  }

  const chars = Array.from(trimmed);
  const per = Math.ceil(chars.length / 3);
  const lines: string[] = [];
  for (let i = 0; i < chars.length; i += per) {
    lines.push(chars.slice(i, i + per).join(''));
  }
  return lines;
}

export function HomeHero() {
  const headline = m['home.hero.headline']();
  const lines = splitHeadline(headline);

  return (
    <section className="hero shell" aria-labelledby="home-hero-title">
      <div className="hero-heading">
        <div>
          <p className="eyebrow">{m['home.hero.eyebrow']()}</p>
          <h1 id="home-hero-title" aria-label={headline}>
            {lines.map((line) => (
              <span key={line} style={{ display: 'block' }}>
                {line}
              </span>
            ))}
          </h1>
        </div>
        <p className="hero-copy">{m['home.hero.subheadline']()}</p>
      </div>
      <HomeGenerator />
    </section>
  );
}
