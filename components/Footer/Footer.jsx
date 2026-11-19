import Logo from '@/components/Logo/Logo';
import SwapLink from '@/components/SwapLink/SwapLink';
import BackToTop from '@/components/BackToTop/BackToTop';
import { footerLinks } from '@/lib/content';
import { siteConfig } from '@/lib/site';
import styles from './Footer.module.css';

const MARQUEE_TEXT = 'Front-end & UI/UX developer';

export default function Footer() {
  const year = new Date().getFullYear();
  const row = Array.from({ length: 4 });

  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} ${styles.top}`}>
        <Logo size="lg" />
        <div className={styles.columns}>
          <nav aria-labelledby="footer-links-title">
            <h2 id="footer-links-title" className={styles.colTitle}>
              Useful links
            </h2>
            <ul className={styles.links}>
              {footerLinks.map((l) => (
                <li key={l.label}>
                  <SwapLink href={l.href}>{l.label}</SwapLink>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className={styles.colTitle}>Get in touch</h2>
            <ul className={styles.links}>
              <li>
                <SwapLink href={`mailto:${siteConfig.email}`}>{siteConfig.email}</SwapLink>
              </li>
              <li>
                <SwapLink href={`tel:${siteConfig.phone}`}>{siteConfig.phoneLabel}</SwapLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.track}>
          {[0, 1].map((group) => (
            <div key={group} className={styles.group}>
              {row.map((_, i) => (
                <span key={i} className={styles.word}>
                  {MARQUEE_TEXT}
                  <i className={styles.dot} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={`${styles.container} ${styles.bottom}`}>
        <p className={styles.copy}>
          © {year} <a href="#top">{siteConfig.shortName}</a> — {siteConfig.role}. All rights reserved.
        </p>
        <div className={styles.right}>
          <ul className={styles.social}>
            {siteConfig.social.map((s) => (
              <li key={s.label}>
                <SwapLink href={s.href} external>
                  {s.label}
                </SwapLink>
              </li>
            ))}
          </ul>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
