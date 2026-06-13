# Diagrams Skill — code/text-driven diagrams

> Verified June 2026. Read this when the user wants diagrams as code — flowcharts, architecture, sequence/ER/state diagrams, dependency graphs, or whiteboard sketches. All version-controllable, regenerable, export to SVG/PNG. Pairs with [`dataviz.skill.md`](dataviz.skill.md) and the `structure` skill.

## TL;DR — which tool
| Need | Use | Why |
|---|---|---|
| Flowcharts/sequence/ER/gantt/state/mindmap in Markdown & docs | **Mermaid** | Native GitHub/GitLab/Notion render, widest type coverage, zero deps to read |
| Best-looking software-**architecture** diagrams (deliverable-grade) | **D2** | Cleanest output, themes, containers, multiple layout engines |
| Hand-drawn / "whiteboard" look (pitch decks, workshops) | **Excalidraw** | Distinctive sketchy aesthetic, embeddable React canvas |
| Precise auto-layout of graphs/trees/networks | **Graphviz** | The DOT engine everything else builds on; deterministic |

Pick order: **Mermaid** for docs by default → **D2** when the diagram is a client deliverable → **Excalidraw** for the deliberately informal vibe → **Graphviz** when layout (not style) is the hard part.

## The tools
**Mermaid** — `mermaid-js/mermaid` (~88k★, MIT). Text→diagram, 15+ types; the lingua franca (renders inline in GitHub/GitLab/Obsidian).
```bash
npm i -g @mermaid-js/mermaid-cli
mmdc -i in.mmd -o out.svg -t dark -b transparent        # -o out.png / .pdf
```
CDN: `https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js`.

**D2** — `terrastruct/d2` (~24k★, MPL-2.0). The "Terraform of diagrams" — best-looking output, real theming, containers, SQL/class shapes, multiple layout engines (dagre/ELK; TALA proprietary).
```bash
brew install d2
d2 input.d2 out.svg          # or .png/.pdf
d2 --watch input.d2          # live preview ;  d2 fmt  to format
```

**Excalidraw** — `excalidraw/excalidraw` (~125k★, MIT). Hand-drawn whiteboard; embeds in Next.js.
```bash
npm i @excalidraw/excalidraw          # React component
# headless export: import { exportToSvg, exportToBlob } from "@excalidraw/utils"
```
For repo-stored `.excalidraw` files in CI: community `excalidraw-to-svg` / `excalidraw_export` CLIs.

**Graphviz** — graphviz.org (EPL-1.0). The canonical auto-layout engine (DOT); many tools sit on it.
```bash
brew install graphviz
dot -Tsvg in.dot -o out.svg          # engines: dot, neato, fdp, sfdp, circo, twopi
```

## License flags
Mermaid/Excalidraw = MIT; **D2 = MPL-2.0** (file-level copyleft — note if redistributing modified source); Graphviz = EPL-1.0. All run on the existing Node + Homebrew setup.

## Files this skill governs
Cross-refs: [`dataviz.skill.md`](dataviz.skill.md), [`svg.skill.md`](svg.skill.md) (export targets), `structure` skill.
