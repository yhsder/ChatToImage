import { Link } from '@/core/i18n/navigation';
import { m } from '@/paraglide/messages.js';
import { HomeSectionHeading } from '@/components/custom/home-section-heading';

import { focusGenerator } from './home-focus';

export function HomePricing() {
  return (
    <section
      className="section"
      id="pricing"
      aria-labelledby="home-pricing-title"
    >
      <div className="shell">
        <HomeSectionHeading
          eyebrow={m['home.pricing.index']()}
          heading={m['home.pricing.heading']()}
          lead={m['home.pricing.lead']()}
          headingId="home-pricing-title"
        />
        <div className="pricing-table">
          <article className="price-row">
            <div>
              <span className="price-kicker">
                {m['home.pricing.free_kicker']()}
              </span>
              <h3>{m['home.pricing.free_title']()}</h3>
            </div>
            <p>{m['home.pricing.free_body']()}</p>
            <a
              className="price-action"
              href="#generator"
              onClick={(e) => {
                e.preventDefault();
                focusGenerator();
              }}
            >
              {m['home.pricing.free_action']()} ↑
            </a>
          </article>
          <article className="price-row">
            <div>
              <span className="price-kicker">
                {m['home.pricing.sub_kicker']()}
              </span>
              <h3>{m['home.pricing.sub_title']()}</h3>
            </div>
            <p>{m['home.pricing.sub_body']()}</p>
            <Link className="price-action" href="/pricing">
              {m['home.pricing.sub_action']()} →
            </Link>
          </article>
          <article className="price-row">
            <div>
              <span className="price-kicker">
                {m['home.pricing.pack_kicker']()}
              </span>
              <h3>{m['home.pricing.pack_title']()}</h3>
            </div>
            <p>{m['home.pricing.pack_body']()}</p>
            <Link className="price-action" href="/pricing">
              {m['home.pricing.pack_action']()} →
            </Link>
          </article>
        </div>
        <div className="section-action">
          <Link className="primary-button" href="/pricing">
            {m['home.pricing.cta']()}
          </Link>
        </div>
      </div>
    </section>
  );
}
