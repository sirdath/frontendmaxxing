# text-animation.skill.md — Animating text for motion video (entrances · exits · emphasis · kinetic)

> Read this whenever the user wants **text that animates** in a video — coming in, leaving, being
> typed, scrambling into existence, jumping into shape, flying around, standing out, riding a path.
> Built for **frame-deterministic Remotion** (the [`remotion.skill.md`](remotion.skill.md) tool); the
> DOM-engine companion is [`gsap.skill.md`](gsap.skill.md). Verified June 2026.
> 50+ techniques (21 entrances · 10 exits · 13 emphasis/loops · 7 kinetic) + a 30-repo OSS table.

## Decide in three lines

| You want… | Reach for |
|---|---|
| Fade/slide/scale/blur/rotate/typewriter/scramble/stagger in a **Remotion video** | **Remotion-native** `interpolate`/`spring`/seeded `random` + a manual `.split()` map (Part 0). Don't import real-time DOM libs — they don't advance off `useCurrentFrame()`. |
| Draw-on handwriting · text-on-path · annotation underline/box | **`@remotion/paths`** `evolvePath`/`getPointAtLength`/`getTangentAtLength` (Parts 1/3/4). |
| Fast-moving text that strobes/looks cheap | **`@remotion/motion-blur`** `<Trail>` / `<CameraMotionBlur>`. |
| True 3D text / extrude | **troika-three-text** (MIT) inside `@remotion/three`. |
| Maximum prebuilt effects rendering to the **DOM/web page** (not Remotion) | **GSAP 3.13+** (now 100% free incl. SplitText/ScrambleText/DrawSVG) or **anime.js v4** / **Motion** — all MIT-or-free, all active. |

## Determinism law (applies to every recipe)

All motion derives from `useCurrentFrame()` via `interpolate()` / `spring()`. The ONLY randomness is
Remotion's **seeded** `random(seed)` (from `"remotion"`) — never `Math.random()`, `Date.now()`, CSS
`@keyframes`/`transition`/`animation`, `setTimeout`, or `IntersectionObserver`. Same seed + same
frame ⇒ identical pixel every render. Split text into chars/words/lines and drive each segment by a
per-index frame offset (the "stagger"). This is *why* DOM libraries (GSAP/Motion/anime/typed.js) can't
be used as runtime engines here — they're built on a real-time clock. Copy their math; don't run them.

---

## Part 0 — Remotion-native primitives (the toolbox every recipe uses)

| Primitive | Package | What it gives you |
|---|---|---|
| `useCurrentFrame()` | `remotion` | The only clock. Everything is `f(frame)`. |
| `interpolate(frame,[inF],[outV],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing})` | `remotion` | Map frame → any numeric prop (opacity, px, deg, blur px, font axis). |
| `spring({frame,fps,config,delay,durationInFrames})` | `remotion` | Physics overshoot/bounce; ~0→1. `config:{damping,mass,stiffness}`. |
| `random(seed)` | `remotion` | **Seeded** deterministic 0–1; seed is number OR string (e.g. `` random(`glitch-${i}-${frame}`) ``). The ONLY legal randomness. |
| `<Sequence from={n}>` | `remotion` | Time-shift children; inner `useCurrentFrame()` reads relative frame — clean per-line/word stagger + exits. |
| `makeTransform([translate(x,y),rotate(deg),scale(s)…])` (+ `translateX/Y/Z`, `rotate/3d/X/Y/Z`, `scale/3d`, `skew`, `perspective`, `matrix`) | `@remotion/animation-utils` | Compose ONE safe `transform` string from interpolated parts. |
| `interpolateStyles(frame,[inF],[styleA,styleB…])` | `@remotion/animation-utils` | Tween whole style objects (incl. colors, shadows). |
| `evolvePath(p 0–1, d)` → `{strokeDasharray,strokeDashoffset}` (+ `getLength`,`getPointAtLength`,`getTangentAtLength`,`interpolatePath`) | `@remotion/paths` | Draw-on / handwriting / text-on-path. |
| `<Trail layers lagInFrames trailOpacity>` / `<CameraMotionBlur shutterAngle samples>` | `@remotion/motion-blur` | Real motion blur for fast text (children must be absolutely positioned). |
| `loadFont` / `@remotion/google-fonts` + `staticFile` | Remotion | Load fonts (incl. variable fonts) deterministically before render. |

**Split text deterministically (no library needed):**
```js
const segs = [...text];              // chars · or text.split(' ') words · text.split('\n') lines
segs.map((s, i) => {
  const delay = i * STAGGER;         // frames; reverse direction = (n-1-i)*STAGGER
  const local = frame - delay;       // animate using `local` with spring/interpolate
});
```
`SplitType` (MIT) / `Splitting.js` (MIT) can pre-segment markup, but the manual map above is the cleanest dependency-free path for Remotion.

---

## Part 1 — ENTRANCES (text coming into existence)

| # | Technique | Effect | Deterministic Remotion recipe |
|---|---|---|---|
| E1 | Fade-in | opacity 0→1 | `interpolate(frame,[0,15],[0,1],{extrapolate:'clamp'})` |
| E2 | Directional slide / rise / drop / fly-in | enters from a side + fades | `translateY=interpolate(frame,[0,20],[40,0])` (rise) / X for slide; compose via `makeTransform`; + E1 |
| E3 | Typewriter / typing | chars appear L→R | **string-slice, NOT per-char opacity** (official rule): `text.slice(0, Math.floor(interpolate(frame,[0,dur],[0,text.length],{extrapolate:'clamp'})))` |
| E3b | Typewriter + caret | typing with `│` | append a caret span: `Math.floor(frame/15)%2 ? 1 : 0` opacity; hide after typing done |
| E4 | Character stagger (cascade) | letters pop in one-by-one | split chars; `delay=i*2`; `o=spring({frame:frame-delay,fps})`; drive opacity + translateY |
| E5 | Word stagger | words in sequence | split on spaces; stagger ~4–6f; each word in `<Sequence from={i*stagger}>` |
| E6 | Line stagger | lines cascade | split on `\n`; per-line `<Sequence>` doing rise+fade |
| E7 | Scramble / decode / matrix | random glyphs settle to text | per char: `p=interpolate(frame,[cStart,cStart+settle],[0,1])`; if `p<1` show `` random(`scr-${i}-${frame}`) `` glyph from a charset, else the real char; settle L→R. Ref: Soulwire `TextScramble`, `use-scramble` (MIT) |
| E8 | Blur-in (focus pull) | resolves blurry→sharp | `filter:blur(${interpolate(frame,[0,20],[12,0])}px)` + E1; per-char = "blurry text reveal" |
| E9 | Scale / pop / zoom-in | grows from small/0 | `scale=spring({frame,fps,config:{damping:12}})` (overshoot) or interpolate 0.6→1 |
| E10 | Mask / clip-path / wipe reveal | uncovered by a moving edge | `clipPath:inset(0 ${100-pct}% 0 0)`, `pct=interpolate(frame,[0,20],[0,100])`; L→R/T→B/diagonal; or `WebkitMaskImage` gradient position |
| E11 | Bounce / jump / spring-overshoot | drops & bounces to rest | `spring` low `damping` (~8) on translateY |
| E12 | Rotate-in / 3D flip / roll | spins/flips into place | `rotate`/`rotateX`/`rotateY` interpolated −90→0 + `perspective(800px)`; per-char = "flip cascade" |
| E13 | Elastic | springy stretch-settle | `spring` high `stiffness` low `damping`; or scaleX/scaleY out of phase (squash-stretch) |
| E14 | Wave / ripple stagger | letters rise in a sine wave | per char: `y=Math.sin((frame-i*phase)/period)*amp` gated by an entrance window |
| E15 | Draw-on (SVG handwriting) | drawn by an invisible pen | text→SVG paths (stroke font / `opentype.js` / hand-lettered); `evolvePath(interpolate(frame,[0,dur],[0,1]), d)`; multi-path = stagger each path. Ref: Vivus (MIT) |
| E16 | Particle assemble | dots fly in & form letters | sample glyph points once; particle start from `` random(`p-${i}`) ``; `x=interpolate(frame,[0,dur],[startX,targetX])` |
| E17 | Glitch-in | RGB-split/jitter → clean | 3 channel copies offset by `` random(`g-${ch}-${frame}`)*amp ``, `amp=interpolate(frame,[0,15],[8,0])` + scanline slices. Lib: `remotion-glitch-effect` |
| E18 | Per-letter "jump into shape" | letters leap from baseline | E11 spring-Y + slight rotate + scale per char with stagger |
| E19 | Variable-font weight/width morph-in | thin→bold / narrow→wide as it appears | `` fontVariationSettings:`'wght' ${interpolate(frame,[0,25],[100,900])}` `` (+`'wdth'`/`'slnt'`); load a variable font first. No library |
| E20 | Counter / odometer (numbers) | number rolls to a value | `Math.round(interpolate(frame,[0,dur],[0,target],{easing:Easing.out(Easing.cubic)}))`; or per-digit vertical 0–9 `translateY` column + `clipPath` (see `remotion-studio/src/lib/Odometer.tsx` in the video pipeline) |
| E21 | Shuffle / sort-in | letters arrive scrambled in position then slot | seeded start slot via `random`; interpolate X from start-slot→final-slot |

---

## Part 2 — EXITS (text leaving)

> Drive by a frame window near the segment end, or wrap in `<Sequence durationInFrames>` and animate vs `durationInFrames - frame`. (DOM analog: Motion `<AnimatePresence>`; in Remotion an exit is just a reverse-time interpolation.)

| # | Technique | Effect | Recipe |
|---|---|---|---|
| X1 | Fade-out | opacity 1→0 | `interpolate(frame,[end-15,end],[1,0],{extrapolate:'clamp'})` |
| X2 | Directional fly-out | slides off-screen | `translateX/Y=interpolate(frame,[end-20,end],[0,±300])` + fade; `<Trail>` if fast |
| X3 | Dissolve | grainy per-char fade | each char fades at `` end - random(`d-${i}`)*spread `` ⇒ uneven, seeded |
| X4 | Blur-out | sharpens away | `blur(${interpolate(frame,[end-15,end],[0,14])}px)` + fade |
| X5 | Scatter / explode / shatter | letters fly apart | per char angle+dist from `` random(`ex-${i}`) ``; `x=cos(a)*…`, `y=sin(a)*…`, +rotate +fade |
| X6 | Collapse | squashes to a line/point | `scaleY→0` (or scaleX) + letter-spacing→0; spring snap |
| X7 | Glitch-out | corrupts then vanishes | inverse of E17: ramp RGB-split + slice jitter UP while opacity → 0 |
| X8 | Mask-out / wipe-out | covered by a moving edge | reverse of E10: `clipPath inset` grows to hide |
| X9 | Per-letter fall away | letters drop with gravity | per char `delay=i*stagger`; `y=0.5*g*local²` + rotate drift + fade |
| X10 | Implode / vacuum | letters suck to center | interpolate X/Y toward centroid + scale→0 |

---

## Part 3 — EMPHASIS / IN-PLACE LOOPS (stand out / sustain)

> Looping functions of frame — make the period divide the segment length so it tiles seamlessly.

| # | Technique | Effect | Recipe |
|---|---|---|---|
| M1 | Variable-font weight "breathing" | weight pulses thin↔bold | `` `'wght' ${100+(Math.sin(frame/15)*0.5+0.5)*800}` ``; `wdth`/optical-size axes same way |
| M2 | Color / gradient flow | gradient sweeps through text | `linear-gradient` + `backgroundClip:'text'` + `` backgroundPosition:`${interpolate(frame%period,[0,period],[0,200])}% 0` `` |
| M3 | Scale pulse / breathe | gentle grow/shrink | `scale=1+Math.sin(frame/12)*0.05` |
| M4 | Wave / wiggle / float | letters bob continuously | per char `y=Math.sin((frame-i*offset)/period)*amp` (no entrance gate = continuous) |
| M5 | Jitter / shake | nervous vibration | `` x=(random(`jx-${frame}`)-0.5)*amp ``, `` y=(random(`jy-${frame}`)-0.5)*amp `` |
| M6 | Glitch (sustained) | periodic RGB tears | burst windows applying RGB-split + slice via `random(burstSeed+frame)`. Lib: `remotion-glitch-effect` |
| M7 | Shimmer / sheen / light-sweep | specular highlight slides across | bright skewed gradient band masked to text; `backgroundPosition` via `frame%period` (same `backgroundClip:text` trick as M2) |
| M8 | Highlight: underline/circle/box/strike | hand-drawn marker appears | build the annotation as an SVG path and `evolvePath(interpolate(frame,[start,end],[0,1]), d)`. Use **rough-notation** (MIT) to GENERATE the hand-drawn path; drive timing with frame, not its `show()` |
| M9 | Text-on-path | text rides a curve | `@remotion/paths` `getPointAtLength` + `getTangentAtLength`; place char at `t=i/n`, `rotate(tangentAngle)`; animate `t` by frame |
| M10 | 3D extrude / rotate | spinning 3D block text | stack N `translateZ` shadow copies for extrusion; `rotateY=frame/period*360` + `perspective`. Lib: **troika-three-text** for true SDF 3D in a Three canvas |
| M11 | Outline ↔ fill | stroke-only morphs to filled | interpolate `WebkitTextStrokeWidth` and `WebkitTextFillColor` alpha |
| M12 | Letter-spacing / tracking breathe | spacing expands/contracts | `letterSpacing=interpolate(Math.sin(frame/20),[-1,1],[0,8])px` |
| M13 | Per-word Y oscillation | words hop in a Mexican wave | per word `y=-Math.abs(Math.sin((frame-i*8)/period))*amp` |

---

## Part 4 — KINETIC TYPOGRAPHY

| # | Technique | Effect | Recipe |
|---|---|---|---|
| K1 | Physics-driven letters | fall/bounce/collide with gravity | deterministic fixed-timestep sim seeded once, advanced by `frame` (no real-time, no `Math.random`); bake keyframes if heavy |
| K2 | Magnetic / cursor-follow | letters drawn toward a point | no live cursor in video → animate a SCRIPTED attractor `P(frame)`; each char eases toward it (distance falloff) |
| K3 | Letter collision | letters bump & rebound | same fixed-timestep solver as K1 with pairwise rebound, or pre-baked keyframes |
| K4 | Text following a path + tangent rotation | letters travel a curve, facing it | `@remotion/paths`: `t=(i/n + frame/travelPeriod)%1`; pos `getPointAtLength`, angle `getTangentAtLength`; `makeTransform([translate(x,y),rotate(angle)])` |
| K5 | Speech / audio-synced | words pop on the beat/phoneme | transcript word-timings JSON (frame stamps) trigger each word's entrance; amplitude via `@remotion/media-utils` `useAudioData`+`visualizeAudio` |
| K6 | Beat-synced scale punch | text snaps bigger on each beat | beat-frames array; `scale=1+nearestBeatFalloff(frame)`; spring back between beats |
| K7 | Kinetic line/word swaps | one phrase replaces another | stagger `<Sequence>`s: outgoing does X9/X1, incoming does E2/E4 overlapping. DOM analog: `react-text-transition` |

---

## Part 5 — OSS repos (verified June 2026)

Legend: ✅ permissive & maintained · ⚠️ caution (license/staleness) · ☠️ dead/abandoned.

**Splitters & engines** — Splitting.js ✅MIT (`shshaw/Splitting`, split + CSS vars + var-font helper) · SplitType ✅MIT (`lukePeavey/SplitType`, free GSAP-SplitText stand-in) · Lettering.js ⚠️MIT ☠️jQuery (`davatron5000/Lettering.js`) · **anime.js v4** ✅MIT (`juliangarnier/anime`, v4.5 2026-06, ~70k★, very active — ESM `import {animate}`) · **Motion** ex-framer-motion ✅MIT (`motiondivision/motion`, v12, `<AnimatePresence>`; **`splitText` is paid Motion+**) · KUTE.js ✅MIT (`thednp/kute.js`, SVG morph/path) · theatre.js ⚠️core Apache-2.0/studio AGPL-3.0, dev stalled.

**Typewriter** — react-type-animation ✅MIT (`maxeth/react-type-animation`) · **typed.js ⚠️GPL-3.0 since v3.0.0 (Jan 2026)** — was MIT; pin `@2.x` for MIT · **TypeIt ⚠️GPL-3.0** (`alexmacarthur/typeit`) · typeit-react ☠️archived.

**Scramble/decode** — **use-scramble** ✅MIT (`tol-is/use-scramble`, best modern React pick) · baffle.js ⚠️MIT ☠️2017 · react-scramble ☠️stale · Soulwire `TextScramble` (CodePen, attribute author — the ~40-line ancestor).

**Draw-on / annotation / 3D** — **Vivus** ✅MIT (`maxwellito/vivus`, SVG draw, zero-dep) · **Rough Notation** ✅MIT (`rough-stuff/rough-notation`, underline/box/circle/highlight/strike) + react-rough-notation ✅MIT · Blotter.js ⚠️MIT ☠️2020 (GLSL text, needs three+underscore) · Textillate.js ⚠️MIT ☠️jQuery · **troika-three-text** ✅MIT (`protectwise/troika`, SDF 3D text, active).

**GSAP (the big one)** — `greensock/GSAP` ✅ **now 100% FREE incl. ALL former Club plugins as of v3.13 (May 2025)** after Webflow's Oct-2024 acquisition. **SplitText** (rewritten, 50% smaller), ScrambleText, DrawSVG, MorphSVG, Flip all free, commercial use included. Covers essentially every technique above — but it's a real-time engine, so in Remotion use it as REFERENCE only (or generate path geometry at build time).

**Remotion-native** — `@remotion/animation-utils` (`makeTransform`,`interpolateStyles`), `@remotion/paths` (`evolvePath`,`getPointAtLength`,`getTangentAtLength`), `@remotion/motion-blur` (`<Trail>`,`<CameraMotionBlur>`) — all under the **Remotion License** (free for individuals/≤3-person; Company License otherwise — NOT MIT despite some package.json fields). MIT helpers: remotion-animated ✅ (`stefanwittwer/remotion-animated`, declarative chains), remotion-animate-text ⚠️no SPDX (`pskd73/...`), react-text-transition ✅MIT, remotion-glitch-effect (check LICENSE).

---

## Part 6 — Which to use for video (recommendation map)

**Default for Remotion: Remotion-native `interpolate`/`spring`/seeded `random` + a manual `.split()` map.** DOM libs run on a real-time clock and break frame-determinism — use them only as reference, or run once at build time for static geometry.

| Need | Best for Remotion video |
|---|---|
| Fade/slide/scale/blur/rotate entrances & exits (E1–E13, X1–X10) | Remotion-native `interpolate`/`spring` + `makeTransform`; optional `remotion-animated` for declarative chains |
| Char/word/line splitting | manual `[...text]`/`.split()` map (zero-dep); SplitType/Splitting.js only for pre-built markup |
| Typewriter (E3/E3b) | Remotion string-slicing (never per-char opacity). **Avoid typed.js/TypeIt (GPL-3.0)**; `react-type-animation` (MIT) if a component is required |
| Scramble/decode (E7) | seeded `random(seed)` rolling a charset; ref use-scramble / Soulwire |
| Draw-on / handwriting (E15) | `@remotion/paths` `evolvePath`; ref Vivus |
| Annotation underline/box/circle (M8) | generate path with rough-notation, animate with `evolvePath` |
| Glitch (E17/M6/X7) | `remotion-glitch-effect` or seeded RGB-split |
| Fast-moving text blur (E2/X2) | `@remotion/motion-blur` `<Trail>` / `<CameraMotionBlur>` |
| Text-on-path / tangent (K4/M9) | `@remotion/paths` `getPointAtLength`+`getTangentAtLength` |
| Variable-font morph/breathe (E19/M1) | native `fontVariationSettings` interpolation; load var font via `@remotion/google-fonts` |
| Counter / odometer (E20) | native `Math.round(interpolate(...))` or per-digit `translateY` column |
| True 3D text / extrude (M10) | troika-three-text inside `@remotion/three` |
| Audio/speech-synced (K5/K6) | `@remotion/media-utils` + transcript word-timing JSON |
| Physics letters/collision (K1/K3) | hand-rolled fixed-timestep sim, seeded once, advanced by `frame` |
| Max prebuilt effects rendering to the DOM (not Remotion) | GSAP 3.13+ (free) / anime.js v4 / Motion |

### Licence/maintenance flags to remember
- ☠️ **typed.js v3+ and TypeIt are GPL-3.0** (commercial = paid). Stay native, use `react-type-animation` (MIT), or pin `typed.js@2.x`.
- ✅ **GSAP is now 100% free (v3.13, May 2025)** — biggest landscape change; SplitText/ScrambleText/DrawSVG/MorphSVG no longer gated.
- ⚠️ **Remotion's own packages use the custom Remotion License** (free indie / paid >3-person), not OSI-MIT.
- ⚠️ **Motion `splitText` is paid (Motion+)**; the free MIT core doesn't include it.
- ☠️ Abandoned but functional: baffle.js, Blotter.js, Lettering.js, Textillate.js, react-scramble, typeit-react.
- ✅ Safe & active (2025–26): anime.js v4, Motion, KUTE.js, troika-three-text, GSAP, the `@remotion/*` packages.

---

## Files this skill governs

A reference catalog (no snippet files of its own yet). Cross-links:
- [`remotion.skill.md`](remotion.skill.md) — the Remotion tool itself (install, API, FFmpeg).
- [`gsap.skill.md`](gsap.skill.md) — GSAP as a DOM-page animation engine (now fully free).
- [`motion-canvas.skill.md`](motion-canvas.skill.md) · [`3d-motion.skill.md`](3d-motion.skill.md) — sibling motion tools.
- Live implementation reference: the Design Book video pipeline (`designbook/remotion-studio/src/lib/`)
  already ships `KineticText` (E4/E5 + M4), `Typewriter` (E3/E3b), `Odometer` (E20), `anim.ts`
  (springs, `jiggle` follow-through, `exitDrift`), and `@remotion/motion-blur` wired globally.
