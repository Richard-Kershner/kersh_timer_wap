/*
File: TimerTypes.ts

Final Intended Purpose:
- Defines all timer-related configuration and runtime state models.
- Acts as the single source of truth for timer semantics.

Explicit Responsibilities:
- Describe timer structural configuration (TimerConfig).
- Enumerate execution and lifecycle states (TimerState).
- Define execution semantics used by TimerNode and TimerScheduler.

Connected Files:
- TimerNode.ts (reads TimerConfig, mutates TimerState)
- TimerScheduler.ts (interprets execution semantics)
- PersistenceService.ts (serializes configs and state)

Shared Data Models:
- TimerConfig
- TimerState
- TimerExecutionMode

Naming Conventions Enforced:
- Enums use singular nouns.
- Config interfaces are immutable by convention.
- Runtime state enums reflect lifecycle transitions only.

Development Steps:
- Step 1: Base timer interfaces (COMPLETE — 2026-02-04)
- Step 2: Execution semantics (COMPLETE — 2026-02-05)
- Step 3: Audio bindings (PLANNED)
- Step 4: Persistence metadata (PLANNED)

Change Log:
- Step 1 completed on 2026-02-04
- Step 2 completed on 2026-02-05
  - Added execution mode semantics
  - Clarified lifecycle state transitions
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

export interface TimerConfig {
  id: string;
  label: string;

  /**
   * Duration in milliseconds.
   * Undefined indicates open-ended timer.
   */
  durationMs?: number;

  /**
   * Defines how this node executes its children.
   */
  executionMode: TimerExecutionMode;
}
