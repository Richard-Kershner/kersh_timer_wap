export type TimerStatus = 'IDLE' | 'RUNNING' | 'COMPLETE' | 'STOPPED';

export interface TimerNodeConfig {
  id: string;
  name: string;
  durationMs: number;

  sound?: string;
  inheritSound: boolean;

  sequentialChild?: TimerNodeConfig;
  parallelSiblings?: TimerNodeConfig[];
}

/* ===========================
   BACKWARD COMPATIBILITY
   =========================== */

export type TimerConfig = TimerNodeConfig;

export interface TimerState {
  remainingMs: number;
  status: TimerStatus;
}

export type AudioChannelType = 'DEFAULT';
