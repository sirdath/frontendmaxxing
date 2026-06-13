# Local Audio Skill — STT, TTS & music on Apple Silicon

> Verified June 2026 for **Mac M5 / 24 GB / macOS 26**. Read this when the user wants speech-to-text, text-to-speech/voiceover, or music/SFX — especially narration + captions for [`remotion.skill.md`](remotion.skill.md) videos, or UI sound. Audio models are small → almost everything fits 24 GB easily; the question is speed/quality, not memory (except music).

## TL;DR
- **STT:** **whisper.cpp** + `large-v3-turbo` (CLI) or **mlx-whisper** (fastest on Mac). ✅ Fast.
- **TTS:** **Kokoro-82M** via `mlx-audio` — the workhorse (Apache, fast, great). Piper for ultra-light/UI; CSM-1B for most natural narration. ✅ Fast.
- **Music:** MusicGen MLX port (small model) — ⚠️ usable for *scratch* only (NC license → swap for licensed audio before launch).
- **Premium voice:** **ElevenLabs (API)** for broadcast-grade client VO.

## 1. STT (speech-to-text)
| Tool | Run | License | Verdict |
|---|---|---|---|
| **whisper.cpp** (Metal) | `brew install whisper-cpp`; `whisper-cli -m ggml-large-v3-turbo.bin a.wav` | MIT | ✅ **Fast, default.** ~60 s audio in ~2.8 s (M2 Pro; M5 faster). Use **`large-v3-turbo`** (~8× faster than large-v3, ~99% accuracy) |
| **mlx-whisper** | `pip install mlx-whisper` | MIT | ✅ **Fastest on Apple Silicon.** Use inside Python/MLX flows |
| **faster-whisper** | `pip install faster-whisper` | MIT | Usable; CPU on Mac (no Metal) → slower here. Good for batch + word timestamps/diarization |
| **MacWhisper** (GUI) | Mac app (free / Pro one-time) | proprietary | ✅ Zero-effort batch + subtitle export, same engine |

## 2. TTS (text-to-speech)
| Model | Run | License | Verdict |
|---|---|---|---|
| **Kokoro-82M** | `pip install mlx-audio` → `mlx-community/Kokoro-82M-bf16` (54 voices, multilingual) | **Apache-2.0** | ✅ **Default.** #1 TTS Arena early 2026, tiny (82M), near-instant on M5, commercial-safe. **Start here** |
| **Piper** | `pip install piper-tts` | MIT | ✅ Fastest/lightest, CPU-fine — UI sounds, embedded prompts |
| **Sesame CSM-1B** | via `mlx-audio` | Apache-2.0 (verify) | ✅ Most *natural*/conversational (English, 2-speaker). Use when naturalness > all |
| ⚠️ XTTS v2 (Coqui) | `pip install coqui-tts` | weights CPML (commercial cloning needs agreement) | Voice *cloning* only; clear license before shipping |
| ⚠️ F5-TTS | `pip install f5-tts` | **CC-BY-NC (non-commercial)** | Experiments only — not for client deliverables |

`mlx-audio` (`Blaizzy/mlx-audio`, Apache-2.0) is the recommended Mac runtime (hosts Kokoro/CSM, OpenAI-compatible server). Pin Python 3.11/3.12 (fussy on 3.13).

## 3. Music / SFX
| Tool | License | Verdict |
|---|---|---|
| **MusicGen / AudioCraft** (Meta) — use the **MLX port** | code MIT; **weights CC-BY-NC** | ⚠️ MLX port: 8 s audio in ~6 s on M4 Max (small model). **NC license = scratch/temp only**, not client delivery |
| **Stable Audio Open** | Stability community (verify) | ⚠️ Short SFX/loops; heavier setup; check license |

**Local music = ideation, not delivery** — license production music elsewhere.

## 4. Cloud premium fallback — ElevenLabs (API)
Broadcast-grade VO for paying clients: **Eleven v3** (most expressive, final deliverables) / **Flash v2.5** (~75 ms latency, cheap, real-time). Bill per character (Pro ~$99/mo). Use only when local TTS quality isn't enough; Kokoro covers most internal needs free.

## 5. Use cases
- **Remotion narration + captions:** Kokoro (or ElevenLabs premium) generates VO → whisper.cpp `large-v3-turbo` transcribes it back to **word-timed SRT/captions** for the timeline. Fully local for drafts. (See `@remotion/captions` + `@remotion/install-whisper-cpp` in [`remotion.skill.md`](remotion.skill.md).)
- **UI sound:** Piper for spoken prompts; MusicGen MLX for temp stings (swap before launch).
- **Podcast/VO:** record → whisper.cpp transcript/edit → CSM-1B or ElevenLabs re-voice; MacWhisper for GUI.

## Files this skill governs
Cross-refs: [`remotion.skill.md`](remotion.skill.md) (narration/captions), [`local-llm.skill.md`](local-llm.skill.md), [`local-image-gen.skill.md`](local-image-gen.skill.md).
