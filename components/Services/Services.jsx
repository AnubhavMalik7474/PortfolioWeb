'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Liquid from '@/components/Liquid/Liquid';
import { services } from '@/lib/content';
import { ScrollTrigger } from '@/lib/gsap';
import styles from './Services.module.css';

export default function Services() {
  const [active, setActive] = useState(2);
  const [lit, setLit] = useState(false);
  const boxRef = useRef(null);

  // The panel turns accent-red while it occupies the middle of the viewport.
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: boxRef.current,
      start: 'top 55%',
      end: 'bottom 30%',
      onToggle: (self) => setLit(self.isActive),
    });
    return () => st.kill();
  }, []);

  return (
    <section id="services" className={styles.services} aria-labelledby="services-title">
      <h2 id="services-title" className="sr-only">
        Services
      </h2>
      <div className={styles.liquidRow}>
        <Liquid id="liquid-services" startAt={5} />
      </div>
      <div className={styles.outer}>
        <div ref={boxRef} className={`${styles.accordion} ${lit ? styles.lit : ''}`}>
          <div className={styles.inner}>
            {services.map((item, i) => {
              const open = i === active;
              return (
                <div key={item.title} className={`${styles.item} ${open ? styles.active : ''}`}>
                  <h3 className={styles.heading}>
                    <button
                      type="button"
                      id={`service-trigger-${i}`}
                      className={styles.trigger}
                      aria-expanded={open}
                      aria-controls={`service-panel-${i}`}
                      onClick={() => setActive(open ? -1 : i)}
                    >
                      <span className={styles.num} aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}.
                      </span>
                      <span className={styles.name}>{item.title}</span>
                    </button>
                  </h3>
                  <div id={`service-panel-${i}`} role="region" aria-labelledby={`service-trigger-${i}`} className={styles.panel} inert={!open}>
                    <div className={styles.panelInner}>
                      <div className={styles.content}>
                        <p className={styles.text}>{item.text}</p>
                        <div className={styles.imageBox}>
                          <Image src={item.image.src} alt={item.image.alt} width={600} height={600} sizes="(max-width: 1024px) 80vw, 480px" className={styles.image} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
