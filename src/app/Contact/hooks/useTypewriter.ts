import { useState, useEffect, useCallback } from 'react';

export function useTypewriter(
  text: string,
  speed: number = 50,
  typewriterAudioRef: React.RefObject<HTMLAudioElement | null>
) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const reset = useCallback(() => {
    setDisplayedText('');
  }, []);

  useEffect(() => {
    if (!text) {
      reset();
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    setDisplayedText('');
    
    let index = 0;
    const intervalId = setInterval(() => {
      if (typewriterAudioRef.current) {
        typewriterAudioRef.current.currentTime = 0;
        typewriterAudioRef.current.play().catch(() => {});
      }

      index++;
      setDisplayedText(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(intervalId);
        setIsTyping(false);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, typewriterAudioRef, reset]);

  return { displayedText, isTyping, reset };
}