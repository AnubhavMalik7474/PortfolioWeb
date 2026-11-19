import Image from 'next/image';
import Liquid from '@/components/Liquid/Liquid';
import Parallax from '@/components/Motion/Parallax';
import { intro } from '@/lib/content';
import IntroShape from './IntroShape';
import styles from './Intro.module.css';

export default function Intro() {
  const { image } = intro;
  return (
    <section className={styles.intro} aria-label="Featured project">
      {/* Animated clip shape — builds itself when the image scrolls into view. */}
      <IntroShape id="intro-shape" triggerSelector="[data-intro-frame]" />
      <div className={styles.container}>
        <div className={styles.colLiquid}>
          <Liquid id="liquid-intro" />
        </div>
        <div className={styles.colImage} data-intro-frame>
          <Parallax className={styles.frame} speed={6} scale={1.12}>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(max-width: 880px) 92vw, 850px"
              className={styles.image}
            />
          </Parallax>
        </div>
      </div>
    </section>
  );
}
