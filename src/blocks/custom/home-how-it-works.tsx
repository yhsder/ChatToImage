import { m } from '@/paraglide/messages.js';
import { HomeSectionHeading } from '@/components/custom/home-section-heading';

import { focusGenerator } from './home-focus';

export function HomeHowItWorks() {
  const steps = [
    {
      number: '01',
      label: m['home.how.step1_label'](),
      title: m['home.how.step1_title'](),
      body: m['home.how.step1_body'](),
    },
    {
      number: '02',
      label: m['home.how.step2_label'](),
      title: m['home.how.step2_title'](),
      body: m['home.how.step2_body'](),
    },
    {
      number: '03',
      label: m['home.how.step3_label'](),
      title: m['home.how.step3_title'](),
      body: m['home.how.step3_body'](),
    },
  ];

  return (
    <section
      className="section"
      id="how-it-works"
      aria-labelledby="home-how-title"
    >
      <div className="shell">
        <HomeSectionHeading
          eyebrow={m['home.how.index']()}
          heading={m['home.how.heading']()}
          lead={m['home.how.lead']()}
          headingId="home-how-title"
        />
        <div className="steps">
          {steps.map((step) => (
            <article key={step.number} className="step">
              <span className="step-number">
                {step.number} · {step.label}
              </span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
        <div className="section-action">
          <a
            className="primary-button"
            href="#generator"
            onClick={(e) => {
              e.preventDefault();
              focusGenerator();
            }}
          >
            {m['home.how.cta']()} ↑
          </a>
        </div>
      </div>
    </section>
  );
}
