import { m } from '@/paraglide/messages.js';
import { HomeSectionHeading } from '@/components/custom/home-section-heading';

export function HomeBenefits() {
  const benefits = [
    {
      title: m['home.benefits.b1_title'](),
      body: m['home.benefits.b1_body'](),
    },
    {
      title: m['home.benefits.b2_title'](),
      body: m['home.benefits.b2_body'](),
    },
    {
      title: m['home.benefits.b3_title'](),
      body: m['home.benefits.b3_body'](),
    },
  ];

  return (
    <section className="section" aria-labelledby="home-benefits-title">
      <div className="shell">
        <HomeSectionHeading
          eyebrow={m['home.benefits.index']()}
          heading={m['home.benefits.heading']()}
          lead={m['home.benefits.lead']()}
          headingId="home-benefits-title"
        />
        <div className="benefits">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="benefit">
              <span className="benefit-mark"></span>
              <h3>{benefit.title}</h3>
              <p>{benefit.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
