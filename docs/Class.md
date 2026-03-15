# Timer System Class / Method Map

---

### src/audio/AudioManager.ts (active: HTMLAudioElement[])
Used by: TimerScheduler; useTimerEngine
- constructor()
- play(soundFile?: string)
- stop()
- stopAll()
- registerActive(audio: HTMLAudioElement)

---

### src/audio/SoundLibrary.ts (none)
Used by: AudioManager
- resolve(soundId: string)

---

### src/audio/SoundRegistry.ts (AVAILABLE_SOUNDS: string[])
Used by: TimerEditor

---

### src/components/TimerEditor.tsx (config: TimerNodeConfig)
Used by: TimerManager
- generateId()
- cloneWithNewIds(node: TimerNodeConfig)
- TimerEditor(config, onSave, onDelete, onCancel)

---

### src/components/TimerRunner.tsx (root: TimerNodeConfig)
Used by: TimerManager
- TimerRunner(root: TimerNodeConfig)

---

### src/components/TimerManager.tsx (defaultRoots: TimerNodeConfig[])
Used by: main.tsx
- handleSave(config: TimerNodeConfig)
- handleDelete(id: string)
- handleImport(configs: TimerNodeConfig[])

---

### src/components/TimerSelector.tsx (onSelect: (config) => void)
Used by: TimerManager
- loadTimers()
- handleDelete(id: string)

---

### src/components/DurationEditor.tsx (valueMs: number)
Used by: TimerEditor; ColumnEditorSkin
- DurationEditor(valueMs, onChange)

---

### src/hooks/useTimerEngine.ts (schedulerRef: TimerScheduler | null)
Used by: TimerRunner
- useTimerEngine(rootConfig: TimerNodeConfig)
- start()
- pause()
- reset()
- cancel()

---

### src/models/TimerTypes.ts (none)
Used by: TimerEditor; TimerRunner; TimerScheduler; PersistenceService
- TimerState (enum)
- TimerNodeConfig (type)

---

### src/models/AudioTypes.ts (none)
Used by: AudioManager; SoundLibrary
- SoundRef (type)
- TimerAudioConfig (type)
- AudioChannelType (enum)

---

### src/timers/TimerNode.ts (id: string; durationMs: number; parent?: TimerNode)
Used by: TimerGraph; TimerScheduler
- constructor(config: TimerNodeConfig, parent?: TimerNode)
- reset()

---

### src/timers/TimerGraph.ts (root: TimerNode)
Used by: TimerScheduler
- constructor(rootConfig: TimerNodeConfig)
- traverseDepthFirst(visitor)
- collectAllNodes()
- collectLeafNodes()

---

### src/timers/TimerScheduler.ts (graph: TimerGraph; activeNodes: Set<TimerNode>)
Used by: useTimerEngine
- start()
- stop()
- activateNode(node: TimerNode)
- completeNode(node: TimerNode)
- resolveSound(node: TimerNode)
- getRemainingMap()

---

### src/services/PersistenceService.ts (none)
Used by: TimerManager; TimerSelector
- saveTimer(timer: TimerNodeConfig)
- loadTimer(timerId: string)
- loadAllTimers()
- deleteTimer(timerId: string)
- saveSkin(skin: string)
- loadSkin()

---

### src/skins/TimerSkin.ts (interface)
Used by: TimerRunner
- renderNode(node: TimerNodeConfig, remainingMs: number)

---

### src/skins/classic/ColumnEditorSkin.tsx (none)
Used by: TimerEditor
- ColumnEditorSkin(props)

---

### src/skins/classic/ColumnRunnerSkin.tsx (none)
Used by: TimerRunner
- ColumnRunnerSkin(props)

---

### src/skins/classic/TimerNodeView.tsx (node: TimerNodeConfig)
Used by: Classic skins
- TimerNodeView(node)

---

### src/skins/minimal/TimerNodeView.tsx (node: TimerNodeConfig)
Used by: Minimal skins
- TimerNodeView(node)

---

### src/utils/timeUtils.ts (none)
Used by: TimerEditor; TimerRunner; DurationEditor
- msToHMS(ms: number)
- hmsToMs(h: number, m: number, s: number)
- formatHMS(ms: number)

---

### src/viewmodels/TimerViewModel.ts (none)
Used by: TimerRunner; skins

---

### src/pwa/registerServiceWorker.ts (none)
Used by: main.tsx
- registerServiceWorker()

---

### src/main.tsx (none)
Used by: index.html
- ReactDOM.createRoot().render()
- registerServiceWorker()

---

### src/vite-env.d.ts (none)
Used by: TypeScript compiler

---

### index.html (none)
Used by: Browser
- root container (#root)
