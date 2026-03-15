import { useState } from 'react';
import { TimerNodeConfig, AlarmSkinType } from '../models/TimerTypes';
import { ColumnEditorSkin } from '../skins/classic/ColumnEditorSkin';

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

/* Skin selector UI */
function SkinSelector({
                        node,
                        update
                      }: {
  node: TimerNodeConfig
  update: (node: TimerNodeConfig) => void
}) {

  const value = node.inheritSkin !== false
    ? "inherit"
    : node.skin ?? "CIRCLE";

  return (
    <div style={{ marginTop: 8 }}>
      <label>Alarm Skin:</label>

      <select
        value={value}
        onChange={(e) => {

          const v = e.target.value;

          if (v === "inherit") {
            update({
              ...node,
              inheritSkin: true,
              skin: undefined
            });
          } else {
            update({
              ...node,
              inheritSkin: false,
              skin: v as AlarmSkinType
            });
          }

        }}
      >
        <option value="inherit">Inherit</option>
        <option value="NONE">None (invisible)</option>
        <option value="CIRCLE">Circle Countdown</option>
      </select>

    </div>
  );
}

export function TimerEditor({ config, onSave, onDelete, onCancel }: Props) {

  const [local, setLocal] = useState<TimerNodeConfig>(
    JSON.parse(JSON.stringify(config))
  );

  function updateRoot(updated: TimerNodeConfig) {
    setLocal(updated);
  }

  return (
    <div style={{ padding: 20 }}>

      <h2>Edit Timer</h2>

      {/* Root Skin Control */}
      <SkinSelector
        node={local}
        update={updateRoot}
      />

      {/* Recursive Node Editor */}
      <div style={{ marginTop: 20 }}>
        {ColumnEditorSkin.renderEditor(local, setLocal)}
      </div>

      <div style={{ marginTop: 30 }}>

        <button
          onClick={() => onSave(cloneWithNewIds(local))}
        >
          Save As New
        </button>

        <button
          onClick={() => onDelete(config.id)}
          style={{ marginLeft: 10 }}
        >
          Delete Original
        </button>

        <button
          onClick={onCancel}
          style={{ marginLeft: 10 }}
        >
          Cancel
        </button>

      </div>

    </div>
  );
}