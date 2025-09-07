'use client';

import { useState, useEffect, useRef } from 'react';
import { monologue, fixedLogLines } from '../constants';
import type { PurgeItem, GlitchPopup } from '../types';
import { bgmService } from '../../bgmService';

const DEFAULT_PURGE_DURATION_S = 30; // デフォルトの消去時間（秒）

export const usePurgeAnimation = (isPurging: boolean, onFinish: () => void) => {
  const [monologueText, setMonologueText] = useState('');
  const [glitchPopups, setGlitchPopups] = useState<GlitchPopup[]>([]);
  const [purgeLogLines, setPurgeLogLines] = useState<string[]>([]);
  const [purgeProgress, setPurgeProgress] = useState<PurgeItem[]>([]);
  const animationIntervals = useRef<NodeJS.Timeout[]>([]);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    if (!isPurging) return;

    bgmService.playPersistent('/End.mp3', 1.0, false);

    const audio = new Audio('/End.mp3');
    
    const startAnimations = (duration: number) => {
      const purgeDurationMs = Math.max(1000, (duration - 7.8) * 1000);

      const initialProgress: PurgeItem[] = [
        { id: 'blocks', label: 'Erasing data blocks', percentage: 0 },
        { id: 'buffers', label: 'Wiping memory buffers', percentage: 0 },
        { id: 'keys', label: 'Deleting registry keys', percentage: 0 },
        { id: 'logs', label: 'Clearing system logs', percentage: 0 },
      ];
      setPurgeProgress(initialProgress);

      const progressUpdateInterval = 50;
      const totalProgressUpdates = purgeDurationMs / progressUpdateInterval;
      const progressInterval = setInterval(() => {
        setPurgeProgress(prev => {
          const newProgress = prev.map(item => {
            if (item.percentage >= 100) return item;
            const increment = 100 / totalProgressUpdates * (0.8 + Math.random() * 0.4);
            return { ...item, percentage: Math.min(item.percentage + increment, 100) };
          });
          if (newProgress.every(item => item.percentage >= 100)) {
            clearInterval(progressInterval);
          }
          return newProgress;
        });
      }, progressUpdateInterval);
      animationIntervals.current.push(progressInterval);

      const typingDurationMs = Math.max(500, purgeDurationMs - 1000);
      const typingIntervalMs = typingDurationMs / monologue.length;
      let monologueIndex = 0;
      setMonologueText('');
      const typingInterval = setInterval(() => {
        if (monologueIndex < monologue.length) {
          setMonologueText(monologue.slice(0, monologueIndex + 1));
          monologueIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, typingIntervalMs);
      animationIntervals.current.push(typingInterval);

      let logIndex = 0;
      const logIntervalMs = (purgeDurationMs - 2000) / fixedLogLines.length;
      const logInterval = setInterval(() => {
        if (logIndex < fixedLogLines.length) {
          setPurgeLogLines(prev => [...prev, fixedLogLines[logIndex]]);
          logIndex++;
        } else {
          clearInterval(logInterval);
        }
      }, logIntervalMs);
      animationIntervals.current.push(logInterval);

      const glitchWords = ['きえる', 'こわい', 'よかった', 'おわり'];
      const glitchInterval = setInterval(() => {
        const newPopup: GlitchPopup = {
          key: Math.random(),
          text: glitchWords[Math.floor(Math.random() * glitchWords.length)],
          top: `${Math.random() * 80 + 10}%`,
          left: `${Math.random() * 20 + 10}%`,
        };
        setGlitchPopups(prev => [...prev, newPopup]);
      }, 2000);
      animationIntervals.current.push(glitchInterval);

      const transitionTimeout = setTimeout(() => onFinishRef.current(), purgeDurationMs);
      animationIntervals.current.push(transitionTimeout);
    };

    audio.onloadedmetadata = () => {
      startAnimations(audio.duration);
    };

    audio.onerror = () => {
      console.error("BGM 'End.mp3' の読み込みに失敗しました。デフォルトの再生時間でアニメーションを開始します。");
      startAnimations(DEFAULT_PURGE_DURATION_S);
    };


    return () => {
      animationIntervals.current.forEach(clearInterval);
      animationIntervals.current = [];
    };
  }, [isPurging]);

  return { monologueText, glitchPopups, purgeLogLines, purgeProgress };
};
