# Awwwards 3D — inspiration reference

> Curated from the [Awwwards 3D gallery](https://www.awwwards.com/websites/3d/), captured 2026-06-04. The "study these" companion to the build-knowledge in [`3d-web.skill.md`](3d-web.skill.md), [`3d-motion.skill.md`](3d-motion.skill.md), [`shaders.skill.md`](shaders.skill.md), [`blender.skill.md`](blender.skill.md). Awwwards 3D is the high end of the craft — live, shipped, award-judged sites (not Dribbble mockups), so it's the best place to reverse-engineer *real* premium 3D-web technique.

## Studios worth following (the names that recur at the top)
These are the shops that consistently win the 3D category — track their work and case studies:

| Studio | Known for | Stack signal |
|---|---|---|
| **Lusion** (lusion.co) | Multi-time Awwwards Site/Dev of the Year; hyper-polished interactive 3D (here: *EverSwap*) | Builds on **OGL** (not three) for hand-tuned perf; see `lusionltd/WebGL-Scroll-Sync` in [`3d-motion.skill.md`](3d-motion.skill.md) |
| **Immersive Garden** (immersive-g.com) | Cinematic brand experiences (here: *Cartier Watches & Wonders 2026*) | Three.js + GSAP + custom shaders, heavy art direction |
| **Merci Michel** (merci-michel.com) | Playful, bold interactive brand sites (here: *Cdiscount – Jumping Max*) | Three.js + GSAP, strong motion |
| **OFF+BRAND** (offbrand.io) | Product/brand launches with premium WebGL (here: *Steven.com*) | R3F / Three.js + WebGPU experiments |
| **madethought** | Refined design-led studio (here: *THE RED*) | Three.js + restrained motion |
| **Andrew Woan** (andrewwoan.com) | R3F educator + playful experiments (here: *John and Patricia's Space*, *Aimee's Papercraft World*) | **React Three Fiber** — great learning source, often writes it up |
| **Studio 28K**, **AP Studio**, **Zypsy**, **Studio375**, **San Rita** | Recurring agency/portfolio 3D | Three.js / R3F + GSAP + Lenis |

## The full grab (32 sites, this snapshot)
**Brand / product showcases:** Cartier Watches & Wonders 2026 (Immersive Garden) · sen knife / Takahashikusu (STUDIO DETAILS INC.) · Steven.com (OFF+BRAND) · Streamline – Variant A · Cdiscount – Jumping Max (Merci Michel) · Podium (San Rita) · THE RED (madethought) · Mira (ADELT Agency) · Tower Garage Doors (MDX) · Ario Law Firm (Ira Gritsay)
**Fintech / crypto / tech:** EverSwap (Lusion) · Hashgraph Ventures (Glenn Catteeuw) · ZettaJoule (Zypsy) · Razorpay Sprint 26 (Razorpay Design) · loook.ai (Báchoo) · UXBERT LABS · digitalists
**Portfolios / personal:** Enzo Casalini · Bilal Gürkan Şanlı · Luke Baffait · Iris K (AP Studio) · Shaky Gotcha (Allen Tseng)
**Playful / experimental / culture:** John and Patricia's Space (Andrew Woan) · Aimee's Papercraft World (Andrew Woan) · 21 Hrs On The Moon (Studio 28K) · GLITCHWEAR Custom Studio (dan-moore) · Shining (302chanwoo) · Borealis ([ ode ]) · Creative Cruise 2026 (Merlin) · Ten Years Away (Studio375) · I•IARMONY (Tom Walter) · Handhold (zacharia-babecoff)

> Tech per-site is inferred from each studio's *known* approach, not scraped — the gallery lists names/studios, not stacks. Verify on the live site (method below) before citing.

## How award-winning 3D sites are actually built (the recurring recipe)
Reverse-engineering dozens of these, the stack is remarkably consistent — and it's the stack your skill files already cover:
1. **Renderer:** Three.js (most) or **R3F** (React shops like OFF+BRAND, Andrew Woan) — or **OGL** when a studio wants minimal abstraction + max perf (Lusion). → [`3d-web.skill.md`](3d-web.skill.md)
2. **Scroll:** **Lenis** smooth scroll + **GSAP ScrollTrigger** driving the timeline; meshes synced to DOM (r3f-scroll-rig pattern). → [`3d-motion.skill.md`](3d-motion.skill.md), [`gsap.skill.md`](gsap.skill.md)
3. **The "expensive" look:** custom **GLSL shaders** (displacement, refraction, gradient, dithering) + **postprocessing** (selective bloom, DoF, chromatic aberration, grain). → [`shaders.skill.md`](shaders.skill.md)
4. **Assets:** modelled/lit in **Blender**, **baked** lighting, exported GLB (Draco/Meshopt), loaded via gltfjsx. → [`blender.skill.md`](blender.skill.md)
5. **Materials:** glass/transmission (`MeshTransmissionMaterial`), chrome/metal with HDRI environment lighting.
6. **Perf discipline:** instancing, baked lighting, offscreen/worker rendering, `prefers-reduced-motion` + mobile fallbacks — this is what separates an *award* from a janky tech demo.
7. **Often:** a custom preloader (the 3D scene needs warm-up), and a 2D fallback.

## How to reverse-engineer any one of these (do this on the live site)
1. Open the live URL → DevTools **Network**, filter JS: look for `three.module.js` / `three.min.js` (Three), absence of it + `ogl` (OGL), `@react-three` chunks (R3F), `gsap` + `ScrollTrigger`, `lenis`, `@theatre`.
2. **Sources** tab → search shader strings (`gl_FragColor`, `varying`, `vUv`) to find inline GLSL.
3. Check for `<canvas>` + WebGL context; look at `.glb`/`.hdr`/`.ktx2` asset requests (the 3D models, environment maps, compressed textures).
4. Use the **chrome-devtools MCP** (you have it) to inspect a live award site's network + console while it runs — then map findings back to the recipe above.

## Honest lens for DS (challenge-first)
- **This is the *aspirational* end** — these sites cost weeks and a specialist. Most client briefs don't need (or can't afford) a full Lusion-grade interactive WebGL site. Match ambition to budget; for a non-interactive hero, the `premium-motion-pipeline` (Flux→Veo) is the right call, not a bespoke WebGL build.
- **Restraint reads as premium.** The most refined here (Cartier, THE RED, Steven.com) use *one* considered 3D moment + space + great type — not maximalist spectacle. That aligns with DS's premium/restrained brand far better than the crypto-neon look on Dribbble's hero tag.
- **Perf is the moat.** What makes these *award*-worthy vs. a heavy demo is the perf/accessibility discipline (point 6). That's your DELIVERY-CHECKLIST (Lighthouse ≥90, reduced-motion) — treat it as the bar, not an afterthought.

## See also
- [`3d-web.skill.md`](3d-web.skill.md) · [`3d-motion.skill.md`](3d-motion.skill.md) · [`shaders.skill.md`](shaders.skill.md) · [`blender.skill.md`](blender.skill.md) · [`claude-skills/`](claude-skills/) (deep how-to skills)
- Galleries: [Awwwards 3D](https://www.awwwards.com/websites/3d/) · [Codrops](https://tympanus.net/codrops/) (gallery **and** open MIT code) · [Godly](https://godly.website)
