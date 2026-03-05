/*
===============================================================================
FILE: src/components/TimerEditor.tsx

Recursive structural editor.
Save always clones to new ID.
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

function generateId(): string {
  return crypto.randomUUID();
}

/* Deep clone and regenerate IDs */
function cloneWithNewIds(node: TimerNodeConfig): TimerNodeConfig {
  return {
    ...node,
    id: generateId(),
    sequentialChild: node.sequentialChild
      ? cloneWithNewIds(node.sequentialChild)
      : undefined,
    parallelSiblings: node.parallelSiblings?.map(cloneWithNewIds),
  };
}

/* Recursive Node Editor */
function NodeEditor({
  node,
  onChange,
  onDeleteSelf,
}: {
  node: TimerNodeConfig;
  onChange: (updated: TimerNodeConfig) => void;
  onDeleteSelf?: () => void;
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

  function removeSequential() {
    update('sequentialChild', undefined);
  }

  function removeParallel(index: number) {
    const list = [...(node.parallelSiblings ?? [])];
    list.splice(index, 1);
    update('parallelSiblings', list);
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

      {/* SOUND DROPDOWN */}
      <select
        value={node.inheritSound ? 'inherit' : (node.sound ?? 'inherit')}
        onChange={(e) => {
          const value = e.target.value;

          if (value === 'inherit') {
            onChange({
              ...node,
              inheritSound: true,
              sound: undefined,
            });
          } else {
            onChange({
              ...node,
              inheritSound: false,
              sound: value,
            });
          }
        }}
      >
        <option value="none">No Sound</option>
        <option value="inherit">Inherit</option>
        {AVAILABLE_SOUNDS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <div>
        <button onClick={addSequential}>+ Sequential</button>
        <button onClick={addParallel}>+ Parallel</button>
        {onDeleteSelf && <button onClick={onDeleteSelf}>Delete</button>}
      </div>

      {/* Sequential */}
      {node.sequentialChild && (
        <>
          <button onClick={removeSequential}>Remove Sequential</button>
          <NodeEditor
            node={node.sequentialChild}
            onChange={(child) => update('sequentialChild', child)}
            onDeleteSelf={removeSequential}
          />
        </>
      )}

      {/* Parallel */}
      {node.parallelSiblings?.map((p, i) => (
        <NodeEditor
          key={p.id}
          node={p}
          onChange={(updatedChild) => {
            const list = [...(node.parallelSiblings ?? [])];
            list[i] = updatedChild;
            update('parallelSiblings', list);
          }}
          onDeleteSelf={() => removeParallel(i)}
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
        <button onClick={() => onSave(cloneWithNewIds(local))}>
          Save As New
        </button>

        <button onClick={() => onDelete(config.id)}>Delete Original</button>

        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
