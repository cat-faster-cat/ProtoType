'use client';

import React from 'react';
import styles from '../SelfDestructPage.module.css';
import type { GlitchPopup } from '../types';

interface PurgeAnimationProps {
  monologueText: string;
  glitchPopups: GlitchPopup[];
}

const PurgeAnimationComponent: React.FC<PurgeAnimationProps> = ({ monologueText, glitchPopups }) => {
  return (
    <>
      <div className={styles.rightColumn}>
        <div className={styles.monologueWindow}>
          <div className={styles.monologueTitleBar}>
            <span>monologue</span>
            <div className={styles.windowButtons}>
              <span>–</span><span>□</span><span>X</span>
            </div>
          </div>
          <div className={styles.monologueContent}>
            {monologueText}
          </div>
        </div>
      </div>

      {glitchPopups.map((popup) => (
        <div key={popup.key} className={styles.glitchPopup} style={{ top: popup.top, left: popup.left }}>
          <div className={styles.glitchPopupTitleBar}>
            <span>ALERT [PID: {(popup.key * 10000).toFixed(0)}]</span>
            <span>X</span>
          </div>
          <div className={styles.glitchPopupContent}>
            {popup.text}
          </div>
        </div>
      ))}
    </>
  );
};

export const PurgeAnimation = React.memo(PurgeAnimationComponent);
