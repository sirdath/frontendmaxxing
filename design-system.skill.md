# design-system.skill.md — DESIGN.md → frontendmaxxing

Give an AI agent **design taste** (a `DESIGN.md` token spec, in the style popularised by [styles.refero.design](https://styles.refero.design/)) and this doc maps it onto frontendmaxxing's **parts** — the 50 themed palettes in `colors/palettes.css`, the per-snippet `--vars`, the `structure/` backbone, and the right snippet for each component slot. Refero supplies the *taste*; frontendmaxxing supplies the *parts*; this doc is the bridge.

> Use the MCP tool `design_system(palette)` to **generate** a ready DESIGN.md from any repo palette (it fills the tokens + recommends snippets). This doc explains the format and the mapping so you can also hand-author or adapt one.

---

## What a DESIGN.md is

A single Markdown file that captures a product's visual language as tokens + conventions, so an agent can build *on-brand* without guessing. The canonical sections:

```md
# DESIGN.md — <name>

## Color        bg / surface / border / fg / muted / accent(+2) / semantic states
## Typography   font stack · type scale · weights · tracking
## Spacing       4/8px scale · container widths · radii · shadows
## Motion        durations · easings · what animates
## Components    the house style for buttons / inputs / cards / nav / etc.
```

Refero hosts 2,000+ of these extracted from real sites — grab one for the *taste* of a brand, then realise it below. (Don't copy a brand's file verbatim into shipped product; use it as the spec to build against.)

---

## The token contract (what frontendmaxxing themes off)

Every palette in `colors/palettes.css` sets the **same token names** that the `structure/` backbone and token-driven snippets read. Apply a palette class and the whole tree re-skins:

```html
<body class="struct pal-fintech-navy"> … </body>
```

| Token | Role |
|---|---|
| `--bg` `--bg-alt` `--surface` | page / alt / card backgrounds |
| `--border` | hairlines |
| `--fg` `--muted` `--faint` | text: primary / secondary / tertiary |
| `--accent` `--accent-2` `--on-accent` | brand accent(s) + text on accent |
| `--ok` `--warn` `--danger` `--info` | semantic states |

A DESIGN.md's **Color** section maps 1:1 onto these. Pick the closest palette (`list_palettes` / `get_palette` via MCP, or `color.skill.md`), or author a one-off by overriding the vars.

---

## Realising a DESIGN.md with frontendmaxxing

| DESIGN.md section | Realise with |
|---|---|
| **Color** | Pick a palette (`pal-*` in `colors/palettes.css`) whose mood/industry matches, or set the token vars directly. See `color.skill.md` for industry→palette + 60-30-10. |
| **Typography** | `typography/fluid-type.css` (clamp scale), `typography/variable-fonts.css`; set the font stack on `:root`. Gradient numerals → `typography/gradient-numbers.css`. |
| **Spacing & radius** | `structure/structure.css` backbone (container, section rhythm). Most snippets expose `--*-radius`; set a global radius token and pass it through. |
| **Shadows / depth** | `effects/gradient-glow.css`, `effects/shadow-*`; elevation via the snippet `--vars`. |
| **Motion** | `utils/easing.js` (named curves), `animations/` (keyframes, spring, stagger), `transitions/transitions-pro.js` for page-level. Match the DESIGN.md's durations/easings. |
| **Backgrounds** | `backgrounds/aurora-bg.css`, `backgrounds/interactive-canvas.*` (spotlight/network/mesh), `backgrounds/patterns*.css`. |

### Component slot → snippet (the "house style")

| Slot | Quiet / refined | Bold / expressive |
|---|---|---|
| Buttons | `blocks/buttons-sleek.css` (`slk-*`) | `blocks/buttons-fx*.css`, `buttons-pack.css` |
| Inputs | `blocks/inputs-fancy.css`, `inputs-uiverse.css` | `components/glow-search.css` |
| Cards | `components/cards.css`, `card-fx.css` (`cfx-holo/flip`) | `effects/luxe-hover.css`, `blocks/cards-fancy.css` |
| Toggles / checks | `blocks/toggles-uiverse.css`, `checkboxes-uiverse.css` | — |
| Nav / chrome | `components/header-pack.css`, `navbars.css`, `footers-pro.css` | — |
| Hero | `components/heroes-pack.css`, `backgrounds/aurora-bg.css` | `backgrounds/interactive-canvas.css` (`network`/`field`) |
| Loaders | `blocks/loaders-mega.css`, `loaders-uiverse.css` | — |
| Theme toggle | `components/theme-switch.css` (`data-theme` + persistence) | — |
| Page transitions | `transitions/transitions-pro.js` (14 effects) | — |

Use the MCP `search_components` / `get_snippet` to pull the exact file for any slot, and `get_skill('structure')` for the section sequence per page genre.

---

## Workflow: brand/taste → built page

1. **Get the taste.** Grab a DESIGN.md from refero (or write one), or call `design_system(palette)` to generate one from a repo palette.
2. **Lock the palette.** Match the Color section to a `pal-*` (`list_palettes`, `color.skill.md`) and apply it on the page root: `<body class="struct pal-…">`. Override individual `--vars` for exact hexes.
3. **Set type + motion.** Wire `typography/fluid-type.css` + a font stack; pick easings from `utils/easing.js` matching the Motion section.
4. **Lay out the page.** `get_skill('structure')` → section sequence for the genre → fill each slot from the table above via `get_snippet`.
5. **Stay on-brand.** Every snippet is token-driven, so the palette + vars keep all parts visually coherent — that's the whole point.

---

## Authoring an original DESIGN.md (template)

```md
# DESIGN.md — Acme (calm fintech)

## Color
bg #0b1020 · surface #121833 · border rgba(255,255,255,.08)
fg #e8ecf6 · muted #9aa4c0 · accent #4f8cff · accent-2 #22d3ee
ok #34d399 · warn #fbbf24 · danger #f87171
Apply: `pal-fintech-navy` (closest), override --accent to #4f8cff.

## Typography
Stack: "Inter var", system-ui, sans-serif · Scale: fluid 14→18 base, 1.25 ratio
Headings 700 · body 400 · tracking -0.01em on display

## Spacing
4px base · container 1120px · radius 12px (cards) / 8px (controls)
Shadow: 0 12px 32px -12px rgba(0,0,0,.5)

## Motion
220ms ease-out for hovers · 600ms cubic-bezier(.2,.8,.2,1) for page transitions
Animate: hover lift, focus ring bloom, section reveal on scroll

## Components
Buttons: slk-soft (primary = accent gradient) · Inputs: inu-glow
Cards: cfx-holo on featured, cards.css elsewhere · Hero: aurora-bg + fluid headline
```

Keep it to tokens + house style — short, machine-readable, opinionated. That's what makes it useful to an agent.

---

**Credit:** the `DESIGN.md`-for-agents pattern is popularised + curated by [styles.refero.design](https://styles.refero.design/). This doc is an original mapping of that pattern onto frontendmaxxing's palettes and snippets.
