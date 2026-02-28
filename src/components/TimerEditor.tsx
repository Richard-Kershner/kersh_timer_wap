/*
===============================================================================
FILE: src/components/TimerEditor.tsx

Step 11:
- Full window edit mode
- Supports editing sub timers
- Allows:
    duration
    interval
    increment
    sound
- Save / Delete / Cancel returns to main window
===============================================================================
*/

import { useState } from 'react';
import { TimerConfig } from '../models/TimerTypes';
import { AVAILABLE_SOUNDS } from '../audio/SoundRegistry';

interface Props {
  config: TimerConfig;
  onSave: (config: TimerConfig) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

export function TimerEditor({ config, onSave, onDelete, onCancel }: Props) {
  const [local, setLocal] = useState<TimerConfig>(config);

  function updateField<K extends keyof TimerConfig>(
    key: K,
    value: TimerConfig[K],
  ) {
    setLocal({ ...local, [key]: value });
  }

  function updateChild(index: number, child: TimerConfig) {
    const children = [...(local.children || [])];
    children[index] = child;
    setLocal({ ...local, children });
  }

  function addChild() {
    const children = [...(local.children || [])];
    children.push({
      id: crypto.randomUUID(),
      name: 'New Sub Timer',
      durationMs: 5000,
    });
    setLocal({ ...local, children });
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Timer</h2>

      <label>Name</label>
      <input
        value={local.name}
        onChange={(e) => updateField('name', e.target.value)}
      />

      <label>Duration (ms)</label>
      <input
        type="number"
        value={local.durationMs}
        onChange={(e) => updateField('durationMs', Number(e.target.value))}
      />

      <label>Interval (ms)</label>
      <input
        type="number"
        value={local.intervalMs || 0}
        onChange={(e) => updateField('intervalMs', Number(e.target.value))}
      />

      <label>Increment (ms)</label>
      <input
        type="number"
        value={local.incrementMs || 0}
        onChange={(e) => updateField('incrementMs', Number(e.target.value))}
      />

      <label>Sound</label>
      <select
        value={local.sound || ''}
        onChange={(e) => setLocal({ ...local, sound: e.target.value })}
      >
        <option value="">None</option>
        {AVAILABLE_SOUNDS.map((file) => (
          <option key={file} value={file}>
            {file}
          </option>
        ))}
      </select>

      <button
        onClick={() => {
          if (!local.sound) return;
          const audio = new Audio(`/sounds/${local.sound}`);
          audio.currentTime = 0;
          audio.play();
        }}
      >
        Preview
      </button>

      <h3>Sub Timers</h3>

      {local.children?.map((child, i) => (
        <div key={child.id} style={{ marginBottom: 10 }}>
          <input
            value={child.name}
            onChange={(e) =>
              updateChild(i, {
                ...child,
                name: e.target.value,
              })
            }
          />

          <button
            onClick={() =>
              updateChild(i, {
                ...child,
                durationMs: child.durationMs + 1000,
              })
            }
          >
            +1s
          </button>
        </div>
      ))}

      <button onClick={addChild}>+ Add Sub Timer</button>

      <hr />

      <button onClick={() => onSave(local)}>Save</button>

      {!local.isDefault && (
        <button onClick={() => onDelete(local.id)}>Delete</button>
      )}

      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}
