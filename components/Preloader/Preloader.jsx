'use client';

import { useEffect, useState } from 'react';
import styles from './Preloader.module.css';

export default function Preloader() {
  const [state, setState] = useState('loading'); // loading → leaving → gone

  useEffect(() => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setState('leaving');
      document.documentElement.classList.add('is-loaded');
      window.dispatchEvent(new Event('app:loaded'));
      setTimeout(() => setState('gone'), 700);
    };
    const delayed = () => setTimeout(finish, 250);

    if (document.readyState === 'complete') delayed();
    else window.addEventListener('load', delayed, { once: true });
    const safety = setTimeout(finish, 3500);

    return () => {
      window.removeEventListener('load', delayed);
      clearTimeout(safety);
    };
  }, []);

  if (state === 'gone') return null;

  return (
    <>
      <noscript>
        <style>{'#preloader{display:none!important}'}</style>
      </noscript>
      <div id="preloader" className={`${styles.loader} ${state === 'leaving' ? styles.leaving : ''}`} aria-hidden="true">
        <div className={styles.spinner}>
          <span />
          <span />
          <span />
        </div>
      </div>
    </>
  );
}
