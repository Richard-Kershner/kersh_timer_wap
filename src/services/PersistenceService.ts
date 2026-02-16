/*
File: PersistenceService.ts

Final Intended Purpose:
- Handles offline-first persistence of timer configurations and runtime state.
- Provides API for saving, loading, and deleting timers.
- Manages serialization and deserialization for local storage and future sync.
- Persists visualization preferences (Step 8.2).

Explicit Responsibilities:
- Persist TimerConfig and TimerState objects.
- Ensure offline-first access.
- Maintain versioned storage format for future migrations.

Connected Files:
- TimerGraph.ts
- TimerNode.ts
- TimerTypes.ts
- AudioManager.ts
- SkinSelector.tsx

Shared Data Models:
- TimerConfig
- TimerState

Development Steps:
- Step 1: Storage interface (COMPLETE — 2026-02-03)
- Step 2: Serialization (COMPLETE — 2026-02-03)
- Step 3: Sync hooks (PLANNED)
- Step 4: Full persistence implementation (IN PROGRESS — 2026-02-07)
- Step 8.2: Visualization skin persistence (COMPLETE — 2026-02-16)

Change Log:
- 2026-02-07
  - Step 4 persistence started.
- 2026-02-16
  - Added saveSkin() and loadSkin().
*/

import { TimerConfig, TimerState } from '../models/TimerTypes';

const STORAGE_PREFIX = 'kersh_timer_';
const SKIN_KEY = STORAGE_PREFIX + 'skin';

/* Storage Abstraction */

async function setItem(key: string, value: string): Promise<void> {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, value);
  }
}

async function getItem(key: string): Promise<string | null> {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
}

async function removeItem(key: string): Promise<void> {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(key);
  }
}

/* PersistenceService */

export class PersistenceService {
  static async saveTimer(timer: TimerConfig, state: TimerState): Promise<void> {
    const key = STORAGE_PREFIX + timer.id;
    const payload = JSON.stringify({ config: timer, state });
    await setItem(key, payload);
  }

  static async loadTimer(
    timerId: string,
  ): Promise<{ config: TimerConfig; state: TimerState } | null> {
    const key = STORAGE_PREFIX + timerId;
    const raw = await getItem(key);

    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static async loadAllTimers(): Promise<
    Array<{ config: TimerConfig; state: TimerState }>
  > {
    const timers: Array<{ config: TimerConfig; state: TimerState }> = [];

    if (typeof localStorage !== 'undefined') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key && key.startsWith(STORAGE_PREFIX) && key !== SKIN_KEY) {
          const raw = localStorage.getItem(key);
          if (raw) {
            try {
              timers.push(JSON.parse(raw));
            } catch {
              // ignore corrupted entries
            }
          }
        }
      }
    }

    return timers;
  }

  static async deleteTimer(timerId: string): Promise<void> {
    const key = STORAGE_PREFIX + timerId;
    await removeItem(key);
  }

  static async syncTimers(): Promise<void> {
    // Future cloud sync implementation
  }

  /* Step 8.2 — Skin Persistence */

  static async saveSkin(skin: string): Promise<void> {
    await setItem(SKIN_KEY, skin);
  }

  static async loadSkin(): Promise<string | null> {
    return await getItem(SKIN_KEY);
  }
}
