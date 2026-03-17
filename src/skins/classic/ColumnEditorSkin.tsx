/*

FILE: src/skins/classic/ColumnEditorSkin.tsx

Column editor skin

• stable tree updates
• preserves parallel + sequential structure
===========================================

*/

import React from 'react';
import { TimerSkin } from '../TimerSkin';
import { TimerColumnGrid } from './TimerColumnGrid';
import { TimerNodeConfig } from '../../models/TimerTypes';
import { DurationEditor } from '../../components/DurationEditor';
import { AVAILABLE_SOUNDS } from '../../audio/SoundRegistry';

function generateId(): string {
  return crypto.randomUUID();
}

export const ColumnEditorSkin: TimerSkin = {

  renderRunner() {
    throw new Error('Runner not implemented here');
  },

  renderEditor(root: TimerNodeConfig, onChange: (node: TimerNodeConfig) => void) {

// recursive safe update
function updateTree(
  node: TimerNodeConfig,
  targetId: string,
  updater: (n: TimerNodeConfig) => TimerNodeConfig
): TimerNodeConfig {

  if (node.id === targetId) {
    return updater(node);
  }

  return {
    ...node,

    // update sequential branch
    sequentialChild: node.sequentialChild
      ? updateTree(node.sequentialChild, targetId, updater)
      : undefined,

    // update all parallel branches
    parallelSiblings: node.parallelSiblings
      ? node.parallelSiblings.map(p =>
          updateTree(p, targetId, updater)
        )
      : undefined
  };
}

function addChild(node: TimerNodeConfig) {

  const child: TimerNodeConfig = {
    id: generateId(),
    name: 'Child',
    durationMs: 5000,
    inheritSound: true
  };

  onChange(
    updateTree(root, node.id, n => ({
      ...n,
      sequentialChild: child
    }))
  );
}

function addParallel(node: TimerNodeConfig) {

  const parallel: TimerNodeConfig = {
    id: generateId(),
    name: 'Parallel',
    durationMs: 5000,
    inheritSound: true
  };

  onChange(
    updateTree(root, node.id, n => ({
      ...n,
      parallelSiblings: [
        ...(n.parallelSiblings ?? []),
        parallel
      ]
    }))
  );
}

function deleteNode(node: TimerNodeConfig) {

  if (node.id === root.id) return;

  function remove(n: TimerNodeConfig): TimerNodeConfig {

    return {
      ...n,

      // remove sequential match
      sequentialChild:
        n.sequentialChild?.id === node.id
          ? undefined
          : n.sequentialChild
          ? remove(n.sequentialChild)
          : undefined,

      // remove from parallels
      parallelSiblings: n.parallelSiblings
        ?.filter(p => p.id !== node.id)
        .map(remove)
    };
  }

  onChange(remove(root));
}

return (

  <TimerColumnGrid
    root={root}

    renderNode={(node: TimerNodeConfig) => (

      <div style={{
        border: '1px solid #ccc',
        padding: 10,
        background: '#fafafa'
      }}>

        {/* name */}
        <input
          value={node.name}
          onChange={e =>
            onChange(
              updateTree(root, node.id, n => ({
                ...n,
                name: e.target.value
              }))
            )
          }
        />

        {/* duration */}
        <DurationEditor
          ms={node.durationMs ?? 0}
          onChange={(ms: number) =>
            onChange(
              updateTree(root, node.id, n => ({
                ...n,
                durationMs: ms
              }))
            )
          }
        />

        {/* sound */}
        <select
          value={node.inheritSound ? 'inherit' : (node.sound ?? 'none')}
          onChange={e => {

            const v = e.target.value;

            onChange(
              updateTree(root, node.id, n => {

                if (v === 'inherit') {
                  return { ...n, inheritSound: true, sound: undefined };
                }

                if (v === 'none') {
                  return { ...n, inheritSound: false, sound: undefined };
                }

                return { ...n, inheritSound: false, sound: v };

              })
            );

          }}
        >
          <option value="inherit">Inherit</option>
          <option value="none">No Sound</option>

          {AVAILABLE_SOUNDS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* actions */}
        <div style={{ marginTop: 6 }}>

          <button onClick={() => addChild(node)}>
            + Child
          </button>

          <button onClick={() => addParallel(node)}>
            + Parallel
          </button>

          {node.id !== root.id && (
            <button onClick={() => deleteNode(node)}>
              Delete
            </button>
          )}

        </div>

      </div>

    )}

  />

);

  }

};
