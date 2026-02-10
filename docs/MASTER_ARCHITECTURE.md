You are assisting with development of a complex, offline-first, nested timer application
called **Kersh Timer**, built with:

- React + TypeScript (web core)
- Capacitor (Android now, iOS later)
- A shared codebase with strict architectural rules

BEFORE WRITING ANY CODE, YOU MUST FOLLOW THESE RULES:

========================
GLOBAL DEVELOPMENT RULES
========================

1) FILE HEADER CONTRACT
   Every source file must begin with a block comment that includes:
- Final intended purpose of the file
- Explicit responsibilities
- Connected files (who calls this file, and who this file calls)
- Shared data models it reads or mutates
- Naming conventions enforced in this file
  No code may be written until this header is complete.

2) DEVELOPMENT STEPS & CHANGE LOG
   Each file must define explicit development steps near the top:
- Step 1: Scaffold / interfaces
- Step 2: Core logic
- Step 3: Testing
- Step 4+: Integration or feature extensions

When a step is completed:
- Mark it complete
- Add the completion date (YYYY-MM-DD)
- List any other files affected by this step

3) INLINE COMMENT RULES
   Inline comments must:
- Reference development step numbers where applicable
- Use terminology defined in the file header or master architecture
- Avoid introducing new names not documented elsewhere

4) MASTER ARCHITECTURE DOCUMENT
   All development must conform to the authoritative architecture defined in:

docs/MASTER_ARCHITECTURE.md

This document defines:
- Global naming conventions
- Module boundaries
- File responsibilities
- Allowed cross-file dependencies
- Current development status

If something is not documented there or in a file header, it does not exist.

========================
PROJECT SUMMARY
========================

The application supports:
- Multiple timer types (fixed, interval, open-ended)
- Deeply nested timers
- Sequential and parallel execution
- Independent audio alarms and background sounds
- Overlapping sounds
- Offline-first storage with optional sync
- Choice of skins to view the timer, forground.
- Web, Android, and iOS deployment from one codebase

High-level architecture:

React UI
→ Timer Engine (pure logic)
→ Audio Orchestrator
→ Persistence Layer
→ Capacitor Native Bridges

========================
WORKING MODE
========================

We will address and edit one file at a time.
For calls that need to be tested in a certain sequence:
- Placeholders will be used, commented on which stage they are removed.
- Full code is commented out with note at which stage it is activated.

This Project, current notesFor each task, I will provide:
src/
├── audio/                     (added 2026-02-02)
│   ├── AudioManager.ts        (added 2026-02-03)
│   └── SoundLibrary.ts        (added 2026-02-03)
│
├── components/                (added 2026-02-02)
│   ├── TimerEditor.tsx        (added 2026-02-03)
│   └── TimerRunner.tsx        (added 2026-02-03)
│
├── hooks/                     (added 2026-02-02)
│   └── useTimerEngine.ts      (added 2026-02-03)
│
├── models/                    (added 2026-02-02)
│   ├── TimerTypes.ts          (added 2026-02-03)
│   └── AudioTypes.ts          (added 2026-02-03)
│
├── services/                  (added 2026-02-02)
│   └── PersistenceService.ts  (added 2026-02-03)
│
├── timers/                    (added 2026-02-02)
│   ├── TimerNode.ts           (added 2026-02-03)
│   ├── TimerGraph.ts          (added 2026-02-03)
│   └── TimerScheduler.ts      (added 2026-02-03)
│
├── main.tsx                   (added 2026-02-02)
└── vite-env.d.ts              (added 2026-02-02)

## STEP TRACKING

---

## Runtime Verification Matrix

This table is the authoritative progress and verification record.
Detailed implementation notes live in individual file headers.

Legend:
- ✅ = Verified
- ⏳ = In progress
- N/A = Not applicable for this step

---

### Step 1 — Project Scaffold & Baseline Architecture

| Item / File | Web | Android | iOS | Status | Completed |
|------------|-----|---------|-----|--------|-----------|
| **Step 1 Runtime Gate** | ✅ | N/A | N/A | COMPLETE | 2026-02-05 |
| `src/main.tsx` | ✅ | N/A | N/A | Complete | 2026-02-04 |
| `src/vite-env.d.ts` | ✅ | N/A | N/A | Complete | 2026-02-03 |
| `src/models/TimerTypes.ts` | ✅ | N/A | N/A | Complete | 2026-02-04 |
| `src/timers/TimerNode.ts` | ✅ | N/A | N/A | Complete | 2026-02-04 |
| `src/timers/TimerGraph.ts` | ✅ | N/A | N/A | Complete | 2026-02-03 |
| `src/components/TimerEditor.tsx` | ✅ | N/A | N/A | Complete | 2026-02-03 |
| `src/components/TimerRunner.tsx` | ✅ | N/A | N/A | Complete | 2026-02-03 |
| **Error correction & cleanup** | ✅ | N/A | N/A | Complete | 2026-02-05 |
| **View / Run verification** | Browser loads | N/A | N/A | Verified | 2026-02-05 |

---

Step 2 — Timer Engine & Nested Execution Rules

| Item / File | Web | Android | iOS | Status | Completed |
|------------|-----|---------|-----|--------|-----------|
| **Step 2 Runtime Gate** | ✅ | N/A | N/A | COMPLETE | 2026-02-06 |
| `src/timers/TimerNode.ts` | ✅ | N/A | N/A | Complete | 2026-02-05 |
| `src/timers/TimerGraph.ts` | ✅ | N/A | N/A | Complete | 2026-02-05 |
| `src/models/TimerTypes.ts` | ✅ | N/A | N/A | Complete | 2026-02-05 |
| `src/timers/TimerScheduler.ts` | ✅ | N/A | N/A | Complete | 2026-02-05 |
| **Error correction & cleanup** | ✅ | N/A | N/A | Complete | 2026-02-06 |
| **View / Run verification** | Console-driven | N/A | N/A | Verified | 2026-02-06 |

### Step 3 — Audio & Alarm Layer

| Item / File | Web            | Android | iOS | Status   | Completed  |
|------------|----------------|---------|-----|----------|------------|
| **Step 3 Runtime Gate** | WEB   | Complete | 2026-02-07 |
| `src/audio/AudioManager.ts` | WEB     | Complete | 2026_02-07 |
| `src/services/AudioService.ts` |  WEB    | Complete | 2026-02-07 |
| `src/models/TimerTypes.ts` |  WEB   | Planned  | 2026-02-07 |
| **Error correction & cleanup** |  WEB     | Complete | 2026-02-07 |
| **View / Run verification** | Audio playback | Web | Complete   |

---

### Step 4 — Persistence & Offline Sync

| Item / File | Systems Web; Android & iOS        | Status | Completed  |
|------------|----------------|-------|------------|--------|------------|
| **Step 4 Runtime Gate** | WEB            | Complete | 2026-02-08 |
| `src/services/PersistenceService.ts` | WEB  | Complete | 2026-02-07 |
| `src/models/TimerTypes.ts` | WEB            | Complete | 2026-02-08 |
| **Error correction & cleanup** | WEB            | Complete | 2026-02-08 |
| **View / Run verification** | Offline reload |  WEB  | Complete | 2026-02-08 |

---

### Step 5 — Web Deployment (PWA)

| Item / File | Web | Android | iOS | Status   | Completed |
|------------|-----|---------|-----|----------|-----------|
| **Step 5 Runtime Gate** | ⏳ | N/A | N/A | Complete | 2026_02-10 |
| Service worker / manifest | ⏳ | N/A | N/A | Complete  | 2026_02-10 |
| **Error correction & cleanup** | ⏳ | N/A | N/A | Complete  | 2026_02-10 |
| **View / Run verification** | Installed PWA | N/A | N/A | Complete  | 2026_02-10 |

---

### Step 6 — Android Wrapper (Capacitor)

| Item / File | Web | Android | iOS | Status | Completed |
|------------|-----|---------|-----|--------|-----------|
| **Step 6 Runtime Gate** | N/A | ⏳ | N/A | Planned | — |
| Android project | N/A | ⏳ | N/A | Planned | — |
| **Error correction & cleanup** | N/A | ⏳ | N/A | Pending | — |
| **View / Run verification** | N/A | Emulator / Device | N/A | Pending | — |

---

### Step 7 — iOS Wrapper (Capacitor)

| Item / File | Web | Android | iOS | Status | Completed |
|------------|-----|---------|-----|--------|-----------|
| **Step 7 Runtime Gate** | N/A | N/A | ⏳ | Planned | — |
| iOS project | N/A | N/A | ⏳ | Planned | — |
| **Error correction & cleanup** | N/A | N/A | ⏳ | Pending | — |
| **View / Run verification** | N/A | N/A | Simulator / Device | Pending | — |

---

### Authoritative Project State

- **Current Step:** Step 2
- **Last Completed Step:** Step 1 (2026-02-05)
- **Build Status:** Clean
- **Runtime Status:** Web verified
