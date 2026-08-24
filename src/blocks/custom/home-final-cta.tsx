import { m } from '@/paraglide/messages.js';

import { focusGenerator } from './home-focus';

export function HomeFinalCta() {
  return (
    <section className="final-cta" aria-labelledby="home-final-title">
      <div className="shell final-cta-grid">
        <h2 id="home-final-title">{m['home.final.heading']()}</h2>
        <div>
          <p>{m['home.final.body']()}</p>
          <a
            className="primary-button"
            href="#generator"
            onClick={(e) => {
              e.preventDefault();
              focusGenerator();
            }}
          >
            {m['home.generator.generate']()} ↑
          </a>
          <p className="final-note">{m['home.final.note']()}</p>
        </div>
      </div>
    </section>
  );
}
