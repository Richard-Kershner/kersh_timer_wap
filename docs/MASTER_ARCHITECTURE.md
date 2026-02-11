# Kersh Timer — Master Architecture Document

> **Authoritative Architecture & Development Control Document**  
> This document defines what exists, what is allowed, and what is currently in scope for the Kersh Timer project.  
> If something is not defined here or in an individual file header, it does **not** exist.**

---

# 1. Project Overview

Kersh Timer is a **deterministic, offline-first, nested timer engine and application** designed for:

- Web (Primary runtime)
- Android (via Capacitor wrapper)
- Desktop (Windows/macOS via PWA installation)

iOS is explicitly **out of scope at this time** and will be added later.

The system prioritizes:

- Deterministic execution
- Explicit state ownership
- Strict module boundaries
- Long-term maintainability
- Zero hidden cross-module mutation

The web application is the canonical runtime.  
All other platforms wrap the web build without introducing business logic.

---

# 2. Document Authority & Use With ChatGPT

This document serves as:

- The **architectural contract**
- The **development sequencing authority**
- The **module boundary definition**
- The **file responsibility registry**
- The **step-tracking system**
- The **AI development constraint system**

When using ChatGPT:

- Development must follow the active step only.
- Files may only be created or modified when their owning step is active.
- No architectural decisions may be introduced unless this document is updated first.
    - This file, when updated, must be in mark down, md, format
    - It is generated as a single file for easy copy/paste
- Terminology must match this document exactly.

If ChatGPT suggests a change not defined here, this document must be updated before implementation.

---

# 3. Global Development Rules (Binding)

## 3.1 File Header Contract (Mandatory)

Every source file must begin with a structured header block defining:

- Final intended purpose
- Explicit responsibilities
- Connected files (incoming + outgoing)
- Shared data models read or mutated
- Naming conventions enforced in the file
- Development steps
- Step completion log

No code may appear before this header.

---

## 3.2 Development Step Tracking

Each file must define explicit development steps:

- Step 1 — Scaffold / Interfaces
- Step 2 — Core Logic
- Step 3 — Testing
- Step 4+ — Integration / Extensions

When a step completes:

- Mark step complete
- Add date (`YYYY-MM-DD`)
- List all files affected

---

## 3.3 Inline Comment Rules

Inline comments must:

- Reference step numbers
- Use terminology defined in this document
- Avoid introducing undocumented concepts

---

## 3.4 Architectural Constraints
React UI
↓
Timer Engine (Pure Logic)
↓
Audio Orchestrator
↓
Persistence Layer
↓
Platform Wrappers (Capacitor / PWA)
### Rules

- Timer Engine is UI-agnostic
- UI never mutates engine state directly
- Scheduler owns execution transitions
- Audio reacts to engine events only
- Persistence owns serialization and migration
- Platform wrappers contain no business logic

---

# 4. Application Capabilities (Authoritative Scope)

## 4.1 Timer Structure

- Multiple timer types (fixed, interval, open-ended)
- Deep nesting (tree graph model)
- Each timer may:
  - Contain child timers
  - Define its own sound
  - Inherit sound from parent
- Root-level default sound
- Sound inheritance cascade

## 4.2 Execution Modes

- Sequential stacks
- Parallel execution branches
- Parent-dependent duration logic:
  - Child equals parent duration
  - Child divides parent into `N` segments
  - Background audio terminates with parent

## 4.3 Audio

- Independent alarms
- Background looping
- Overlapping playback permitted
- Engine-driven trigger events only

## 4.4 Persistence

- Offline-first storage
- Multiple saved timers
- Optional future sync (not yet in scope)

## 4.5 Interface & Visualization

- Multiple saved timer selection
- Nested timer authoring
- Sequential vs parallel configuration
- Start / Pause / Resume / Reset controls
- Runtime visualization:
  - Digital countdown
  - Linear progress bar
  - Circular / radial fill
- Skin switching (visual theme layer)

## 4.6 Platform Targets

| Platform | Status |
|----------|--------|
| Web | Primary |
| Android (Capacitor) | Planned |
| Desktop (PWA install) | Supported |
| iOS | Deferred |

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
│ ├── TimerTypes.ts
│ └── AudioTypes.ts
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

# 6. Runtime State Machine (Authoritative Definition)

## 6.1 Purpose

Before expanding UI controls and nested execution behaviors, the execution lifecycle must be formally defined and locked.

This prevents:

- Illegal nested transitions
- Race conditions
- UI-engine desynchronization
- Audio firing outside valid transitions

---

## 6.2 Allowed Runtime States

DLE
RUNNING
PAUSED
COMPLETED
Cancell
---

## 6.3 Legal Transitions

| From | To | Allowed |
|------|----|----------|
| IDLE | RUNNING | Yes |
| RUNNING | PAUSED | Yes |
| PAUSED | RUNNING | Yes |
| RUNNING | COMPLETED | Yes |
| COMPLETED | IDLE | Yes (Reset) |
| Any | IDLE | No (except via Reset from COMPLETED) |
| COMPLETED | RUNNING | No |

---

## 6.4 Ownership Rules

- TimerScheduler owns all transitions.
- UI dispatches events only.
- TimerNode never mutates global execution state.
- AudioManager listens to transition events only.
- Persistence never triggers transitions.

This state machine is locked and may not change without updating this document first.

---

# 7. Step Tracking

---

## Step 1 — Project Scaffold & Baseline Architecture

| File | Platform | Status | Completed |
|------|----------|--------|-----------|
| src/main.tsx | Web | COMPLETE | 2026-02-04 |
| src/vite-env.d.ts | Web | COMPLETE | 2026-02-03 |
| src/models/TimerTypes.ts | Web | COMPLETE | 2026-02-04 |
| src/timers/TimerNode.ts | Web | COMPLETE | 2026-02-04 |
| src/timers/TimerGraph.ts | Web | COMPLETE | 2026-02-03 |
| src/components/TimerEditor.tsx | Web | COMPLETE | 2026-02-03 |
| src/components/TimerRunner.tsx | Web | COMPLETE | 2026-02-03 |

---

## Step 2 — Timer Engine & Nested Execution Rules

| File | Platform | Status | Completed |
|------|----------|--------|-----------|
| src/timers/TimerNode.ts | Web | COMPLETE | 2026-02-05 |
| src/timers/TimerGraph.ts | Web | COMPLETE | 2026-02-05 |
| src/timers/TimerScheduler.ts | Web | COMPLETE | 2026-02-05 |

---

## Step 3 — Audio & Alarm Layer

| File | Platform | Status | Completed |
|------|----------|--------|-----------|
| src/audio/AudioManager.ts | Web | COMPLETE | 2026-02-07 |
| src/audio/SoundLibrary.ts | Web | COMPLETE | 2026-02-07 |

---

## Step 4 — Persistence & Offline Storage

| File | Platform | Status | Completed |
|------|----------|--------|-----------|
| src/services/PersistenceService.ts | Web | COMPLETE | 2026-02-07 |

---

## Step 5 — Web Deployment (PWA)

| File | Platform | Status | Completed |
|------|----------|--------|-----------|
| public/service-worker.js | Web | COMPLETE | 2026-02-10 |
| public/manifest.webmanifest | Web | COMPLETE | 2026-02-10 |
| src/pwa/registerServiceWorker.ts | Web | COMPLETE | 2026-02-10 |

---

## Step 6 — Execution State Machine Lock

**Scope:**

- Formal runtime state definitions
- Transition validation rules
- Scheduler transition enforcement
- UI event contract

| File | Platform | Status | Completed |
|------|----------|--------|-----------|
| src/timers/TimerScheduler.ts | Web | IN PROGRESS | — |
| src/hooks/useTimerEngine.ts | Web | PLANNED | — |
| src/components/TimerRunner.tsx | Web | PLANNED | — |

---

## Step 7 — User Interface & Timer Management

**Scope:**

- Timer selection and creation
- Multiple saved timers
- Nested authoring interface
- Sequential vs parallel configuration
- Start / Pause / Resume / Reset controls

| File | Platform | Status | Completed |
|------|----------|--------|-----------|
| src/components/TimerSelector.tsx | Web | PLANNED | — |
| src/components/TimerEditor.tsx | Web | IN PROGRESS | — |
| src/components/TimerRunner.tsx | Web | IN PROGRESS | — |

---

## Step 8 — Visualization & Skins

**Scope:**

- Digital countdown
- Bar progress
- Radial progress
- Runtime skin switching

| File | Platform | Status | Completed |
|------|----------|--------|-----------|
| src/components/TimerVisualizer.tsx | Web | PLANNED | — |
| src/components/SkinSelector.tsx | Web | PLANNED | — |

---

## Step 9 — Android Wrapper (Capacitor)

| Item | Platform | Status | Completed |
|------|----------|--------|-----------|
| Capacitor Android project | Android | PLANNED | — |
| Runtime verification | Android | PLANNED | — |

---

# Authoritative Project State

- Current Active Step: **Step 6 — Execution State Machine Lock**
- Build Status: Clean
- Web Runtime: Verified
- Android: Not started
- Desktop (PWA): Supported
- iOS: Deferred

---

*End of MASTER_ARCHITECTURE.md*