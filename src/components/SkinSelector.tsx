/*
File: SkinSelector.tsx

Final Intended Purpose:
- UI-only skin selector for TimerVisualizer.
- Controls visualization mode.
- Does NOT affect engine state.
- Does NOT trigger transitions.

Explicit Responsibilities:
- Provide skin selection control.
- Maintain selected skin locally.
- Pass selected skin to TimerVisualizer.

Connected Files:
- TimerVisualizer.tsx

Shared Data Models:
- VisualSkin

Development Steps:
- Step 8: Visualization skin selector (COMPLETE — 2026-02-16)

Change Log:
- 2026-02-16
  - Created simple skin selector.
  - Confirmed no scheduler interaction.
*/

import React, { useState } from 'react';
import { TimerVisualizer, VisualSkin } from './TimerVisualizer';

export const SkinSelector: React.FC = () => {
  const [skin, setSkin] = useState<VisualSkin>('DIGITAL');

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>Visualization:</label>
        <select
          value={skin}
          onChange={(e) => setSkin(e.target.value as VisualSkin)}
        >
          <option value="DIGITAL">Digital</option>
          <option value="LINEAR">Linear</option>
          <option value="RADIAL">Radial</option>
        </select>
      </div>

      <TimerVisualizer skin={skin} />
    </div>
  );
};
