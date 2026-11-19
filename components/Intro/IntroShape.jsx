'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

/*
 * Clip shape for the intro image: two overlapping blocks (top-left "A", bottom-right "B") plus two
 * fillet patches that round the inner corners where they meet. Units are objectBoundingBox (0–1)
 * for an 850×752 frame, so the shape scales with the image.
 *
 * Only the OUTER corners of each block are rounded — the corners that sit inside the other block
 * stay square, otherwise their curves leave dark gaps at the joints.
 *
 * When the frame scrolls into view: block A grows out of the top-left corner, block B out of the
 * bottom-right, the image eases from a zoom, and finally the joints "melt" into smooth curves.
 */
const W = 850;
const H = 752;
const R = 70; // outer corner radius (px)
const C = 60; // inner fillet radius (px)

const FINAL = {
  a: { x: 0, y: 0, w: 550, h: 580 },
  b: { x: 520, y: 152, w: 330, h: 600 },
};

const nx = (v) => (v / W).toFixed(5);
const ny = (v) => (v / H).toFixed(5);

/** Rect path (design px → bbox units) with an individual radius per corner. */
function rectPath({ x, y, w, h }, { tl = 0, tr = 0, br = 0, bl = 0 }) {
  if (w <= 0.01 || h <= 0.01) return 'M0 0Z';
  const lim = (r) => Math.max(0, Math.min(r, w / 2, h / 2));
  const [a, b, c, d] = [lim(tl), lim(tr), lim(br), lim(bl)];
  const arc = (r, ex, ey) => (r ? `A ${nx(r)} ${ny(r)} 0 0 1 ${nx(ex)} ${ny(ey)} ` : '');
  return (
    `M ${nx(x + a)} ${ny(y)} H ${nx(x + w - b)} ${arc(b, x + w, y + b)}` +
    `V ${ny(y + h - c)} ${arc(c, x + w - c, y + h)}` +
    `H ${nx(x + d)} ${arc(d, x, y + h - d)}` +
    `V ${ny(y + a)} ${arc(a, x + a, y)}Z`
  );
}

// Fillet patches: area between the concave joint corner and a quarter circle of radius c.
const topFillet = (c) => {
  const ax = FINAL.a.x + FINAL.a.w;
  const by = FINAL.b.y;
  if (c < 0.5) return 'M0 0Z';
  return `M ${nx(ax)} ${ny(by - c)} A ${nx(c)} ${ny(c)} 0 0 0 ${nx(ax + c)} ${ny(by)} L ${nx(ax)} ${ny(by)} Z`;
};
const bottomFillet = (c) => {
  const bx = FINAL.b.x;
  const ay = FINAL.a.y + FINAL.a.h;
  if (c < 0.5) return 'M0 0Z';
  return `M ${nx(bx)} ${ny(ay + c)} A ${nx(c)} ${ny(c)} 0 0 0 ${nx(bx - c)} ${ny(ay)} L ${nx(bx)} ${ny(ay)} Z`;
};

const pathA = (r) => rectPath(r, { tl: R, tr: R, bl: R, br: 0 });
const pathB = (r) => rectPath(r, { tr: R, br: R, bl: R, tl: 0 });

export default function IntroShape({ id, triggerSelector }) {
  const svgRef = useRef(null);
  const aRef = useRef(null);
  const bRef = useRef(null);
  const f1Ref = useRef(null);
  const f2Ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    // Capture DOM nodes now: on unmount React clears refs *before* this effect's cleanup runs,
    // and ctx.revert() renders the timeline one last time (→ draw()).
    const [pA, pB, pF1, pF2] = [aRef.current, bRef.current, f1Ref.current, f2Ref.current];
    const frame = svgRef.current?.closest('section')?.querySelector(triggerSelector);
    if (!frame || !pA || !pB || !pF1 || !pF2) return;
    const img = frame.querySelector('img');

    // Animated state (design px). A starts as a small tile in its corner, B in the opposite one.
    const a = { x: 0, y: 0, w: 0, h: 0 };
    const b = { x: W, y: H, w: 0, h: 0 };
    const f = { c: 0 };

    const draw = () => {
      pA.setAttribute('d', pathA(a));
      pB.setAttribute('d', pathB(b));
      pF1.setAttribute('d', topFillet(f.c));
      pF2.setAttribute('d', bottomFillet(f.c));
    };

    const ctx = gsap.context(() => {
      draw();
      if (img) gsap.set(img, { scale: 1.35, transformOrigin: '50% 50%' });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: frame, start: 'top 70%', once: true },
        defaults: { ease: 'expo.inOut' },
        onUpdate: draw,
      });

      tl.to(a, { w: FINAL.a.w, h: FINAL.a.h, duration: 1.4 }, 0)
        .to(b, { x: FINAL.b.x, y: FINAL.b.y, w: FINAL.b.w, h: FINAL.b.h, duration: 1.4 }, 0.25)
        .to(f, { c: C, duration: 0.7, ease: 'power3.out' }, 1.35);

      if (img) tl.to(img, { scale: 1, duration: 2, ease: 'expo.out' }, 0.1);
    });

    return () => ctx.revert();
  }, [triggerSelector]);

  // Server render = final shape, so it is correct without JS.
  return (
    <svg ref={svgRef} width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={id} clipPathUnits="objectBoundingBox">
          <path ref={aRef} d={pathA(FINAL.a)} />
          <path ref={bRef} d={pathB(FINAL.b)} />
          <path ref={f1Ref} d={topFillet(C)} />
          <path ref={f2Ref} d={bottomFillet(C)} />
        </clipPath>
      </defs>
    </svg>
  );
}
