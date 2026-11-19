'use client';

import { scrollToTarget } from '@/lib/gsap';
import styles from './BackToTop.module.css';

export default function BackToTop() {
  return (
    <button type="button" className={styles.button} onClick={() => scrollToTarget(0, { duration: 1.8 })} aria-label="Back to top">
      <span aria-hidden="true" />
    </button>
  );
}
