Kersh Timer — Master Architecture Document

Authoritative Architecture & Development Control Document
If not defined here or in a file header, it does not exist.

1. Project Overview

Kersh Timer is a deterministic, offline-first, nested timer engine.

Platforms

Web (Canonical runtime)

Android (Capacitor wrapper)

Desktop (PWA install)

iOS (Deferred)

Design Priorities

Deterministic execution

Explicit state ownership

Strict module boundaries

No hidden mutation

Long-term maintainability

Web build is the single source of truth.

2. Document Authority

This document defines:

Architecture contract

Development sequence

Module boundaries

File ownership

Runtime state machine

ChatGPT Operational Rules

Only work on the active step.

Only modify files owned by that step.

No architectural changes without updating this document first.

Output must remain:

Markdown

Single copy/paste file

Terminology consistent

3. Global Development Rules
   3.1 File Header Contract (Mandatory)

Every source file must define:

Final intended purpose

Responsibilities

Connected files

Shared data models

Naming conventions

Development steps

Step completion log

No code before header.

3.2 Step Structure Format

All steps must follow:

## Step X — Title
Status: Not Started | In Progress | Completed

### Scope
- Bullet

### Files
| File | Status | Date |


When complete:

Mark Completed

Add YYYY-MM-DD

List affected files

3.3 Architecture Layers

React UI
↓
Timer Engine (Pure Logic)
↓
Audio Orchestrator
↓
Persistence Layer
↓
Platform Wrappers

Layer Rules

Engine is UI-agnostic.

UI dispatches only.

TimerScheduler owns transitions.

Audio reacts to engine events only.

Persistence handles storage only.

Wrappers contain no business logic.

4. Application Capabilities
   4.1 Timer Structure

Fixed, interval, open-ended timers

Deep nesting (tree model)

Sequential or parallel execution

Parent-dependent duration logic

Sound inheritance cascade

Root-level default sound

4.2 Audio

Alarm sounds

Background looping

Overlapping playback allowed

Triggered only by engine events

4.3 Persistence

Offline-first

Multiple saved timers

No sync (future scope)

4.4 UI

Timer selection

Nested authoring

Execution controls:

Start

Pause

Resume

Reset

Visualization:

Digital

Linear

Radial

Skin switching

5. Authoritative Source Tree
   src/
   ├── audio/
   │   ├── AudioManager.ts
   │   └── SoundLibrary.ts
   │
   ├── components/
   │   ├── TimerEditor.tsx
   │   ├── TimerRunner.tsx
   │   ├── TimerSelector.tsx
   │   ├── TimerVisualizer.tsx
   │   └── SkinSelector.tsx
   │
   ├── hooks/
   │   └── useTimerEngine.ts
   │
   ├── models/
   │   └── TimerTypes.ts
   │
   ├── services/
   │   └── PersistenceService.ts
   │
   ├── timers/
   │   ├── TimerNode.ts
   │   ├── TimerGraph.ts
   │   └── TimerScheduler.ts
   │
   ├── pwa/
   │   └── registerServiceWorker.ts
   │
   ├── main.tsx
   └── vite-env.d.ts


This tree is authoritative.

6. Runtime State Machine (Locked)
   6.1 Allowed States

IDLE

RUNNING

PAUSED

COMPLETED

No other states exist.

6.2 Legal Transitions
From	To	Allowed
IDLE	RUNNING	Yes
RUNNING	PAUSED	Yes
PAUSED	RUNNING	Yes
RUNNING	COMPLETED	Yes
COMPLETED	IDLE	Yes (Reset only)
COMPLETED	RUNNING	No
Any	IDLE	No (except Reset)

All transitions validated by TimerScheduler.

6.3 Ownership

Scheduler owns transitions.

UI dispatches only.

TimerNode does not mutate global state.

Audio listens only.

Persistence never triggers transitions.

State machine changes require document update first.

7. Step Tracking
   Step 1 — Scaffold

Status: Completed

File	Status	Date
main.tsx	COMPLETE	2026-02-04
vite-env.d.ts	COMPLETE	2026-02-03
TimerTypes.ts	COMPLETE	2026-02-04
TimerNode.ts	COMPLETE	2026-02-04
TimerGraph.ts	COMPLETE	2026-02-03
TimerEditor.tsx	COMPLETE	2026-02-03
TimerRunner.tsx	COMPLETE	2026-02-03
Step 2 — Engine Logic

Status: Completed

File	Status	Date
TimerNode.ts	COMPLETE	2026-02-05
TimerGraph.ts	COMPLETE	2026-02-05
TimerScheduler.ts	COMPLETE	2026-02-05
Step 3 — Audio Layer

Status: Completed

File	Status	Date
AudioManager.ts	COMPLETE	2026-02-07
SoundLibrary.ts	COMPLETE	2026-02-07
Step 4 — Persistence

Status: Completed

File	Status	Date
PersistenceService.ts	COMPLETE	2026-02-07
Step 5 — PWA

Status: Completed

File	Status	Date
registerServiceWorker.ts	COMPLETE	2026-02-10
Step 6 — State Machine Lock

Status: Completed

File	Status	Date
TimerScheduler.ts	COMPLETE	2026-02-11
useTimerEngine.ts	COMPLETE	2026-02-11
TimerRunner.tsx	COMPLETE	2026-02-11
TimerTypes.ts	COMPLETE	2026-02-11
AudioManager.ts	COMPLETE	2026-02-11
Step 7 — UI & Timer Management

Status: Completed

File	Status	Date
TimerSelector.tsx	COMPLETE	2026-02-16
TimerEditor.tsx	COMPLETE	2026-02-16
TimerRunner.tsx	COMPLETE	2026-02-16
Step 8 — Visualization

Status: Completed

File	Status	Date
TimerVisualizer.tsx	COMPLETE	2026-02-16
SkinSelector.tsx	COMPLETE	2026-02-16
Step 8.2 — Progress, Animation, Skin Persistence

Status: Completed

File	Status	Date
TimerScheduler.ts	COMPLETE	2026-02-16
useTimerEngine.ts	COMPLETE	2026-02-16
TimerVisualizer.tsx	COMPLETE	2026-02-16
SkinSelector.tsx	COMPLETE	2026-02-16
PersistenceService.ts	COMPLETE	2026-02-16
Step 9 — Functional Demo

Status: Completed

File	Status	Date
TimerScheduler.ts	COMPLETE	2026-02-16
TimerRunner.tsx	COMPLETE	2026-02-16
main.tsx	COMPLETE	2026-02-16
Step 10 — Multiple Alarms & Sound Selection

Status: In Progress

Scope

Support multiple saved timer graphs (alarm presets)

TimerSelector switches between alarms

Last selected alarm loads by default

Add at least one additional bundled sound

Sound selection per timer

Last selected sound persists

Add Edit button to each container in TimerEditor

Modify container properties

Add child container

Delete container

No structural persistence of container edits in this step

Files
File	Status	Date
models/TimerTypes.ts	IN PROGRESS	2026-02-18
services/PersistenceService.ts	IN PROGRESS	2026-02-18
components/TimerSelector.tsx	IN PROGRESS	2026-02-18
components/TimerEditor.tsx	IN PROGRESS	2026-02-18
audio/SoundLibrary.ts	IN PROGRESS	2026-02-18
audio/AudioManager.ts	IN PROGRESS	2026-02-18
hooks/useTimerEngine.ts	IN PROGRESS	2026-02-18
Step 9 — Functional Demo
Validate full end-to-end execution of a nested timer stack including interval behavior.

Development Step 10 multiple timers, save, open and edit
Currently this project has one timer that runs.
It needs to have: timer edit, save.
2 default timers as an options
Additional timers can be loaded from or saved to the device
Each timer has it's own edit button, denoted standard 3 stacked bars
Each sub timer has it's own edit button, denoted 3 stacked bars
As part of the save, a json data structure needs to be generated.
This structure will not be concerned with version control at this time.

Dev step 10 Edit timer, multiple timers, save timer
FILES CHANGED
main.tsx
TimerRunner.tsx
TimerEditor.tsx
TimerSelector.tsx
PersistenceService.ts
FILES ADDED
TimerManager.tsx

Step ?? — Android Wrapper

Status: Planned

Item	Status
Capacitor Android project	PLANNED
Runtime verification	PLANNED