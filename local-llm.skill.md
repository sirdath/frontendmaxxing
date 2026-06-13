# Local LLM Skill — Ollama / MLX on Apple Silicon

> Verified June 2026 for **Mac M5 / 24 GB unified / macOS 26** (Ollama already installed). Read this when the user wants to run a language model **locally/offline/free** — privacy-sensitive client data, offline copy drafts, summarization, RAG, cheap bulk classification. Honest memory ceiling up front: 24 GB leaves **~16–20 GB usable** → fits **dense ≤14B at Q4** comfortably, **30B-class MoE at 4-bit** (only a few B active), **dense 32B is tight**, **70B is out**.

## 1. Ollama (installed) — the everyday driver
`ollama pull <model>` · `ollama run <model>` · `ollama list` · `ollama ps`. Serves an **OpenAI-compatible API at `http://localhost:11434/v1`** — point any OpenAI SDK at it with a dummy key.

**M5 note:** Ollama 0.19 added an **MLX backend (preview)** for the M5's Neural Accelerators, but it **requires 32 GB** — on your 24 GB M5 it auto-falls back to the (still fast) Metal/llama.cpp backend. For MLX speed on 24 GB today, use MLX-LM directly (§2).

Recommended pulls (Q4 on-disk size; +2–4 GB runtime KV cache):
| Job | Model | tag | Fit | Verdict |
|---|---|---|---|---|
| **Code (best)** | Qwen3-Coder 30B-A3B (MoE, ~3.3B active, 256K ctx) | `qwen3-coder:30b` | ~17–20GB | **Usable→fast** (~25–35 tok/s). Keep ctx 32–64K to avoid swap |
| **General/copy** | Qwen3 14B / Gemma 3 12B | `qwen3:14b` / `gemma3:12b` | ~9–11GB | **Fast.** Comfortable headroom |
| **Reasoning** | DeepSeek-R1 32B | `deepseek-r1:32b` | ~19–20GB tight | Usable, slow-ish |
| **Vision** | Gemma 3 12B (text+image, 128K) | `gemma3:12b` | ~9–11GB | **Fast.** Best vision/size balance |
| **Bulk/light** | Phi-4 14B / Gemma 3 4B | `phi4:14b` / `gemma3:4b` | ~9GB / ~3GB | **Fast.** 4B = cheap-bulk workhorse |

**Default to 12–14B dense for speed; reach for Qwen3-Coder 30B-A3B for real coding muscle; avoid dense 32B.** For agent/tool use prefer Qwen3/Qwen2.5-instruct, Llama 3.x-instruct, Mistral-instruct (confirmed function-calling).

## 2. MLX-LM & LM Studio — when each wins
- **MLX-LM** (`pip install mlx-lm`, MIT) — **fastest on Apple Silicon** (~15–30% faster gen than llama.cpp, up to ~2× on MoE, less memory at same quant). `mlx_lm.generate --model mlx-community/<repo> --prompt "..."` or `mlx_lm.server` (OpenAI-compatible). Use for max throughput / lowest memory on 24 GB, or on-device LoRA fine-tune. Models: `mlx-community` org on HF.
- **LM Studio** (free GUI, proprietary; bundles MLX + GGUF) — best for point-and-click model discovery, quant A/B, one-click local server.
- **Keep Ollama as the everyday driver; MLX-LM in your back pocket** for the 30B MoE coder when you want it snappier/leaner.

## 3. Wiring local models to Claude Code
Two *different* real options — don't conflate:
- **(a) Endpoint swap (official, not MCP):** make a local model the *driving* model — `ANTHROPIC_BASE_URL=http://localhost:11434`, `ANTHROPIC_AUTH_TOKEN=ollama`, then `claude --model qwen3-coder:30b` (or `ollama launch claude --model …`). Needs ≥64K ctx to behave (demanding on 24 GB; expect quality below cloud Claude).
- **(b) MCP servers that expose Ollama as tools** (cloud Claude orchestrates, *delegates* to local): `Jadael/OllamaClaude` (AGPL, ~14★, immature), `rawveg/ollama-mcp`, `patruff/ollama-mcp-bridge`. **Honest:** the Claude-Code-specific bridge is immature; for real delegation, a thin custom MCP over Ollama's `/v1` is more robust. Multi-turn tool-use is the weak spot.

## 4. Uses for the consultancy
- **Privacy-sensitive / NDA client data** (the headline) — summarize/classify/draft **fully offline**, nothing leaves the Mac (fits the CLAUDE.md secrets rule).
- **Offline copy drafts** — 12–14B first pass → hand to the `frontend-design` brand guardrail (local models won't know DS voice).
- **RAG over client docs** — embed via Ollama (`nomic-embed-text`/`mxbai-embed-large`) into **pgvector** (the repo's Supabase default), answer with a local 12–14B. Zero per-query cost, no data egress.
- **Cheap bulk classification** — Gemma 3 4B / Phi-4 over thousands of items (tag competitor pages, label research) at no API cost.

## Files this skill governs
Cross-refs: [`local-image-gen.skill.md`](local-image-gen.skill.md), [`local-audio.skill.md`](local-audio.skill.md), the NeuroVault memory layer, and the repo's Supabase/pgvector RAG default.
