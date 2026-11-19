'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Lightbox from '@/components/Lightbox/Lightbox';
import { gallery } from '@/lib/content';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import styles from './Gallery.module.css';

// The reference repeats its five images to build a long horizontal strip.
const items = [...gallery, ...gallery].map((img, i) => ({ ...img, key: i, duplicate: i >= gallery.length }));

export default function Gallery() {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const wrap = wrapRef.current;
    const track = trackRef.current;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1025px)', () => {
      const distance = () => Math.max(0, track.scrollWidth - wrap.clientWidth);
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top 65%',
          end: () => `+=${distance()}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    });
    const t = setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => {
      clearTimeout(t);
      mm.revert();
    };
  }, []);

  return (
    <section id="gallery" className={styles.gallery} aria-labelledby="gallery-title">
      <h2 id="gallery-title" className="sr-only">
        Project showcase
      </h2>
      <div ref={wrapRef} className={styles.wrap}>
        <ul ref={trackRef} className={styles.track}>
          {items.map((item) => (
            <li
              key={item.key}
              className={styles.item}
              style={{ '--w': `${item.w}px`, '--h': `${item.h}px` }}
              aria-hidden={item.duplicate || undefined}
            >
              <button
                type="button"
                className={styles.button}
                onClick={() => setActive(item)}
                tabIndex={item.duplicate ? -1 : undefined}
                aria-label={`Open image: ${item.alt}`}
                data-cursor-label="View"
              >
                <Image src={item.src} alt={item.alt} width={item.width} height={item.height} sizes="(max-width: 1024px) 70vw, 520px" className={styles.image} />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <Lightbox image={active} onClose={() => setActive(null)} />
    </section>
  );
}
