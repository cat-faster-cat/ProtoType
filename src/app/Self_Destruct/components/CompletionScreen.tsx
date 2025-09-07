'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PAGE_TOKENS } from '../../tokens';

export const CompletionScreen = () => {
  const [isClickable, setIsClickable] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const clickableTimer = setTimeout(() => {
      setIsClickable(true);
    }, 7800);
    return () => clearTimeout(clickableTimer);
  }, []);

  const handleEndClick = () => {
    if (isClickable) {
      router.push(`/Look_Sun?token=${PAGE_TOKENS.Look_Sun}`);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', color: isClickable ? '#555555' : '#dddddd', fontSize: '1.5rem', fontFamily: 'monospace', cursor: isClickable ? 'pointer' : 'not-allowed' }}>
      <span onClick={handleEndClick}>
        完遂
      </span>
    </div>
  );
};