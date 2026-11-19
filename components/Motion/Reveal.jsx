'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

/** Fade-up reveal when the element scrolls into view (content stays visible without JS). */
export default function Reveal({ children, as: Tag = 'div', y = 60, delay = 0, className = '', ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.from(el, {
        y,
        opacity: 0,
        duration: 1.2,
        delay,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [y, delay]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
