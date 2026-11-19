import styles from './CircleButton.module.css';

/** Round CTA with circular text that spins on hover and an arrow in the middle. */
export default function CircleButton({ href, label, ariaLabel, className = '' }) {
  const ring = `${label} • ${label} • `.toUpperCase();
  return (
    <a href={href} className={`${styles.button} ${className}`} aria-label={ariaLabel || label}>
      <span className={styles.inner} aria-hidden="true">
        <svg className={styles.ring} viewBox="0 0 100 100" focusable="false">
          <defs>
            <path id="circle-btn-path" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
          </defs>
          <text className={styles.ringText}>
            <textPath href="#circle-btn-path" textLength="230" lengthAdjust="spacing">
              {ring}
            </textPath>
          </text>
        </svg>
        <span className={styles.slot}>
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M6 18 18 6M8.5 6H18v9.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
    </a>
  );
}
