'use client';

import { useSession } from '@/core/auth/client';
import { envConfigs } from '@/config';
import { m } from '@/paraglide/messages.js';
import { SiteFooter, type FooterColumn } from '@/components/site-footer';

export function Footer() {
  const { data: session } = useSession();
  const user = session?.user;

  const columns: FooterColumn[] = [
    {
      title: m['landing.footer.product_links'](),
      links: [
        { label: m['landing.nav.examples'](), href: '/#examples' },
        { label: m['landing.nav.how_it_works'](), href: '/#how-it-works' },
        { label: m['landing.nav.pricing'](), href: '/pricing' },
        { label: m['landing.nav.faq'](), href: '/#faq' },
      ],
    },
    {
      title: m['landing.footer.legal'](),
      links: [
        { label: m['landing.footer.privacy'](), href: '/privacy-policy' },
        { label: m['landing.footer.terms'](), href: '/terms-of-service' },
      ],
    },
    {
      title: m['landing.footer.account'](),
      links: [
        user
          ? { label: m['common.nav.settings'](), href: '/settings' }
          : { label: m['common.nav.sign_in'](), href: '/sign-in' },
      ],
    },
  ];

  return (
    <SiteFooter
      tagline={m['landing.footer.brand_line']()}
      columns={columns}
      copyright={`© ${new Date().getFullYear()} ${envConfigs.app_name}. ${m['landing.footer.copyright']()}`}
    />
  );
}
