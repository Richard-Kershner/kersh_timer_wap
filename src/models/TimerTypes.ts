export type TimerStatus = 'IDLE' | 'RUNNING' | 'COMPLETE' | 'STOPPED';

/* ===========================
   SKIN TYPES
   =========================== */

export type RunnerLayoutType =
  | 'COLUMN'
  | 'ONE_AT_A_TIME';

export type AlarmSkinType =
  | 'NONE'
  | 'CIRCLE';

export type BackgroundColorOption =
  | 'white'
  | 'black'
  | 'darkgray'
  | 'navy'
  | 'olive'
  | 'teal'
  | 'maroon';

/* ===========================
   TIMER CONFIG
   =========================== */

export interface TimerNodeConfig {
  id: string;
  name: string;
  durationMs: number;

  sound?: string | 'none';
  inheritSound: boolean;

  /* alarm skin */
  skin?: AlarmSkinType;
  inheritSkin?: boolean;

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