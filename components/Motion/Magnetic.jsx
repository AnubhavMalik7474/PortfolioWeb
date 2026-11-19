'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

/** Magnetic hover: the wrapper (and an optional inner [data-magnetic-text]) drift toward the pointer. */
export default function Magnetic({ children, strength = 0.25, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const inner = el.querySelector('[data-magnetic-text]');
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    const ixTo = inner && gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'power3.out' });
    const iyTo = inner && gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'power3.out' });

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * strength);
      yTo(dy * strength);
      if (inner) {
        ixTo(dx * strength * 0.4);
        iyTo(dy * strength * 0.4);
      }
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
      if (inner) {
        ixTo(0);
        iyTo(0);
      }
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  return (
    <span ref={ref} className={className} style={{ display: 'inline-block' }}>
      {children}
    </span>
  );
}
