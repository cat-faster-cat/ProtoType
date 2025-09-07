'use client';

import { Suspense } from 'react';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import styles from './PuzzlePage.module.css';
import { useTypewriter } from './hooks/useTypewriter';
import { useDialogueManager } from './hooks/useDialogueManager';
import { CharacterImage } from './components/CharacterImage';
import { PAGE_TOKENS } from '../tokens';
import { COOKIE_VISITED_FACADE } from '../constants';
import AccessDenied from '../components/AccessDenied';

function ContactPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const isValidToken = token === PAGE_TOKENS.Contact;

  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [screenEffect, setScreenEffect] = useState<string | null>(null);
  const isTransitioning = useRef(false);

  const typewriterAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);

  const {
    currentNode,
    currentNodeKey,
    selectChoice,
    handleTransition,
    showHelpLink,
    helpLinkSize,
    helpLinkColor,
    selectedChoices,
    completedNodes,
  } = useDialogueManager('start');

  const fullText = currentNode.dialogue.replace(/[ 　]/g, '\n');
  const { displayedText: displayedDialogue, isTyping, reset } = useTypewriter(
    isReady ? fullText : '',
    currentNode.typingSpeed || 50,
    typewriterAudioRef
  );

  // クッキーをチェックしてリダイレクト
  useEffect(() => {
    if (document.cookie.includes(`${COOKIE_VISITED_FACADE}=true`)) {
      router.push(`/Error?token=${PAGE_TOKENS.Error}`);
    }
  }, [router]);

  // 1. ページロード後、2秒待ってローディング完了
  useEffect(() => {
    if (!isValidToken) return;
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [isValidToken]);

  // 2. ローディング完了後、アラートを表示
  useEffect(() => {
    if (!isLoading && isValidToken) {
      window.alert("このサイトはPCでの閲覧を推奨しています。\nBGMが流れますのでご注意ください。");
      setIsReady(true);
    }
  }, [isLoading, isValidToken]);

  // 3. コンテンツ表示準備完了後、BGM再生と音量設定
  useEffect(() => {
    if (isReady && isValidToken) {
      bgmAudioRef.current?.play().catch(e => console.error("BGMの再生に失敗しました:", e));
      if (typewriterAudioRef.current) {
        typewriterAudioRef.current.volume = 0.2;
      }
    }
  }, [isReady, isValidToken]);

  // BGMのクリーンアップ
  useEffect(() => {
    const audioEl = bgmAudioRef.current;
    return () => {
      audioEl?.pause();
    };
  }, []);

  // 自動ページ遷移の管理
  useEffect(() => {
    if (!isTyping && !currentNode.choices && currentNode.nextId) {
      const delay = currentNode.delay || 0;
      const timerId = setTimeout(() => {
        isTransitioning.current = true;
        reset();
        handleTransition(currentNode.nextId!);
      }, delay);

      return () => clearTimeout(timerId);
    }
  }, [isTyping, currentNode, handleTransition, reset]);

  // 遷移状態の管理
  useEffect(() => {
    if (isTyping) {
      isTransitioning.current = false;
    }
  }, [isTyping]);

  // エフェクトのトリガーを監視
  useEffect(() => {
    if (currentNode?.effect) {
      setScreenEffect(currentNode.effect);
    }
  }, [currentNode]);

  // "whiteout" エフェクト（時間差演出）の処理
  useEffect(() => {
    if (screenEffect === 'whiteout') {
      const timer = setTimeout(() => {
        setScreenEffect(null); // エフェクト状態をリセット
        handleTransition('kako_whiteout_after'); // 次のノードへ遷移
        bgmAudioRef.current?.play().catch(e => console.error("BGMの再生に失敗しました:", e));
      }, 5000); // 5秒の遅延
      return () => clearTimeout(timer);
    }
  }, [screenEffect, handleTransition]);


  const handleChoiceClick = (nextId: string) => {
    if (isTyping) return;
    
    isTransitioning.current = true;
    reset();

    if (nextId === 'kako_resp3') {
      bgmAudioRef.current?.pause();
    }
    selectChoice(currentNodeKey, nextId);
  };

  if (!isValidToken) {
    return <AccessDenied />;
  }

  return (
    <>
      <audio ref={bgmAudioRef} src="/Dempness.mp3" loop />
      <audio ref={typewriterAudioRef} src="/文字送りd単.mp3" preload="auto" />

      {screenEffect === 'whiteout' && <div className={styles.whiteoutEffect} />}

      <div className={`${styles.splashScreen} ${isReady ? styles.hidden : ''}`}> 
        <Image src="/internet-icon.svg" alt="Loading..." width={150} height={150} />
      </div>

      <div className={`${styles.contentWrapper} ${isReady ? styles.visible : ''}`}> 
        <div className={styles.pageWrapper}>
          {screenEffect !== 'whiteout' && (
            <>
              <h1 className={styles.pageTitle}>カー子プロジェクト(仮)</h1>
              <div className={styles.mainContent}>
                <div className={styles.characterImageContainer}>
                  <CharacterImage src="/イラスト2.png" alt="キャラクター画像" />
                </div>
                <div className={styles.dialogueContainer}>
                  <div className={styles.dialogueBox}>
                    {displayedDialogue.length > 0 && <p>{displayedDialogue}</p>}
                  </div>
                  <div className={styles.choicesContainer}>
                    {!isTransitioning.current && !isTyping && currentNode.choices?.map((choice) => (
                      <button
                        key={choice.text}
                        className={styles.flatButton}
                        onClick={() => handleChoiceClick(choice.nextId)}
                      >
                        {choice.text}
                        {(selectedChoices.has(choice.nextId) || completedNodes.has(choice.nextId)) && (
                          <span className={styles.checkmark}>✔</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {showHelpLink && (
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); router.push(`/Escape?token=${PAGE_TOKENS.Escape}`); }}
              className={styles.helpLink}
              style={{ fontSize: `${helpLinkSize}rem`, color: helpLinkColor }}
            >
              助けて
            </a>
          )}
        </div>
      </div>
    </>
  );
}

export default function ContactPage() {
  return (
    <Suspense>
      <ContactPageContent />
    </Suspense>
  );
}