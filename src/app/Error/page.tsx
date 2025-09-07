'use client';

import { Suspense } from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Clock } from 'react-bootstrap-icons';
import styles from './PuzzlePage.module.css';
import { PAGE_TOKENS } from '../tokens';
import { COOKIE_VISITED_FACADE } from '../constants';
import AccessDenied from '../components/AccessDenied';

function ErrorPageContent() {
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [modalIsVisible, setModalIsVisible] = useState(false); // For triggering transition
  const [isRedirecting, setIsRedirecting] = useState(false);
  const backdropClickCount = useRef(0);
  const [showRedirectButton, setShowRedirectButton] = useState(false);
  const [shake, setShake] = useState(false);
  const router = useRouter();
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const isValidToken = token === PAGE_TOKENS.Error;

  useEffect(() => {
    if (!isValidToken) return;
    bgmAudioRef.current?.play().catch(e => console.error("BGMの再生に失敗しました:", e));
    document.cookie = `${COOKIE_VISITED_FACADE}=true; path=/; max-age=31536000`;
    const warningTimer = setTimeout(() => {
      setShowWarningModal(true);
    }, 3000);

    return () => {
      clearTimeout(warningTimer);
      bgmAudioRef.current?.pause();
    };
  }, [isValidToken]);

  // This effect triggers the appearance animation after the modal is in the DOM
  useEffect(() => {
    if (showWarningModal) {
      const timer = setTimeout(() => setModalIsVisible(true), 10);
      return () => clearTimeout(timer);
    }
  }, [showWarningModal]);

  const handleReset = () => {
    document.cookie = `${COOKIE_VISITED_FACADE}=; path=/; max-age=-1;`;
    setIsRedirecting(true);
    setTimeout(() => {
      router.push(`/Contact?token=${PAGE_TOKENS.Contact}`);
    }, 2000);
  };

  const handleRedirectToSelfDestruct = useCallback(() => {
    router.push(`/Self_Destruct?token=${PAGE_TOKENS.Self_Destruct}`);
  }, [router]);

  const handleBackdropClick = () => {
    backdropClickCount.current += 1;
    if (backdropClickCount.current >= 10) {
      setShowRedirectButton(true);
    }
    setShake(true);
    setTimeout(() => setShake(false), 300);
  };

  if (!isValidToken) {
    return <AccessDenied />;
  }

  return (
    <>
      <audio ref={bgmAudioRef} src="/Null.mp3" loop />

      <div className={`${styles.redirectingScreen} ${isRedirecting ? styles.visible : ''}`}> 
        <Clock size={100} /> 
      </div>

      <div className={`${styles.contentWrapper} ${styles.visible}`}> 
        <div className={styles.pageWrapper}> 
          <h1 className={styles.pageTitle}>Null</h1>
          <div className={styles.mainContent}>
            <div className={styles.errorBoxContainer}>
              <div style={{
                width: '100%',
                border: '1px solid #555',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '8rem',
                color: '#444',
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '4px'
              }}>
                404
              </div>
            </div>
            
            <div className={styles.dialogueContainer}>
              <div className={styles.dialogueBox}>
                <p style={{ whiteSpace: 'pre-wrap' }}>{'Null'}</p>
              </div>
              <div className={styles.choicesContainer}>
                <button className={styles.flatButton}>{'Null'}</button>
                <button className={styles.flatButton}>{'Null'}</button>
                <button className={styles.flatButton}>{'Null'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showWarningModal && (
        <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
          <div 
            className={`${styles.warningModal} ${modalIsVisible ? styles.modalVisible : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Inner wrapper for shake AND content styling */}
            <div className={`${styles.modalContent} ${shake ? styles.shake : ''}`}>
              <div className={styles.warningHeader}>
                <div>致命的なエラー</div>
              </div>
              <div className={styles.warningBody}>
                {`Kako.exeが存在しません\n緊急用パスワードを表示します\nPass: ImposedHeart`}
              </div>
            </div>
          </div>
        </div>
      )}

      {showWarningModal && (
        <>
          <button onClick={handleReset} className={styles.resetButton}>
            やり直し
          </button>
          {showRedirectButton && (
            <button onClick={handleRedirectToSelfDestruct} className={styles.selfDestructButton}>
              自己消去プログラム
            </button>
          )}
        </>
      )}
    </>
  );
}

export default function ErrorPage() {
  return (
    <Suspense>
      <ErrorPageContent />
    </Suspense>
  );
}
