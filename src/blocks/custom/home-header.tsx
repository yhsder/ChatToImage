import { useState } from 'react';

// Self-hosted body + meta fonts; display font (Cabinet Grotesk) loads below.
import '@fontsource/source-sans-3/400.css';
import '@fontsource/source-sans-3/600.css';
import '@fontsource/source-sans-3/700.css';
import '@fontsource/jetbrains-mono/700.css';

import { Link } from '@/core/i18n/navigation';
import { m } from '@/paraglide/messages.js';
import { HomeBrandMark } from '@/components/custom/home-brand-mark';

export function HomeHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: '#examples', label: m['home.nav.examples']() },
    { href: '#how-it-works', label: m['home.nav.how_it_works']() },
    { href: '#pricing', label: m['home.nav.pricing']() },
    { href: '#faq', label: m['home.nav.faq']() },
  ];

  return (
    <header className="site-header">
      <link rel="preconnect" href="https://api.fontshare.com" />
      <link
        rel="stylesheet"
        href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@700,800&display=swap"
      />
      <div className="shell">
        <nav className="site-nav">
          <a className="brand" href="#top">
            <HomeBrandMark />
            ChatToImage
          </a>
          <div className="nav-links">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
          <div className="nav-end">
            <Link className="sign-in" href="/sign-in">
              {m['home.nav.sign_in']()}
            </Link>
            <button
              className="menu-button"
              type="button"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? m['home.nav.close']() : m['home.nav.menu']()}
            </button>
          </div>
        </nav>
        <div className={`mobile-menu${menuOpen ? 'is-open' : ''}`}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link href="/sign-in" onClick={() => setMenuOpen(false)}>
            {m['home.nav.sign_in']()}
          </Link>
        </div>
      </div>
    </header>
  );
}
