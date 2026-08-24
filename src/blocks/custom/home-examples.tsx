import { m } from '@/paraglide/messages.js';
import { HomeSectionHeading } from '@/components/custom/home-section-heading';

import { setGeneratorPrompt } from './home-focus';

export function HomeExamples() {
  const examples = [
    {
      art: 'art-product',
      category: m['home.examples.cat_product'](),
      prompt: m['home.examples.prompt_product'](),
    },
    {
      art: 'art-portrait',
      category: m['home.examples.cat_portrait'](),
      prompt: m['home.examples.prompt_portrait'](),
    },
    {
      art: 'art-fantasy',
      category: m['home.examples.cat_fantasy'](),
      prompt: m['home.examples.prompt_fantasy'](),
    },
    {
      art: 'art-illustration',
      category: m['home.examples.cat_illustration'](),
      prompt: m['home.examples.prompt_illustration'](),
    },
    {
      art: 'art-poster',
      category: m['home.examples.cat_poster'](),
      prompt: m['home.examples.prompt_poster'](),
    },
    {
      art: 'art-interior',
      category: m['home.examples.cat_interior'](),
      prompt: m['home.examples.prompt_interior'](),
    },
    {
      art: 'art-nature',
      category: m['home.examples.cat_nature'](),
      prompt: m['home.examples.prompt_nature'](),
    },
    {
      art: 'art-complex',
      category: m['home.examples.cat_complex'](),
      prompt: m['home.examples.prompt_complex'](),
    },
  ];

  return (
    <section
      className="section"
      id="examples"
      aria-labelledby="home-examples-title"
    >
      <div className="shell">
        <HomeSectionHeading
          eyebrow={m['home.examples.index']()}
          heading={m['home.examples.heading']()}
          lead={m['home.examples.lead']()}
          headingId="home-examples-title"
        />
        <div className="examples-note">
          <span>{m['home.examples.scaffold_left']()}</span>
          <span>{m['home.examples.scaffold_right']()}</span>
        </div>
        <div className="examples-grid">
          {examples.map((example, index) => (
            <article key={example.art} className="example-card">
              <div className={`example-visual ${example.art}`}>
                <span className="image-tag">{example.category}</span>
              </div>
              <div className="example-content">
                <div className="example-category">
                  <strong>{m['home.result.prompt_used']()}</strong>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <p className="example-prompt">{example.prompt}</p>
                <button
                  className="try-prompt"
                  type="button"
                  onClick={() => setGeneratorPrompt(example.prompt)}
                >
                  {m['home.result.try_this']()} ↑
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
