# Timer Execution Flow
Timer execution pipeline:

UI Start
↓
useTimerEngine.start()
↓
TimerScheduler.start()
↓
TimerGraph traversal
↓
activateNode(root)
↓
Timer countdown
↓
completeNode(node)
↓
play alarm sound
↓
activate sequential child
↓
parallel nodes continue

---

# Audio Playback Flow

TimerScheduler
↓
resolveSound(node)
↓
AudioManager.play(sound)
↓
HTMLAudioElement created
↓
registerActive(audio)
↓
sound plays independently

Multiple alarms may overlap.

---

# UI Rendering Flow

TimerManager
↓
TimerRunner
↓
useTimerEngine
↓
remaining time map
↓
Runner Skin
↓
TimerNodeView components

Rendering is **skin controlled**.
---

# Editor Layout Rules

Editor uses a column-aligned timer tree.

### Structure example:

Main
├ Parallel A
├ Parallel B
│ └ Child B1
└ Child A

### Grid layout:

| Main | Parallel A | Parallel B |
|------|------------|------------|
|ChildA|            |Child B1    |

### Rules:
Parent → first column  
Parallel nodes → columns to the right  
Sequential children → rows beneath parent column
---

# Skin Architecture
### Skins control UI layout and appearance.

### Interface:
TimerSkin
renderNode(node,remainingMs)

### Current skins:
classic/
ColumnEditorSkin
ColumnRunnerSkin

minimal/
TimerNodeView

### ***Future skins may include:
graph/
mobile/
touch/
compact/
---

# Persistence Model

### Timers saved as:
TimerNodeConfig tree.
## Storage:
### localStorage via PersistenceService.

### Saved items include:
• timer trees  
• selected skin
---

# Utility Layer
### timeUtils.ts provides conversion between:
milliseconds
hours/minutes/seconds
### Used by editor and runtime UI.
---

# System Entry

### Browser loads:
index.html
↓
main.tsx
↓
React app bootstrap
↓
TimerManager UI

# Timer Execution
TimerGraph
│
Scheduler
│
AudioManager
│
Runner Skin
