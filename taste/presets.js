/* ============================================
   TASTE · PRESETS (global: TastePresets) — ready-made taste bundles
   ============================================
   ~12 named, opinionated bundles that bind an aesthetic + palette + font pairing
   + motion + density + a "house" component set (which existing pack to reach for
   per slot) + an `avoid` list. This is where the "keep ALL packs, guide agents via
   presets" decision lives: each aesthetic routes to the RIGHT existing button/card/
   input/hero/loader pack instead of agents picking at random.

   Every `palette` and every `house.*` value is a REAL name/path in the repo — the
   pure validate() below proves it against INDEX paths + palette names (a test runs
   it), so a preset can never point at something that doesn't exist.

   Usage:
     <script src="presets.js"></script>
     <script>
       var p = TastePresets.get('luxury-noir');
       // p.aesthetic 'luxury', p.palette 'luxe-black-gold', p.house.button 'blocks/buttons-fx3.css' …
       document.body.className = 'struct pal-' + p.palette;
       document.body.setAttribute('data-aesthetic', p.aesthetic);
       document.body.setAttribute('data-font-pair', p.fontPair);
       document.body.setAttribute('data-motion', p.motion);
       document.body.setAttribute('data-density', p.density);

       TastePresets.list('minimal');                 // presets for one aesthetic
       TastePresets.validate(p, { paletteNames, indexPaths });  // {ok, errors}
     </script>

   Methods: get(name) · list(aesthetic?) · names() · validate(preset,{paletteNames,indexPaths})
   ============================================ */

(function (global) {
  'use strict';

  // Each preset: { name, label, aesthetic, palette, fontPair, motion, density,
  //                summary, house:{button,card,input,hero,loader}, avoid:[] }
  // house.* are real INDEX paths; palette is a real .pal-* name.
  var PRESETS = [
    {
      name: 'calm-fintech', label: 'Calm Fintech',
      aesthetic: 'minimal', palette: 'fintech-light', fontPair: 'grotesk-tech',
      motion: 'minimal', density: 'airy',
      summary: 'Trustworthy, quiet, lots of air. Restrained accent; numbers do the talking.',
      house: { button: 'blocks/buttons-sleek.css', card: 'components/cards.css', input: 'blocks/inputs-pro.css', hero: 'components/heroes.css', loader: 'blocks/loaders.css' },
      avoid: ['neon glow', 'gradient-soup backgrounds', 'bouncy spring on form controls', 'scale(1.08) card hovers'],
    },
    {
      name: 'clean-saas', label: 'Clean SaaS',
      aesthetic: 'minimal', palette: 'saas-indigo', fontPair: 'grotesk-tech',
      motion: 'standard', density: 'normal',
      summary: 'Modern product site: crisp grotesk, indigo accent, sleek buttons, subtle motion.',
      house: { button: 'blocks/buttons-sleek.css', card: 'components/cards.css', input: 'blocks/inputs.css', hero: 'components/hero-pack.css', loader: 'blocks/loaders.css' },
      avoid: ['3d tilt everywhere', 'rainbow gradients', 'more than one accent hue'],
    },
    {
      name: 'editorial-mag', label: 'Editorial Magazine',
      aesthetic: 'editorial', palette: 'paper', fontPair: 'editorial-serif',
      motion: 'standard', density: 'airy',
      summary: 'Print-magazine feel: Fraunces display, paper palette, generous measure, calm reveals.',
      house: { button: 'blocks/buttons-sleek.css', card: 'components/cards.css', input: 'blocks/inputs.css', hero: 'components/heroes.css', loader: 'blocks/loaders-text.css' },
      avoid: ['heavy drop shadows', 'glassmorphism', 'tech-y mono labels', 'fast snappy motion'],
    },
    {
      name: 'editorial-ink', label: 'Editorial Ink',
      aesthetic: 'editorial', palette: 'ink', fontPair: 'editorial-serif',
      motion: 'standard', density: 'normal',
      summary: 'Dark literary journal: ink ground, serif headlines, restrained gold-less elegance.',
      house: { button: 'blocks/buttons-sleek.css', card: 'components/cards.css', input: 'blocks/inputs-pro.css', hero: 'components/heroes.css', loader: 'blocks/loaders-text.css' },
      avoid: ['neon', 'gaming buttons', 'confetti', 'pulsing glows'],
    },
    {
      name: 'bold-launch', label: 'Bold Launch',
      aesthetic: 'energetic', palette: 'electric-night', fontPair: 'display-bold',
      motion: 'playful', density: 'normal',
      summary: 'High-energy launch page: bold Sora display, electric accent, FX buttons, lively motion.',
      house: { button: 'blocks/buttons-fx.css', card: 'components/cards-3d.css', input: 'blocks/inputs-pro.css', hero: 'components/hero-pack.css', loader: 'blocks/loaders-pack.css' },
      avoid: ['muddy low-contrast text', 'tiny timid CTAs', 'all-grey palette'],
    },
    {
      name: 'vibrant-startup', label: 'Vibrant Startup',
      aesthetic: 'energetic', palette: 'energy-volt', fontPair: 'display-bold',
      motion: 'standard', density: 'normal',
      summary: 'Punchy startup: volt accent, confident display type, shiny buttons, snappy reveals.',
      house: { button: 'blocks/buttons-shine.css', card: 'components/cards-pack.css', input: 'blocks/inputs-pro.css', hero: 'components/heroes-pack.css', loader: 'blocks/loaders-pack.css' },
      avoid: ['serif body text', 'sleepy slow fades', 'pastel-on-pastel'],
    },
    {
      name: 'luxury-noir', label: 'Luxury Noir',
      aesthetic: 'luxury', palette: 'luxe-black-gold', fontPair: 'luxury-serif',
      motion: 'standard', density: 'airy',
      summary: 'Black-and-gold couture: Playfair display, deep elevation, slow glide, lots of negative space.',
      house: { button: 'blocks/buttons-fx3.css', card: 'components/glare-card.css', input: 'blocks/inputs-pro.css', hero: 'components/heroes-pack.css', loader: 'blocks/loaders-fancy.css' },
      avoid: ['playful spring', 'rounded-bubbly shapes', 'loud primary-color CTAs', 'cramped spacing'],
    },
    {
      name: 'luxury-cream', label: 'Luxury Cream',
      aesthetic: 'luxury', palette: 'luxe-cream', fontPair: 'luxury-serif',
      motion: 'standard', density: 'airy',
      summary: 'Soft prestige: warm cream ground, fine serif, whisper-quiet motion, refined cards.',
      house: { button: 'blocks/buttons-sleek.css', card: 'components/glare-card.css', input: 'blocks/inputs-pro.css', hero: 'components/heroes.css', loader: 'blocks/loaders-fancy.css' },
      avoid: ['neon', 'harsh pure-black text', 'gaming/3d buttons', 'fast motion'],
    },
    {
      name: 'playful-pop', label: 'Playful Pop',
      aesthetic: 'playful', palette: 'playful-bright', fontPair: 'geometric-warm',
      motion: 'playful', density: 'normal',
      summary: 'Friendly and fun: rounded Poppins, bright palette, bouncy spring, chunky buttons.',
      house: { button: 'blocks/buttons-pack.css', card: 'components/cards-pack.css', input: 'blocks/inputs-uiverse.css', hero: 'components/hero-pack.css', loader: 'blocks/loaders-pack.css' },
      avoid: ['thin hairline type', 'corporate grey', 'sharp 0-radius corners', 'somber dark-only palette'],
    },
    {
      name: 'friendly-care', label: 'Friendly Care',
      aesthetic: 'playful', palette: 'care-mint', fontPair: 'humanist-soft',
      motion: 'standard', density: 'airy',
      summary: 'Warm, reassuring health/wellness: soft mint, humanist type, gentle rounded UI.',
      house: { button: 'blocks/buttons-sleek.css', card: 'components/cards.css', input: 'blocks/inputs.css', hero: 'components/heroes.css', loader: 'blocks/loaders.css' },
      avoid: ['aggressive red', 'sharp edges', 'jittery fast motion', 'dense data-grid layouts'],
    },
    {
      name: 'dev-tool', label: 'Developer Tool',
      aesthetic: 'technical', palette: 'vercel-mono', fontPair: 'mono-technical',
      motion: 'minimal', density: 'compact',
      summary: 'Vercel-grade dev product: mono labels, monochrome ground, crisp edges, near-zero motion.',
      house: { button: 'blocks/buttons-sleek.css', card: 'components/cards.css', input: 'blocks/inputs-pro.css', hero: 'components/heroes.css', loader: 'blocks/spinner-pack.css' },
      avoid: ['gradients', 'confetti', 'rounded-bubbly shapes', 'decorative illustration'],
    },
    {
      name: 'data-console', label: 'Data Console',
      aesthetic: 'technical', palette: 'slate-dark', fontPair: 'grotesk-tech',
      motion: 'minimal', density: 'compact',
      summary: 'Dense dashboard/console: slate ground, grotesk+mono, tight rhythm, status-driven color.',
      house: { button: 'blocks/buttons-states.css', card: 'components/cards.css', input: 'blocks/inputs-pro.css', hero: 'components/heroes.css', loader: 'blocks/spinner-pack.css' },
      avoid: ['big airy hero whitespace', 'playful spring', 'serif display type'],
    },
  ];

  var AESTHETICS = ['minimal', 'editorial', 'energetic', 'luxury', 'playful', 'technical'];
  var FONT_PAIRS = ['system-clean', 'grotesk-tech', 'editorial-serif', 'luxury-serif', 'geometric-warm', 'mono-technical', 'display-bold', 'humanist-soft'];
  var MOTIONS = ['minimal', 'standard', 'playful'];
  var DENSITIES = ['compact', 'normal', 'airy'];
  var HOUSE_SLOTS = ['button', 'card', 'input', 'hero', 'loader'];

  var BY_NAME = {};
  PRESETS.forEach(function (p) { BY_NAME[p.name] = p; });

  function get(name) { return BY_NAME[name] || null; }
  function names() { return PRESETS.map(function (p) { return p.name; }); }
  function list(aesthetic) {
    return aesthetic ? PRESETS.filter(function (p) { return p.aesthetic === aesthetic; }) : PRESETS.slice();
  }

  // Pure: prove a preset's enums are valid and every palette/house path resolves
  // against the real repo data. opts.paletteNames = string[], opts.indexPaths = string[]|Set.
  function validate(preset, opts) {
    opts = opts || {};
    var errors = [];
    if (!preset || typeof preset !== 'object') return { ok: false, errors: ['preset is not an object'] };
    var palSet = opts.paletteNames ? (opts.paletteNames instanceof Set ? opts.paletteNames : new Set(opts.paletteNames)) : null;
    var pathSet = opts.indexPaths ? (opts.indexPaths instanceof Set ? opts.indexPaths : new Set(opts.indexPaths)) : null;

    if (AESTHETICS.indexOf(preset.aesthetic) === -1) errors.push('bad aesthetic: ' + preset.aesthetic);
    if (FONT_PAIRS.indexOf(preset.fontPair) === -1) errors.push('bad fontPair: ' + preset.fontPair);
    if (MOTIONS.indexOf(preset.motion) === -1) errors.push('bad motion: ' + preset.motion);
    if (DENSITIES.indexOf(preset.density) === -1) errors.push('bad density: ' + preset.density);
    if (palSet && !palSet.has(preset.palette)) errors.push('unknown palette: ' + preset.palette);
    if (!preset.house || typeof preset.house !== 'object') {
      errors.push('missing house map');
    } else {
      HOUSE_SLOTS.forEach(function (slot) {
        var v = preset.house[slot];
        if (!v) { errors.push('missing house.' + slot); return; }
        if (pathSet && !pathSet.has(v)) errors.push('house.' + slot + ' not in INDEX: ' + v);
      });
    }
    return { ok: errors.length === 0, errors: errors };
  }

  var TastePresets = {
    presets: PRESETS,
    AESTHETICS: AESTHETICS, FONT_PAIRS: FONT_PAIRS, MOTIONS: MOTIONS, DENSITIES: DENSITIES, HOUSE_SLOTS: HOUSE_SLOTS,
    get: get, names: names, list: list, validate: validate,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TastePresets;
  } else {
    global.TastePresets = TastePresets;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
