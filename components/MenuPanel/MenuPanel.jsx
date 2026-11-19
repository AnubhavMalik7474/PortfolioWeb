'use client';

import { useEffect, useRef } from 'react';
import SwapLink from '@/components/SwapLink/SwapLink';
import { siteConfig } from '@/lib/site';
import { getLenis, scrollToTarget } from '@/lib/gsap';
import styles from './MenuPanel.module.css';

export default function MenuPanel({ open, onClose }) {
  const firstLinkRef = useRef(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => firstLinkRef.current?.focus({ preventScroll: true }), 500);
      return () => clearTimeout(t);
    }
  }, [open]);

  const go = (e, href) => {
    e.preventDefault();
    onClose();
    getLenis()?.start();
    const target = href === '#top' ? 0 : document.querySelector(href);
    if (target !== null) {
      setTimeout(() => scrollToTarget(target, { force: true }), 350);
      history.replaceState(null, '', href);
    }
  };

  return (
    <div
      id="site-menu"
      className={`${styles.panel} ${open ? styles.active : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      inert={!open}
    >
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.inner}>
          <div className={styles.top}>
            <div className={styles.connect}>
              <p className={styles.label}>#Connect</p>
              <ul className={styles.social}>
                {siteConfig.social.map((s, i) => (
                  <li key={s.label} style={{ '--i': i }}>
                    <SwapLink href={s.href} external>
                      {s.label}
                    </SwapLink>
                  </li>
                ))}
              </ul>
            </div>
            <nav aria-label="Primary" className={styles.nav}>
              <ul>
                {siteConfig.nav.map((item, i) => (
                  <li key={item.href} style={{ '--i': i }}>
                    <a
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={item.href}
                      className={styles.navLink}
                      onClick={(e) => go(e, item.href)}
                    >
                      <span className={styles.num} aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className={styles.navText}>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className={styles.bottom}>
            <div>
              <p className={styles.question}>Have a project in mind? Let's talk.</p>
              <a className={styles.email} href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </div>
            <a className={styles.tel} href={`tel:${siteConfig.phone}`}>
              <span className={styles.plus} aria-hidden="true">
                +
              </span>
              <span className={styles.telText}>{siteConfig.phoneLabel}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
