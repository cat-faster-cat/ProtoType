export type Line = {
  id: number;
  text: string;
  status: 'loading' | 'done' | 'static' | 'purge_progress' | 'purge_log';
};

export type ProcState = 'booting' | 'awaiting_key' | 'awaiting_confirmation' | 'awaiting_trace' | 'locating' | 'purging' | 'finished' | 'terminated';

export type PurgeItem = {
  id: string;
  label: string;
  percentage: number;
};

export type GlitchPopup = {
  key: number;
  text: string;
  top: string;
  left: string;
};