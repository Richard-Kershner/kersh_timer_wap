## src/

### audio/
AudioManager.ts  
SoundLibrary.ts  
SoundRegistry.ts

### components/
TimerEditor.tsx  
TimerRunner.tsx  
TimerManager.tsx  
TimerSelector.tsx  
DurationEditor.tsx  
TimerGraph.tsx

### hooks/
useTimerEngine.ts

### models/
AudioTypes.ts  
TimerTypes.ts

### pwa/
registerServiceWorker.ts

### services/
PersistenceService.ts

### skins/
TimerSkin.ts

#### classic/
ColumnEditorSkin.tsx  
ColumnRunnerSkin.tsx  
TimerColumnGrid.tsx  
TimerNodeView.tsx

#### minimal/
TimerNodeView.tsx

### timers/
TimerGraph.ts  
TimerNode.ts  
TimerScheduler.ts

### utils/
timeUtils.ts

### viewmodels/
TimerViewModel.ts

### main.tsx
### vite-env.d.ts

### index.html


# Timer System Class / Method Map

---

### src/audio/AudioManager.ts (active: HTMLAudioElement[])
Used by: TimerScheduler; useTimerEngine

Methods:
- constructor()
- play(soundFile?: string)
- stop()
- stopAll()
- registerActive(audio: HTMLAudioElement)

Purpose:
Handles overlapping alarm playback and tracks active audio elements.

---

### src/audio/SoundLibrary.ts (none)
Used by: AudioManager

Methods:
- resolve(soundId: string)

Purpose:
Maps logical sound identifiers to actual sound files.

---

### src/audio/SoundRegistry.ts (AVAILABLE_SOUNDS: string[])
Used by: TimerEditor

Purpose:
List of selectable sounds shown in the editor UI.

---

# Components

---

### src/components/TimerEditor.tsx (config: TimerNodeConfig)
Used by: TimerManager

Methods:
- generateId()
- cloneWithNewIds(node: TimerNodeConfig)
- TimerEditor(config, onSave, onDelete, onCancel)

Purpose:
Interactive editor for timer trees including:
- duration editing
- sound selection
- sequential / parallel structure
- per-node skin selection

---

### src/components/TimerRunner.tsx (root: TimerNodeConfig)
Used by: TimerManager

Methods:
- TimerRunner(root: TimerNodeConfig)

Purpose:
Main runtime timer UI.

Responsibilities:
- Connects runtime engine
- Passes remaining time map to runner skin
- Displays controls (start/pause/reset/cancel)

---

### src/components/TimerManager.tsx (defaultRoots: TimerNodeConfig[])
Used by: main.tsx

Methods:
- handleSave(config: TimerNodeConfig)
- handleDelete(id: string)
- handleImport(configs: TimerNodeConfig[])

Purpose:
Application-level timer management:
- editing
- saving
- loading
- selecting timers

---

### src/components/TimerSelector.tsx (onSelect: (config) => void)
Used by: TimerManager

Methods:
- loadTimers()
- handleDelete(id: string)

Purpose:
Timer list UI allowing selection or deletion.

---

### src/components/DurationEditor.tsx (valueMs: number)
Used by: TimerEditor; ColumnEditorSkin

Methods:
- DurationEditor(valueMs, onChange)

Purpose:
Input component for editing timer durations in HH:MM:SS format.

---

### src/components/TimerGraph.tsx (config: TimerNodeConfig)
Used by: Debugging / development

Purpose:
Diagnostic visualization of the timer tree structure.

Notes:
Does not affect runtime execution.

---

# Hooks

---

### src/hooks/useTimerEngine.ts (schedulerRef: TimerScheduler | null)
Used by: TimerRunner

Methods:
- useTimerEngine(rootConfig: TimerNodeConfig)
- start()
- pause()
- reset()
- cancel()

Purpose:
React hook that manages the timer scheduler lifecycle.

---

# Models

---

### src/models/TimerTypes.ts

Used by:
TimerEditor  
TimerRunner  
TimerScheduler  
PersistenceService

Types:

TimerStatus
TimerNodeConfig
TimerState

TimerNodeConfig fields:

- id
- name
- durationMs
- sound
- inheritSound
- skin
- inheritSkin
- sequentialChild
- parallelSiblings

Notes:

Skin is now **per node**, allowing parallel timers to have independent skins.

---

### src/models/AudioTypes.ts

Used by:
AudioManager  
SoundLibrary

Types:

- SoundRef
- TimerAudioConfig
- AudioChannelType

---

# Timer Engine

---

### src/timers/TimerNode.ts (id: string; durationMs: number; parent?: TimerNode)

Used by:
TimerGraph  
TimerScheduler

Methods:

- constructor(config: TimerNodeConfig, parent?: TimerNode)
- reset()

Purpose:

Runtime representation of a timer node.

Stores relationships between sequential and parallel nodes.

---

### src/timers/TimerGraph.ts (root: TimerNode)

Used by:
TimerScheduler

Methods:

- constructor(rootConfig: TimerNodeConfig)
- traverseDepthFirst(visitor)
- collectAllNodes()
- collectLeafNodes()

Purpose:

Graph wrapper around the timer tree for traversal and scheduling.

---

### src/timers/TimerScheduler.ts (graph: TimerGraph; activeNodes: Set<TimerNode>)

Used by:
useTimerEngine

Methods:

- start()
- stop()
- activateNode(node: TimerNode)
- completeNode(node: TimerNode)
- resolveSound(node: TimerNode)
- getRemainingMap()

Purpose:

Core runtime execution engine responsible for:

- timer countdown
- sequential progression
- parallel node activation
- sound playback triggering

---

# Services

---

### src/services/PersistenceService.ts

Used by:
TimerManager  
TimerSelector

Methods:

- saveTimer(timer: TimerNodeConfig)
- loadTimer(timerId: string)
- loadAllTimers()
- deleteTimer(timerId: string)

Notes:

Global skin persistence has been removed.
Skins are now stored directly on timer nodes.

---

# Skins

---

### src/skins/TimerSkin.ts (interface)

Used by:
TimerRunner

Methods:

- renderRunner(root, remaining)

Purpose:

Defines runtime rendering behavior for timers.

Skins control:

- layout
- visual appearance
- node rendering

---

### src/skins/classic/ColumnRunnerSkin.tsx

Used by:
TimerRunner

Purpose:

Column-aligned runtime skin.

Features:

- Displays root timer name
- Shows timers before start
- Falls back to node.durationMs when remaining map is empty
- Renders parallel nodes in columns

Uses:

TimerColumnGrid  
TimerNodeView  
TimerViewModel.resolveSkin

---

### src/skins/classic/ColumnEditorSkin.tsx

Used by:
TimerEditor

Purpose:

Column-based visual layout for editing timer trees.

---

### src/skins/classic/TimerColumnGrid.tsx

Used by:
ColumnEditorSkin  
ColumnRunnerSkin

Purpose:

Grid layout system that aligns:

- parent nodes in first column
- parallel siblings in adjacent columns
- sequential children in rows below

---

### src/skins/classic/TimerNodeView.tsx

Used by:
Classic skins

Purpose:

Reusable UI component for rendering a timer node.

Displays:

- name
- duration
- remaining time
- optional skin visuals

---

### src/skins/minimal/TimerNodeView.tsx

Used by:
Minimal skins

Purpose:

Simplified timer node renderer for compact layouts.

---

# Utilities

---

### src/utils/timeUtils.ts

Used by:
TimerEditor  
TimerRunner  
DurationEditor

Methods:

- msToHMS(ms: number)
- hmsToMs(h: number, m: number, s: number)
- formatHMS(ms: number)

Purpose:

Conversion utilities between:

- milliseconds
- hours/minutes/seconds

---

# ViewModels

---

### src/viewmodels/TimerViewModel.ts

Used by:
TimerRunner  
skins

Methods:

- resolveSkin(node, parentSkin?)

Purpose:

View-layer helpers.

Currently responsible for:

- resolving skin inheritance

Resolution order:

node.skin  
→ parent skin  
→ default skin

Future responsibilities may include:

- node activity status
- runtime UI helpers
- animation state

---

# PWA

---

### src/pwa/registerServiceWorker.ts

Used by:
main.tsx

Methods:

- registerServiceWorker()

Purpose:

Registers progressive web app service worker.

---

# Application Entry

---

### src/main.tsx

Used by:
index.html

Methods:

- ReactDOM.createRoot().render()
- registerServiceWorker()

Purpose:

React application bootstrap.

---

### src/vite-env.d.ts

Used by:
TypeScript compiler

Purpose:

Vite environment type declarations.

---

### index.html

Used by:
Browser

Purpose:

Root HTML container for React application.

Contains:

- root div (#root)