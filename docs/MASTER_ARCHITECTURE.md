# Kersh Timer — Master Architecture Document

> Authoritative Architecture & Development Control Document  
> If something is not defined here or in a file header, it does **not** exist.

---

# 1. Project Overview

**Kersh Timer** is a deterministic, offline-first, nested timer engine.

### Platforms
- Web (Primary runtime)
- Android (Capacitor wrapper)
- Desktop (PWA install)
- iOS (Deferred)

### Design Priorities
- Deterministic execution
- Explicit state ownership
- Strict module boundaries
- No hidden cross-module mutation
- Long-term maintainability

Web is canonical.  
All other platforms wrap the web build only.

---

# 2. Document Authority

This document defines:

- Architecture contract
- Development sequence
- Module boundaries
- File ownership
- Runtime state machine

### ChatGPT Rules

- Only work on the active step.
- Only modify files owned by the active step.
- No architectural changes without updating this document first.
- This file must remain:
  - Markdown (`.md`)
  - Single copy/paste output
  - Terminology consistent

---

# 3. Global Development Rules

## 3.1 File Header Contract (Mandatory)

Every source file must define:

- Final intended purpose
- Explicit responsibilities
- Connected files
- Shared data models
- Naming conventions
- Development steps
- Step completion log

No code before header.

---

## 3.2 Step Definitions

Each file uses:

- Step 1 — Scaffold / Interfaces
- Step 2 — Core Logic
- Step 3 — Testing
- Step 4+ — Extensions

When a step completes:
- Mark complete
- Add date (`YYYY-MM-DD`)
- List affected files

---

## 3.3 Architecture Layers

React UI
↓
Timer Engine (Pure Logic)
↓
Audio Orchestrator
↓
Persistence Layer
↓
Platform Wrappers


### Rules

- Timer Engine is UI-agnostic.
- UI dispatches events only.
- TimerScheduler owns transitions.
- Audio reacts to engine events only.
- Persistence handles storage only.
- Wrappers contain no business logic.

---

# 4. Application Capabilities

## 4.1 Timer Structure

- Fixed / interval / open-ended timers
- Deep nesting (tree model)
- Sequential or parallel execution
- Parent-dependent duration logic
- Sound inheritance cascade
- Root-level default sound

---

## 4.2 Audio

- Alarm sounds
- Background looping
- Overlapping playback allowed
- Triggered only by engine events

---

## 4.3 Persistence

- Offline-first
- Multiple saved timers
- No sync (future scope)

---

## 4.4 UI

- Timer selection
- Nested authoring
- Execution controls:
  - Start
  - Pause
  - Resume
  - Reset
- Visualization:
  - Digital countdown
  - Linear bar
  - Radial progress
- Skin switching

---

# 5. Source Tree (Authoritative)

src/
├── audio/
│ ├── AudioManager.ts
│ └── SoundLibrary.ts
│
├── components/
│ ├── TimerEditor.tsx
│ ├── TimerRunner.tsx
│ ├── TimerSelector.tsx
│ ├── TimerVisualizer.tsx
│ └── SkinSelector.tsx
│
├── hooks/
│ └── useTimerEngine.ts
│
├── models/
│ └── TimerTypes.ts
│
├── services/
│ └── PersistenceService.ts
│
├── timers/
│ ├── TimerNode.ts
│ ├── TimerGraph.ts
│ └── TimerScheduler.ts
│
├── pwa/
│ └── registerServiceWorker.ts
│
├── main.tsx
└── vite-env.d.ts


---

# 6. Runtime State Machine (Locked)

## 6.1 Allowed States

- `IDLE`
- `RUNNING`
- `PAUSED`
- `COMPLETED`

No other states exist.

---

## 6.2 Legal Transitions

| From | To | Allowed |
|------|----|----------|
| IDLE | RUNNING | Yes |
| RUNNING | PAUSED | Yes |
| PAUSED | RUNNING | Yes |
| RUNNING | COMPLETED | Yes |
| COMPLETED | IDLE | Yes (Reset only) |
| COMPLETED | RUNNING | No |
| Any | IDLE | No (except via Reset) |

All transitions are validated by **TimerScheduler**.

---

## 6.3 Ownership

- Scheduler owns transitions.
- UI dispatches only.
- TimerNode does not mutate global state.
- Audio listens only.
- Persistence never triggers transitions.

State machine changes require updating this document first.

---

# 7. Step Tracking
  - each step must generate 
    - all requested files for the step
    - Once all files have been uploaded
      - complete code for each file being changed
  - All files being reference must have complete path
---

## Step 1 — Scaffold

| File | Status | Date |
|------|--------|------|
| main.tsx | COMPLETE | 2026-02-04 |
| vite-env.d.ts | COMPLETE | 2026-02-03 |
| TimerTypes.ts | COMPLETE | 2026-02-04 |
| TimerNode.ts | COMPLETE | 2026-02-04 |
| TimerGraph.ts | COMPLETE | 2026-02-03 |
| TimerEditor.tsx | COMPLETE | 2026-02-03 |
| TimerRunner.tsx | COMPLETE | 2026-02-03 |

---

## Step 2 — Engine Logic

| File | Status | Date |
|------|--------|------|
| TimerNode.ts | COMPLETE | 2026-02-05 |
| TimerGraph.ts | COMPLETE | 2026-02-05 |
| TimerScheduler.ts | COMPLETE | 2026-02-05 |

---

## Step 3 — Audio Layer

| File | Status | Date |
|------|--------|------|
| AudioManager.ts | COMPLETE | 2026-02-07 |
| SoundLibrary.ts | COMPLETE | 2026-02-07 |

---

## Step 4 — Persistence

| File | Status | Date |
|------|--------|------|
| PersistenceService.ts | COMPLETE | 2026-02-07 |

---

## Step 5 — PWA

| File | Status | Date |
|------|--------|------|
| service-worker.js | COMPLETE | 2026-02-10 |
| manifest.webmanifest | COMPLETE | 2026-02-10 |
| registerServiceWorker.ts | COMPLETE | 2026-02-10 |

---

## Step 6 — State Machine Lock

Scope:
- Runtime state definitions
- Transition validation
- Scheduler enforcement
- UI dispatch contract

| File | Status | Date |
|------|--------|------|
| TimerScheduler.ts | COMPLETE | 2026-02-11 |
| useTimerEngine.ts | COMPLETE | 2026-02-11 |
| TimerRunner.tsx | COMPLETE | 2026-02-11 |
| TimerTypes.ts | COMPLETE | 2026-02-11 |
| AudioManager.ts | COMPLETE | 2026-02-11 |

---

## Step 7 — UI & Timer Management

Active Step

| File             | Status |
|------------------|--------|
| TimerSelector.tsx | COMPLETE | 2026-02-16
| TimerEditor.tsx  | COMPLETE | 2026-02-16
| TimerRunner.tsx  | COMPLETE | 2026-02-16
| error resolve | COMPLETE | 2026-02-16

---

## Step 8 — Visualization

| File | Status |
|------|--------|
| TimerVisualizer.tsx | COMPLETE | 2026-02-16
| SkinSelector.tsx | COMPLETE | 2026-02-16

---
## Step 8.2 — Progress, Animation, Skin Persistence

Scope:

Real runtime progress tracking

Engine time-based execution enhancement

Visual animation refinement

Skin persistence via PersistenceService

Files Modified:

File	Status	Date
TimerScheduler.ts	COMPLETE	2026-02-16
useTimerEngine.ts	COMPLETE	2026-02-16
TimerVisualizer.tsx	COMPLETE	2026-02-16
SkinSelector.tsx	COMPLETE	2026-02-16
PersistenceService.ts	COMPLETE	2026-02-16
---





## Step 8.3 — Functional Web

????????

---
## Step 9 — Android Wrapper

| Item | Status |
|------|--------|
| Capacitor Android project | PLANNED |
| Runtime verification | PLANNED |

---

# Authoritative Project State

- **Current Active Step:** Step 8 — UI & Timer Management
- Build Status: Clean
- Web Runtime: Verified
- Android: Not started
- Desktop: Supported
- iOS: Deferred

---

End of MASTER_ARCHITECTURE.md
If you'd like, I can now: