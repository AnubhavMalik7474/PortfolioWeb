'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import styles from './Cursor.module.css';

const INTERACTIVE = 'a, button, [data-cursor]';

/** Custom follower cursor — only on devices with a fine pointer. */
export default function Cursor() {
  const ref = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mq.matches) return;
    const el = ref.current;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

    const onMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      el.classList.add(styles.visible);
    };
    const onOver = (e) => {
      const target = e.target.closest?.(INTERACTIVE);
      const label = target?.dataset.cursorLabel || '';
      el.classList.toggle(styles.active, Boolean(target));
      el.classList.toggle(styles.hasLabel, Boolean(label));
      labelRef.current.textContent = label;
    };
    const onLeave = () => el.classList.remove(styles.visible);
    const onDown = () => el.classList.add(styles.down);
    const onUp = () => el.classList.remove(styles.down);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.documentElement.addEventListener('mouseleave', onLeave);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  return (
    <div ref={ref} className={styles.cursor} aria-hidden="true">
      <div className={styles.wrapper}>
        <div className={styles.follower} />
        <span ref={labelRef} className={styles.label} />
      </div>
    </div>
  );
}
