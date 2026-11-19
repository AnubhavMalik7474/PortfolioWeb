import Link from 'next/link';
import { siteConfig } from '@/lib/site';
import styles from './Logo.module.css';

export default function Logo({ className = '', size = 'md' }) {
  return (
    <Link href="/" className={`${styles.logo} ${styles[size]} ${className}`} aria-label={`${siteConfig.name} — home`}>
      {/* Mark: two overlapping rounded blocks — the same idea as the intro image shape. */}
      <svg className={styles.mark} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <rect x="4" y="4" width="36" height="38" rx="10" fill="currentColor" />
        <rect x="24" y="22" width="36" height="38" rx="10" fill="var(--primary)" />
      </svg>
      <span className={styles.word}>{siteConfig.shortName}</span>
    </Link>
  );
}
