/*
===============================================================================
FILE: src/components/TimerManager.tsx

Owns:
- TimerNodeConfig roots
- Editing lifecycle
- Persistence boundary
===============================================================================
*/

import { useEffect, useState } from 'react';
import { TimerNodeConfig } from '../models/TimerTypes';
import { TimerRunner } from './TimerRunner';
import { TimerEditor } from './TimerEditor';
import { PersistenceService } from '../services/PersistenceService';

interface Props {
  defaultRoots: TimerNodeConfig[];
}

/* Deep clone */
function cloneConfig(config: TimerNodeConfig): TimerNodeConfig {
  return JSON.parse(JSON.stringify(config));
}

/* Reorder helper */
function moveItem<T>(arr: T[], from: number, to: number): T[] {
  const updated = [...arr];
  const [item] = updated.splice(from, 1);
  updated.splice(to, 0, item);
  return updated;
}

export function TimerManager({ defaultRoots }: Props) {
  const [timers, setTimers] = useState<TimerNodeConfig[]>([]);
  const [selected, setSelected] = useState<TimerNodeConfig | null>(null);
  const [editing, setEditing] = useState<TimerNodeConfig | null>(null);

  /* Initial load */
  useEffect(() => {
    async function load() {
      const stored = await PersistenceService.loadAllTimers();

      if (stored.length > 0) {
        setTimers(stored.map((s) => s.config));
      } else {
        setTimers(defaultRoots.map((r) => cloneConfig(r)));
      }
    }

    load();
  }, [defaultRoots]);

  /* Save */
  async function handleSave(updated: TimerNodeConfig) {
    const exists = timers.some((t) => t.id === updated.id);

    const newTimers = exists
      ? timers.map((t) => (t.id === updated.id ? updated : t))
      : [...timers, updated];

    setTimers(newTimers);

    await PersistenceService.saveTimer(updated, 'Idle' as any);

    setEditing(null);
  }

  /* Delete */
  async function handleDelete(id: string) {
    const filtered = timers.filter((t) => t.id !== id);

    setTimers(filtered);

    await PersistenceService.deleteTimer(id);

    setEditing(null);
  }

  /* Import */
  async function handleImport(parsed: TimerNodeConfig[]) {
    setTimers(parsed);

    for (const t of parsed) {
      await PersistenceService.saveTimer(t, 'Idle' as any);
    }
  }

  /* Reorder */
  async function handleReorder(from: number, to: number) {
    const reordered = moveItem(timers, from, to);

    setTimers(reordered);

    for (const t of reordered) {
      await PersistenceService.saveTimer(t, 'Idle' as any);
    }
  }

  /* ================= MAIN VIEW ================= */
  if (!editing) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Kersh Timer</h1>

        {/* Export */}
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

        {/* Import */}
        <input
          type="file"
          accept="application/json"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = async () => {
              const parsed: TimerNodeConfig[] = JSON.parse(
                reader.result as string,
              );

              await handleImport(parsed);
            };

            reader.readAsText(file);
          }}
        />

        {/* Timer List */}
        {timers.map((t, index) => (
          <div
            key={t.id}
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData('index', index.toString())
            }
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const from = Number(e.dataTransfer.getData('index'));

              handleReorder(from, index);
            }}
            style={{ marginBottom: 8 }}
          >
            <span
              style={{
                cursor: 'pointer',
                marginRight: 10,
              }}
              onClick={() => setSelected(t)}
            >
              {t.name}
            </span>

            <button onClick={() => setEditing(cloneConfig(t))}>Edit</button>
          </div>
        ))}

        {selected && <TimerRunner root={selected} />}
      </div>
    );
  }

  /* ================= EDIT VIEW ================= */
  return (
    <TimerEditor
      config={editing}
      onSave={handleSave}
      onDelete={handleDelete}
      onCancel={() => setEditing(null)}
    />
  );
}
