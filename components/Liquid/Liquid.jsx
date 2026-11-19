'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import styles from './Liquid.module.css';

/*
 * Interactive gooey "liquid" blob: five rounded squares melted together by an SVG goo filter,
 * morphing through 15 shapes.
 *
 * Interaction:
 *  - auto-plays through the shapes while visible
 *  - click / tap → jumps to the next shape instantly with a splash (and restarts the timer)
 *  - pointer nearby → every drop is pulled toward the cursor (closer drops stretch more),
 *    and the whole blob leans toward it — the liquid "reaches" for you
 *  - gently breathes while a shape is held
 *
 * Each shape = 5 points [dx, dy, scale] in grid units from the centre
 * (1 unit ≈ one square width, so neighbours touch and merge).
 */
const SHAPES = [
  { name: 'plus', pts: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]] },
  { name: 'diagonal', pts: [[-2, -2], [-1, -1], [0, 0], [1, 1], [2, 2]] },
  { name: 'L', pts: [[-1, -1.5], [-1, -0.5], [-1, 0.5], [0, 0.5], [1, 0.5]] },
  { name: 'T', pts: [[-1, -1], [0, -1], [1, -1], [0, 0], [0, 1]] },
  { name: 'U', pts: [[-1, -1], [-1, 0], [0, 0.4], [1, 0], [1, -1]] },
  { name: 'zigzag', pts: [[-1, -1], [0, -1], [0, 0], [0, 1], [1, 1]] },
  { name: 'triangle', pts: [[0, -1.2], [-0.5, -0.2], [0.5, -0.2], [-1, 0.8], [1, 0.8]] },
  { name: 'bar', pts: [[-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0]] },
  { name: 'X', pts: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]] },
  { name: 'heart', pts: [[-0.82, -0.55, 1.2], [0.82, -0.55, 1.2], [-0.42, 0.3, 1.0], [0.42, 0.3, 1.0], [0, 0.98, 0.78]] },
  { name: 'dumbbell', pts: [[-1.7, 0, 1.45], [-0.7, 0, 0.55], [0, 0, 0.55], [0.7, 0, 0.55], [1.7, 0, 1.45]] },
  { name: 'C', pts: [[0.9, -1.1], [-0.2, -1.25], [-1.05, -0.2], [-0.2, 1.0], [0.9, 0.95]] },
  { name: 'chevron', pts: [[-1, -1.5], [0, -0.75], [1, 0], [0, 0.75], [-1, 1.5]] },
  { name: 'ring', pts: [0, 1, 2, 3, 4].map((k) => {
    const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
    return [Math.cos(a) * 1.15, Math.sin(a) * 1.15, 1.1];
  }) },
  { name: 'blob', pts: [[-0.3, -0.3, 1.5], [0.3, -0.3, 1.5], [-0.3, 0.3, 1.5], [0.3, 0.3, 1.5], [0, 0, 1.6]] },
];

const UNIT = 92; // % of a square's own width per grid unit (squares are 19% of the box)
const HOLD = 1.6; // seconds a shape stays before auto-advancing
const MORPH = 1.2; // seconds per morph
const PULL_RADIUS = 320; // px — how far away the pointer starts attracting the liquid
const PULL = 0.5; // how strongly drops stretch toward the pointer
const MAX_STRETCH = 55; // px — cap so the goo stays connected

export default function Liquid({ id, size = 250, className = '', startAt = 0 }) {
  const boxRef = useRef(null);
  const groupRef = useRef(null);

  useEffect(() => {
    const box = boxRef.current;
    const group = groupRef.current;
    const blobs = gsap.utils.toArray(group.querySelectorAll('span'));
    let index = startAt % SHAPES.length;

    // Shape pose uses xPercent/yPercent/scale only — x/y are left free for the pointer pull.
    const pose = (shape) => ({
      xPercent: (i) => -50 + shape.pts[i][0] * UNIT,
      yPercent: (i) => -50 + shape.pts[i][1] * UNIT,
      scale: (i) => shape.pts[i][2] ?? 1,
    });

    // x/y reset to 0: GSAP reads the CSS fallback translate() as px, which would add to xPercent.
    gsap.set(blobs, { x: 0, y: 0, ...pose(SHAPES[index]) });
    if (prefersReducedMotion()) return;

    let timer = null;
    let visible = false;

    const ctx = gsap.context(() => {
      const goTo = (next, { splash = false } = {}) => {
        index = next % SHAPES.length;
        gsap.to(blobs, {
          ...pose(SHAPES[index]),
          duration: splash ? MORPH * 0.75 : MORPH,
          ease: 'back.inOut(1.6)',
          stagger: { each: 0.05, from: 'center' },
          overwrite: 'auto',
        });
        gsap.to(group, { rotation: '+=90', duration: MORPH + 0.2, ease: 'expo.inOut', overwrite: 'auto' });
        if (splash) {
          gsap.fromTo(box, { scale: 0.86 }, { scale: 1, duration: 0.9, ease: 'elastic.out(1, 0.45)', overwrite: 'auto' });
        }
        schedule();
      };

      const schedule = () => {
        timer?.kill();
        if (visible) timer = gsap.delayedCall(MORPH + HOLD, () => goTo(index + 1));
      };

      // Auto-play only while on screen.
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible) schedule();
        else timer?.kill();
      });
      io.observe(box);

      // Click / tap → next shape right away.
      const onClick = () => goTo(index + 1, { splash: true });
      box.addEventListener('click', onClick);

      // Pointer attraction (mouse / pen only).
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const pullers = blobs.map((el) => ({
        el,
        x: gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' }),
        y: gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' }),
      }));
      const leanX = gsap.quickTo(group, 'x', { duration: 0.8, ease: 'power3.out' });
      const leanY = gsap.quickTo(group, 'y', { duration: 0.8, ease: 'power3.out' });

      const release = () => {
        pullers.forEach((p) => {
          p.x(0);
          p.y(0);
        });
        leanX(0);
        leanY(0);
      };

      const onMove = (e) => {
        if (!visible) return;
        const r = box.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        if (dist > PULL_RADIUS) {
          release();
          return;
        }
        const strength = 1 - dist / PULL_RADIUS; // 1 at the centre → 0 at the edge
        leanX((e.clientX - cx) * 0.12 * strength);
        leanY((e.clientY - cy) * 0.12 * strength);
        // Drops live inside the rotating group → convert the screen-space pull into group space.
        const a = (-gsap.getProperty(group, 'rotation') * Math.PI) / 180;
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        pullers.forEach((p) => {
          const b = p.el.getBoundingClientRect();
          const dx = e.clientX - (b.left + b.width / 2);
          const dy = e.clientY - (b.top + b.height / 2);
          const near = 1 - Math.min(1, Math.hypot(dx, dy) / PULL_RADIUS);
          // Max stretch keeps drops within reach of their neighbours so the goo stays connected.
          const k = PULL * strength * near;
          const sx = dx * k;
          const sy = dy * k;
          p.x(gsap.utils.clamp(-MAX_STRETCH, MAX_STRETCH, sx * cos - sy * sin));
          p.y(gsap.utils.clamp(-MAX_STRETCH, MAX_STRETCH, sx * sin + sy * cos));
        });
      };

      if (fine) {
        window.addEventListener('pointermove', onMove, { passive: true });
        box.addEventListener('pointerleave', release);
      }

      // Gentle breathing.
      gsap.to(group, { scale: 1.05, duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });

      return () => {
        timer?.kill();
        io.disconnect();
        box.removeEventListener('click', onClick);
        window.removeEventListener('pointermove', onMove);
        box.removeEventListener('pointerleave', release);
      };
    }, box);

    return () => ctx.revert();
  }, [startAt]);

  return (
    <div className={`${styles.wrap} ${className}`}>
      <div
        ref={boxRef}
        className={styles.liquid}
        style={{ width: size, height: size, filter: `url(#${id})` }}
        data-cursor
        aria-hidden="true"
      >
        <svg className={styles.svg} focusable="false">
          <defs>
            <filter id={id}>
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blurred" />
              <feColorMatrix in="blurred" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
            </filter>
          </defs>
        </svg>
        <div ref={groupRef} className={styles.group}>
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
