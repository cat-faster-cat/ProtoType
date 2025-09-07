'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { bgmService } from './bgmService';

interface BGMContextType {
  isPlaybackEnabled: boolean;
  enablePlayback: () => void;
}

const BGMContext = createContext<BGMContextType | null>(null);

export default function BGMProvider({ children }: { children: ReactNode }) {
  const [isPlaybackEnabled, setIsPlaybackEnabled] = useState(false);

  const enablePlayback = useCallback(() => {
    bgmService.enablePlayback().then(() => {
      setIsPlaybackEnabled(true);
    });
  }, []);

  useEffect(() => {
    const enabled = sessionStorage.getItem('bgmPlaybackEnabled') === 'true';
    if (enabled) {
      setIsPlaybackEnabled(true);
    } else {
      const handleFirstInteraction = () => {
        enablePlayback();
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
      };
      window.addEventListener('click', handleFirstInteraction);
      window.addEventListener('keydown', handleFirstInteraction);

      return () => {
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
      };
    }
  }, [enablePlayback]);

  return (
    <BGMContext.Provider value={{ isPlaybackEnabled, enablePlayback }}>
      {children}
    </BGMContext.Provider>
  );
}
