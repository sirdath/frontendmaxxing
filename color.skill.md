# color.skill.md — Read this first for *choosing colors*

This skill answers **"what colors should this use, and how do I combine them?"**
It's the companion to `gradients.skill.md` (which handles blends/mesh/holo) — this
one is about **solid palettes, harmony, and matching color to a business/mood.**

> Pair: the **`colors/`** folder.
> - `colors/palettes.css` — **50+ vetted, named theme presets** as `.pal-*` classes.
>   Each sets the SAME tokens the `structure/` backbone uses, so applying a palette
>   class re-themes a whole page instantly.
> - `colors/scales.css` — raw building blocks: 14 hue ramps (50→900), tuned neutral
>   grays (cool/warm), and semantic tokens (success/warn/danger/info).

## Fastest path (90% of the time)

1. Identify the **business/industry** or the **mood** you want.
2. Look it up in the tables below → get a recommended `.pal-*` name.
3. Apply it: `<body class="struct pal-fintech-navy">…</body>`. Done — bg, surface,
   text, borders, accent, and semantic colors are all set and contrast-checked.
4. Need a custom brand color? Jump to **"Build a palette from one brand hue."**

Never hand-pick 5 random hex codes. A palette is a *system of roles*, not a mood board.

## The role model (what every palette defines)

Color in UI is assigned by **role**, not decoration. Every `.pal-*` sets these tokens:

| Token | Role | Rule of thumb |
| --- | --- | --- |
| `--bg` | page background | the **60%** |
| `--bg-alt` | alternating section surface | a half-step from `--bg` |
| `--surface` | cards / raised panels | the **30%** |
| `--border` | hairlines, dividers | low-contrast, often an alpha |
| `--fg` | primary text | hits **4.5:1** on `--bg` |
| `--muted` | secondary text | hits **≥4.5:1** (don't just lower opacity) |
| `--faint` | tertiary / labels | decorative, can be ~3:1 |
| `--accent` | primary brand / CTA | the **10%** — used sparingly |
| `--accent-2` | secondary accent / gradient pair | |
| `--on-accent` | text on the accent | white or near-black for contrast |
| `--ok` `--warn` `--danger` `--info` | semantic states | green / amber / red / blue, consistent everywhere |

**The 60-30-10 rule:** ~60% dominant (bg), ~30% secondary (surfaces), ~10% accent.
If the accent is everywhere, nothing is the accent.

## Harmony schemes — and when to use them in UI

Pick a scheme to relate `--accent`, `--accent-2`, and chart colors.

| Scheme | Hues | Use it for |
| --- | --- | --- |
| **Monochromatic** | one hue, vary L/C | the safest base; pair with ONE contrasting accent (don't ship mono-only — hard to encode info) |
| **Analogous** | adjacent hues | calm, unified base UI; still needs one contrasting accent |
| **Complementary** | 180° apart | a single high-energy CTA against a neutral base; overwhelming in bulk |
| **Split-complementary** | base + 2 around its complement | high contrast, less tension than straight comp (Slack uses this) |
| **Triadic** | 3 hues, 120° | playful, vibrant, balanced; harder to control |
| **Tetradic** | 2 complementary pairs | bold; let ONE dominate, others as accents; balance warm/cool |
| **Square** | 4 hues, 90° | **charts/dashboards** needing 4 distinct-but-related series |

Default recipe: **analogous base + one complementary accent.**

## Industry → palette

Conventions exist because they work (and users expect them). Start here, then deviate
deliberately. "Primary hue" = the dominant brand color the industry leans on.

| Industry | Primary hue + why | Try these `.pal-*` |
| --- | --- | --- |
| Finance / banking | **Blue** — trust, security, competence (~95% of finance brands) | `pal-fintech-navy`, `pal-fintech-light`, `pal-wealth-emerald` |
| Healthcare / medical | **Blue + green** — healing, clean, calm | `pal-medical-blue`, `pal-wellness-teal`, `pal-care-mint` |
| Tech / SaaS | **Blue / indigo / violet** — modern, credible | `pal-saas-indigo`, `pal-saas-light`, `pal-linear-violet`, `pal-vercel-mono` |
| E-commerce / retail | Neutral base + a confident accent | `pal-clean-light`, `pal-charcoal`, any accent palette |
| Food / restaurant | **Red / orange / yellow** — appetite, warmth, urgency | `pal-appetite-red`, `pal-warm-bistro`, `pal-fresh-citrus` |
| Coffee / café | **Brown + warm reds** — warmth, the bean | `pal-espresso-cream`, `pal-mocha` |
| Luxury / premium | **Black + gold accent** (gold accents, never foundation) | `pal-luxe-black-gold`, `pal-luxe-cream`, `pal-royal-purple` |
| Beauty / cosmetics / spa | **Pink / pastels / soft neutrals + gold** | `pal-blush-rose`, `pal-spa-sage`, `pal-nude-elegant` |
| Fitness / sports | **High-energy red/orange or electric + bold contrast** | `pal-energy-volt`, `pal-power-orange`, `pal-electric-night` |
| Kids / education | **Bright, saturated, multi-hue** | `pal-playful-bright`, `pal-crayon` |
| Eco / sustainability | **Green + earthy tones** — nature, renewal | `pal-forest`, `pal-earth-organic`, `pal-solar-green` |
| Legal / professional | **Navy / dark blue (+ gold)** — credibility | `pal-law-navy-gold`, `pal-corporate-slate` |
| Real estate | **Navy or warm terracotta** | `pal-property-navy`, `pal-terracotta-home` |
| Travel | **Blue / teal (sky & sea) + warm accent** | `pal-ocean-sky`, `pal-sunset-coast` |
| Music / entertainment | **Bright saturated / neon** | `pal-neon-night`, `pal-festival` |
| Crypto / web3 | **Purple / violet** — innovation, "cyberspace" | `pal-web3-violet`, `pal-neon-cyber` |
| Gaming | **Deep black + neon (green / electric purple)** | `pal-cyberpunk`, `pal-arcade-dark` |
| Nonprofit / charity | **Warm (urgency) or cool (trust)** by mission | `pal-hope-warm`, `pal-care-mint` |
| Wedding / events | **Soft blush, cream, muted gold** | `pal-romantic-blush`, `pal-luxe-cream` |

## Mood → palette

| Mood | Reach for |
| --- | --- |
| Trustworthy / corporate | `pal-fintech-navy`, `pal-corporate-slate`, `pal-medical-blue` |
| Energetic / bold | `pal-energy-volt`, `pal-power-orange`, `pal-festival` |
| Calm / wellness | `pal-care-mint`, `pal-spa-sage`, `pal-ocean-sky` |
| Luxurious / elegant | `pal-luxe-black-gold`, `pal-royal-purple`, `pal-nude-elegant` |
| Playful / friendly | `pal-playful-bright`, `pal-crayon`, `pal-fresh-citrus` |
| Minimal / clean | `pal-clean-light`, `pal-vercel-mono`, `pal-mono-noir` |
| Warm / cozy | `pal-espresso-cream`, `pal-warm-bistro`, `pal-terracotta-home` |
| Dark / moody / techy | `pal-midnight`, `pal-cyberpunk`, `pal-ink` |
| Natural / organic | `pal-forest`, `pal-earth-organic` |
| Retro / nostalgic | `pal-vaporwave`, `pal-retro-70s` |

## Build a palette from one brand hue

When you have a single brand color and need a full system:

1. **Work in OKLCH, not HSL.** HSL isn't perceptually uniform — equal lightness looks
   wildly different across hues (HSL yellow at 50% ≈ much brighter than blue at 50%).
   In OKLCH a fixed lightness step *looks* equally bright on any hue, so ramps come out
   even. (Tailwind v4, Radix, Reasonable Colors all moved to OKLCH/LCH.)
2. **Generate a ramp** by fixing hue + chroma and stepping lightness — e.g. L from ~0.97
   (tint, for subtle bg) down to ~0.25 (shade, for text-on-light). ~10 steps. Use the
   step around L 0.55–0.62 as the solid `--accent`.
3. **Hover/active** = nudge lightness one step (don't add a separate hue). On dark UIs,
   hover usually *brightens*; on light UIs, hover *darkens*.
4. **Neutrals aren't pure gray** — tint them slightly toward the brand hue (cool grays
   lean blue, warm grays lean orange/yellow). Pure `#000`/`#fff` look harsh; use
   near-black/near-white (`#0a0a12` / `#fafafa`).
5. **Bump saturation as lightness leaves the middle** so very light/dark shades don't
   wash out to gray (Refactoring UI rule).
6. **Semantic colors are separate** from brand: green=ok, amber=warn, red=danger,
   blue=info — keep them consistent app-wide. `colors/scales.css` ships tuned ones.

## Accessibility (non-negotiable)

- **WCAG 2 AA:** body text **4.5:1**, large text (≥24px or ≥18.66px bold) **3:1**,
  UI components/icons **3:1**. AAA: **7:1** / **4.5:1**.
- **Don't fade text with `opacity`** — pick a lighter/darker *shade* that still meets
  contrast. Opacity over a busy bg fails unpredictably.
- **APCA** (the WCAG 3 draft, perceptual + polarity-aware): rough map Lc 60 ≈ 4.5:1,
  Lc 75 ≈ 7:1, Lc 45 ≈ 3:1. Use for dark-mode where WCAG 2 is over/under-strict.
- **Never encode meaning by hue alone** (color-blind users) — pair with icon/label.
- Check both themes: a palette that passes on light can fail inverted on dark.

## Pitfalls

- Pure `#000` on pure `#fff` (harsh, "vibrating"); use near-black/near-white.
- Saturated/neon text on white — fails contrast and strains eyes; reserve neon for accents on dark.
- More than ~2 brand hues + neutrals; extra hues read as chaos. Charts are the exception (use the **square** scheme).
- Accent overuse — if every button is the accent color, prioritize.
- Same gray for borders and text — borders should be lower-contrast than `--muted`.
- Light-mode palette literally inverted for dark mode — re-tune; dark surfaces need *raised* (lighter) cards, not darker.

## The vetted combo catalog

Full token sets live in `colors/palettes.css`. Names + the signature pair below
(`bg → accent`). All dark unless tagged **(light)**. Grep the CSS for the full tokens.

**Foundations** — `clean-light`(light), `paper`(light), `cool-gray`(light), `midnight`, `charcoal`, `ink`, `slate-dark`
**Finance** — `fintech-navy` (#0a0f1e→#3b82f6), `fintech-light`(light), `wealth-emerald` (#07140f→#10b981), `banking-azure`
**Health** — `medical-blue`(light), `wellness-teal`, `care-mint`(light)
**Tech/SaaS** — `saas-indigo` (#0a0a14→#6366f1), `saas-light`(light), `linear-violet`, `vercel-mono`
**Luxury** — `luxe-black-gold` (#0c0a07→#c8a14b), `luxe-cream`(light), `royal-purple`
**Beauty/spa** — `blush-rose`(light), `spa-sage`(light), `nude-elegant`(light)
**Food** — `appetite-red`, `warm-bistro`, `fresh-citrus`(light)
**Coffee** — `espresso-cream`(light), `mocha`
**Fitness** — `energy-volt` (#0a0a0a→#d4ff3f), `power-orange`, `electric-night`
**Kids/edu** — `playful-bright`(light), `crayon`(light)
**Eco** — `forest`, `earth-organic`(light), `solar-green`
**Legal/RE** — `law-navy-gold`, `corporate-slate`(light), `property-navy`, `terracotta-home`(light)
**Travel** — `ocean-sky`(light), `sunset-coast`
**Entertainment** — `neon-night`, `festival`
**Crypto/gaming** — `web3-violet`, `neon-cyber`, `cyberpunk`, `arcade-dark`
**Soft/events** — `romantic-blush`(light), `hope-warm`(light)
**Retro** — `vaporwave`, `retro-70s`
**Mono** — `mono-noir`, `mono-snow`(light)

## Sources
- Radix Colors (12-step scale roles) · Open Color · Tailwind (OKLCH 50–950) · Material 3 (tonal palettes)
- IBM Carbon (tokens) · Adobe Spectrum + Leonardo (contrast-generated) · Reasonable Colors (AA by design) · ColorBox (Lyft)
- Refactoring UI (work in HSL/OKLCH, don't fade with opacity, saturate grays)
- WCAG 2.1 contrast · APCA / WCAG 3 draft · OKLCH perceptual rationale
- Generators: coolors.co · color.adobe.com · colorhunt.co · happyhues.co · tints.dev · oklch.com
