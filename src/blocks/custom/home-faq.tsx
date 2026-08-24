import { m } from '@/paraglide/messages.js';
import { HomeSectionHeading } from '@/components/custom/home-section-heading';

export function HomeFAQ() {
  const faqs = [
    { q: m['home.faq.q1'](), a: m['home.faq.a1']() },
    { q: m['home.faq.q2'](), a: m['home.faq.a2']() },
    { q: m['home.faq.q3'](), a: m['home.faq.a3']() },
    { q: m['home.faq.q4'](), a: m['home.faq.a4']() },
    { q: m['home.faq.q5'](), a: m['home.faq.a5']() },
    { q: m['home.faq.q6'](), a: m['home.faq.a6']() },
  ];

  return (
    <section className="section" id="faq" aria-labelledby="home-faq-title">
      <div className="shell">
        <HomeSectionHeading
          eyebrow={m['home.faq.index']()}
          heading={m['home.faq.heading']()}
          lead={m['home.faq.lead']()}
          headingId="home-faq-title"
        />
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details key={faq.q} className="faq-item" open={index === 0}>
              <summary>
                <span>{faq.q}</span>
                <span className="faq-plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="faq-answer">{faq.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
