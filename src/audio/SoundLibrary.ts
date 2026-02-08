/*
File: SoundLibrary.ts

Final Intended Purpose:
- Central registry mapping logical sound identifiers to concrete audio assets.
- Acts as the single source of truth for resolving audio IDs used by timers.

Explicit Responsibilities:
- Maintain a deterministic mapping from sound IDs to asset references.
- Validate existence of requested sound identifiers.
- Expose resolution APIs used by AudioManager only.

Connected Files:
- AudioManager.ts (calls resolve to obtain asset references)
- AudioService.ts (consumes resolved asset references)

Shared Data Models:
- TimerAudioConfig (reads sound ID strings only)

Naming Conventions Enforced:
- Sound identifiers are lowercase kebab-case strings.
- Public API methods use verb-based names (resolve, register).

Development Steps:
- Step 1: Static sound map scaffold (COMPLETE — 2026-02-03)
- Step 2: Resolution API (COMPLETE — 2026-02-06)
- Step 3: Dynamic loading / platform awareness (PLANNED)

Change Log:
- Step 2 completed on 2026-02-06
*/

export class SoundLibrary {
  /**
   * Internal map of sound identifiers to asset references.
   * Step 1: static, hardcoded mapping
   */
  private readonly soundMap: Record<string, string> = {
    'default-alarm': 'assets/sounds/default-alarm.mp3',
    'default-background': 'assets/sounds/default-background.mp3',
  };

  /**
   * Resolves a logical sound identifier to a concrete asset reference.
   * Step 2: AudioManager dependency unblocked
   */
  resolve(soundId: string): string {
    const asset = this.soundMap[soundId];

    if (!asset) {
      throw new Error(`SoundLibrary: unknown soundId '${soundId}'`);
    }

    return asset;
  }
}
