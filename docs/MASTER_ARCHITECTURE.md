Kersh Timer — Master Architecture Document

Authoritative Architecture & Development Control Document.
- This document must maintain strict mark down language rules
- Project can be referenced at https://github.com/Richard-Kershner/kersh_timer_wap
# Project Overview
Kersh Timer is a deterministic, offline-first, nested timer engine.
## Platforms
- Web (Canonical runtime)
- Android (Capacitor wrapper)
- Desktop (PWA install)
- iOS (Deferred)
## Design Priorities
- Deterministic execution
- Explicit state ownership
- Strict module boundaries
- No hidden mutation
- Long-term maintainability
- Web build is the single source of truth.
- Cool visual skin options
## Document Authority
- Architecture contract
- Development sequence
- File, Module and Process Ownership boundaries
- Runtime state machine
- ChatGPT Operational Rules
## Global Development Rules
- clear header remarks describing use
- inline remarks on all code
- remarks should be none verbose and complete
# Kersh Timer – Architecture Overview

---

# Project Structure

## src

### audio

AudioManager.ts
SoundLibrary.ts
SoundRegistry.ts

### components

TimerEditor.tsx
TimerRunner.tsx
TimerManager.tsx
TimerSelector.tsx
DurationEditor.tsx
TimerGraph.tsx

### hooks

useTimerEngine.ts

### models

AudioTypes.ts
TimerTypes.ts

### pwa

registerServiceWorker.ts

### services

PersistenceService.ts

### skins

TimerSkin.ts

#### classic

ColumnEditorSkin.tsx
ColumnRunnerSkin.tsx
TimerColumnGrid.tsx
TimerNodeView.tsx
buildColumnTree.ts

#### minimal

TimerNodeView.tsx

### timers

TimerGraph.ts
TimerNode.ts
TimerScheduler.ts

### utils

timeUtils.ts

### viewmodels

TimerViewModel.ts

### main.tsx

### vite-env.d.ts

### index.html

---

# Runtime Architecture

TimerNodeConfig (data model)
↓
TimerGraph (runtime tree)
↓
TimerScheduler (execution engine)
↓
AudioManager (alarm playback)
↓
useTimerEngine (React hook)
↓
TimerRunner (UI container)
↓
TimerSkin
↓
TimerColumnGrid
↓
TimerNodeView

---

# Core Concepts

Timers are structured as a **tree**.

Nodes may have:

• sequential children
• parallel siblings

Example:

Main
├ Meditation
├ Start1
├ Start2
└ Post

Execution behavior:

Parallel timers start **when parent starts**.
Sequential timers start **when parent finishes**.

---

# Timer Execution Flow

User presses Start
↓
TimerRunner.start()
↓
useTimerEngine.start()
↓
TimerScheduler.start()
↓
activateNode(root)
↓
activateNode(parallel siblings)
↓
scheduler tick loop begins
↓
remainingMs decreases each second
↓
node reaches 0
↓
alarm sound plays
↓
completeNode(node)
↓
activate sequential child
↓
execution continues until no active nodes remain

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
audio registered
↓
sound plays independently

Multiple alarms may overlap.

---

# UI Rendering Flow

TimerManager
↓
TimerRunner
↓
useTimerEngine hook
↓
remaining Map<string, number>
↓
TimerSkin.renderRunner()
↓
TimerColumnGrid layout
↓
TimerNodeView rendering

Rendering is **skin controlled**.

---

# Column Layout Rules

TimerColumnGrid renders timers using a grid.

Rules:

Parent node → first column

Parallel nodes → columns to the right

Sequential nodes → rows beneath the parent

Example:

| Main | Meditation | Start1 | Start2 |
| ---- | ---------- | ------ | ------ |
| Post |            |        |        |

---

# Skin System

Skins control visual layout and rendering.

Interface:

TimerSkin.renderRunner(root, remaining)

Current skins:

classic/
ColumnEditorSkin
ColumnRunnerSkin
TimerNodeView
TimerColumnGrid

minimal/
TimerNodeView

Future skins may include:

mobile
compact
graph
dashboard

---

# Persistence Model

Timers are saved as a **TimerNodeConfig tree**.

Stored using:

localStorage via PersistenceService.

Saved properties include:

• timer structure
• durations
• sounds
• skins
• sequential relationships
• parallel relationships

Skins are stored **per node**.

---

# Utility Layer

timeUtils.ts provides:

msToHMS(ms)
hmsToMs(h,m,s)
formatHMS(ms)

Used by:

TimerEditor
TimerRunner
DurationEditor
Skins

---

# ViewModel Layer

TimerViewModel.ts handles UI logic such as:

resolveSkin(node,parentSkin)

Resolution order:

node.skin
↓
parent skin
↓
default skin

This isolates UI rules from the timer engine.

---

# Application Startup

Browser loads:

index.html
↓
main.tsx
↓
React app initialized
↓
service worker registered
↓
TimerManager mounted
↓
user selects timer
↓
TimerRunner renders timer UI

