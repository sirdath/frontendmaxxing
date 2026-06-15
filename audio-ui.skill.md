# audio-ui.skill.md — Sound in the interface (playback & feedback UX)

This skill owns **interactive audio in the browser** — UI feedback sounds, audio-reactive
visuals, and the Web-Audio gotchas that bite. It is the *playback/feedback* sibling of
[`local-audio.skill.md`](local-audio.skill.md), which owns *generation* (TTS/STT/music).

## Decide in three lines

| You want… | Reach for | Why |
|---|---|---|
| Click / hover / success / error feedback | **`interactions/ui-sounds.js`** (`UiSounds`) | Synthesized Web Audio — zero asset files, zero network, instant. |
| A specific recorded sound / brand SFX | **CDN `howler`** (MIT) via a sprite map | When timbre matters and synthesis won't do; one file, many sounds. |
| Visuals that react to live audio (bars / wave / radial) | **`media/audio-visualizer.js`** (`AudioVisualizer`) | Realtime AnalyserNode → canvas (mic or `<audio>`). |
| Drive *CSS* from amplitude (scale a bar, pulse a glow) | **`interactions/sound-react.js`** (`SoundReact`) | Writes `--snd-level`/`--snd-bass`/`--snd-treble`; styling stays in CSS. |
| A static seek/scrub waveform of a clip | **`media/audio-waveform.js`** (existing) | Not live — a precomputed waveform pill for a player. |

## Synthesize vs ship an asset

- **Synthesize (default for UI):** `OscillatorNode` + a gain envelope. No download, no decode latency, infinitely tweakable, ~0 KB. `ui-sounds.js` does this. Good for ticks, blips, confirmations.
- **Ship an asset (howler/`<audio>`):** only when you need a *specific* recorded sound (a brand chime, a real "whoosh"). Preload, use a sprite (one file, offset playback) to avoid many requests.

## The non-negotiable gotchas

1. **Autoplay policy.** Browsers suspend `AudioContext` until a user gesture. **Create/resume the context inside the first real interaction** (click/keydown), not on load. `ui-sounds.js` lazily builds the context on first `play()` after a gesture — do the same in custom code (`if (ctx.state === 'suspended') ctx.resume()`).
2. **Never sound-only feedback (a11y).** Sound must *accompany* a visual/text state change, never replace it. Deaf/HoH users and muted devices must lose nothing.
3. **Respect reduced-motion / give a mute.** Decorative sound is motion-adjacent — `ui-sounds.js` silences itself under `prefers-reduced-motion` by default (`respectReducedMotion`). Always expose a visible **mute** and persist it (`UiSounds.mute(true)`).
4. **Latency.** Synthesized sounds are sub-millisecond; decoded assets aren't — preload and `decodeAudioData` ahead of time so the click and the sound land together.
5. **One context.** Don't spawn an `AudioContext` per sound (browsers cap them). Share one (the snippets do).

## Recipes

```html
<!-- feedback sounds, auto-wired -->
<button data-ui-sound="click">Save</button>
<a data-ui-sound-hover="hover" data-ui-sound="pop">Open</a>
<script src="interactions/ui-sounds.js"></script>
<script>UiSounds.init('[data-ui-sound], [data-ui-sound-hover]'); UiSounds.volume(0.4);</script>
```
```html
<!-- bars that pulse to a track, styled entirely in CSS -->
<div class="eq"><i></i><i></i><i></i></div>
<style>.eq i{height:calc(8px + var(--snd-level,0) * 60px);transition:none}</style>
<script src="interactions/sound-react.js"></script>
<script>SoundReact.init('.eq', { source: '#track' });</script>
```

## Files this skill governs
- `interactions/ui-sounds.js` · `interactions/sound-react.js` · `media/audio-visualizer.js`
- Adjacent: `media/audio-waveform.js` (static), `local-audio.skill.md` (generation), `taste.skill.md` (motion/sound restraint).

## Licensing
- The snippets are vanilla Web Audio — no third-party code. `howler` (MIT) and `tone` (MIT) are CDN-safe when you need recorded/musical audio. Ship only sound assets you own or that are CC0.
