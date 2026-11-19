'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/** Lenis instance shared across components (set by <SmoothScroll />). */
let lenisInstance = null;
export const setLenis = (l) => {
  lenisInstance = l;
};
export const getLenis = () => lenisInstance;

/** Smoothly scroll to a target (selector, element or number). */
export function scrollToTarget(target, opts = {}) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4, ...opts });
    return;
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: 'smooth' });
}

/** Run `cb` once the preloader has finished (immediately if it already has). */
export function onAppLoaded(cb) {
  if (typeof window === 'undefined') return () => {};
  if (document.documentElement.classList.contains('is-loaded')) {
    cb();
    return () => {};
  }
  window.addEventListener('app:loaded', cb, { once: true });
  return () => window.removeEventListener('app:loaded', cb);
}

/**
 * Site-wide switch for the OS "reduce motion" / "show animations: off" setting.
 * false → animations always run, even when the visitor's system asks for less motion.
 * Set to true to respect that setting again (recommended for accessibility).
 */
export const RESPECT_REDUCED_MOTION = false;

export const prefersReducedMotion = () =>
  RESPECT_REDUCED_MOTION &&
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { gsap, ScrollTrigger };
