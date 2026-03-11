Class & Process Tracking
src/audio/AudioManager.ts (active: HTMLAudioElement[])

Used by:
TimerScheduler; useTimerEngine

Methods

– constructor()
Used by ext: application bootstrap

– play(soundFile?: string)
Used by: TimerScheduler; useTimerEngine

– stopAll()
Used by: TimerScheduler; UI stop action

– registerActive(audio: HTMLAudioElement)
Used by: internal only

Purpose
Manages overlapping audio playback channels.

src/audio/SoundLibrary.ts (none)

Used by: AudioManager

Methods

– resolve(soundId: string)
Used by: AudioManager

Purpose
Maps logical sound identifiers to sound asset files.

src/audio/SoundRegistry.ts (AVAILABLE_SOUNDS: string[])

Used by: TimerEditor

Purpose
Defines the list of selectable alarm sounds.

UI Components
src/components/TimerEditor.tsx (config: TimerNodeConfig)

Used by: TimerManager

Methods

– generateId()
Used by: NodeEditor

– cloneWithNewIds(node)

Used by: Save As New logic

– TimerEditor(config, onSave, onDelete, onCancel)

Used by: TimerManager

Purpose
Recursive editor for timer trees.

src/components/TimerRunner.tsx (root: TimerNodeConfig)

Used by: TimerManager

Methods

– TimerRunner(root)

Used by: main UI

– renderNode(node)

Used by: TimerRunner

Purpose
Visual runtime timer display.

src/components/TimerManager.tsx (defaultRoots: TimerNodeConfig[])

Used by: main.tsx

Methods

– handleSave(config)

– handleDelete(id)

– handleImport(configs)

Purpose
Top-level alarm manager UI.

Handles:

• alarm selection
• alarm editing
• alarm execution

src/components/TimerSelector.tsx (onSelect: (config) => void)

Used by: TimerManager

Methods

– loadTimers()

– handleDelete(id)

Purpose
Lists stored alarms.

Timer Engine Layer
src/engine/TimerEngine.ts

Used by: useTimerEngine

Purpose
Central timing scheduler.

src/hooks/useTimerEngine.ts

Used by: TimerRunner

Methods

– useTimerEngine(rootConfig)

Purpose
React integration for TimerEngine.

Timer Model Layer
src/models/TimerTypes.ts

Used by:
TimerEngine; TimerEditor; TimerRunner; AudioManager; PersistenceService

Types

– TimerState (enum)

– TimerNodeConfig

Fields:

id
name
durationMs
inheritSound
sound
parallelSiblings
sequentialChild

Purpose
Defines timer structure.

src/models/AudioTypes.ts

Used by:

AudioManager
SoundLibrary

Types

– SoundRef

– TimerAudioConfig

– AudioChannelType (enum)

Purpose
Defines audio playback structure.

Graph / Execution Layer
src/timers/TimerNode.ts (config: TimerConfig)

Used by:

TimerGraph
TimerRunner
TimerEngine

Methods

– constructor(config)

– addChild(child)

– getExecutableChildren()

– hasChildren()

Purpose
Represents a timer node.

src/timers/TimerGraph.ts (root: TimerNode)

Used by:

TimerEngine
diagnostics

Methods

– constructor(root)

– traverseDepthFirst(visitor)

– collectAllNodes()

– collectLeafNodes()

Purpose
Graph traversal utilities.

Services
src/services/AudioService.ts

Used by: AudioManager

Methods

– play(assetId, channel)

– playLoop(assetId, channel)

– stopChannel(channel)

Purpose
Low-level audio playback abstraction.

src/services/PersistenceService.ts

Used by:

TimerEditor
TimerManager

Methods

– saveTimer(timer, state)

– loadTimer(timerId)

– loadAllTimers()

– deleteTimer(timerId)

– saveSkin(skin)

– loadSkin()

Purpose
Persistent storage layer.

Skins System
src/skins/TimerSkin.ts

Used by: TimerRunner

Interface
renderNode(node: TimerNodeConfig, remainingMs: number)

Purpose
Defines pluggable UI renderers.

src/skins/classic/TimerNodeView.tsx

Used by: ClassicSkin

Purpose
Current default visual style.

src/skins/minimal/TimerNodeView.tsx

Used by: MinimalSkin

Purpose
Future lightweight display skin.

Utility Layer
src/utils/timeUtils.ts

Used by:

TimerEditor
TimerRunner

Methods

– msToHMS(ms)

– hmsToMs(h,m,s)

– formatHMS(ms)

Purpose
Time conversion utilities.

ViewModel Layer
src/viewmodels/TimerViewModel.ts

Used by:

TimerRunner
skins

Purpose
Separates rendering data from timer engine state.

Application Entry
src/main.tsx

Used by: index.html

Functions

– ReactDOM.createRoot().render()

– registerServiceWorker()

Purpose
Application bootstrap.

src/vite-env.d.ts

Used by: TypeScript compiler

index.html

Used by: Browser

Defines root DOM container.

Part 2 — Editor Layout Upgrade

You requested:

Child timers → appear below parent
Parallel timers → appear in column to the right

This requires grid layout instead of indentation recursion.

Desired Structure

Example timer tree:

Main
├─ Parallel A
├─ Parallel B
│   └─ Child B1
└─ Child A

Should render like:

| Main | Parallel A | Parallel B |
|ChildA|            | Child B1   |
Implementation Approach

Replace the NodeEditor container with a grid layout.

Key concept

Each node creates a grid column group.

Children extend downward.

Core Layout Code

Inside NodeEditor

Replace container with:

<div
  style={{
    display: "grid",
    gridTemplateColumns: `repeat(${(node.parallelSiblings?.length ?? 0) + 1}, 1fr)`,
    gap: 20,
    alignItems: "start"
  }}
>
Render Parent + Parallel Nodes
Parent column = first column
Parallel siblings = next columns

Example:

<div>
  <NodeCard node={node} />

{node.sequentialChild && (
<NodeEditor
node={node.sequentialChild}
onChange={(child) => update("sequentialChild", child)}
/>
)}
</div>

{node.parallelSiblings?.map((p,i)=>(
  <div key={p.id}>
    <NodeEditor
      node={p}
      onChange={(updated)=>{
        const list=[...(node.parallelSiblings??[])]
        list[i]=updated
        update("parallelSiblings",list)
      }}
    />
  </div>
))}
Result

Visually becomes:

[ Parent ] [ Parallel1 ] [ Parallel2 ]
|
[ Child ]

Exactly matching your requested behavior.

Future Skin Integration

Because this is in NodeEditor only, skins can later override:

skins/classic/EditorNodeView.tsx
skins/minimal/EditorNodeView.tsx
skins/graph/EditorNodeView.tsx

So the architecture remains compatible.