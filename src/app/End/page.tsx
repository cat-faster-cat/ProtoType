'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './GoalPage.module.css';
import { PAGE_TOKENS } from '../tokens';
import { COOKIE_SITE_LOCKED } from '../constants';
import AccessDenied from '../components/AccessDenied';

function EndPageContent() {
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  const text = "End";
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const isValidToken = token === PAGE_TOKENS.End;

  // Set the lock cookie when this page is visited
  useEffect(() => {
    if (!isValidToken) return;
    document.cookie = `${COOKIE_SITE_LOCKED}=true; path=/; max-age=31536000`; // Expires in 1 year
  }, [isValidToken]);

  useEffect(() => {
    if (!isValidToken) return;
    let timeoutId: NodeJS.Timeout;

    const scheduleEffect = () => {
      // Random delay between 2 to 5 seconds
      const randomDelay = Math.random() * 3000 + 2000;

      timeoutId = setTimeout(() => {
        // Only use the 'glitch' effect
        const effect = 'glitch';
        setActiveEffect(effect);

        // After a short duration, remove the effect
        setTimeout(() => {
          setActiveEffect(null);
        }, 200); // Glitch effect lasts for 200ms

        // Schedule the next effect
        scheduleEffect();
      }, randomDelay);
    };

    // Start the effect loop
    scheduleEffect();

    // Cleanup on component unmount
    return () => clearTimeout(timeoutId);
  }, [isValidToken]);

  if (!isValidToken) {
    return <AccessDenied />;
  }

  const titleClassName = `${styles.title} ${activeEffect === 'glitch' ? styles.glitch : ''}`;

  return (
    <div className={styles.container}>
      <h1 className={titleClassName}>{text}</h1>
    </div>
  );
}

export default function EndPage() {
  return (
    <Suspense>
      <EndPageContent />
    </Suspense>
  );
}
