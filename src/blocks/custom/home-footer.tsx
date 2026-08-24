import { Link } from '@/core/i18n/navigation';
import { m } from '@/paraglide/messages.js';
import { HomeBrandMark } from '@/components/custom/home-brand-mark';

export function HomeFooter({ year }: { year: number }) {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-grid">
          <div className="footer-brand">
            <a className="brand" href="#top">
              <HomeBrandMark />
              ChatToImage
            </a>
            <p>{m['home.footer.brand_line']()}</p>
          </div>
          <nav className="footer-links" aria-label="Product links">
            <strong>{m['home.footer.product_label']()}</strong>
            <a href="#examples">{m['home.nav.examples']()}</a>
            <a href="#how-it-works">{m['home.nav.how_it_works']()}</a>
            <a href="#pricing">{m['home.nav.pricing']()}</a>
            <a href="#faq">{m['home.nav.faq']()}</a>
          </nav>
          <nav className="footer-links" aria-label="Legal and account links">
            <strong>{m['home.footer.company_label']()}</strong>
            <Link href="/privacy-policy">{m['home.footer.privacy']()}</Link>
            <Link href="/terms-of-service">{m['home.footer.terms']()}</Link>
            <Link href="/sign-in">{m['home.nav.sign_in']()}</Link>
          </nav>
        </div>
        <div className="copyright">
          <span>{m['home.footer.copyright']({ year })}</span>
          <span>{m['home.footer.tagline']()}</span>
        </div>
      </div>
    </footer>
  );
}
