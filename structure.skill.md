# structure.skill.md — Read this first for *page architecture*

This skill answers the question **"what goes on the page and in what order?"** —
the layer above individual components. Where `gradients.skill.md` decides color
and `gsap.skill.md` decides motion, this decides **skeleton**: which sections a
site needs, their sequence, pacing, and how to connect them.

> Pair: the **`structure/`** folder. `structure.css` is the backbone (tokens +
> section rhythm + nav/hero/grid/split/footer shells). `section-transitions.css`
> connects sections (wave/diagonal/curve…). `section-frames.css` frames a block.
> Ten full openable reference pages live there — open them to *see* the
> architecture: `saas.html`, `agency.html`, `restaurant.html`, `ecommerce.html`,
> `shop-store.html` (a complete store wiring the e-shop component kit),
> **plus `templates/atelier/`** — a complete prebuilt luxury clothing webshop
> (35-product catalogue, 4 product-page layouts, Store Studio admin) to copy
> wholesale as a starting point (see `templates/README.md`),
> `dashboard.html` (an analytics/admin app built from `dashboard-widgets` +
> a color palette), and the **local-business** set: `legal.html`, `cleaning.html`,
> `gym.html`, `coffee.html`.

## How to use this skill

1. **Identify the genre** (or read the reference the user gave). Map it to one of
   the archetypes below.
2. **Take the section sequence** for that archetype as your skeleton.
3. **Fill each section** by composing existing vault snippets (this file names the
   best ones per slot — grep `INDEX.md` to confirm the API before using).
4. **Pace it**: alternate surfaces (`.s-section` ↔ `.s-section--alt`), insert a
   `section-transitions.css` shape only where a *mood change* happens (hero→proof,
   proof→pricing), not between every block.
5. **Open the matching `structure/*.html`** to copy a working arrangement.

## Universal structure principles (apply to every genre)

- **One job per section.** If a section has two messages, split it.
- **Above the fold = WHO + WHAT + ACTION.** Within the first screen: who you are,
  what you offer, one primary CTA. Everything else is below.
- **F-pattern for text-led pages, Z-pattern for visual/landing pages.** Put the
  CTA where the eye lands at the end of the scan.
- **Rhythm beats decoration.** Consistent vertical spacing (`--section-y`) and a
  max-width container do more for "looks structured" than any effect.
- **Alternate surface, don't alternate layout.** Flip background
  (`--bg` ↔ `--bg-alt`) to signal a new section; keep the container + rhythm
  identical so it feels intentional, not random.
- **3 / 4 / 6 rule for grids.** Features in 3s, logos in 4–6s, pricing in 3s.
  Odd counts center a hero card; even counts read as a catalog.
- **Transitions are punctuation.** A wave/diagonal between two sections is a comma.
  Use 1–3 per page, at genuine topic shifts. Overuse = noise.
- **End every page with a CTA + footer.** Never let a page just stop.

## The archetypes

Each lists the **section sequence** (top→bottom) and the **vault snippet** to drop
in each slot. `→ st` marks a natural spot for a `section-transitions.css` shape.

### 1 · SaaS / startup landing  (`structure/saas.html`)
Goal: convert a visitor to a signup. Lead with the value prop, prove it, price it.

```
Nav (sticky, logo + links + Sign up)      → .s-nav  /  components/navbars
Hero (centered or split, 1 CTA + sub-CTA) → .s-hero--center  /  components/hero-pack
Logo cloud ("trusted by")                 → .s-logos  /  components/marketing-pack
Feature trio (icon + title + line)        → .s-grid--3 + .s-card  /  components/feature-blocks
Product shot / bento of capabilities  →st → components/bento-grid, components/artifact-split
Social proof (testimonials / stats)       → components/marketing-pack (testimonial-strip), .s-stats
How it works (3 numbered steps)           → components/feature-blocks (numbered)
Pricing (3 tiers, middle featured)    →st → components/pricing-* , .s-grid--3
FAQ (accordion)                           → components/accordion-pack
Final CTA band (accent surface)           → .s-section--accent  /  components/cta-sections
Footer (4-col)                            → .s-footer  /  components/footers
```
Pacing: hero → alt → default → alt …; transitions at product→proof and pricing→FAQ.
Density: airy. Accent used sparingly (CTA band + primary buttons only).

### 2 · Agency / studio / portfolio  (`structure/agency.html`)
Goal: demonstrate taste and capability. The work *is* the pitch — show it big, early.

```
Nav (minimal, lots of negative space)     → .s-nav
Hero (huge type statement, no stock art)  → .s-hero--center, --t-display
Selected work (asymmetric grid, big imgs) → components/bento-grid, layout/masonry
Services (numbered list or 2-col)     →st → components/feature-blocks (alternating rows)
Approach / process (3–5 steps)            → components/steps / feature-blocks
Stats / awards strip                      → .s-stats
Team (photo grid, bios on hover)          → components/team-grid
Big quote / manifesto                     → typography/quote-blocks
Contact CTA (oversized, single field)     → .s-section--accent / components/cta-sections
Footer (minimal, social)                  → .s-footer
```
Pacing: dark, editorial, generous whitespace. Let one diagonal/tilt transition do
the heavy lifting after the work grid. Type scale is the star.

### 3 · Local business / restaurant  (`structure/restaurant.html`)
Goal: appetite + trust + "where/when/how do I come in." Warmth over slickness.

```
Nav (logo center or left, "Book a table") → .s-nav
Hero (full-bleed food photo + name + CTA) → .s-hero--split / image bg
Intro blurb (short story, 2–3 lines)      → .s-container-narrow centered
Menu highlights (cards or 2-col list) →st → .s-grid + .s-card, components/pricing (as menu)
Gallery (photo strip / masonry)           → media/image-gallery-pro, layout/masonry
Hours + Location + Map                    → components/maps-pack, .s-split
Reviews (stars + quotes)                  → components/ratings-pack, marketing-pack
Reservation / booking CTA                 → .s-section--accent / components/cta-sections
Footer (address, hours, socials)          → .s-footer
```
Pacing: warm palette (override `--accent` to terracotta/olive), softer radii,
a wave or curve transition into the menu. Photography-forward.

### 4 · E-commerce / product  (`structure/ecommerce.html`)
Goal: one hero product → desire → confidence → buy. Buy CTA is always reachable.

```
Nav (logo + cart + sticky buy)            → .s-nav (+ sticky mini buy-bar)
Hero (product beauty shot + price + Buy)  → .s-hero--split
Feature highlights (3–4 benefit icons)    → .s-grid + .s-card
Detail split rows (alternating img/text)  → .s-split--media-left (alternate)
Gallery / 360 / lifestyle             →st → media/image-gallery-pro
Spec table / what's included              → components/table-pro
Reviews + rating summary                  → components/ratings-pack
Bundle / upsell row                       → components/commerce-pack
FAQ + shipping/returns                     → components/accordion-pack
Sticky buy bar (price + Add to cart)      → components/commerce-pack
Footer (trust badges, payment icons)      → .s-footer
```
Pacing: keep the Buy CTA in the nav AND a sticky bottom bar. Confidence section
(reviews, returns) right before the final buy. One transition before the gallery.

> Full store: `structure/shop-store.html` wires the actual e-shop kit
> (`product-cards-pro` grid + `shop-filters` PLP + `cart-pro` drawer +
> `shop-extras` free-ship bar/trust). Use it as the collection-page reference.

### 5 · Local service business  (legal / cleaning / gym / coffee / salon / dentist / trades)
Goal: **build trust fast and make the one action obvious** — book, call, or get a
quote. These businesses live or die on the hero CTA + proof. They share ONE
skeleton; only the theme + the action verb change.

```
Nav (logo + 1 clear CTA: Book / Quote / Call)  → .s-nav
Hero (promise + the ONE action, split or full) → .s-hero (+ inline quote/booking card)
Trust bar (rating, "insured", years, badges)   → .s-cluster / .shx-trust
Services / offerings (grid of 3–6)             → .s-grid--3 + .s-card
Why us / differentiators (split + checklist)   → .s-split + ✓ list / .sf-brackets
How it works (3 numbered steps)                → .s-grid--3 + numbered
Pricing / packages (tiers, middle featured)    → .s-grid--3  (skip if quote-based)
Team / trainers / attorneys (photo grid)       → .s-grid--4
Testimonials / results / case outcomes         → .s-card grid or big quote
Service area / hours / location (+ map)         → .s-split + components/maps-pack
FAQ (accordion)                                → components/accordion-pack
Contact / booking CTA band (phone + form)      → .s-section--accent
Footer (NAP: name, address, phone)             → .s-footer
```
The four shipped references show how far theme alone takes the *same* skeleton:
- **`legal.html`** — navy + gold + serif. Authority. Stats ($ recovered, years,
  win-rate), practice-area grid, attorney grid, big case-outcome quote, "free
  consultation" everywhere. Action verb: **Request consultation / Call**.
- **`cleaning.html`** — fresh teal + lime, light. Instant-quote card *inside* the
  hero, plan tiers (one-time/bi-weekly/weekly), 1-2-3 how-it-works, satisfaction
  guarantee. Action verb: **Get a free quote / Book**.
- **`gym.html`** — black + electric lime, huge uppercase type. Class grid with
  tags, trainer grid, no-contract membership tiers, transformation quote.
  Action verb: **Claim free class / Join now**.
- **`coffee.html`** — warm espresso + cream + serif, cozy. Story blurb, two-column
  menu with dotted leaders, values, gallery, hours/location. Action verb:
  **Order ahead / Visit**.

Pick the theme from the trade (legal=trust/navy, health=clean/blue-green,
food=warm, fitness=bold/energetic, beauty=soft/elegant) and keep the skeleton.

## Choosing when you only have a *reference* (no stated genre)

Look at the reference and classify by **primary goal**:
- "Sign up / start free trial / book a demo" → **SaaS** archetype.
- "Look at our work / hire us" → **Agency** archetype.
- "Come visit / order / reserve" → **Local/restaurant** archetype.
- "Book / call / get a quote" (a service: law, cleaning, gym, salon, trades) →
  **Local service business** archetype (#5). Theme by trade; keep the skeleton.
- "Buy this thing" → **E-commerce** archetype.
- Long text, author-led, dated posts → **Editorial/blog** (SaaS skeleton minus
  pricing, plus a content list + reading layout).

Then note its **density** (airy vs packed), **palette** (light/dark/warm), and
**hero style** (centered statement vs split-with-media) and carry those three
choices through every section.

## Theming the skeleton

`structure.css` is a token system. To re-skin any archetype, override on `.struct`:
```css
.struct {
  --accent: #e07a3f; --accent-2: #c2410c;   /* warm restaurant */
  --bg: #faf6f0; --bg-alt:#f1e9dd; --surface:#fff; --fg:#2a211a; --muted:#6b5d4f;
  --font-head: 'Playfair Display', serif;   /* pair with typography/ fonts */
  --radius: 8px; --section-y: clamp(4rem, 9vw, 8rem);
}
```
Light vs dark, tight vs airy, sharp vs round — all flow from these tokens, so the
*structure* stays identical while the *feel* changes per business.

## Don't

- Don't stack three transition shapes in a row.
- Don't give every section a different container width — pick one and hold it.
- Don't put pricing above proof, or a contact form before you've shown the work.
- Don't decorate an empty skeleton; fill sections with real snippets first, then
  add gradients/motion from the other skills.
