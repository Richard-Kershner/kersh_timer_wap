/*
===============================================================================
FILE: src/components/TimerManager.tsx
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

/* Deep clone helper */
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
  const [showManager, setShowManager] = useState(false);

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    async function load() {
      const stored = await PersistenceService.loadAllTimers();

      if (stored.length > 0) {
        const configs = stored.map((s) => s.config);
        setTimers(configs);
        setSelected(configs[0] ?? null);
      } else {
        const defaults = defaultRoots.map((r) => cloneConfig(r));
        setTimers(defaults);
        setSelected(defaults[0] ?? null);
      }
    }

    load();
  }, [defaultRoots]);

  /* ================= SAVE ================= */

  async function handleSave(updated: TimerNodeConfig) {
    const exists = timers.some((t) => t.id === updated.id);

    const newTimers = exists
      ? timers.map((t) => (t.id === updated.id ? updated : t))
      : [...timers, updated];

    setTimers(newTimers);
    setSelected(updated);

    await PersistenceService.saveTimer(updated, {
      remainingMs: updated.durationMs,
      status: 'IDLE',
    });

    setEditing(null);
  }

  /* ================= DELETE ================= */

  async function handleDelete(id: string) {
    const filtered = timers.filter((t) => t.id !== id);

    setTimers(filtered);

    await PersistenceService.deleteTimer(id);

    setEditing(null);

    if (filtered.length > 0) {
      setSelected(filtered[0]);
    } else {
      setSelected(null);
    }
  }

  /* ================= IMPORT ================= */

  async function handleImport(parsed: TimerNodeConfig[]) {
    setTimers(parsed);

    for (const t of parsed) {
      await PersistenceService.saveTimer(t, {
        remainingMs: t.durationMs,
        status: 'IDLE',
      });
    }

    setSelected(parsed[0] ?? null);
  }

  /* ================= REORDER ================= */

  async function handleReorder(from: number, to: number) {
    const reordered = moveItem(timers, from, to);

    setTimers(reordered);

    for (const t of reordered) {
      await PersistenceService.saveTimer(t, {
        remainingMs: t.durationMs,
        status: 'IDLE',
      });
    }
  }

  /* ================= MAIN VIEW ================= */

  if (!editing && !showManager) {
    return (
      <div style={{ padding: 20 }}>
        <div style={{ marginBottom: 20 }}>
          <button onClick={() => setShowManager(true)}>Alarms</button>
        </div>

        <h1>Kersh Timer</h1>

        {selected && <TimerRunner root={cloneConfig(selected)} />}
      </div>
    );
  }

  /* ================= ALARM MANAGER ================= */

  if (showManager && !editing) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Alarm Manager</h2>

        <button onClick={() => setShowManager(false)}>Back</button>

        {timers.map((t) => (
          <div key={t.id} style={{ marginTop: 10 }}>
            <span
              style={{ cursor: 'pointer', marginRight: 10 }}
              onClick={() => {
                setSelected(t);
                setShowManager(false);
              }}
            >
              {t.name}
            </span>

            <button onClick={() => setEditing(cloneConfig(t))}>Edit</button>
          </div>
        ))}

        <div style={{ marginTop: 20 }}>
          <button
            onClick={() =>
              setEditing({
                id: crypto.randomUUID(),
                name: 'New Alarm',
                durationMs: 5000,
                inheritSound: true,
                sound: 'none',
                parallelSiblings: [],
                sequentialChild: undefined,
              })
            }
          >
            New Alarm
          </button>
        </div>
      </div>
    );
  }

  /* ================= EDIT VIEW ================= */

  if (editing) {
    return (
      <TimerEditor
        config={editing}
        onSave={handleSave}
        onDelete={handleDelete}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return null;
}
