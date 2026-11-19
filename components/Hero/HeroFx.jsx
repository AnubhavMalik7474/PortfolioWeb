'use client';

import { useEffect, useRef } from 'react';
import { gsap, onAppLoaded, prefersReducedMotion } from '@/lib/gsap';

const VB_W = 1920;
const VB_H = 1080;

/**
 * Hero interactions:
 *  - a soft spotlight mask that follows the cursor and turns nearby grid outlines accent-red
 *    (drifts on its own when the pointer is idle or on touch devices)
 *  - intro reveal after the preloader
 *  - content fades out while scrolling away (like the reference "scroll-opacity")
 */
export default function HeroFx() {
  const ref = useRef(null);

  useEffect(() => {
    const section = ref.current?.parentElement;
    if (!section) return;
    const spot = section.querySelector('[data-hero-spot]');
    const hot = section.querySelector('[data-hero-hot]');
    const spotR = { r: 340 }; // spotlight radius in 1920-wide design px
    const content = section.querySelector('[data-hero-content]');
    const backdrop = section.querySelector('[data-hero-backdrop]');
    const lines = section.querySelectorAll('[data-hero-line]');
    const reduce = prefersReducedMotion();

    let w = section.offsetWidth;
    let h = section.offsetHeight;
    const ro = new ResizeObserver(() => {
      w = section.offsetWidth;
      h = section.offsetHeight;
    });
    ro.observe(section);

    const pos = { x: w * 0.56, y: h * 0.2 };
    const target = { ...pos };
    let lastMove = -Infinity;
    let inView = true;

    const onMove = (e) => {
      const r = section.getBoundingClientRect();
      if (e.clientY > r.bottom) return;
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
      lastMove = performance.now();
    };

    const apply = () => {
      if (hot) {
        // Image mode: move the CSS radial mask (section-local px).
        const scale = Math.max(w / VB_W, h / VB_H);
        hot.style.setProperty('--mx', `${pos.x.toFixed(1)}px`);
        hot.style.setProperty('--my', `${pos.y.toFixed(1)}px`);
        hot.style.setProperty('--spot-r', `${(spotR.r * scale).toFixed(1)}px`);
        return;
      }
      // SVG mode: map section coords → viewBox coords (preserveAspectRatio "xMidYMid slice").
      const scale = Math.max(w / VB_W, h / VB_H);
      const ox = (w - VB_W * scale) / 2;
      const oy = (h - VB_H * scale) / 2;
      spot.setAttribute('cx', ((pos.x - ox) / scale).toFixed(1));
      spot.setAttribute('cy', ((pos.y - oy) / scale).toFixed(1));
    };

    const tick = () => {
      if (!inView) return;
      const now = performance.now();
      if (now - lastMove > 2500) {
        const t = now / 1000;
        target.x = w * (0.62 + 0.24 * Math.sin(t * 0.42));
        target.y = h * (0.46 + 0.22 * Math.sin(t * 0.67 + 1));
      }
      pos.x += (target.x - pos.x) * 0.08;
      pos.y += (target.y - pos.y) * 0.08;
      apply();
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    io.observe(section);

    const ctx = gsap.context(() => {}, section);

    if (reduce) {
      apply();
    } else {
      window.addEventListener('mousemove', onMove, { passive: true });
      gsap.ticker.add(tick);

      ctx.add(() => {
        gsap.to(content, {
          opacity: 0,
          y: -90,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to(backdrop, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
        });
      });
    }

    const offLoaded = reduce
      ? () => {}
      : onAppLoaded(() => {
          ctx.add(() => {
            gsap.from(lines, { y: 90, opacity: 0, duration: 1.4, stagger: 0.14, ease: 'power4.out', clearProps: 'transform,opacity' });
            if (hot) gsap.from(spotR, { r: 0, duration: 1.6, ease: 'expo.out' });
            else gsap.from(spot, { attr: { r: 0 }, duration: 1.6, ease: 'expo.out' });
          });
        });

    return () => {
      offLoaded();
      window.removeEventListener('mousemove', onMove);
      gsap.ticker.remove(tick);
      io.disconnect();
      ro.disconnect();
      ctx.revert();
    };
  }, []);

  return <span ref={ref} hidden />;
}
