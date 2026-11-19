'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, setLenis, scrollToTarget, prefersReducedMotion } from '@/lib/gsap';

/** Lenis smooth scrolling synced with GSAP ScrollTrigger + smooth in-page anchor links. */
export default function SmoothScroll() {
  useEffect(() => {
    let lenis = null;
    let tick = null;

    if (!prefersReducedMotion()) {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 1 });
      setLenis(lenis);
      lenis.on('scroll', ScrollTrigger.update);
      tick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // Smooth-scroll for same-page hash links (skipped if a component already handled the click).
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute('href');
      const target = hash === '#top' || hash === '#' ? 0 : document.querySelector(hash);
      if (target === null) return;
      e.preventDefault();
      scrollToTarget(target);
      history.replaceState(null, '', hash === '#' ? location.pathname : hash);
    };
    document.addEventListener('click', onClick);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('load', refresh);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
