/*
===============================================================================
FILE: src/models/TimerTypes.ts

Centralized domain model definitions.

This file MUST remain backward compatible with:
- TimerNode
- TimerScheduler
- TimerRunner
- AudioManager
- AudioService
- PersistenceService
===============================================================================
*/

/* ============================================================================
   TIMER CONFIGURATION (STRUCTURAL)
============================================================================ */

export interface TimerConfig {
  id: string;
  name: string;

  durationMs: number;
  intervalMs?: number;
  incrementMs?: number;

  sound?: string;

  children?: TimerConfig[];

  isDefault?: boolean;
}

/* ============================================================================
   TIMER RUNTIME STATE
============================================================================ */

export enum TimerState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
}

/* ============================================================================
   AUDIO CHANNEL TYPES
============================================================================ */

export enum AudioChannelType {
  ALARM = 'ALARM',
  BACKGROUND = 'BACKGROUND',
  INTERVAL = 'INTERVAL',
  NOTIFICATION = 'NOTIFICATION',
}

/* ============================================================================
   TIMER AUDIO CONFIG
============================================================================ */

export interface TimerAudioConfig {
  /* Used by AudioManager */
  alarmSoundId?: string;

  /* Optional looping background */
  backgroundSoundId?: string;

  /* Optional volume */
  volume?: number;

  /* Optional channel override */
  channel?: AudioChannelType;
}

/* ============================================================================
   STEP 12 ADDITIONS (No versioning)
============================================================================ */

export interface TimerConfig {
  repeatCount?: number;
  category?: string;
}
