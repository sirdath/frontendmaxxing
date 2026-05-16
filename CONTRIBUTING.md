# Contributing to frontendmaxxing

Thanks for considering a contribution! This library lives by one rule: **every snippet is vanilla, zero-dep, and copy-paste ready.** If you can keep that rule, you can add anything.

## The 30-second version

1. Pick a folder ([see the layout](AGENTS.md#folder-layout))
2. Add your `.css` and/or `.js` file following the [conventions](AGENTS.md#conventions-locked-follow-exactly-when-adding-files)
3. Add a 2-line tagged entry in [`INDEX.md`](INDEX.md)
4. Register a live preview in [`demo/index.html`](demo/index.html)
5. Open a PR

That's it. No tests, no build, no lint config to wrestle with.

## What to contribute

**Most welcome:**
- New snippets that fit the pattern (visual effects, components, utilities, shaders, 3D scenes)
- Brand gradient recreations (TikTok, Pinterest, Reddit, Slack, Adobe CC apps, anything iconic)
- New variants of existing snippets (more color presets, new sizes, new shapes)
- Bug fixes to existing snippets
- INDEX.md tag improvements (add synonyms that would help grep find an existing file)
- Demo improvements

**Probably not a fit:**
- Things requiring a build step (TypeScript sources, JSX, SASS, etc.)
- Things requiring a framework (React/Vue/Svelte components specifically)
- Files depending on npm packages (one exception: Three.js via CDN for `3d/*`)
- Massive sprawling PRs adding 50 unrelated files at once — break those up

When in doubt, open an issue first to check fit.

## Conventions

Full conventions are in [`AGENTS.md`](AGENTS.md). The essentials:

### JS

Every JS file uses this IIFE+UMD pattern so it works as `window.X` in browsers and as `require()` in Node:

```js
/* ============================================
   MODULE NAME — One-sentence description
   Inspired by [source]
   ============================================
   Usage:
     ModuleName.init('.selector', { opt: val });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = { /* … */ };

  function init(target, opts) { /* returns instance or [instances] */ }

  var ModuleName = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = ModuleName;
  else root.ModuleName = ModuleName;
})(typeof window !== 'undefined' ? window : this);
```

One global per file. PascalCase name.

### CSS

```css
/* ============================================
   SNIPPET NAME — Description
   Inspired by [source]
   ============================================
   Usage: <div class="snippet-name">...</div>

   Variants: .snippet-name-variant
   Modifiers: .snippet-name-modifier
   ============================================ */
.snippet-name {
  --snippet-var: value;     /* every tunable as a CSS custom property */
  /* … */
}

.snippet-name-variant { /* … */ }
```

CSS classes use **kebab-case with a short prefix**: `.tcc`, `.tcc-head`, `.tcc-success`. CSS variables match: `--tcc-bg`. Pick a 2-4 char prefix and stick to it across the file.

### File naming

- Kebab-case: `gradient-text.css`, `streaming-text.js`
- Paired files share a base: `tool-call-card.css` + `tool-call-card.js`

### Inspiration credits

Add a short `Inspired by [source]` line to your file header if your snippet recreates a pattern from another open-source project, article, or product. Reimplement the *idea* in vanilla CSS/JS — don't paste verbatim from MIT-licensed source.

## INDEX.md entries

After adding a file, append a 2-line entry to the appropriate section in `INDEX.md`:

```
**filename.ext** `folder/filename.ext` (CSS|JS, global: `Name`) — tags: keyword keyword2 synonym3 vendor-name
  One-sentence description of what it does and its key API/variants.
```

**Bake synonyms into tags.** Someone searching for "card 3d hover tilt parallax" should find your card-tilt snippet even if the file is named `cards-3d.js`. Include vendor names where relevant (`linear`, `vercel`, `stripe`, `apple`, `notion`, `cursor`, `claude`).

## Demo registration

In `demo/index.html`:

1. Add `<link rel="stylesheet" href="path/to/file.css">` in `<head>`
2. Add `<script src="path/to/file.js"></script>` before `</body>`
3. Add a new `<section>` showing the snippet's variants:

```html
<section id="my-snippet" class="demo-section">
  <h2>Snippet Name</h2>
  <div class="demo-grid">
    <div class="demo-card">
      <!-- variant 1 markup -->
    </div>
    <div class="demo-card">
      <!-- variant 2 markup -->
    </div>
  </div>
</section>
```

4. If JS needs initialization, add `ModuleName.init('...')` to the closing inline `<script>` block.

## Pull request checklist

- [ ] File(s) follow the JS/CSS template (header comment, IIFE+UMD wrapper, CSS vars for tunables)
- [ ] No dependencies (or only Three.js via CDN if `3d/*`)
- [ ] `INDEX.md` updated with tagged 2-line entry
- [ ] `demo/index.html` updated with live preview
- [ ] Tested in at least Chrome and Firefox
- [ ] Respects `prefers-reduced-motion` if your snippet animates
- [ ] Snippet works without any HTML/CSS class collisions

## Code of conduct

Be kind, be patient, be welcoming. We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/) — basic rules: treat people with respect, no harassment, no slurs.

## Questions

- **Where does X go?** — Check [`AGENTS.md`](AGENTS.md) folder layout.
- **Is X already in here?** — Grep [`INDEX.md`](INDEX.md). Try multiple synonyms.
- **Is this idea welcome?** — Open an issue with the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md).

Thanks again for contributing!
