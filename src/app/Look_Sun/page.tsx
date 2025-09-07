'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './FinalPage.module.css';
import Image from 'next/image';
import { PAGE_TOKENS } from '../tokens';
import AccessDenied from '../components/AccessDenied';

function LookSunPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const isValidToken = token === PAGE_TOKENS.Look_Sun;

  const [isWindowVisible, setWindowVisible] = useState(false);
  const [animationState, setAnimationState] = useState<'idle' | 'zooming' | 'zoomed'>('idle');
  const [isHovering, setIsHovering] = useState(false);
  const [isFading, setIsFading] = useState(false); // State for the fade effect

  const handleFileClick = () => {
    if (isWindowVisible) return;
    setAnimationState('zooming');
    setWindowVisible(true);
  };

  const handleCloseClick = () => {
    setWindowVisible(false);
    setAnimationState('idle');
  };

  const handleAnimationEnd = () => {
    if (animationState === 'zooming') {
      setAnimationState('zoomed');
    }
  };

  const handleInteraction = (e: React.MouseEvent<HTMLImageElement>, isClick: boolean) => {
    if (isFading) return; // Prevent interaction during fade

    const imgElement = e.currentTarget;
    const rect = imgElement.getBoundingClientRect();

    const naturalWidth = 1600;
    const naturalHeight = 1200;
    const naturalRatio = naturalWidth / naturalHeight;
    const rectRatio = rect.width / rect.height;

    let visualWidth = rect.width;
    let visualHeight = rect.height;
    let paddingX = 0;
    let paddingY = 0;

    if (naturalRatio > rectRatio) {
      visualHeight = rect.width / naturalRatio;
      paddingY = (rect.height - visualHeight) / 2;
    } else {
      visualWidth = rect.height * naturalRatio;
      paddingX = (rect.width - visualWidth) / 2;
    }

    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;

    if (relativeX < paddingX || relativeX > rect.width - paddingX ||
        relativeY < paddingY || relativeY > rect.height - paddingY) {
      setIsHovering(false);
      return;
    }

    const adjustedX = relativeX - paddingX;
    const adjustedY = relativeY - paddingY;
    
    const percentX = adjustedX / visualWidth;
    const percentY = adjustedY / visualHeight;

    const originalX = 1600 * percentX;
    const originalY = 1200 * percentY;

    const targetX = 105;
    const targetY = 100;
    const radius = 20;

    const distance = Math.sqrt(Math.pow(originalX - targetX, 2) + Math.pow(originalY - targetY, 2));
    const isInTarget = distance <= radius;

    setIsHovering(isInTarget);

    if (isClick && isInTarget) {
      setIsFading(true); // Start the fade
      setTimeout(() => {
        router.push(`/Clear?token=${PAGE_TOKENS.Clear}`);
      }, 1500); // Wait for the fade animation (1.5s)
    }
  };

  if (!isValidToken) {
    return <AccessDenied />;
  }

  return (
    <>
      <div className={`${styles.fadeOverlay} ${isFading ? styles.visible : ''}`}></div>
      <div className={styles.container}>
        <Image
          src="/file.png"
          alt="File Icon"
          width={128}
          height={128}
          className={styles.fileImage}
          onClick={handleFileClick}
          title="Click to open"
        />
      </div>

      {isWindowVisible && (
        <div className={styles.overlay}>
          <div
            className={`${styles.retroWindow} ${animationState === 'zooming' ? styles.zooming : ''}`}
            onAnimationEnd={handleAnimationEnd}
          >
            <div className={styles.retroTitleBar}>
              <p className={styles.retroTitleText}>架空の翼</p>
              <button className={styles.retroCloseButton} onClick={handleCloseClick} title="Close">
                ×
              </button>
            </div>
            <div className={styles.retroWindowContent}>
              {animationState === 'zoomed' && (
                <Image
                  src="/架空の翼.png"
                  alt="The Fictional Wing"
                  width={850}
                  height={580}
                  className={styles.wingImage}
                  unoptimized={true}
                  style={{ cursor: isHovering ? 'pointer' : 'default' }}
                  onClick={(e) => handleInteraction(e, true)}
                  onMouseMove={(e) => handleInteraction(e, false)}
                  onMouseLeave={() => setIsHovering(false)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function LookSunPage() {
  return (
    <Suspense>
      <LookSunPageContent />
    </Suspense>
  );
}