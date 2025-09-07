'use client';

import React from 'react';
import Image from 'next/image';
import styles from '../PuzzlePage.module.css';

interface CharacterImageProps {
  src: string;
  alt: string;
}

const CharacterImageComponent: React.FC<CharacterImageProps> = ({ src, alt }) => {
  return (
    // The wrapper div is no longer strictly necessary for layout but can be kept for styling hooks
    <div className={styles.characterImageWrapper}>
      <Image
        src={src}
        alt={alt}
        width={400} // Specify a base width
        height={600} // Specify a base height
        className={styles.characterImage}
        style={{ objectFit: 'contain' }} // Ensure aspect ratio is maintained
      />
    </div>
  );
};

export const CharacterImage = React.memo(CharacterImageComponent);