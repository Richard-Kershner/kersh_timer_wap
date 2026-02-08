/*
File: TimerTypes.ts

Final Intended Purpose:
- Defines all timer-related configuration and runtime state models.
- Acts as the single source of truth for timer semantics and persistence identity.

Explicit Responsibilities:
- Describe timer structural configuration (TimerConfig).
- Enumerate execution and lifecycle states (TimerState).
- Define execution semantics used by TimerNode and TimerScheduler.
- Define audio bindings used by AudioManager.
- Define persistence metadata required for offline-first storage and sync.

Connected Files:
- TimerNode.ts (reads TimerConfig, mutates TimerState)
- TimerScheduler.ts (interprets execution and audio semantics)
- AudioManager.ts (reads TimerAudioConfig)
- PersistenceService.ts (serializes configs and state)

Shared Data Models:
- TimerConfig
- TimerState
- TimerExecutionMode
- TimerAudioConfig
- TimerPersistenceMeta

Naming Conventions Enforced:
- Enums use singular nouns.
- Config interfaces are immutable by convention.
- Audio identifiers are opaque string IDs.
- Persistence timestamps are ISO-8601 strings.

Development Steps:
- Step 1: Base timer interfaces (COMPLETE — 2026-02-04)
- Step 2: Execution semantics (COMPLETE — 2026-02-05)
- Step 3: Audio bindings (COMPLETE — 2026-02-06)
- Step 4: Persistence metadata (COMPLETE — 2026-02-07)

Change Log:
- Step 3 completed on 2026-02-06
- Step 4 completed on 2026-02-07
*/

export enum TimerState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  STOPPED = 'STOPPED',
}

export enum TimerExecutionMode {
  SEQUENTIAL = 'SEQUENTIAL',
  PARALLEL = 'PARALLEL',
}

/*
Logical audio channels.
Used to manage overlapping and lifecycle rules.
*/
export enum AudioChannelType {
  ALARM = 'ALARM',
  BACKGROUND = 'BACKGROUND',
}

/*
Audio behavior bound to a timer.
Step 3 artifact.
*/
export interface TimerAudioConfig {
  /*
  Sound played when timer completes.
  */
  alarmSoundId: string;

  /*
  Optional looping background sound during RUNNING state.
  */
  backgroundSoundId?: string;
}

/*
Persistence metadata attached to all timers.
Step 4 artifact.

Used exclusively by PersistenceService and sync layers.
*/
export interface TimerPersistenceMeta {
  /*
  Creation timestamp (ISO-8601).
  */
  createdAt: string;

  /*
  Last modification timestamp (ISO-8601).
  */
  updatedAt: string;

  /*
  Incremented on each persisted mutation.
  Used for conflict resolution in future sync.
  */
  revision: number;
}

/*
Immutable structural configuration for a timer node.
*/
export interface TimerConfig {
  /*
  Stable unique identifier.
  Used as persistence key.
  */
  id: string;

  /*
  Human-readable label.
  */
  label: string;

  /*
  Duration in milliseconds.
  Undefined indicates open-ended timer.
  */
  durationMs?: number;

  /*
  Defines how this node executes its children.
  */
  executionMode: TimerExecutionMode;

  /*
  Audio behavior bound to this timer.
  Step 3: optional but explicit.
  */
  audio?: TimerAudioConfig;

  /*
  Persistence metadata.
  Step 4: required for all persisted timers.
  */
  persistence: TimerPersistenceMeta;
}
