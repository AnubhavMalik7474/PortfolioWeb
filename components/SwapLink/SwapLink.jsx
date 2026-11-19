import styles from './SwapLink.module.css';

/** Link whose label slides up and is replaced by a scaled, accent-coloured copy on hover. */
export default function SwapLink({ href, children, className = '', external = false, ...rest }) {
  const ext = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <a href={href} className={`${styles.link} ${className}`} {...ext} {...rest}>
      <span className={styles.text} data-text={children}>
        {children}
      </span>
    </a>
  );
}
