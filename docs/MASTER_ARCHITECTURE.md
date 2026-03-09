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
## Partial of directory structure
src/
  engine/
    TimerEngine.ts 
  viewmodels/ 
    TimerViewModel.ts 
  skins/ 
    classic/
      TimerNodeView.tsx 
    minimal/
      TimerNodeView.tsx

## All classes and processes must be tracked in this document:
Current classeses
### src/audio/AudioManager.ts (audioService: AudioService; soundLibrary: SoundLibrary)
Used by: TimerScheduler; AudioService 
– constructor(audioService: AudioService; soundLibrary: SoundLibrary)
Used by ext: application bootstrap / dependency injector
– playAlarm(config: TimerAudioConfig)
Used by ext: TimerScheduler
– startBackground(config: TimerAudioConfig)
Used by: TimerScheduler
– stopAll(none)
Used by ext: TimerScheduler
– registerActive(channel: AudioChannelType; assetId: string)
Used by: internal only
### src/audio/SoundLibrary.ts (none)
Used by: AudioManager
– resolve(soundId: string)
Uses ext: none
Used by: AudioManager
### src/components/TimerEditor.tsx (selected?: TimerConfig; onSaved: () => void)
Used by: Parent UI container (renders TimerEditor; passes selected & onSaved)
– generateId(none)
Used by: TimerEditor
– TimerEditor(selected?: TimerConfig; onSaved: () => void)
Used by: Parent UI container
– handleSave(none)
Used by: TimerEditor (Save button onClick)
### src/components/TimerRunner.tsx (root: TimerNode)
Used by: Parent UI container (functional demo view)
– format(ms: number)
Used by: TimerRunner
– TimerRunner(root: TimerNode)
Used by: Parent UI container
– renderNode(node: TimerNode; depth: number)
Used by: TimerRunner
### src/components/TimerSelector.tsx (onSelect: (config: TimerConfig) => void)
Used byt: Parent UI container (receives selected TimerConfig)
– TimerSelector(onSelect: (config: TimerConfig) => void)
Used by: Parent UI container
– loadTimers(none)
Used by: TimerSelector (useEffect; handleDelete)
– handleDelete(id: string)
Used by: TimerSelector (Delete button onClick)
### src/hooks/useTimerEngine.ts (none)
Used by: TimerRunner
– useTimerEngine(none)
Used by: TimerRunner
### src/models/AudioTypes.ts (none)
Used by: AudioManager; SoundLibrary
– SoundRef(id: string; uri: string)
Used by: AudioConfig
– AudioConfig(alarmSound?: SoundRef; backgroundSound?: SoundRef; loopBackground?: boolean)
Used by: AudioManager
### src/models/TimerTypes.ts (none)
Used by ext: TimerScheduler; TimerNode; AudioManager; PersistenceService; useTimerEngine; TimerRunner; TimerEditor; TimerSelector; AudioService
– TimerState(enum)
Used by: TimerScheduler; useTimerEngine; TimerRunner; TimerEditor; PersistenceService
– TimerConfig(id: string; name: string; durationMs?: number; divideParentInto?: number; intervalMs?: number; sequential?: boolean; children?: TimerConfig[]; audio?: TimerAudioConfig)
Used by: TimerNode; PersistenceService; TimerEditor; TimerSelector; TimerScheduler
– AudioChannelType(enum)
Used by ext: AudioManager; AudioService
– TimerAudioConfig(alarmSoundId?: string; backgroundSoundId?: string; backgroundLoop?: boolean; volume?: number)
Used by: AudioManager; TimerConfig
### src/pwa
src/pwa/registerServiceWorker.ts (none)
Used by ext: main.tsx
– registerServiceWorker(none)
Used by ext: main.tsx
### src/services/AudioService.ts (none)
Used by ext: AudioManager
Uses ext: AudioChannelType
– play(assetId: string; channel: AudioChannelType)
Used by: AudioManager
– playLoop(assetId: string; channel: AudioChannelType)
Used by: AudioManager
– stopChannel(channel: AudioChannelType)
Used by: AudioManager
### src/services/PersistenceService.ts (none)
Used by: TimerEditor; TimerSelector; TimerGraph; TimerNode; AudioManager; SkinSelector
– setItem(key: string; value: string)
Used by: PersistenceService
– getItem(key: string)
Used by: PersistenceService
– removeItem(key: string)
Used by: PersistenceService
– saveTimer(timer: TimerConfig; state: TimerState)
Used by: TimerEditor
– loadTimer(timerId: string)
Used by: external callers
– loadAllTimers(none)
Used by: TimerSelector
– deleteTimer(timerId: string)
Used by: TimerSelector
– syncTimers(none)
Used by: none
– saveSkin(skin: string)
Used by: SkinSelector
– loadSkin(none)
Used by: SkinSelector
### src/timers/TimerGraph.ts (root: TimerNode)
Used by: TimerScheduler; diagnostics tooling
– constructor(root: TimerNode)
Used by: external graph creator (e.g., TimerScheduler bootstrap)
– traverseDepthFirst(visitor: (node: TimerNode) => void)
Used by: collectAllNodes; collectLeafNodes; TimerScheduler
– collectAllNodes(none)
Used by: TimerScheduler; diagnostics
– collectLeafNodes(none)
Used by: TimerScheduler
### src/timers/TimerNode.ts (config: TimerConfig)
Used by: TimerGraph; TimerScheduler; TimerRunner; main.tsx
– constructor(config: TimerConfig)
Used by: TimerGraph; main.tsx
– addChild(child: TimerNode)
Used by: TimerGraph; main.tsx
– getExecutableChildren(none)
Used by: TimerScheduler; TimerRunner
– hasChildren(none)
Used by: TimerGraph; TimerSchedule
### src/main.tsx (none)
Used by: index.html (script entry point)
– Demo construction block(timer configs inline)
Used by: main.tsx only
– ReactDOM.createRoot(element: HTMLElement).render(component: ReactNode)
Used by: main.tsx
– registerServiceWorker(none)
Used by: main.tsx
### src/vite-env.d.ts (none)
Used by: TypeScript compiler
– reference directive(/// <reference types="vite/client" />)
Used by: TypeScript compiler
### index.html (none)
Used by: Browser (application entry)
– div#root(none)
Used by: main.tsx
– script(type="module" src="/src/main.tsx")
Used by: Browser module loader

