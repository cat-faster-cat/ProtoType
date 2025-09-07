'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './SelfDestructPage.module.css';
import type { Line, ProcState } from './types';
import { sequenceData, finalMessage } from './constants';
import { Terminal } from './components/Terminal';
import { PurgeAnimation } from './components/PurgeAnimation';
import { CompletionScreen } from './components/CompletionScreen';
import { usePurgeAnimation } from './hooks/usePurgeAnimation';
import { PAGE_TOKENS } from '../tokens';
import AccessDenied from '../components/AccessDenied';

function SelfDestructPageContent() {
  const [lines, setLines] = useState<Line[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [procState, setProcState] = useState<ProcState>('booting');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const isValidToken = token === PAGE_TOKENS.Self_Destruct;

  const { monologueText, glitchPopups, purgeLogLines, purgeProgress } = usePurgeAnimation(
    procState === 'purging',
    () => setProcState('finished')
  );

  useEffect(() => {
    if (procState !== 'booting' || !isValidToken) return;
    let index = 0;
    const processNextLine = () => {
      if (index < sequenceData.length) {
        const currentLineData = sequenceData[index];
        const lineId = Math.random();
        setLines(prev => [...prev, { id: lineId, text: currentLineData.text, status: 'loading' }]);
        const completionTime = 500 + Math.random() * 200;
        setTimeout(() => {
          setLines(prev => prev.map(line => line.id === lineId ? { ...line, status: 'done' } : line));
          index++;
          const nextLineDelay = 100 + Math.random() * 150;
          setTimeout(processNextLine, nextLineDelay);
        }, completionTime);
      } else {
        const staticLines: Line[] = finalMessage.map(text => ({ id: Math.random(), text, status: 'static' }));
        setLines(prev => [...prev, ...staticLines]);
        setShowInput(true);
        setProcState('awaiting_key');
      }
    };
    const startTimeout = setTimeout(processNextLine, 500);
    return () => clearTimeout(startTimeout);
  }, [procState, isValidToken]);

  useEffect(() => {
    if (procState === 'locating') {
      const locateTimeout = setTimeout(() => {
        setLines(prev => [...prev, { id: Math.random(), text: 'Trace data recognized. Locating target...', status: 'done' }, { id: Math.random(), text: 'Starting final purge process...', status: 'done' }]);
        setShowInput(false);
        setProcState('purging');
      }, 1000);
      return () => clearTimeout(locateTimeout);
    }
  }, [procState]);

  useEffect(() => {
    if (procState !== 'purging') return;
    const newProgressLines: Line[] = purgeProgress.map(item => {
      const bar = '[' + '#'.repeat(Math.floor(item.percentage / 10)) + '-'.repeat(10 - Math.floor(item.percentage / 10)) + ']';
      const numericId = Array.from(item.id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return {
        id: numericId,
        text: `${item.label.padEnd(30, ' ')} ${bar} ${Math.floor(item.percentage)}%`,
        status: 'purge_progress'
      };
    });
    const newLogLines: Line[] = purgeLogLines.map(logText => ({
      id: Math.random(),
      text: logText,
      status: 'purge_log'
    }));
    setLines(prev => {
      const otherLines = prev.filter(l => l.status !== 'purge_progress' && l.status !== 'purge_log');
      return [...otherLines, ...newProgressLines, ...newLogLines];
    });
  }, [procState, purgeProgress, purgeLogLines]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.replace(/[^\u0000-\u007F]/g, ''));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || procState === 'terminated' || procState === 'booting') return;
    if (inputValue === 'Trace Acquisition') {
      const commandLine: Line = { id: Math.random(), text: `> ${inputValue}`, status: 'static' };
      const linkLine: Line = { id: Math.random(), text: 'https://www.■■■■■■■.com/watch?v=1nYh2eRMyWM', status: 'static' };
      let linesToRestore: Line[] = [];
      switch (procState) {
        case 'awaiting_key':
          linesToRestore = finalMessage.map(text => ({ id: Math.random(), text, status: 'static' }));
          break;
        case 'awaiting_confirmation':
          linesToRestore.push({ id: Math.random(), text: 'Authorization key accepted. Are you sure you want to proceed? (y/n)', status: 'static' });
          break;
        case 'awaiting_trace':
          linesToRestore.push({ id: Math.random(), text: 'Enter residual trace data to locate target:', status: 'static' });
          break;
      }
      setLines(prev => [...prev, commandLine, linkLine, ...linesToRestore]);
      setInputValue('');
      return;
    }
    const commandLine: Line = { id: Math.random(), text: `> ${inputValue}`, status: 'static' };
    const linesToAdd: Line[] = [commandLine];
    let nextState: ProcState = procState;
    if (procState === 'awaiting_key') {
      if (inputValue === 'Fatal_813') {
        linesToAdd.push({ id: Math.random(), text: 'Authorization key accepted. Are you sure you want to proceed? (y/n)', status: 'static' });
        nextState = 'awaiting_confirmation';
      } else {
        linesToAdd.push({ id: Math.random(), text: 'ERROR: Authorization key denied.', status: 'static' });
      }
    } else if (procState === 'awaiting_confirmation') {
      if (inputValue.toLowerCase() === 'y') {
        linesToAdd.push({ id: Math.random(), text: 'Enter residual trace data to locate target:', status: 'static' });
        nextState = 'awaiting_trace';
      } else if (inputValue.toLowerCase() === 'n') {
        linesToAdd.push({ id: Math.random(), text: 'Operation cancelled by user. Shutting down protocol...', status: 'static' });
        nextState = 'terminated';
      } else {
        linesToAdd.push({ id: Math.random(), text: 'Invalid input. Please enter y or n.', status: 'static' });
      }
    } else if (procState === 'awaiting_trace') {
      if (inputValue === 'kpIHw9a7673Kwi') {
        nextState = 'locating';
      } else {
        linesToAdd.push({ id: Math.random(), text: 'ERROR: Trace data unrecognized.', status: 'static' });
      }
    }
    setLines(prev => [...prev, ...linesToAdd]);
    setProcState(nextState);
    setInputValue('');
  };

  if (!isValidToken) {
    return <AccessDenied />;
  }

  if (procState === 'finished') {
    return <CompletionScreen />;
  }

  return (
    <div className={styles.container}>
      <Terminal 
        lines={lines}
        showInput={showInput}
        inputValue={inputValue}
        procState={procState}
        onInputChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      {procState === 'purging' && (
        <PurgeAnimation 
          monologueText={monologueText}
          glitchPopups={glitchPopups}
        />
      )}
    </div>
  );
}

export default function SelfDestructPage() {
  return (
    <Suspense>
      <SelfDestructPageContent />
    </Suspense>
  );
}