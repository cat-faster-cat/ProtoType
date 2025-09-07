'use client';

import React, { useRef, useEffect } from 'react';
import styles from '../SelfDestructPage.module.css';
import type { Line } from '../types';

interface TerminalProps {
  lines: Line[];
  showInput: boolean;
  inputValue: string;
  procState: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const TerminalComponent: React.FC<TerminalProps> = ({ lines, showInput, inputValue, procState, onInputChange, onKeyPress }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    if (showInput) {
      inputRef.current?.focus();
    }
  }, [showInput]);

  return (
    <div ref={containerRef} className={styles.leftColumn}>
      {lines.map((line) => (
        <div key={line.id} className={styles.line}>
          <span className={line.status === 'purge_progress' ? styles.progressLine : line.status === 'purge_log' ? styles.purgeLogText : line.status === 'done' ? styles.done : ''}>
            {line.text}
          </span>
          {line.status === 'loading' && <span>...</span>}
          {line.status !== 'purge_progress' && line.status !== 'purge_log' && line.status !== 'loading' && <span className={styles.done}></span>}
        </div>
      ))}
      {showInput && (
        <div className={styles.promptContainer}>
          <span className={styles.prompt}>&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={onInputChange}
            onKeyPress={onKeyPress}
            className={styles.input}
            autoFocus
            disabled={procState !== 'awaiting_key' && procState !== 'awaiting_confirmation' && procState !== 'awaiting_trace'}
          />
        </div>
      )}
    </div>
  );
};

export const Terminal = React.memo(TerminalComponent);