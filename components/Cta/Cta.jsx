import Reveal from '@/components/Motion/Reveal';
import CircleButton from '@/components/CircleButton/CircleButton';
import Magnetic from '@/components/Motion/Magnetic';
import { cta } from '@/lib/content';
import { siteConfig } from '@/lib/site';
import styles from './Cta.module.css';

export default function Cta() {
  return (
    <section id="contact" className={styles.cta} aria-labelledby="cta-title">
      <div className={styles.container}>
        <Reveal className={styles.box} y={100}>
          <div className={styles.copy}>
            <h2 id="cta-title" className={styles.title}>
              {cta.title}
            </h2>
            <p className={styles.text}>{cta.text}</p>
          </div>
          <div className={styles.action}>
            <Magnetic strength={0.2}>
              <CircleButton
                href={`mailto:${siteConfig.email}`}
                label={cta.button.label}
                ariaLabel={`${cta.button.label} — email ${siteConfig.email}`}
              />
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
