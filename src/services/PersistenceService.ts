/*
File: PersistenceService.ts

Final Intended Purpose:
- Handles offline-first persistence of timer configurations and runtime state.
- Provides API for saving, loading, and deleting timers.
- Manages serialization and deserialization for local storage and future sync.

Explicit Responsibilities:
- Persist TimerConfig and TimerState objects to IndexedDB (web) or Capacitor Storage (native).
- Ensure offline-first access: reads work without network connectivity.
- Provide hooks for optional cloud sync (Step 4+).
- Maintain versioned storage format for future migrations.

Connected Files:
- TimerGraph.ts (calls load/save timers)
- TimerNode.ts (reads TimerState)
- TimerTypes.ts (reads TimerConfig and TimerState)
- AudioManager.ts (may read audio configs indirectly via timers)

Shared Data Models:
- TimerConfig
- TimerState

Naming Conventions Enforced:
- Methods use camelCase.
- Async methods return Promise<T>.
- All public methods explicitly annotated.
- All storage keys prefixed with 'kersh_timer_'.

Development Steps:
- Step 1: Storage interface (COMPLETE — 2026-02-03)
- Step 2: Serialization (COMPLETE — 2026-02-03)
- Step 3: Sync hooks (PLANNED)
- Step 4: Full persistence & offline sync implementation (IN PROGRESS — 2026-02-07)

Change Log:
- Step 4 started on 2026-02-07
*/

import { TimerConfig, TimerState } from '../models/TimerTypes';

// Storage key(s) prefix
const STORAGE_PREFIX = 'kersh_timer_';

// Abstracted platform storage
async function setItem(key: string, value: string): Promise<void> {
  // Step 4: unified storage for web & Capacitor
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, value);
  } else {
    // Capacitor Storage placeholder
    // import { Storage } from '@capacitor/storage';
    // await Storage.set({ key, value });
  }
}

async function getItem(key: string): Promise<string | null> {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(key);
  } else {
    // Capacitor Storage placeholder
    // const res = await Storage.get({ key });
    // return res.value;
    return null;
  }
}

async function removeItem(key: string): Promise<void> {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(key);
  } else {
    // Capacitor Storage placeholder
    // await Storage.remove({ key });
  }
}

/**
 * PersistenceService
 *
 * Provides offline-first storage for Kersh Timer.
 */
export class PersistenceService {
  /**
   * Save a timer configuration and its current state.
   * Step 4: active implementation
   */
  static async saveTimer(timer: TimerConfig, state: TimerState): Promise<void> {
    const key = STORAGE_PREFIX + timer.id;
    const payload = JSON.stringify({ config: timer, state });
    await setItem(key, payload);
  }

  /**
   * Load a timer by ID.
   * Returns null if not found.
   */
  static async loadTimer(
    timerId: string,
  ): Promise<{ config: TimerConfig; state: TimerState } | null> {
    const key = STORAGE_PREFIX + timerId;
    const raw = await getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (err) {
      console.error(`Failed to parse timer ${timerId}:`, err);
      return null;
    }
  }

  /**
   * Load all timers stored locally.
   */
  static async loadAllTimers(): Promise<
    Array<{ config: TimerConfig; state: TimerState }>
  > {
    const timers: Array<{ config: TimerConfig; state: TimerState }> = [];
    if (typeof localStorage !== 'undefined') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
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
    } else {
      // Capacitor Storage placeholder: implement getAllKeys + multiGet
    }
    return timers;
  }

  /**
   * Delete a timer by ID.
   */
  static async deleteTimer(timerId: string): Promise<void> {
    const key = STORAGE_PREFIX + timerId;
    await removeItem(key);
  }

  /**
   * Placeholder for future cloud sync.
   * Step 4+: hook to push local changes to server.
   */
  static async syncTimers(): Promise<void> {
    // TODO: implement server sync
  }
}
