/*
===============================================================================
FILE: src/components/TimerManager.tsx

Step 11 Responsibilities:
- Own all timer trees
- Full-window edit mode
- Clone default timers on edit
- Handle save / delete
- Enable sub-timer editing
===============================================================================
*/

import { useState } from 'react';
import { TimerConfig } from '../models/TimerTypes';
import { TimerNode } from '../timers/TimerNode';
import { TimerRunner } from './TimerRunner';
import { TimerEditor } from './TimerEditor';

interface Props {
  defaultRoots: TimerNode[];
}

/* Convert runtime tree to config */
function serializeNode(node: TimerNode): TimerConfig {
  return {
    ...node.config,
    children: node.children.map(serializeNode),
  };
}

/* Deep clone config */
function cloneConfig(config: TimerConfig): TimerConfig {
  return JSON.parse(JSON.stringify(config));
}

export function TimerManager({ defaultRoots }: Props) {
  const [timers, setTimers] = useState<TimerConfig[]>(
    defaultRoots.map((r) => ({
      ...serializeNode(r),
      isDefault: true,
    })),
  );

  const [selected, setSelected] = useState<TimerConfig | null>(null);
  const [editing, setEditing] = useState<TimerConfig | null>(null);

  /* Build runtime tree */
  function buildNode(config: TimerConfig): TimerNode {
    const node = new TimerNode(config);
    config.children?.forEach((c) => node.addChild(buildNode(c)));
    return node;
  }

  /* Save edit */
  function handleSave(updated: TimerConfig) {
    let newTimers = [...timers];

    if (updated.isDefault) {
      /* Clone default timer instead of modifying */
      const clone = cloneConfig(updated);
      clone.id = crypto.randomUUID();
      clone.isDefault = false;
      newTimers.push(clone);
    } else {
      newTimers = newTimers.map((t) => (t.id === updated.id ? updated : t));
    }

    setTimers(newTimers);
    setEditing(null);
  }

  /* Delete */
  function handleDelete(id: string) {
    setTimers(timers.filter((t) => t.id !== id));
    setEditing(null);
  }

  /* MAIN WINDOW */
  if (!editing) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Kersh Timer</h1>

        {timers.map((t) => (
          <div key={t.id} style={{ marginBottom: 8 }}>
            <span
              style={{ cursor: 'pointer', marginRight: 10 }}
              onClick={() => setSelected(t)}
            >
              {t.name}
            </span>

            <button onClick={() => setEditing(cloneConfig(t))}>≡</button>
          </div>
        ))}

        {selected && <TimerRunner root={buildNode(selected)} />}
      </div>
    );
  }

  /* EDIT WINDOW (Full Window Replacement) */
  return (
    <TimerEditor
      config={editing}
      onSave={handleSave}
      onDelete={handleDelete}
      onCancel={() => setEditing(null)}
    />
  );
}
