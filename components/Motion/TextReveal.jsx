'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

/** Paragraph whose words light up one by one as it scrolls through the viewport. */
export default function TextReveal({ text, as: Tag = 'p', className = '', wordClassName = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('[data-word]'),
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 45%', scrub: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const words = text.split(' ');
  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} data-word className={wordClassName}>
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
