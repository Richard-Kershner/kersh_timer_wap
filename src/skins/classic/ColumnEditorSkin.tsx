/*
===============================================================================
Column-aligned timer editor skin
===============================================================================
*/

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

  renderEditor(root, onChange) {
    function updateNode(
      target: TimerNodeConfig,
      updated: TimerNodeConfig,
    ): TimerNodeConfig {
      if (target.id === updated.id) return updated;

      return {
        ...target,

        sequentialChild: target.sequentialChild
          ? updateNode(target.sequentialChild, updated)
          : undefined,

        parallelSiblings: target.parallelSiblings?.map((p: TimerNodeConfig) =>
          updateNode(p, updated),
        ),
      };
    }

    function addChild(node: TimerNodeConfig) {
      const child: TimerNodeConfig = {
        id: generateId(),
        name: 'Child',
        durationMs: 5000,
        inheritSound: true,
      };

      onChange(
        updateNode(root, {
          ...node,
          sequentialChild: child,
        }),
      );
    }

    function addParallel(node: TimerNodeConfig) {
      const parallel: TimerNodeConfig = {
        id: generateId(),
        name: 'Parallel',
        durationMs: 5000,
        inheritSound: true,
      };

      onChange(
        updateNode(root, {
          ...node,
          parallelSiblings: [...(node.parallelSiblings ?? []), parallel],
        }),
      );
    }

    function deleteNode(node: TimerNodeConfig) {
      if (node.id === root.id) return;

      function remove(target: TimerNodeConfig): TimerNodeConfig {
        return {
          ...target,

          sequentialChild:
            target.sequentialChild?.id === node.id
              ? undefined
              : target.sequentialChild
                ? remove(target.sequentialChild)
                : undefined,

          parallelSiblings: target.parallelSiblings
            ?.filter((p: TimerNodeConfig) => p.id !== node.id)
            .map((p: TimerNodeConfig) => remove(p)),
        };
      }

      onChange(remove(root));
    }

    return (
      <TimerColumnGrid
        root={root}
        renderNode={(node: TimerNodeConfig) => (
          <div
            style={{
              border: '1px solid #ccc',
              padding: 10,
              background: '#fafafa',
            }}
          >
            <input
              value={node.name}
              onChange={(e) =>
                onChange(
                  updateNode(root, {
                    ...node,
                    name: e.target.value,
                  }),
                )
              }
            />

            <DurationEditor
              ms={node.durationMs ?? 0}
              onChange={(ms: number) =>
                onChange(
                  updateNode(root, {
                    ...node,
                    durationMs: ms,
                  }),
                )
              }
            />

            {/* SOUND SELECTOR */}

            <select
              value={node.inheritSound ? 'inherit' : (node.sound ?? 'none')}
              onChange={(e) => {
                const v = e.target.value;

                if (v === 'inherit') {
                  onChange(
                    updateNode(root, {
                      ...node,
                      inheritSound: true,
                      sound: undefined,
                    }),
                  );
                } else if (v === 'none') {
                  onChange(
                    updateNode(root, {
                      ...node,
                      inheritSound: false,
                      sound: undefined,
                    }),
                  );
                } else {
                  onChange(
                    updateNode(root, {
                      ...node,
                      inheritSound: false,
                      sound: v,
                    }),
                  );
                }
              }}
            >
              <option value="inherit">Inherit</option>
              <option value="none">No Sound</option>

              {AVAILABLE_SOUNDS.map((s: string) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <div style={{ marginTop: 6 }}>
              <button onClick={() => addChild(node)}>+ Child</button>

              <button onClick={() => addParallel(node)}>+ Parallel</button>

              {node.id !== root.id && (
                <button onClick={() => deleteNode(node)}>Delete</button>
              )}
            </div>
          </div>
        )}
      />
    );
  },
};
