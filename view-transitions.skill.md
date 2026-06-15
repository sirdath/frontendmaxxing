# view-transitions.skill.md — Animating between states & pages

Choosing how to animate a DOM change or a navigation: the native **View Transitions API**, GSAP
**Flip**, or a hand-rolled **FLIP**. Pairs with `transitions/` (the snippets) and `gsap.skill.md` (Flip).

## Pick in one table

| Situation | Use | Why |
|---|---|---|
| Animate a DOM mutation (toggle, filter, sort, tab) in one document | **View Transitions API** — `transitions/view-transitions.js` `ViewTransitions.run(swap)` | Browser snapshots before/after and cross-fades for free; zero animation code. |
| Morph a shared element (thumbnail → hero, list row → detail) | **Named view transitions** — `transitions/named-transitions.*` `NamedTransitions.morph(from, to, swap)` | Paired `view-transition-name` makes the browser tween position/size/shape between the two. |
| Cross-document / MPA navigation (real page loads) | **`@view-transition { navigation: auto }`** in CSS (both pages) | Native multi-page transitions (Chrome 126+); no JS, no SPA router. |
| You need spring physics, stagger, scrub, or pre-VT browser support | **GSAP Flip** (`gsap.skill.md`) or hand **FLIP** | VT can't do springs/stagger; Flip records first→last and tweens with full GSAP control. |
| Animate one element's layout change (it moved/resized) without a snapshot | **`ViewTransitions.flip(el, before)`** or manual FLIP | Cheapest; transforms only, no snapshot cost. |

## The shared-element morph (the high-value pattern)

Give the source and destination the **same** `view-transition-name`, mutate the DOM inside a
transition, then clear the names. `transitions/named-transitions.js` does exactly this declaratively:

```html
<img class="thumb" data-vt-morph="hero" src="t.jpg">
<!-- …later, the detail view -->
<img class="hero" data-vt-morph="hero" src="t.jpg">
<script src="transitions/view-transitions.js"></script>
<script src="transitions/named-transitions.js"></script>
<script>
  NamedTransitions.morph('.thumb', '.hero', function () { openDetailView(); });
</script>
```
It assigns a unique paired name to both elements, runs the swap through `ViewTransitions.run` (so its fallback + `data-vt-type` hooks apply), then removes the names so the page stays clean.

## SPA vs MPA

- **SPA** (you mutate the DOM): wrap every state change in `ViewTransitions.run(swap)`. Set
  `view-transition-name` only on the elements that move, and only *during* the transition (two
  elements may never share a name at rest, or the snapshot throws).
- **MPA** (real navigations): add `@view-transition { navigation: auto }` to **both** documents'
  CSS and give the persistent element the same `view-transition-name` on each page. No JS.

## Non-negotiables

1. **Graceful fallback.** `document.startViewTransition` is Chrome/Edge 111+, Safari 18+, Firefox
   recent. `view-transitions.js` runs the callback un-animated when unsupported — never gate the DOM
   change on the API.
2. **Reduced-motion.** Under `prefers-reduced-motion`, skip the morph and just swap (a cross-fade at
   most). `named-transitions.css` collapses its keyframes to an instant fade there.
3. **One name per snapshot.** Duplicate `view-transition-name`s at capture time throw — assign/clear
   them around the swap (the snippet handles this).
4. **Don't transition huge subtrees.** Name the specific shared elements, not `body`, or you snapshot
   the whole page each change.

## Files this skill governs
- `transitions/view-transitions.js` (API wrapper) · `transitions/named-transitions.css/.js` (shared-element morph)
- Adjacent: `transitions/*` (fade/curtain/morph/pro-pack), `gsap.skill.md` (Flip), `taste.skill.md` (motion restraint).
