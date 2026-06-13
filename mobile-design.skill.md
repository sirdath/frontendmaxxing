# mobile-design.skill.md — native-quality app UI: screen flows, HIG/Material, anti-slop

This skill answers **"how do I design an app that feels native, not like a website
in a phone frame?"** — the mobile peer to `structure.skill.md` (web page skeletons).
Where that skill builds ONE scrolling page from `.s-*` sections, this builds a
**FLOW of discrete screens** from the `.scr-*` shell, connected by real navigation.
It obeys the same anti-slop law as `art-direction.skill.md` and reuses the same
taste tokens (palette, font, motion) as `taste.skill.md`.

> Pair: **`structure/app-shell.css`** (the `.scr-*` primitives) + the **`mobile/`**
> folder (57 files: `ios-*` chrome + `app-*` screens + sheets/stacks). The shell
> dogfoods the taste tokens, so a `pal-*` palette + `data-aesthetic` re-skins every
> screen the same way it re-skins a web page. Load order is the same as web:
> `structure/structure.css` (tokens) → `colors/palettes.css` → `taste/*.css` →
> `structure/app-shell.css`. A single `.scr` renders exact-size at 390×844; an
> `.app-flow` lays several phones in a row so you can SEE the flow.

## The core mental model — a flow, not a page

A website is a scroll. An app is a **graph of screens you move between.** Design the
*graph first*, then each screen. Three connection types, three different shells:

| Connection | When | Shell / vault part | Gesture intent |
|---|---|---|---|
| **Tab bar** — peer sections, always reachable | 3–5 co-equal top destinations (Home / Search / Profile) | `.scr-tabbar` + `.scr-tab` · `mobile/tab-bar.css` · `mobile/ios-tab-bar.css` | tap; never a back relationship |
| **Nav stack** — drill-down into detail | list → item → sub-item; a clear hierarchy with "back" | `.scr-nav` (inline) / `.scr-nav--large` (root) · `mobile/ios-nav-bar.css` | **swipe-back** from left edge |
| **Modal / sheet** — a focused, dismissable task | compose, filter, confirm, pick — interrupts the flow, returns you exactly where you were | `.scr-sheet` · `mobile/bottom-sheet.css` · `mobile/ios-modal-sheet.css` · `mobile/ios-action-sheet.css` | **drag-down to dismiss** |

Rules of the graph:
- **Tabs are roots, not steps.** Each tab owns its own nav stack. Switching tabs
  never means "back."
- **Drill-down deepens; modals interrupt.** A detail screen pushes onto the stack
  (back arrow appears). A task that must complete-or-cancel is a sheet/modal.
- **One primary action per screen.** It lives in the bottom third (CTA, FAB, or
  tab bar) — see thumb-reach below. If a screen has two equal CTAs, it's two screens.
- **Every screen earns its place.** If a screen only shows one fact, fold it into
  the previous one. Apps die from too many taps, not too few screens.

## Screen-flow archetypes by genre

Each lists the **ordered screens** (the graph), the **`.scr-*` shell** per screen,
and the **`mobile/` parts** that fill it. `→ stack` = push (back appears);
`⇢ sheet` = modal/sheet; `⇆ tab` = a tab-bar peer.

### 1 · Onboarding / auth  (the first-run flow)
Goal: sell the value *before* asking for anything; ask permissions *in context*, late.
```
Welcome (logo, one line, Get started)     → .scr (centered) · mobile/app-onboarding-welcome.css · ios-onboarding.css
  → stack  Value props (3 swipeable cards) → mobile/app-onboarding-value-props.css (.apvprop) + ios paged dots
  → stack  Pick goals / personalize        → .scr-chips / .scr-list · mobile/app-onboarding-pick-goals.css
  → stack  Sign up (email or SSO)           → .scr-field/.scr-input + .scr-btn--block · mobile/app-signup.css / app-login.css
  ⇢ sheet  Magic link / verify              → mobile/app-magic-link-sent.css · app-email-verify.css
  → stack  Name / age (one field per screen)→ mobile/app-name-input.css · app-age-picker.css · ios-picker.css
  ⇢ sheet  Permission prompt (in context)   → mobile/app-permission-prompt.css  ← ask only when the feature needs it
  ⇢ sheet  Paywall / trial (after value)    → mobile/app-paywall.css (.appaywall) · app-subscription-tiers.css · app-trial-locked.css
  → (done) Land on the Home tab
```
Law: **value before friction.** Never open on a sign-up wall. One question per
screen, big progress, an always-visible "Skip" for optional steps. Permission
prompts come *at the moment of need*, never in a batch up front.

### 2 · Social / feed
Goal: an endless, scannable feed; fast drill into detail and profile.
```
Feed (tab root, large title)              → .scr-nav--large + .scr-list/.scr-card · pull-to-refresh intent
  ⇢ sheet  Compose / new post              → .scr-sheet + .scr-field · mobile/ios-modal-sheet.css
  → stack  Post detail (media + thread)     → .scr-nav (inline back) + .scr-media + comments list
  → stack  Profile (header + grid/list)     → .scr-hero + .scr-avatar + .scr-stats + .scr-segment
⇆ tab  Search/Explore                      → mobile/ios-search-bar.css + grid
⇆ tab  Activity / notifications            → .scr-list · mobile/ios-notification-banner.css
⇆ tab  Profile (own)                        → .scr-stats + .scr-segment + content grid
  long-press a post ⇢ ios-context-menu.css (.ios-cmenu) · share ⇢ ios-activity-sheet.css
```
Swipe-card variant (dating/discovery): `mobile/swipe-stack.css` (`.swst`) as the feed.

### 3 · Commerce / shopping
Goal: storefront → desire → confidence → buy, with the buy action always reachable.
```
Storefront (tab root, collections)        → .scr-nav--large + .scr-chips (categories) + .scr-card grid
  → stack  Product detail                   → .scr-media gallery + price + .scr-cta (sticky Add) ← CTA pinned bottom
  ⇢ sheet  Size / variant / quantity        → mobile/ios-action-sheet.css · bottom-sheet.css
  → stack  Cart                              → .scr-list (line items) + .scr-stats (subtotal) + .scr-btn--block
  → stack  Checkout (address → pay → review) → .scr-field steps · mobile/app-payment-card.css
  ⇢ sheet  Apple/Google Pay confirm          → .scr-sheet
  → stack  Receipt / order placed            → mobile/app-receipt.css · app-billing-history.css
⇆ tab  Search · Wishlist · Bag(badge) · Account
```
Law: **the Buy CTA never scrolls away.** Use `.scr-cta` (sticky region above the
home indicator) on the product and cart screens. Put reviews/returns confidence
*right before* the buy.

### 4 · Health / fitness
Goal: a glanceable dashboard, then drill into an activity, then the stats behind it.
```
Today (tab root, rings/streak)            → .scr-nav--large + .scr-stats + .scr-card (today's plan)
  → stack  Activity / workout detail        → .scr-hero + .scr-stat(s) + .scr-list (sets/splits)
  ⇢ sheet  Start / log workout               → .scr-sheet + .scr-segment + .scr-btn--block
  → stack  Trends / stats (charts)           → .scr-segment (D/W/M) + chart + .scr-stats
⇆ tab  History  ·  Programs  ·  Profile
  active session ⇢ live indicator on mobile/ios-dynamic-island.css (.ios-island)
```
Law: the dashboard is **glance-first** — big numbers, one ring, today's one action.
Detail and history are where density is allowed.

### 5 · Finance / banking
Goal: balance at a glance → transaction history → send / transaction detail. Trust + clarity.
```
Balance (tab root, big number + cards)    → .scr-nav--large + .scr-stat (balance) + .scr-card (account tiles)
  → stack  Transactions (grouped by day)    → mobile/ios-list-grouped.css (.ios-list/.ios-group) — date sections
  → stack  Transaction detail               → .scr-hero (amount) + .scr-list (merchant/date/category)
  ⇢ sheet  Send / pay (amount keypad)        → .scr-sheet + numeric field + .scr-btn--block
  ⇢ sheet  PIN / biometric confirm           → mobile/app-pin-create.css · ios-alert.css (.ios-alert)
⇆ tab  Cards  ·  Activity  ·  Settings
```
Law: **money needs confirmation + reversibility cues.** Destructive/irreversible
actions go through an `ios-alert` or sheet; show the amount large before confirm.

### 6 · Productivity (list / tasks / notes)
Goal: a list you act on, an item to edit, settings out of the way.
```
List (tab root, items)                    → .scr-nav--large + .scr-list/.scr-row + .scr-fab (add) ← FAB bottom-right
  ⇢ sheet  Quick add                         → .scr-sheet + .scr-input + .scr-btn--block
  → stack  Item detail / editor             → .scr-field + .scr-segment + .scr-list (subtasks)
  → stack  Settings (grouped)                → mobile/ios-list-grouped.css — sectioned rows + chevrons
  ⇢ sheet  Filter / sort                      → mobile/ios-action-sheet.css
  swipe a row ⇢ reveal actions · long-press ⇢ ios-context-menu.css
  empty state ⇢ mobile/app-state-screens.css (.apstate-empty)
```
Law: the FAB or a single nav `+` is the one primary action. Settings is a grouped
list (`ios-list-grouped`), never a wall of toggles on the main screen.

### 7 · Media / player
Goal: browse → now-playing, with a persistent mini-player above the tab bar.
```
Library / browse (tab root)               → .scr-nav--large + .scr-card grid (art) + .scr-list
  → stack  Album / playlist / show          → .scr-hero (art) + .scr-list (tracks) + .scr-btn (Play)
  ⇢ sheet  Now playing (full)                → .scr-sheet (drag down to minimize) + .scr-media + scrubber
  mini-player                                → a slim bar pinned above .scr-tabbar (persists across tabs)
  ⇢ sheet  Queue / lyrics / output            → bottom-sheet.css
⇆ tab  Browse · Search · Library
  live playback ⇢ mobile/ios-dynamic-island.css
```
Law: the mini-player is the signature — it persists across every tab and expands
into the full now-playing sheet. That continuity *is* the native feel.

> No exact archetype? Classify by the **primary verb**: *try it* → onboarding ·
> *scroll & react* → feed · *buy* → commerce · *track* → health/finance ·
> *manage a list* → productivity · *play* → media. Take that graph, re-theme the
> tokens.

## iOS HIG + Android Material essentials (what protects design quality)

These are the rules that separate a real app from a styled webpage. The `.scr-*`
shell already bakes most in — these tell you *why* and *when they diverge*.

| Concern | iOS (HIG) | Android (Material) | How the shell handles it |
|---|---|---|---|
| **Tap target** | ≥ 44 × 44 pt | ≥ 48 × 48 dp | `--scr-tap: 48px`; rows ≥52px, buttons ≥50px, nav/tab hit areas ≥44px |
| **Safe areas** | clear notch/Dynamic Island top, home-indicator bottom | status bar + gesture nav | `--scr-safe-top: 47px` / `--scr-safe-bottom: 34px`; `.scr-body`, `.scr-cta`, `.scr-tabbar` pad for them automatically |
| **Primary nav** | tab bar 3–5 items, bottom | bottom nav 3–5, or nav drawer | `.scr-tabbar` + `.scr-tab` (3–5; the 5-item ceiling is real) |
| **Title style** | **large title** at a stack root, **inline** when drilled | top app bar (CenterAligned/Small) | `.scr-nav--large` (root) vs `.scr-nav` (inline + back) |
| **Back affordance** | chevron + swipe-back from left edge | up-arrow + system back | put a `.scr-nav-left` chevron on every pushed screen; note swipe-back as intent |
| **Primary action** | bottom CTA / tab bar; **never** a top corner | FAB (bottom-right) or bottom bar | `.scr-cta` (sticky) · `.scr-fab` (bottom-right, above safe area) |
| **Type** | Dynamic Type; body ~17pt; don't go below ~13pt | sp units, scalable | shell body is 17px; `.scr-row-sub` 13px is the floor — never tiny caption text as UI |

**Thumb-reach (the load-bearing rule):** the top corners are the *hardest* area to
reach one-handed. So: **primary actions live in the bottom third** — the `.scr-cta`,
the `.scr-fab`, or the `.scr-tabbar`. The top nav holds *navigation and secondary
icons only* (back, a single trailing action). A "Buy" or "Continue" button in the
top-right is the #1 sign nobody designed this for a hand.

**Gestures — note them as design intent** (the static shell implies them):
- **Swipe-back** from the left edge on every pushed screen (so back is never required).
- **Pull-to-refresh** at the top of a feed/list root.
- **Drag-to-dismiss** on every `.scr-sheet` (the `::before` grabber handle signals it).
- **Swipe-row actions** + **long-press → context menu** (`ios-context-menu.css`).

**Platform divergence — diverge here, stay neutral elsewhere:**
- **Diverge:** primary action placement (iOS bottom CTA vs Android FAB), back glyph
  (chevron vs up-arrow), sheet style (iOS card sheet vs Material bottom sheet),
  switch/control look. The `ios-*` parts are explicitly iOS; for Material, keep the
  `.scr-*` shell and swap the FAB-forward action model.
- **Stay neutral** (one design serves both): the screen graph, safe areas, tap-target
  minimums, thumb-reach, list/card content, the palette + type from taste tokens.
- **When unsure, design iOS-first** (the vault's `ios-*` set is complete) and note
  the Material delta, rather than building a muddy hybrid that's neither.

## The anti-AI-slop law, applied to mobile

Same law as `art-direction.skill.md` — *too many gradients + no images reads as
generated; real imagery + custom touches read as native.* On mobile:

1. **Real imagery & iconography, not empty card grids.** A feed of grey `.scr-card`
   rectangles is a wireframe. Fill `.scr-media`, avatars, and album/product art with
   real photos (`local-image-gen.skill.md`) and a *consistent* icon set in
   `.scr-row-ico` / `.scr-tab-ico` — not mismatched emoji.
2. **Gradient budget: ONE.** A single moment — a hero header wash *or* one accent
   CTA — never a gradient on every card. (`--accent` → `--accent-2` once.)
3. **One motion signature.** Pick ONE and repeat it: a spring sheet present
   (`.scr-sheet` rising), a staggered list-in on the feed, or the media mini-player
   morph. Not motion sprinkled on everything. Reduced-motion guarded (the shell guards
   `.scr-fab`/`.scr-btn` already).
4. **One bespoke touch no template has:** a live Dynamic Island state
   (`ios-dynamic-island.css`), a branded empty-state illustration
   (`app-state-screens.css` `.apstate-art`), a custom chart, a signature transition.

**Mobile-specific tells of a FAKE app** (catch these before shipping):
- **Hover affordances** — `:hover` color shifts, tooltips, hover-reveal menus. Touch
  has no hover. Use `:active` press states (`scale(0.98)`) like the shell does.
- **Desktop density** — 8 nav items, multi-column dashboards, 13px body text as the
  main reading size. Mobile is one column, generous, 17px body.
- **Tiny tap targets** — 24px icons with no padding, link-sized text buttons. Below
  44/48 = unusable; the shell's `--scr-tap` is the floor.
- **Content under the notch / over the home indicator** — ignoring safe areas. Always
  go through `.scr-body` / `.scr-cta`, never absolute-position content into the bars.
- **Fake navigation** — a hamburger drawer as the *primary* nav on iOS, a top "menu"
  bar, web breadcrumbs, or a back button that's actually a tab switch. Use a real
  pattern: tab bar (peers) / nav stack (drill) / sheet (task).
- **A scrolling web page in a phone frame** — one long page with anchor links instead
  of discrete screens. If it doesn't have a graph, it's not an app.

## Done-checklist for a screen flow

- [ ] **Graph is real** — tabs are peers, drill-downs push (back appears), tasks are
      sheets. No screen is a dead end or a one-fact filler.
- [ ] **Tap targets** ≥ 44pt (iOS) / 48dp (Android) on every interactive element.
- [ ] **Safe areas** respected — nothing under the status bar/notch or over the home
      indicator; content flows through `.scr-body`/`.scr-cta`/`.scr-tabbar`.
- [ ] **Thumb-reach** — every screen's primary action is in the bottom third
      (`.scr-cta` / `.scr-fab` / `.scr-tabbar`), never a top corner.
- [ ] **Real nav pattern** — large-title at roots, inline + back when drilled,
      tab bar 3–5 items, swipe-back implied.
- [ ] **Imagery present** — `.scr-media`/avatars/art carry real photos; one coherent
      icon set; no grids of empty cards.
- [ ] **One gradient moment, one motion signature, one bespoke touch** — and motion
      is reduced-motion-guarded.
- [ ] **Permissions/paywall come after value**, never on the first screen.
- [ ] **Platform stance chosen** (iOS-first or Material) and consistent across screens.

## Cross-refs

`structure/app-shell.css` (the `.scr-*` primitives — every class here is real) ·
`structure.skill.md` (the web peer: `.s-*` page skeletons) ·
`taste.skill.md` (palette/font/motion tokens the shell dogfoods — pick a
`data-aesthetic` + `pal-*`) · `art-direction.skill.md` (the anti-slop law this
inherits) · `color.skill.md` (the `pal-*` palettes) ·
`local-image-gen.skill.md` (the real photos that defeat slop) ·
`mobile/` — chrome: `ios-status-bar` `ios-nav-bar` `ios-tab-bar` `tab-bar`
`ios-search-bar` `ios-segmented-control` `ios-picker` `ios-list-grouped`
`ios-home-screen` `ios-dynamic-island` `ios-notification-banner` `iphone-frame`;
overlays: `bottom-sheet` `ios-modal-sheet` `ios-action-sheet` `ios-activity-sheet`
`ios-alert` `ios-context-menu` `swipe-stack`; screens: `app-onboarding-*`
`app-signup`/`app-login`/`app-magic-link-sent`/`app-email-verify` `app-name-input`
`app-age-picker` `app-permission-prompt` `app-paywall`/`app-subscription-tiers`/
`app-trial-locked` `app-payment-card`/`app-receipt`/`app-billing-history`
`app-pin-create` `app-state-screens` `app-rating-prompt` `app-logout-confirm`.
