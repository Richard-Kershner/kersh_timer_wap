/*
===============================================================================
FILE: src/components/TimerEditor.tsx

Recursive structural editor for TimerNodeConfig
No runtime execution
===============================================================================
*/

import { useState } from 'react';
import { TimerNodeConfig } from '../models/TimerTypes';

interface Props {
  config: TimerNodeConfig;
  onSave: (config: TimerNodeConfig) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  onCancel: () => void;
}

function generateId(): string {
  return crypto.randomUUID();
}

/* Recursive Node Editor */
function NodeEditor({
  node,
  onChange,
}: {
  node: TimerNodeConfig;
  onChange: (updated: TimerNodeConfig) => void;
}) {
  function update<K extends keyof TimerNodeConfig>(
    key: K,
    value: TimerNodeConfig[K],
  ) {
    onChange({ ...node, [key]: value });
  }

  function addSequential() {
    update('sequentialChild', {
      id: generateId(),
      name: 'New Child',
      durationMs: 5000,
      inheritSound: true,
    });
  }

  function addParallel() {
    update('parallelSiblings', [
      ...(node.parallelSiblings ?? []),
      {
        id: generateId(),
        name: 'New Parallel',
        durationMs: 5000,
        inheritSound: true,
      },
    ]);
  }

  return (
    <div
      style={{ marginLeft: 20, borderLeft: '1px solid #ccc', paddingLeft: 10 }}
    >
      <input
        value={node.name}
        onChange={(e) => update('name', e.target.value)}
      />

      <input
        type="number"
        value={node.durationMs ?? 0}
        onChange={(e) => update('durationMs', Number(e.target.value))}
      />

      <label>
        <input
          type="checkbox"
          checked={node.inheritSound}
          onChange={(e) => update('inheritSound', e.target.checked)}
        />
        inheritSound
      </label>

      <div>
        <button onClick={addSequential}>+ Sequential</button>

        <button onClick={addParallel}>+ Parallel</button>
      </div>

      {/* Sequential */}
      {node.sequentialChild && (
        <NodeEditor
          node={node.sequentialChild}
          onChange={(child) => update('sequentialChild', child)}
        />
      )}

      {/* Parallel */}
      {node.parallelSiblings?.map((p, i) => (
        <NodeEditor
          key={p.id}
          node={p}
          onChange={(updatedChild) => {
            const updatedList = [...(node.parallelSiblings ?? [])];
            updatedList[i] = updatedChild;
            update('parallelSiblings', updatedList);
          }}
        />
      ))}
    </div>
  );
}

export function TimerEditor({ config, onSave, onDelete, onCancel }: Props) {
  const [local, setLocal] = useState<TimerNodeConfig>(
    JSON.parse(JSON.stringify(config)),
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Timer</h2>

      <NodeEditor node={local} onChange={setLocal} />

      <div style={{ marginTop: 20 }}>
        <button onClick={() => onSave(local)}>Save</button>

        <button onClick={() => onDelete(local.id)}>Delete</button>

        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
