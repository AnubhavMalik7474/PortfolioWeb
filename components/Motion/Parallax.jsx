'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

/** Scroll-linked vertical parallax for its child (translates the inner wrapper). */
export default function Parallax({ children, speed = 10, scale = 1, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.firstElementChild,
        { yPercent: -speed, scale },
        {
          yPercent: speed,
          scale,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [speed, scale]);

  return (
    <div ref={ref} className={className}>
      <div>{children}</div>
    </div>
  );
}
