/*
===============================================================================
FILE: src/components/TimerEditor.tsx

Purpose:
- Full window editor for a TimerNodeConfig
- Creates / edits nested timer structures
- Does NOT execute timers
- Pure configuration editor

Used by:
- TimerManager (full-window replacement view)

Responsibilities:
- Edit name
- Edit duration
- Edit sound inheritance
- Save / Delete / Cancel actions
===============================================================================
*/

import { useState } from 'react';
import { TimerNodeConfig } from '../models/TimerTypes';
import { AVAILABLE_SOUNDS } from '../audio/SoundRegistry';

interface Props {
  config: TimerNodeConfig;
  onSave: (config: TimerNodeConfig) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  onCancel: () => void;
}

/* simple id generator (no uuid dependency) */
function generateId(): string {
  return crypto.randomUUID();
}

export function TimerEditor({ config, onSave, onDelete, onCancel }: Props) {
  const [local, setLocal] = useState<TimerNodeConfig>(
    JSON.parse(JSON.stringify(config)),
  );

  /* update helper */
  function update<K extends keyof TimerNodeConfig>(
    key: K,
    value: TimerNodeConfig[K],
  ) {
    setLocal((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  /* add sequential child */
  function addChild() {
    update('sequentialChild', {
      id: generateId(),
      name: 'Child Alarm',
      durationMs: 5000,
      inheritSound: true,
    });
  }

  /* add parallel sibling */
  function addSibling() {
    const list = local.parallelSiblings ?? [];

    if (list.length >= 3) return;

    update('parallelSiblings', [
      ...list,
      {
        id: generateId(),
        name: 'Parallel Alarm',
        durationMs: 5000,
        inheritSound: true,
      },
    ]);
  }

  /* ================= UI ================= */

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Timer</h2>

      {/* NAME */}
      <div>
        <label>Name</label>
        <input
          value={local.name}
          onChange={(e) => update('name', e.target.value)}
        />
      </div>

      {/* DURATION */}
      <div>
        <label>Duration (seconds)</label>
        <input
          type="number"
          value={local.durationMs / 1000}
          onChange={(e) => update('durationMs', Number(e.target.value) * 1000)}
        />
      </div>

      {/* SOUND */}
      <div>
        <label>Alarm Sound</label>
        <select
          value={local.sound ?? ''}
          onChange={(e) => update('sound', e.target.value || undefined)}
        >
          <option value="">(inherit)</option>

          {AVAILABLE_SOUNDS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* INHERIT */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={local.inheritSound}
            onChange={(e) => update('inheritSound', e.target.checked)}
          />
          Inherit sound from parent
        </label>
      </div>

      {/* STRUCTURE */}
      <div style={{ marginTop: 20 }}>
        <button onClick={addChild}>Add Sequential Child</button>

        <button onClick={addSibling} style={{ marginLeft: 10 }}>
          Add Parallel Sibling
        </button>
      </div>

      {/* ACTIONS */}
      <div style={{ marginTop: 30 }}>
        <button onClick={() => onSave(local)}>Save</button>

        <button onClick={() => onDelete(local.id)} style={{ marginLeft: 10 }}>
          Delete
        </button>

        <button onClick={onCancel} style={{ marginLeft: 10 }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
