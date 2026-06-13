# taste.skill.md — Read this to make a page look *intentional*, not generated

This skill answers the question **"how do I make 931 good parts add up to one
tasteful, cohesive, distinctive page?"** — the layer above `structure.skill.md`
(which decides *what sections* go on the page) and `color.skill.md` (which decides
*palette*). Where those decide skeleton and color, **this decides taste**: a single
coordinated aesthetic, paired type, motion that matches, spacing rhythm, and the
discipline to avoid the tells that make a UI read as "AI slop."

> Pair: the **`taste/`** folder. It is a *token-layer* — attribute selectors that
> only WRITE CSS variables, so they retune the whole page without touching any
> component's behavior. Load order: `structure/structure.css` → `colors/palettes.css`
> → `taste/*.css`. Apply together:
>
> ```html
> <body class="struct pal-luxe-black-gold"
>       data-aesthetic="luxury" data-font-pair="luxury-serif"
>       data-motion="standard" data-density="airy">
> ```
>
> `data-aesthetic` alone already sets font + motion + spacing + elevation for that
> profile — the other three attributes are for overriding a single axis. There is
> also `taste/presets.js` (`TastePresets`) with ~12 ready bundles and
> `taste/motion-profiles.js` (`MotionProfile`) for the JS side of motion.

## How to use this skill

1. **Pick ONE aesthetic** from the vocabulary below (or take a `TastePresets`
   bundle, which picks all axes for you). Commit to it. The single biggest cause
   of "generated-looking" pages is mixing two aesthetics on one page.
2. **Apply it as attributes on `<body>`** (one `data-aesthetic`, plus a matching
   `pal-*`). Optionally override `data-density`/`data-motion`/`data-font-pair`.
3. **Reach for the preset's `house` packs** for buttons/cards/inputs/hero/loader —
   not a random pack each time. This is how the library stays diverse *across*
   pages but cohesive *within* one.
4. **Obey the anti-slop rules.** Every "don't" below has a concrete "do" using a
   token or a real snippet.
5. **Seed diversity.** If you've built this genre before, change the aesthetic,
   the palette, or the `variety_seed` (in `compose_page`) so you don't ship the
   same page twice.

## The aesthetic vocabulary (6 profiles)

Each row is internally consistent: the palette, type, motion, and density were
chosen to reinforce one feeling. `data-aesthetic` sets the type/motion/spacing
automatically; the palette is your choice (suggestions given).

| Aesthetic | Feels like | Palettes (`pal-*`) | Font pair | Motion | Density | Signature parts |
| --- | --- | --- | --- | --- | --- | --- |
| **minimal** | calm, trustworthy, premium-quiet | `fintech-light` `saas-indigo` `clean-light` `mono-snow` | `grotesk-tech` / `system-clean` | minimal | airy | `buttons-sleek`, `components/cards`, `inputs-pro`, lots of whitespace |
| **editorial** | print magazine, considered, literary | `paper` `ink` `luxe-cream` `nude-elegant` | `editorial-serif` | standard | airy/normal | serif display heroes, `loaders-text`, wide measure, rules over shadows |
| **energetic** | launch-day, punchy, confident | `electric-night` `energy-volt` `power-orange` `festival` | `display-bold` | playful/standard | normal | `buttons-fx`/`buttons-shine`, `cards-3d`, bold CTAs, lively reveals |
| **luxury** | couture, exclusive, expensive | `luxe-black-gold` `luxe-cream` `royal-purple` `wealth-emerald` | `luxury-serif` | standard | airy | `buttons-fx3`, `glare-card`, deep soft elevation, slow glide, negative space |
| **playful** | friendly, fun, approachable | `playful-bright` `care-mint` `hope-warm` `crayon` | `geometric-warm` / `humanist-soft` | playful | normal | `buttons-pack`, `cards-pack`, big radii, bouncy spring, chunky shapes |
| **technical** | dev-grade, precise, dense | `vercel-mono` `slate-dark` `charcoal` `mono-noir` | `mono-technical` / `grotesk-tech` | minimal | compact | mono labels, crisp edges, `spinner-pack`, status colors, near-zero motion |

## Preset bundles (`TastePresets`)

Twelve opinionated bundles bind every axis + a `house` pack per slot + an `avoid`
list. Resolve one and apply it in five lines (see the file header). Use these as
your default starting point — they encode the "right pack per aesthetic" decision
so you don't have to.

`calm-fintech` · `clean-saas` · `editorial-mag` · `editorial-ink` · `bold-launch`
· `vibrant-startup` · `luxury-noir` · `luxury-cream` · `playful-pop` ·
`friendly-care` · `dev-tool` · `data-console`

Via MCP: `list_taste_presets()`, `get_taste_preset("luxury-noir")`, or let
`compose_page("saas", preset:"calm-fintech")` assemble a whole page from one.

## Anti-AI-slop rules (each *don't* has a *do*)

These are the specific tells that make a page look machine-generated. Fix them with
a token or a real snippet — never by eyeballing a magic number.

1. **Don't** hardcode hex colors in components. **Do** use the palette tokens:
   `var(--accent)`, `var(--surface)`, `var(--fg)`, `var(--muted)`, `var(--border)`.
   A page where every color traces to one `pal-*` reads as designed.
2. **Don't** put a different accent hue in every section (rainbow soup). **Do**
   commit to one accent (`--accent`, maybe `--accent-2` for a single gradient).
3. **Don't** use random transition durations (`0.3s` here, `450ms` there). **Do**
   use the blessed motion tokens `var(--m-dur-fast|--m-dur|--m-dur-slow)` and
   `var(--m-ease)` from `data-motion`. Blessed set: 90/120/140/160/200/260/320/480ms.
4. **Don't** ship the default `transform: scale(1.05)` card hover on everything —
   it's the #1 slop tell. **Do** lift with the aesthetic's `var(--ts-hover-lift)`
   (a small translateY) + `var(--ts-elevation)`, or use a purpose-built hover from
   `effects/card-fx.css` / `effects/3d-cards-pack.css`.
5. **Don't** glassmorphism + neon glow + gradient text + 3d-tilt all on one page.
   **Do** pick the 1–2 signature moves your aesthetic allows and repeat them.
6. **Don't** use `border-radius: 8px` literals scattered around. **Do** use
   `var(--radius)` / `var(--radius-sm)` so density/aesthetic can retune them.
7. **Don't** center every section and call it a layout. **Do** vary rhythm with
   the `.s-*` shells (`s-split`, `s-grid--2`, `s-hero--split`) and let
   `data-density` set the breathing room.
8. **Don't** leave motion on for users who don't want it. **Do** rely on the
   built-in `prefers-reduced-motion` guard (every taste file + every snippet has
   one) — never add motion that ignores it.
9. **Don't** pair a serif display with a serif body, or mismatch voice and content
   (playful bubble font on a bank). **Do** use a `data-font-pair` — they're
   pre-vetted head+body combinations matched to each aesthetic.
10. **Don't** use placeholder-grey everything and weak 1px-faint text. **Do**
    respect the type scale (`--t-display`…`--t-small`) and the `--fg`/`--muted`
    contrast pair from the palette.

## Visual hierarchy & diversity

- **One hero idea.** The hero carries the aesthetic; everything downstream is
  quieter. Don't compete with the hero in section 3.
- **Three weights, not ten.** Display for the hero, `--t-h2` for section heads,
  body for the rest. Resist styling every element uniquely.
- **Repeat, then break.** Establish a card/spacing pattern, then break it *once*
  intentionally (a full-bleed band, an oversized stat) for emphasis.
- **Diversity across pages.** The library is huge on purpose — don't collapse it.
  For a new build, rotate the aesthetic/palette, or pass a fresh `variety_seed`
  to `compose_page` so each slot picks a different valid snippet.

## Cross-references

- `structure.skill.md` — which sections a genre needs and in what order (the
  skeleton this taste layer dresses). `compose_page` joins the two.
- `color.skill.md` — the 50 palettes and how to read their tokens; pick the
  `pal-*` your aesthetic suggests.
- `design-system.skill.md` — DESIGN.md in/out (`design_system`, `apply_design_md`)
  for matching an external brand's tokens before applying a taste.
- `gradients.skill.md` / `gsap.skill.md` — when a signature move needs a custom
  gradient or scripted motion, stay inside the blessed tokens.
