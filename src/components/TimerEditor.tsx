import { useState } from 'react';
import { TimerNodeConfig } from '../models/TimerTypes';
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

export function TimerEditor({ config, onSave, onDelete, onCancel }: Props) {
  const [local, setLocal] = useState<TimerNodeConfig>(
    JSON.parse(JSON.stringify(config)),
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Timer</h2>

      {ColumnEditorSkin.renderEditor(local, setLocal)}

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
