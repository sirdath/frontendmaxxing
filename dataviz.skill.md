# Data-Viz Skill — charts & visualization

> Verified June 2026. Read this when the user wants charts, dashboards, or custom data visualization. Governs the [`data-viz/`](data-viz/) folder; pairs with [`svg.skill.md`](svg.skill.md), [`diagrams.skill.md`](diagrams.skill.md), [`shaders.skill.md`](shaders.skill.md) (WebGL for huge datasets).

## TL;DR — which library
| Situation | Use | Why |
|---|---|---|
| Fast exploratory charts, minimal code | **Observable Plot** | Grammar-of-graphics one-liners; ~10× less code than raw D3 |
| Fully bespoke / novel viz, own every pixel | **D3** | The foundation; unlimited control, steepest curve |
| Custom viz **inside React** with composable primitives | **visx** | D3 math + React rendering (BYO state/animation) |
| Standard dashboard charts, framework-agnostic | **Chart.js** | Canvas, tiny API, huge ecosystem |
| Dense/enterprise dashboards, maps, big data | **ECharts** | Canvas+SVG, deepest catalog |
| Drop-in declarative React charts | **Recharts** | SVG JSX components, most popular React option |
| Beautiful themed React charts out of the box | **Nivo** | D3+React, SVG/Canvas/SSR variants, premium defaults |
| Shared viz across React/Vue/Svelte/Angular | **unovis** | One API, every framework |

Shortcut: **Plot first** (exploration/most charts) → **Recharts/Nivo** (ship React dashboards) → **visx** (custom-but-React) → **D3** (nothing else fits) → **Chart.js/ECharts** (canvas perf / chart breadth) → **unovis** (multi-framework reuse).

## Renderer = the performance decision
- **SVG** (D3/Recharts/visx/Nivo-SVG): crisp, CSS-styleable, accessible — degrades past ~1–5k DOM nodes.
- **Canvas** (Chart.js/ECharts/Nivo-canvas): one element, tens of thousands of points; no per-element a11y.
- **WebGL** (ECharts-GL/deck.gl/regl): 100k–millions / geospatial.
- **Rule: <~1k marks → SVG; ~1k–100k → canvas; >100k or maps → WebGL.**

## The libraries (verified)
| Lib | ★ | License | One-line |
|---|---|---|---|
| **D3** (d3/d3) | 113k | ISC | Low-level data→document; substrate of the ecosystem. Reach for last, deliberately |
| **Chart.js** | 67k | MIT | Simplest canvas charting; React via `react-chartjs-2` |
| **ECharts** (apache) | 66k | Apache-2.0 | Feature-max enterprise (maps/graph/candlestick); `echarts-for-react` |
| **Recharts** | 27k | MIT | Declarative React SVG charts; watch node counts on big series |
| **visx** (airbnb) | 20k | MIT | 30+ low-level React+D3 primitives; un-opinionated |
| **Nivo** (plouc) | 13k | MIT | Themed React dataviz, SVG/Canvas/SSR per chart |
| **Observable Plot** | 5.3k | ISC | Concise grammar-of-graphics from D3's author; CDN-friendly |
| **unovis** (f5) | 2.8k | Apache-2.0 | Modular multi-framework viz |

CDN (Chart.js): `https://cdn.jsdelivr.net/npm/chart.js`.

## Files this skill governs
[`data-viz/`](data-viz/) folder · cross-refs: [`svg.skill.md`](svg.skill.md), [`diagrams.skill.md`](diagrams.skill.md), [`shaders.skill.md`](shaders.skill.md) (WebGL at scale).
