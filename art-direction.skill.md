# art-direction.skill.md — the orchestrator: what makes a page feel CUSTOM-MADE

This skill answers **"which extras does THIS site need?"** — the layer above
`taste.skill.md` (tokens/cohesion) and `structure.skill.md` (sections). Taste
keeps a page coherent; art direction makes it feel **hand-crafted**. Read this
when building any complete site, before writing the hero.

## The law (owner's words, encode it in everything)

> People decide a website is AI-generated when it has **too many gradients and
> no images**. Quality images, animations, and custom touches make it read as
> sleek and custom-made.

Operationally:
1. **Every site ships with real imagery** — photographs (generate locally:
   `local-image-gen.skill.md`, or `book_generate_image` in Design Book),
   illustrations (`svg/illustrations.js`), or a deliberate 3D/video moment.
   Empty `s-card` grids of text are a wireframe, not a deliverable.
2. **Gradient budget: ONE.** A single considered gradient moment (hero glow OR
   one accent band) — never section after section of them.
3. **At least one motion signature** — something that moves with intent
   (scroll reveal, hover choreography, hero entrance), not decoration sprinkled
   everywhere.
4. **One bespoke touch no template has** — a drawn SVG, a branded player/widget
   mock, a custom diagram, an interactive flourish. This is what "custom" means.

## The decision matrix — imagery strategy by aesthetic × genre

| Aesthetic | Default imagery | Motion plan | Bespoke-touch ideas |
|---|---|---|---|
| **minimal** | 1 hero photo (lots of negative space) or none + strong type | tasteful scroll reveals (`scroll/`), 200ms hovers | an animated stat, a precise diagram |
| **editorial** | photography-led: hero + 1 per major section, warm/printed grade | slow reveals, no parallax circus | drop caps, pull quotes, custom rules |
| **energetic** | bold product shots, big crops | GSAP scroll choreography (`gsap.skill.md`), staggered grids (`animations/stagger.js`) | marquee (`components/marquee.css`), kinetic type |
| **luxury** | full-bleed hero photograph, dark grade, few but perfect | slow glide (480ms), subtle parallax, glare-card | serif numerals, gold-line dividers, `effects/luxe-hover` |
| **playful** | illustrations > photos (`svg/illustrations.js`), bright props | springy entrances (`animations/spring.js`), micro-interactions (`micro/`) | mascot SVG, confetti on CTA (`feedback/confetti.js`) |
| **technical** | UI screenshots in `components/browser-chrome.css`, diagrams, terminal blocks | near-none; typed-text or terminal cursor only | ASCII banner (`typography/ascii-banner.js`), API snippet with copy button |

Genre overrides: **ecommerce/restaurant/wellness → photography is mandatory**
(products, food, spaces). **dev-tool/SaaS → product UI is the imagery** (real
screenshots in browser chrome beat stock photos). **portfolio → the work IS
the imagery.**

## Photographic prompt recipes (local gen)

Build prompts as: **subject + setting/surface + light + lens/style + palette
words that match the page tokens.** Always name the palette mood so the photo
sits in the design instead of on top of it.

- *editorial-warm*: "…, soft morning window light, shallow depth of field,
  editorial food photography, warm cream and espresso tones"
- *luxury-dark*: "…, dramatic low-key lighting, black background, single warm
  rim light, high-end product photography"
- *minimal-light*: "…, bright diffused daylight, white seamless background,
  generous negative space, catalog photography"
- *tech-ambient*: "…, dark desk scene, screen glow, cool blue ambient light,
  cinematic depth"
Sizes: hero 1280×832 · product square 1024×1024 · tall/editorial 832×1216.
Generate 2 candidates with different seeds when the hero matters; view both.

## Brand play — the signature move for logo-led brands (ASK FIRST)

For tech-y/brand-forward companies the highest-value bespoke touch is playing
with **their logo**: a 3D render moment (`3d/` + `3d-web.skill.md`), an
animated logo build (SVG stroke-draw via `svg/`, or GSAP timeline), logo-mark
pattern walls, or a short logo motion piece (`local-video-3d-gen.skill.md` /
`remotion.skill.md`).

**Protocol — never assume, always offer:**
1. Detect the opportunity (brand with a distinctive mark, tech audience).
2. **Ask the user**: "Want a logo moment — 3D render / animated build / pattern
   wall? If yes I need the ingredients: the logo as SVG (or let me redraw it),
   brand hex codes, and any motion feel you like."
3. If no SVG exists, offer to draw a faithful vector version first and show it
   for approval before animating.
4. Prototype 2 cheap variants (e.g. stroke-draw vs 3D tilt) and show both
   before investing in the expensive one (video render).

## Checklist before calling a page done

- [ ] ≥1 real image or deliberate illustration in the hero region
- [ ] gradient count ≤ 1 · accent hue count ≤ 2
- [ ] one motion signature implemented and reduced-motion-guarded
- [ ] one bespoke touch a template couldn't have
- [ ] product/feature areas show *things* (shots, screenshots, illustrations) — not text-only cards
- [ ] verified visually (Design Book: `book_view`) — facts first (`book_inspect`), taste judgment second

## Cross-refs

`taste.skill.md` (tokens/anti-slop) · `structure.skill.md` (sections) ·
`local-image-gen.skill.md` (photos) · `gsap.skill.md` + `animations/` (motion) ·
`svg/illustrations.js` (scenes) · `3d-motion.skill.md` (logo 3D/video decisions) ·
`asset-libraries.md` (licensed external assets)
