import Reveal from '@/components/Motion/Reveal';
import TextReveal from '@/components/Motion/TextReveal';
import Magnetic from '@/components/Motion/Magnetic';
import { about } from '@/lib/content';
import styles from './About.module.css';

export default function About() {
  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <div className={styles.container}>
        <Reveal as="h2" id="about-title" className={styles.title}>
          {about.title}
        </Reveal>
        <TextReveal text={about.text} className={styles.text} />
        <div className={styles.action}>
          <Magnetic>
            <a href={about.cta.href} className={styles.button}>
              <span data-magnetic-text>{about.cta.label}</span>
              <svg className={styles.icon} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <path d="M4 16 16 4M7 4h9v9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
