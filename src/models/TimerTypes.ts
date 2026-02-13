/*
File: TimerTypes.ts

Final Intended Purpose:
- Canonical shared models for timer engine, audio, and persistence.
- Must remain backward-compatible across completed steps.

Explicit Responsibilities:
- Define runtime states.
- Define timer structural model.
- Define audio configuration model expected by AudioManager.

Connected Files:
- TimerScheduler.ts
- TimerNode.ts
- AudioManager.ts
- PersistenceService.ts
- useTimerEngine.ts
- TimerRunner.tsx

Development Steps:
- Step 1: Base models (COMPLETE — 2026-02-04)
- Step 3: Audio model integration (COMPLETE — 2026-02-07)
- Step 6: Runtime state expansion (COMPLETE — 2026-02-11)

Change Log:
- 2026-02-04
  - Introduced TimerState and TimerConfig
- 2026-02-07
  - Added TimerAudioConfig with alarm/background support
- 2026-02-11
  - Added PAUSED runtime state
*/

export enum TimerState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
}

/* ============================================================
   TIMER STRUCTURE MODEL
   ============================================================ */

export interface TimerConfig {
  id: string;
  name: string;

  durationMs?: number;
  divideParentInto?: number;

  sequential?: boolean;
  children?: TimerConfig[];

  audio?: TimerAudioConfig;
}

/* ============================================================
   AUDIO MODELS (Step 3 Contract)
   ============================================================ */

export enum AudioChannelType {
  ALARM = 'ALARM',
  BACKGROUND = 'BACKGROUND',
}

export interface TimerAudioConfig {
  alarmSoundId?: string;
  backgroundSoundId?: string;
  backgroundLoop?: boolean;
  volume?: number; // 0–1 normalized
}
