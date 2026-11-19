'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Logo from '@/components/Logo/Logo';
import MenuPanel from '@/components/MenuPanel/MenuPanel';
import { getLenis } from '@/lib/gsap';
import styles from './Header.module.css';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const buttonRef = useRef(null);
  const openRef = useRef(open);
  openRef.current = open;

  // Sticky behaviour: hide while scrolling down, reveal (with background) when scrolling up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      if (!openRef.current) setHidden(y > lastY && y > 240);
      lastY = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock scrolling + Escape to close while the menu is open.
  useEffect(() => {
    const lenis = getLenis();
    if (open) {
      lenis ? lenis.stop() : document.body.classList.add('is-locked');
    } else {
      lenis ? lenis.start() : document.body.classList.remove('is-locked');
    }
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  const headerClass = [styles.header, scrolled && styles.scrolled, hidden && styles.hidden, open && styles.menuOpen]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <header className={headerClass}>
        <div className={styles.bar}>
          <Logo />
          <button
            ref={buttonRef}
            type="button"
            className={`${styles.toggle} ${open ? styles.open : ''}`}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={styles.words} aria-hidden="true">
              <span className={styles.menuText}>Menu</span>
              <span className={styles.openText}>Open</span>
              <span className={styles.closeText}>Close</span>
            </span>
            <span className={styles.divider} aria-hidden="true">
              <span className={styles.line1} />
              <span className={styles.line2} />
            </span>
          </button>
        </div>
      </header>
      <MenuPanel open={open} onClose={close} />
    </>
  );
}
