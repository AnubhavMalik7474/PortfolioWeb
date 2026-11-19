'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { works } from '@/lib/content';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import styles from './WorksPin.module.css';

/**
 * Stacked project cards: each card pins near the top while the next one slides over it,
 * blurring & shrinking as it is covered. Titles go from outline to solid while scrolling.
 */
export default function WorksPin() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    const items = gsap.utils.toArray(root.querySelectorAll('[data-work]'));
    const mm = gsap.matchMedia();

    mm.add(
      {
        // Reduced-motion is only honoured when RESPECT_REDUCED_MOTION is true (lib/gsap.js).
        reduce: '(prefers-reduced-motion: reduce)',
        desktop: '(min-width: 768px)',
      },
      (ctx) => {
        const { desktop } = ctx.conditions;
        if (prefersReducedMotion()) return;

        items.forEach((item) => {
          const title = item.querySelector('[data-work-title]');
          gsap.fromTo(
            title,
            { '--fill': 0 },
            {
              '--fill': 1,
              ease: 'power2.out',
              scrollTrigger: { trigger: title, start: '-10% center', end: '50% center', scrub: 1.5 },
            },
          );
        });

        if (!desktop) return;

        const gap = (window.innerHeight - items[0].offsetHeight) / 3;
        root.style.paddingTop = `${gap / 2 + 5}px`;

        items.forEach((item, i) => {
          if (i === items.length - 1) return;
          item.style.marginBottom = `${gap * 2}px`;
          gsap.fromTo(
            item,
            { y: 0, filter: 'blur(0px)', scale: 1 },
            {
              y: -gap,
              filter: 'blur(10px)',
              scale: 0.8,
              ease: 'power2.out',
              scrollTrigger: { trigger: item, pin: true, pinSpacing: false, start: 'top 30%', end: 'bottom top', scrub: 1 },
            },
          );
        });

        return () => {
          root.style.paddingTop = '';
          items.forEach((item) => {
            item.style.marginBottom = '';
          });
        };
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section id="works" className={styles.works} aria-labelledby="works-title">
      <h2 id="works-title" className="sr-only">
        Selected projects
      </h2>
      <div className={styles.container}>
        <div ref={ref} className={styles.list}>
          {works.map((work) => (
            <article key={work.title} className={styles.item} data-work>
              <div className={styles.media}>
                <Image src={work.image.src} alt={work.image.alt} fill sizes="(max-width: 767px) 100vw, 1700px" className={styles.image} />
              </div>
              <div className={styles.caption}>
                <p className={styles.category}>{work.category}</p>
                <h3 className={styles.title} data-work-title>
                  {work.title}
                </h3>
              </div>
              {work.href && (
                <a
                  className={styles.cardLink}
                  href={work.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${work.title} (${work.category}) on Dribbble`}
                  data-cursor-label="View"
                />
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
