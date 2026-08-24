import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { m } from '@/paraglide/messages.js';
import { getLocale, locales, localizeUrl } from '@/paraglide/runtime.js';
import { HomeBenefits } from '@/blocks/custom/home-benefits';
import { HomeExamples } from '@/blocks/custom/home-examples';
import { HomeFAQ } from '@/blocks/custom/home-faq';
import { HomeFinalCta } from '@/blocks/custom/home-final-cta';
import { HomeFooter } from '@/blocks/custom/home-footer';
import { HomeHeader } from '@/blocks/custom/home-header';
import { HomeHero } from '@/blocks/custom/home-hero';
import { HomeHowItWorks } from '@/blocks/custom/home-how-it-works';
import { HomePricing } from '@/blocks/custom/home-pricing';

import '@/styles/home.css';

/**
 * ChatToImage homepage — marketing page + generator UI shell.
 * See docs/designs/homepage-implementation-spec.md and docs/adr/0001-homepage-ui-shell.md.
 */
function HomePage() {
  return (
    <div className="home-root">
      <HomeHeader />
      <main id="top">
        <HomeHero />
        <HomeExamples />
        <HomeHowItWorks />
        <HomeBenefits />
        <HomePricing />
        <HomeFAQ />
        <HomeFinalCta />
      </main>
      <HomeFooter />
    </div>
  );
}

export const Route = createFileRoute('/')({
  loader: () => {
    const locale = getLocale();
    return { locale };
  },
  head: ({ loaderData }) => {
    const locale = loaderData?.locale ?? 'en';
    const urlFor = (loc: string) =>
      localizeUrl(`${envConfigs.app_url}/`, { locale: loc as any }).href;
    return {
      meta: [
        {
          title: m['home.meta.title']({}, { locale: locale as any }),
        },
        {
          name: 'description',
          content: m['home.meta.description']({}, { locale: locale as any }),
        },
      ],
      links: [
        { rel: 'canonical', href: urlFor(locale) },
        ...locales.map((loc) => ({
          rel: 'alternate',
          hrefLang: loc,
          href: urlFor(loc),
        })),
        { rel: 'alternate', hrefLang: 'x-default', href: urlFor('en') },
      ],
    };
  },
  component: HomePage,
});
