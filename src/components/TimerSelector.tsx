/*
File: TimerSelector.tsx

Final Intended Purpose:
- UI for selecting, loading, and deleting persisted timers.
- Operates strictly at the TimerConfig layer.
- Emits selected TimerConfig upward.
- Never interacts with TimerScheduler or runtime state.

Explicit Responsibilities:
- Load all saved timers from PersistenceService.
- Render selectable list.
- Allow deletion.
- Emit selection to parent via callback.

Connected Files:
- PersistenceService.ts
- TimerTypes.ts

Shared Data Models:
- TimerConfig
- TimerState (read-only via loadAllTimers return type)

Naming Conventions Enforced:
- Functional React component.
- No side effects outside useEffect.
- Async methods explicitly typed.

Development Steps:
- Step 1: Scaffold (COMPLETE — 2026-02-13)
- Step 2: Load & selection logic (COMPLETE — 2026-02-13)

Change Log:
- 2026-02-13
  - Implemented timer listing, selection, and deletion.
*/

import { useEffect, useState } from 'react';
import { TimerConfig } from '../models/TimerTypes';
import { PersistenceService } from '../services/PersistenceService';

interface Props {
  onSelect: (config: TimerConfig) => void;
}

export function TimerSelector({ onSelect }: Props) {
  const [timers, setTimers] = useState<TimerConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function loadTimers(): Promise<void> {
    setLoading(true);
    const results = await PersistenceService.loadAllTimers();
    setTimers(results.map((r) => r.config));
    setLoading(false);
  }

  async function handleDelete(id: string): Promise<void> {
    await PersistenceService.deleteTimer(id);
    await loadTimers();
  }

  useEffect(() => {
    void loadTimers();
  }, []);

  if (loading) {
    return <div>Loading timers...</div>;
  }

  if (timers.length === 0) {
    return <div>No saved timers.</div>;
  }

  return (
    <div>
      <h3>Saved Timers</h3>
      <ul>
        {timers.map((timer) => (
          <li key={timer.id}>
            <span
              style={{ cursor: 'pointer', marginRight: '10px' }}
              onClick={() => onSelect(timer)}
            >
              {timer.name ?? timer.id}
            </span>
            <button onClick={() => handleDelete(timer.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
