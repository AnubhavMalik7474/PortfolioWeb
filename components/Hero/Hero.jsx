import { existsSync } from 'node:fs';
import path from 'node:path';
import Image from 'next/image';
import { hero } from '@/lib/content';
import { buildGridPath } from '@/lib/pattern';
import HeroFx from './HeroFx';
import styles from './Hero.module.css';

// Optional artwork (e.g. from your licensed theme package). Both 1920×1080:
//   public/images/hero/hero-pattern.png        → dim background pattern
//   public/images/hero/hero-pattern-lines.png  → bright line version (white lines on dark)
// When both exist they are used; otherwise a generated SVG pattern is drawn instead.
const HERO_DIR = path.join(process.cwd(), 'public', 'images', 'hero');
const hasArtwork = ['hero-pattern.png', 'hero-pattern-lines.png'].every((f) => existsSync(path.join(HERO_DIR, f)));

const gridPath = hasArtwork ? '' : buildGridPath();

function ArtworkBackdrop() {
  return (
    <>
      <Image src="/images/hero/hero-pattern.png" alt="" fill priority sizes="(max-aspect-ratio: 16/9) 178vh, 100vw" className={styles.patternImg} />
      <div className={styles.hotLayer} data-hero-hot>
        <Image src="/images/hero/hero-pattern-lines.png" alt="" fill loading="eager" sizes="(max-aspect-ratio: 16/9) 178vh, 100vw" className={styles.patternImg} />
      </div>
    </>
  );
}

function SvgBackdrop() {
  return (
    <svg className={styles.grid} viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" data-hero-svg>
      <defs>
        <path id="hero-grid" d={gridPath} />
        <radialGradient id="hero-spot">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="hero-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080">
          <circle data-hero-spot cx="1100" cy="200" r="340" fill="url(#hero-spot)" />
        </mask>
      </defs>
      {/* Stroke + same-shape fill on top → only the outer outline of merged shapes remains. */}
      <g>
        <use href="#hero-grid" className={styles.dimStroke} />
        <use href="#hero-grid" className={styles.cover} />
      </g>
      <g mask="url(#hero-mask)">
        <use href="#hero-grid" className={styles.hotStroke} />
        <use href="#hero-grid" className={styles.cover} />
      </g>
    </svg>
  );
}

export default function Hero() {
  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.backdrop} aria-hidden="true" data-hero-backdrop>
        {hasArtwork ? <ArtworkBackdrop /> : <SvgBackdrop />}
        <div className={styles.fade} />
      </div>

      <div className={styles.inner} data-hero-content>
        <h1 id="hero-title" className={styles.heading}>
          <span className={styles.kicker} data-hero-line>
            {hero.kicker}
          </span>
          <span className={styles.title} data-hero-line>
            <span className={styles.titleText}>{hero.title}</span>
          </span>
        </h1>
        <p className={styles.lead} data-hero-line>
          {hero.lead}
        </p>
      </div>
      <HeroFx />
    </section>
  );
}
