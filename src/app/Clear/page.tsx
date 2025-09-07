'use client';

import { Suspense } from 'react';
import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Draggable from 'react-draggable';
import styles from './GoalPage.module.css';
import { PAGE_TOKENS } from '../tokens';
import AccessDenied from '../components/AccessDenied';

// ノイズ要素（四角形）の型定義
interface NoiseSquare {
  id: number;
  style: React.CSSProperties;
}

function ClearPageContent() {
  const nodeRef = useRef(null);
  const router = useRouter();
  const keyCounter = useRef(0); // Unique key counter
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const isValidToken = token === PAGE_TOKENS.Clear;

  // --- State管理 ---
  const [isFadingIn, setIsFadingIn] = useState(true);
  const [noises, setNoises] = useState<NoiseSquare[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [isAccelerating, setIsAccelerating] = useState(false);

  // --- Web Audio APIのためのState ---
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  // --- ページロード時の処理 ---
  useEffect(() => {
    if (!isValidToken) return;
    const timer = setTimeout(() => setIsFadingIn(false), 100);
    
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(context);
      fetch('/破壊.mp3')
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
        .then(decodedData => setAudioBuffer(decodedData))
        .catch(e => {
          console.error("Audio decoding failed:", e);
          setAudioBuffer(null); // Set to null on failure
        });
    } catch (e) {
      console.error("Web Audio API is not supported in this browser.", e);
    }

    return () => {
      clearTimeout(timer);
      audioContext?.close();
    };
  }, [isValidToken]);

  // --- 音声再生ロジック ---
  const playSound = useCallback(() => {
    if (!audioContext || !audioBuffer) {
      console.error("Audio context or buffer is not available.");
      return;
    };
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.4;
    gainNode.connect(audioContext.destination);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(gainNode);
    source.start(0);
  }, [audioContext, audioBuffer]);

  // --- ノイズ生成ロジック ---
  const generateNoises = useCallback(() => {
    const newSquares: NoiseSquare[] = Array.from({ length: 8 }).map(() => {
      const offsetX1 = (Math.random() * 6 + 2) * (Math.random() < 0.5 ? 1 : -1);
      const offsetY1 = (Math.random() * 6 + 2) * (Math.random() < 0.5 ? 1 : -1);
      const offsetX2 = (Math.random() * 6 + 2) * (Math.random() < 0.5 ? 1 : -1);
      const offsetY2 = (Math.random() * 6 + 2) * (Math.random() < 0.5 ? 1 : -1);
      return {
        id: keyCounter.current++, // Use and increment the counter for a guaranteed unique key
        style: {
          position: 'fixed',
          top: `${Math.random() * 100}vh`,
          left: `${Math.random() * 100}vw`,
          width: `${Math.random() * 150 + 50}px`,
          height: `${Math.random() * 150 + 50}px`,
          backgroundColor: 'black',
          zIndex: 9999,
          pointerEvents: 'none',
          boxShadow: `
            ${offsetX1}px ${offsetY1}px 0px rgba(255, 0, 0, 0.7),
            ${offsetX2}px ${offsetY2}px 0px rgba(0, 255, 255, 0.7)
          `,
        }
      };
    });
    setNoises(prev => [...prev, ...newSquares]);
  }, []);

  // --- クリック時の処理 ---
  const handleHiddenMessageClick = () => {
    if (isAccelerating) return;
    playSound();
    generateNoises();
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    if (newClickCount >= 5) {
      setIsAccelerating(true);
    }
  };

  // --- 加速とページ遷移のシーケンス ---
  useEffect(() => {
    if (!isAccelerating) return;

    let timeoutId: NodeJS.Timeout;
    
    const accelerateEffect = (currentInterval: number) => {
      playSound();
      generateNoises();
      const nextInterval = Math.max(50, currentInterval * 0.85);
      timeoutId = setTimeout(() => accelerateEffect(nextInterval), nextInterval);
    };

    timeoutId = setTimeout(() => accelerateEffect(300), 300);

    const navigationTimeout = setTimeout(() => {
      clearTimeout(timeoutId);
      router.push(`/End?token=${PAGE_TOKENS.End}`);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(navigationTimeout);
    };
  }, [isAccelerating, generateNoises, playSound, router]);

  if (!isValidToken) {
    return <AccessDenied />;
  }

  return (
    <>
      {noises.map(noise => <div key={noise.id} style={noise.style} />)}
      <div className={`${styles.fadeOverlay} ${isFadingIn ? styles.visible : ''}`}></div>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.stackingContext}>
            <div
              className={styles.hiddenMessage}
              onClick={handleHiddenMessageClick}
              style={{ cursor: 'pointer' }}
            >
              こんな結末は間違っている
            </div>
            <Draggable nodeRef={nodeRef}>
              <div ref={nodeRef} className={styles.draggableContainer}>
                <div className={styles.titleBackground}></div>
                <h1 className={styles.title}>クリア</h1>
              </div>
            </Draggable>
          </div>
          <Image
            src="/cat.png"
            alt="Cat"
            width={1000}
            height={1000}
            className={styles.catImage}
          />
        </div>
      </div>
    </>
  );
}

export default function ClearPage() {
  return (
    <Suspense>
      <ClearPageContent />
    </Suspense>
  );
}
