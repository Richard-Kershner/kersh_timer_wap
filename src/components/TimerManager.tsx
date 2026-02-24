/*
===============================================================================
FILE: src/components/TimerManager.tsx

STEP 10 ROLE:
- Owns multiple root timer trees.
- Provides selection + editing controls.
- Loads persisted timers.
- Exports JSON.
- Delegates runtime to TimerRunner.

NOTE:
- Receives default root trees from main.tsx.
===============================================================================
*/

import { useEffect, useState } from 'react';
import { TimerConfig } from '../models/TimerTypes';
import { TimerNode } from '../timers/TimerNode';
import { TimerRunner } from './TimerRunner';
import { TimerEditor } from './TimerEditor';
import { PersistenceService } from '../services/PersistenceService';

interface Props {
  defaultRoots: TimerNode[];
}

/* Helper: Convert TimerNode → TimerConfig recursively */
function serializeNode(node: TimerNode): TimerConfig {
  return {
    ...node.config,
    children: node.children.map(serializeNode),
  };
}

export function TimerManager({ defaultRoots }: Props) {
  const [timers, setTimers] = useState<TimerConfig[]>(
    defaultRoots.map(serializeNode),
  );

  const [selected, setSelected] = useState<TimerConfig | null>(null);
  const [editing, setEditing] = useState<TimerConfig | null>(null);

  /* ------------------------------------------------------------------------
     On mount: load persisted timers if they exist.
  ------------------------------------------------------------------------ */
  useEffect(() => {
    (async () => {
      const stored = await PersistenceService.loadAllTimers();
      if (stored.length > 0) {
        setTimers(stored.map((r) => r.config));
      }
    })();
  }, []);

  async function handleSaved() {
    const stored = await PersistenceService.loadAllTimers();
    setTimers(stored.map((r) => r.config));
    setEditing(null);
  }

  function exportJSON(timer: TimerConfig) {
    const json = JSON.stringify(timer, null, 2);
    console.log('[Step 10 Export]', json);
  }

  function buildNodeTree(config: TimerConfig): TimerNode {
    const node = new TimerNode(config);
    config.children?.forEach((child) => node.addChild(buildNodeTree(child)));
    return node;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Kersh Timer</h1>

      <h3>Available Timers</h3>

      {timers.map((timer) => (
        <div key={timer.id} style={{ marginBottom: 8 }}>
          <span
            style={{ cursor: 'pointer', marginRight: 10 }}
            onClick={() => setSelected(timer)}
          >
            {timer.name}
          </span>

          {/* Step 10 — Edit Button (≡) */}
          <button onClick={() => setEditing(timer)}>≡</button>

          <button onClick={() => exportJSON(timer)}>Export JSON</button>
        </div>
      ))}

      <button
        onClick={() =>
          setEditing({
            id: '',
            name: '',
            durationMs: 60000,
          })
        }
      >
        + New Timer
      </button>

      {editing && <TimerEditor selected={editing} onSaved={handleSaved} />}

      {selected && <TimerRunner root={buildNodeTree(selected)} />}
    </div>
  );
}
