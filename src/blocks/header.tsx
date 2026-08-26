'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

import { useSession } from '@/core/auth/client';
import { tDynamic } from '@/core/i18n/dynamic';
import { Link } from '@/core/i18n/navigation';
import { envConfigs } from '@/config';
import { m } from '@/paraglide/messages.js';
import { SiteUserMenu } from '@/components/site-user-menu';

const navLinks = [
  { href: '/#examples', label: 'landing.nav.examples' },
  { href: '/#how-it-works', label: 'landing.nav.how_it_works' },
  { href: '/#pricing', label: 'landing.nav.pricing' },
  { href: '/#faq', label: 'landing.nav.faq' },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b101e]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-amber-300 font-black text-slate-950 shadow-[0_0_0_1px_rgba(250,204,66,0.25)]">
            C
          </span>
          <span className="text-sm font-bold tracking-tight text-slate-100">
            {envConfigs.app_name}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-400 transition-colors hover:text-slate-100"
            >
              {tDynamic(link.label)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <SiteUserMenu
              name={user.name || 'User'}
              email={user.email}
              image={user.image}
            />
          ) : (
            <Link
              href="/sign-in"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-slate-50"
            >
              {m['common.nav.sign_in']()}
            </Link>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/5 hover:text-white md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
              >
                {tDynamic(link.label)}
              </Link>
            ))}
            {user ? (
              <div className="mt-2 flex items-center border-t border-white/10 px-3 pt-3">
                <SiteUserMenu
                  name={user.name || 'User'}
                  email={user.email}
                  image={user.image}
                />
              </div>
            ) : (
              <Link
                href="/sign-in"
                onClick={() => setMobileOpen(false)}
                className="mt-2 border-t border-white/10 px-3 pt-3 text-sm font-medium text-amber-300"
              >
                {m['common.nav.sign_in']()}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
