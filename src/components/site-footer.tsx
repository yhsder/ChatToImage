import type { ComponentType, ReactNode, SVGProps } from 'react';
import { Mail } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { envConfigs } from '@/config';

export interface FooterColumn {
  title: string;
  /** external: open in a new tab. Off-site (http) hrefs always open in a new tab. */
  links: { label: string; href: string; external?: boolean }[];
}

/** Off-site URLs render as plain <a>; internal paths use the locale-aware Link. */
const isExternalHref = (href: string) => /^https?:\/\//.test(href);

const linkClassName =
  'text-sm text-slate-400 transition-colors duration-200 hover:text-primary';

export interface FooterSocial {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  href: string;
  label: string;
}

function FooterLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
}) {
  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      className={linkClassName}
    >
      {children}
    </Link>
  );
}

export function SiteFooter({
  tagline,
  email,
  columns,
  socials,
  copyright,
}: {
  tagline?: string;
  email?: string;
  columns?: FooterColumn[];
  socials?: FooterSocial[];
  copyright?: string;
}) {
  const year = new Date().getFullYear();
  const name = envConfigs.app_name;

  return (
    <footer className="w-full border-t border-white/10 bg-[#0b101e] text-white">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Link
                href="/"
                aria-label={name}
                title={name}
                className="flex items-center space-x-2 font-bold"
              >
                <img
                  src={envConfigs.app_logo}
                  alt=""
                  className="size-8 rounded-lg"
                />
                <h3 className="mb-0 text-lg font-bold tracking-tight text-slate-50">
                  {name}
                </h3>
              </Link>
            </div>
            {tagline && (
              <p className="text-sm leading-relaxed text-slate-400">
                {tagline}
              </p>
            )}
            {email && (
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Mail className="text-primary h-4 w-4" />
                <a
                  href={`mailto:${email}`}
                  className="hover:text-primary text-slate-200 transition"
                >
                  {email}
                </a>
              </div>
            )}
          </div>

          {columns && columns.length > 0 && (
            <div className="flex flex-col gap-8 sm:flex-row sm:gap-16 md:col-span-3 md:ml-16 lg:gap-24">
              {columns.map((col) => (
                <div
                  key={col.title}
                  className="min-w-[9rem] shrink-0 space-y-4"
                >
                  <h3 className="text-sm font-bold tracking-[0.18em] text-slate-200 uppercase">
                    {col.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <FooterLink href={link.href} external={link.external}>
                          {link.label}
                        </FooterLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-sm text-slate-500">
              {copyright || `© ${year} ${name}. All rights reserved.`}
            </div>
            {socials && socials.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary text-slate-400 transition-colors"
                  >
                    <s.icon className="size-[18px]" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
