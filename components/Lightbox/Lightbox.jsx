'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { getLenis } from '@/lib/gsap';
import styles from './Lightbox.module.css';

/** Accessible image popup built on the native <dialog> element. */
export default function Lightbox({ image, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (image && !dialog.open) {
      dialog.showModal();
      getLenis()?.stop();
    } else if (!image && dialog.open) {
      dialog.close();
    }
  }, [image]);

  const handleClose = () => {
    getLenis()?.start();
    onClose();
  };

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      onClose={handleClose}
      onClick={(e) => e.target === e.currentTarget && ref.current.close()}
      aria-label={image?.alt || 'Image preview'}
    >
      {image && (
        <figure className={styles.figure}>
          <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="90vw" className={styles.image} />
          <figcaption className={styles.caption}>{image.alt}</figcaption>
        </figure>
      )}
      <button type="button" className={styles.close} onClick={() => ref.current.close()} aria-label="Close preview">
        <span aria-hidden="true" />
      </button>
    </dialog>
  );
}
