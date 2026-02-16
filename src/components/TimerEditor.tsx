/*
File: TimerEditor.tsx

Final Intended Purpose:
- UI for creating and editing TimerConfig objects.
- Saves timers via PersistenceService.
- Does not interact with runtime engine.

Explicit Responsibilities:
- Create new timer configs.
- Edit name and duration.
- Persist TimerConfig.
- Emit save completion event.

Connected Files:
- PersistenceService.ts
- TimerTypes.ts

Shared Data Models:
- TimerConfig
- TimerState

Development Steps:
- Step 1: Scaffold (COMPLETE — 2026-02-03)
- Step 2: Form logic (COMPLETE — 2026-02-13)
- Step 3: Basic validation (COMPLETE — 2026-02-13)
- Step 7 Fix: durationMs alignment (COMPLETE — 2026-02-13)

Change Log:
- 2026-02-13
  - Implemented controlled form.
  - Added save logic.
  - Corrected duration to durationMs.
*/

import { useEffect, useState } from 'react';
import { TimerConfig, TimerState } from '../models/TimerTypes';
import { PersistenceService } from '../services/PersistenceService';

interface Props {
  selected?: TimerConfig;
  onSaved: () => void;
}

function generateId(): string {
  return crypto.randomUUID();
}

export function TimerEditor({ selected, onSaved }: Props) {
  const [name, setName] = useState<string>('');
  const [durationSeconds, setDurationSeconds] = useState<number>(60);

  useEffect(() => {
    if (selected) {
      setName(selected.name ?? '');
      setDurationSeconds(
        selected.durationMs ? selected.durationMs / 1000 : 60,
      );
    } else {
      setName('');
      setDurationSeconds(60);
    }
  }, [selected]);

  async function handleSave(): Promise<void> {
    if (!name.trim()) return;

    const config: TimerConfig = {
      id: selected?.id ?? generateId(),
      name,
      durationMs: durationSeconds * 1000,
    };

    const initialState: TimerState = TimerState.IDLE;

    await PersistenceService.saveTimer(config, initialState);
    onSaved();
  }

  return (
    <div>
      <h3>{selected ? 'Edit Timer' : 'New Timer'}</h3>

      <div>
        <label>Name:</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label>Duration (seconds):</label>
        <input
          type="number"
          value={durationSeconds}
          onChange={(e) =>
            setDurationSeconds(Number(e.target.value))
          }
        />
      </div>

      <button onClick={handleSave}>Save</button>
    </div>
  );
}
