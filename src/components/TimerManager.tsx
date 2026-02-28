/*
===============================================================================
FILE: src/components/TimerManager.tsx

Step 12 Responsibilities:
- Own all timer trees
- Full-window edit mode
- Clone default timers on edit
- Handle save / delete
- Drag reorder timers
- JSON import/export (all timers)
- Persist ordering
===============================================================================
*/

import { useEffect, useState } from 'react';
import { TimerConfig, TimerState } from '../models/TimerTypes';
import { TimerNode } from '../timers/TimerNode';
import { TimerRunner } from './TimerRunner';
import { TimerEditor } from './TimerEditor';
import { PersistenceService } from '../services/PersistenceService';

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

/* Move array element */
function moveItem<T>(arr: T[], from: number, to: number): T[] {
  const updated = [...arr];
  const [item] = updated.splice(from, 1);
  updated.splice(to, 0, item);
  return updated;
}

export function TimerManager({ defaultRoots }: Props) {
  const [timers, setTimers] = useState<TimerConfig[]>([]);
  const [selected, setSelected] = useState<TimerConfig | null>(null);
  const [editing, setEditing] = useState<TimerConfig | null>(null);

  /* Initial Load */
  useEffect(() => {
    async function load() {
      const stored = await PersistenceService.loadAllTimers();

      if (stored.length > 0) {
        setTimers(stored.map((s) => s.config));
      } else {
        /* Use defaults if nothing persisted */
        setTimers(
          defaultRoots.map((r) => ({
            ...serializeNode(r),
            isDefault: true,
          })),
        );
      }
    }

    load();
  }, [defaultRoots]);

  /* Build runtime tree */
  function buildNode(config: TimerConfig): TimerNode {
    const node = new TimerNode(config);
    config.children?.forEach((c: TimerConfig) => node.addChild(buildNode(c)));
    return node;
  }

  /* Persist all timers */
  async function persistAll(configs: TimerConfig[]) {
    for (const cfg of configs) {
      const runtimeNode = buildNode(cfg);

      await PersistenceService.saveTimer(
        cfg,
        runtimeNode.state
      );
    }
  }

  /* Save edit */
  async function handleSave(updated: TimerConfig) {
    let newTimers = [...timers];

    if (updated.isDefault) {
      /* Clone default instead of modifying */
      const clone = cloneConfig(updated);
      clone.id = crypto.randomUUID();
      clone.isDefault = false;
      newTimers.push(clone);
    } else {
      newTimers = newTimers.map((t) => (t.id === updated.id ? updated : t));
    }

    setTimers(newTimers);
    await persistAll(newTimers);
    setEditing(null);
  }

  /* Delete */
  async function handleDelete(id: string) {
    const filtered = timers.filter((t) => t.id !== id);
    setTimers(filtered);

    await PersistenceService.deleteTimer(id);
    await persistAll(filtered);

    setEditing(null);
  }

  /* MAIN WINDOW */
  if (!editing) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Kersh Timer</h1>

        {/* JSON EXPORT */}
        <button
          onClick={() => {
            const blob = new Blob([JSON.stringify(timers, null, 2)], {
              type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'timers.json';
            a.click();
          }}
        >
          Export All
        </button>

        {/* JSON IMPORT */}
        <input
          type="file"
          accept="application/json"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async () => {
              const parsed: TimerConfig[] = JSON.parse(reader.result as string);
              setTimers(parsed);
              await persistAll(parsed);
            };
            reader.readAsText(file);
          }}
        />

        {/* TIMER LIST */}
        {timers.map((t, index) => (
          <div
            key={t.id}
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData('index', index.toString())
            }
            onDragOver={(e) => e.preventDefault()}
            onDrop={async (e) => {
              const from = Number(e.dataTransfer.getData('index'));
              const reordered = moveItem(timers, from, index);
              setTimers(reordered);
              await persistAll(reordered);
            }}
            style={{ marginBottom: 8 }}
          >
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

  /* EDIT WINDOW */
  return (
    <TimerEditor
      config={editing}
      onSave={handleSave}
      onDelete={handleDelete}
      onCancel={() => setEditing(null)}
    />
  );
}
