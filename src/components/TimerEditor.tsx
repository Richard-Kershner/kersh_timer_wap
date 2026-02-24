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
      setDurationSeconds(selected.durationMs ? selected.durationMs / 1000 : 60);
    }
  }, [selected]);

  async function handleSave(): Promise<void> {
    if (!name.trim()) return;

    const config: TimerConfig = {
      id: selected?.id || generateId(),
      name,
      durationMs: durationSeconds * 1000,
    };

    const json = JSON.stringify(config, null, 2);
    console.log('Saved JSON:', json);

    await PersistenceService.saveTimer(config, TimerState.IDLE);
    onSaved();
  }

  return (
    <div style={{ marginTop: 20 }}>
      <h3>{selected?.id ? 'Edit Timer' : 'New Timer'}</h3>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Timer name"
      />

      <input
        type="number"
        value={durationSeconds}
        onChange={(e) => setDurationSeconds(Number(e.target.value))}
      />

      <button onClick={handleSave}>Save</button>
    </div>
  );
}
