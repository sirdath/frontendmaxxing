/* ============================================
   ILLUSTRATIONS — Registry of 12 hand-crafted inline-SVG scenes (duotone line style)
   Inspired by unDraw / Notion empty states / Headspace illustration language
   ============================================
   Usage:
     <div id="hero-art" style="color:slategray; --ill-accent:#8b5cf6; max-width:420px;"></div>
     <script src="illustrations.js"></script>
     <script>
       Illustrations.mount('#hero-art', 'sleeping-child', { title: 'A child asleep under the moon' });
     </script>

   Methods:
     Illustrations.get(name, { accent, title })    -> svg markup string
         role="img" + <title> when title given, aria-hidden="true" otherwise;
         accent sets --ill-accent inline on the svg
     Illustrations.mount(elOrSelector, name, opts) -> injects svg, returns el
     Illustrations.names()                         -> array of scene names

   Scenes:
     sleeping-child, crescent-moon, night-sky, meditating-figure,
     cat-sleeping, reading-lamp, plant-duo, calm-waves,
     mountain-dawn, hot-drink, paper-plane, abstract-arches

   Theming: every stroke inherits currentColor; every fill uses
   var(--ill-accent, currentColor) at varying opacity — zero baked-in
   colors, scales to any size via viewBox. Pair with svg/illustrations.css.
   ============================================ */
(function (global) {
  'use strict';

  var ACCENT = 'var(--ill-accent, currentColor)';

  /* ---- tiny draw helpers ------------------------------------ */

  // accent-filled + stroked shape
  function shape(op, d, extra) {
    return '<path fill="' + ACCENT + '" fill-opacity="' + op + '" d="' + d + '"' + (extra || '') + '/>';
  }
  // accent fill only, no stroke
  function fill(op, d) {
    return '<path fill="' + ACCENT + '" fill-opacity="' + op + '" stroke="none" d="' + d + '"/>';
  }
  // plain stroke line
  function line(d, extra) {
    return '<path d="' + d + '"' + (extra || '') + '/>';
  }
  // 4-point twinkle star (concave diamond)
  function star(x, y, s) {
    return '<path fill="' + ACCENT + '" fill-opacity="0.85" stroke="none" d="M' + x + ' ' + (y - s) +
      ' Q' + x + ' ' + y + ' ' + (x + s) + ' ' + y +
      ' Q' + x + ' ' + y + ' ' + x + ' ' + (y + s) +
      ' Q' + x + ' ' + y + ' ' + (x - s) + ' ' + y +
      ' Q' + x + ' ' + y + ' ' + x + ' ' + (y - s) + ' Z"/>';
  }
  // small accent dot star
  function dot(x, y, r) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + ACCENT + '" fill-opacity="0.7" stroke="none"/>';
  }
  // three ascending z's
  function zzz(x, y) {
    function z(zx, zy, s) { return '<path d="M' + zx + ' ' + zy + ' h' + s + ' l-' + s + ' ' + s + ' h' + s + '"/>'; }
    return '<g stroke-width="2">' + z(x, y, 7) + z(x + 12, y - 12, 5.5) + z(x + 21, y - 22, 4) + '</g>';
  }
  // elegant crescent (opens left, bulges right), filled + stroked
  function crescent(cx, cy, r, op) {
    var R = Math.round(r * 1.4 * 10) / 10;
    return shape(op == null ? 0.25 : op,
      'M' + cx + ' ' + (cy - r) +
      ' A' + r + ' ' + r + ' 0 1 1 ' + cx + ' ' + (cy + r) +
      ' A' + R + ' ' + R + ' 0 0 0 ' + cx + ' ' + (cy - r) + ' Z');
  }

  /* ---- scene registry (all viewBox 0 0 240 180) -------------- */

  var VB = '0 0 240 180';
  var scenes = {};

  /* THE flagship: child asleep in a side-view bed, zzz, moon + stars */
  scenes['sleeping-child'] = {
    vb: VB,
    body:
      crescent(198, 40, 15) +
      star(158, 28, 4) + star(224, 66, 3) +
      // floor
      line('M 24 150 H 216', ' stroke-opacity="0.35"') +
      // headboard + footboard
      shape(0.08, 'M 46 148 V 80 Q 46 68 56 68 Q 66 68 66 80 V 148') +
      shape(0.08, 'M 186 148 V 96 Q 186 88 193 88 Q 200 88 200 96 V 148') +
      // mattress
      '<rect x="66" y="106" width="120" height="20" rx="7" fill="' + ACCENT + '" fill-opacity="0.08"/>' +
      // pillow
      '<rect x="70" y="88" width="34" height="16" rx="8" fill="' + ACCENT + '" fill-opacity="0.18"/>' +
      // child's head + hair + closed eye
      '<circle cx="87" cy="90" r="9" fill="' + ACCENT + '" fill-opacity="0.25"/>' +
      line('M 79 87 Q 82 80 90 82', ' stroke-width="1.8"') +
      line('M 84 91 q 2.5 2 5 0', ' stroke-width="1.5"') +
      // blanket draped over the body, bump at the shoulders
      shape(0.3, 'M 100 126 V 112 C 104 96 122 86 140 90 C 160 94 176 100 186 107 V 126 Z') +
      line('M 122 90 C 124 102 124 114 122 126', ' stroke-width="1.8" stroke-opacity="0.45"') +
      line('M 152 94 C 154 106 154 116 152 126', ' stroke-width="1.8" stroke-opacity="0.45"') +
      zzz(96, 66)
  };

  /* big faceless crescent + scattered stars */
  scenes['crescent-moon'] = {
    vb: VB,
    body:
      crescent(128, 90, 42, 0.22) +
      star(60, 40, 5) + star(48, 104, 3.5) + star(186, 52, 4.5) +
      star(174, 128, 3) + star(96, 150, 3.5) +
      dot(74, 70, 1.8) + dot(196, 92, 2) + dot(130, 24, 1.6) + dot(58, 140, 1.5) +
      line('M 40 150 Q 120 178 200 146', ' stroke-dasharray="1 8" stroke-opacity="0.45" stroke-width="2"')
  };

  /* layered hills horizon + stars + moon */
  scenes['night-sky'] = {
    vb: VB,
    body:
      star(50, 36, 4) + star(96, 58, 3) + star(146, 30, 3.5) +
      dot(120, 70, 1.8) + dot(168, 64, 1.6) + dot(28, 76, 1.5) +
      crescent(196, 42, 14) +
      // back hill range with a tiny pine
      shape(0.1, 'M 16 150 V 126 Q 58 96 100 120 Q 140 142 176 114 Q 198 98 224 112 V 150 Z') +
      line('M 58 106 V 97', ' stroke-width="2"') +
      shape(0.3, 'M 50 98 L 58 82 L 66 98 Z') +
      // front hill band
      shape(0.25, 'M 16 156 V 138 Q 66 114 118 134 Q 170 152 224 128 V 156 Z') +
      line('M 16 156 H 224', ' stroke-opacity="0.4"')
  };

  /* cross-legged human silhouette with dashed halo ring */
  scenes['meditating-figure'] = {
    vb: VB,
    body:
      // halo
      '<circle cx="120" cy="56" r="24" stroke="' + ACCENT + '" stroke-dasharray="1 7" stroke-opacity="0.9"/>' +
      // head + bun
      '<circle cx="120" cy="56" r="13" fill="' + ACCENT + '" fill-opacity="0.18"/>' +
      '<circle cx="120" cy="40" r="4.5" fill="' + ACCENT + '" fill-opacity="0.35"/>' +
      // torso mass (narrow, sloped shoulders)
      fill(0.12, 'M 109 70 C 101 75 97 84 96 95 C 106 102 134 102 144 95 C 143 84 139 75 131 70 Q 120 66 109 70 Z') +
      // arms flowing out and down to the knees
      line('M 109 70 C 100 76 96 86 94 97 C 92 107 90 112 86 117') +
      line('M 131 70 C 140 76 144 86 146 97 C 148 107 150 112 154 117') +
      // crossed legs with knees wider than the torso
      shape(0.15, 'M 78 137 C 88 121 104 113 120 113 C 136 113 152 121 162 137 C 165 142 162 146 156 146 H 84 C 78 146 75 142 78 137 Z') +
      line('M 100 132 C 114 119 136 121 146 134', ' stroke-width="1.8" stroke-opacity="0.55"') +
      line('M 113 140 q 7 5 14 0', ' stroke-width="1.8"') +
      // hands resting on the knees (drawn over the legs)
      '<circle cx="88" cy="121" r="4" fill="' + ACCENT + '" fill-opacity="0.4"/>' +
      '<circle cx="152" cy="121" r="4" fill="' + ACCENT + '" fill-opacity="0.4"/>' +
      // mat
      '<path d="M 68 152 H 172" stroke="' + ACCENT + '" stroke-width="4" stroke-opacity="0.5"/>'
  };

  /* curled cat, wrapped tail, zzz */
  scenes['cat-sleeping'] = {
    vb: VB,
    body:
      // floor shadow
      '<ellipse cx="120" cy="152" rx="56" ry="5" fill="' + ACCENT + '" fill-opacity="0.08" stroke="none"/>' +
      // curled body
      shape(0.12, 'M 68 118 C 68 92 90 74 120 74 C 150 74 172 92 172 116 C 172 136 156 146 122 146 C 92 146 68 140 68 118 Z') +
      // fur stripes
      line('M 100 80 q 4 8 1 14', ' stroke-width="1.8" stroke-opacity="0.5"') +
      line('M 114 76 q 3 8 1 14', ' stroke-width="1.8" stroke-opacity="0.5"') +
      // tail wrapping around the front
      line('M 76 130 C 88 146 116 152 142 147 C 152 145 158 140 156 134', ' stroke-width="5.5"') +
      // head resting on the body
      '<circle cx="150" cy="116" r="19" fill="' + ACCENT + '" fill-opacity="0.18"/>' +
      shape(0.3, 'M 138 101 L 141 88 L 151 96 Z') +
      shape(0.3, 'M 157 95 L 166 86 L 169 99 Z') +
      // closed eye, nose, whiskers
      line('M 142 116 q 4 3 8 0', ' stroke-width="2"') +
      fill(0.8, 'M 158 121 l 5 1.5 l -4 3 Z') +
      line('M 165 118 l 10 -3', ' stroke-width="1.5" stroke-opacity="0.7"') +
      line('M 166 124 l 10 2', ' stroke-width="1.5" stroke-opacity="0.7"') +
      zzz(182, 76)
  };

  /* armchair + floor lamp with a soft light cone */
  scenes['reading-lamp'] = {
    vb: VB,
    body:
      // light cone first (sits behind everything)
      fill(0.07, 'M 166 66 L 126 134 H 214 L 190 66 Z') +
      line('M 166 66 L 126 134', ' stroke-width="1.5" stroke-dasharray="1 6" stroke-opacity="0.5"') +
      line('M 190 66 L 214 134', ' stroke-width="1.5" stroke-dasharray="1 6" stroke-opacity="0.5"') +
      // floor
      line('M 24 154 H 216', ' stroke-opacity="0.4"') +
      // armchair: backrest, arms, cushion, legs
      '<rect x="70" y="76" width="44" height="44" rx="10" fill="' + ACCENT + '" fill-opacity="0.1"/>' +
      '<rect x="56" y="96" width="16" height="42" rx="8" fill="' + ACCENT + '" fill-opacity="0.18"/>' +
      '<rect x="112" y="96" width="16" height="42" rx="8" fill="' + ACCENT + '" fill-opacity="0.18"/>' +
      '<rect x="70" y="112" width="44" height="14" rx="5" fill="' + ACCENT + '" fill-opacity="0.22"/>' +
      line('M 64 138 V 152', ' stroke-width="3"') +
      line('M 120 138 V 152', ' stroke-width="3"') +
      // open book on the cushion
      line('M 84 112 L 92 107 L 100 112 M 92 107 V 112', ' stroke-width="1.8"') +
      // floor lamp: base, pole, shade
      '<ellipse cx="178" cy="150" rx="14" ry="3.5" fill="' + ACCENT + '" fill-opacity="0.2"/>' +
      line('M 178 146 V 64', ' stroke-width="2.2"') +
      shape(0.25, 'M 164 64 L 169 42 H 187 L 192 64 Z')
  };

  /* monstera + snake plant in pots */
  scenes['plant-duo'] = {
    vb: VB,
    body:
      line('M 32 152 H 208', ' stroke-opacity="0.4"') +
      // monstera stems
      line('M 82 114 C 78 100 72 90 66 78', ' stroke-width="2"') +
      line('M 88 114 C 92 98 98 84 104 74', ' stroke-width="2"') +
      line('M 85 114 C 85 102 86 92 88 80', ' stroke-width="2"') +
      // monstera leaf 1 (left) — elongated, tapered tip, edge slits to the midrib
      shape(0.15, 'M 66 78 C 50 72 40 58 44 44 C 47 34 56 28 64 32 C 74 37 76 66 66 78 Z') +
      line('M 66 78 C 60 64 56 48 56 34', ' stroke-width="1.8" stroke-opacity="0.7"') +
      line('M 44 58 L 58 60 M 44 44 L 56 48 M 52 32 L 57 40', ' stroke-width="1.8" stroke-opacity="0.7"') +
      // monstera leaf 2 (right) — mirrored
      shape(0.15, 'M 104 74 C 120 68 130 54 126 40 C 123 30 114 24 106 28 C 96 33 94 62 104 74 Z') +
      line('M 104 74 C 110 60 114 44 114 30', ' stroke-width="1.8" stroke-opacity="0.7"') +
      line('M 126 54 L 112 56 M 126 40 L 114 44 M 118 28 L 113 36', ' stroke-width="1.8" stroke-opacity="0.7"') +
      // monstera leaf 3 (small, center, tapered)
      shape(0.22, 'M 88 80 C 79 74 76 64 81 58 C 85 53 92 54 95 61 C 98 68 95 77 88 80 Z') +
      // monstera pot
      '<rect x="56" y="114" width="56" height="9" rx="3" fill="' + ACCENT + '" fill-opacity="0.3"/>' +
      shape(0.2, 'M 62 152 L 59 123 H 109 L 106 152 Z') +
      // snake plant blades
      shape(0.12, 'M 150 122 C 147 104 146 88 152 70 C 156 84 156 104 157 122 Z') +
      shape(0.12, 'M 158 122 C 156 100 155 78 162 54 C 167 76 166 100 166 122 Z') +
      shape(0.12, 'M 165 122 C 163 96 162 66 169 40 C 174 64 173 96 172 122 Z') +
      shape(0.12, 'M 172 122 C 172 100 173 80 179 60 C 183 80 181 104 179 122 Z') +
      shape(0.12, 'M 179 122 C 180 108 182 94 188 80 C 190 96 187 110 185 122 Z') +
      line('M 160 116 C 159 96 159 76 162 60', ' stroke-width="1.5" stroke-opacity="0.5"') +
      line('M 168 116 C 167 92 167 68 169 48', ' stroke-width="1.5" stroke-opacity="0.5"') +
      // snake plant pot
      '<rect x="142" y="122" width="48" height="8" rx="3" fill="' + ACCENT + '" fill-opacity="0.3"/>' +
      shape(0.2, 'M 149 152 L 146 130 H 186 L 183 152 Z')
  };

  /* three overlapping wave bands + sun/moon disc */
  scenes['calm-waves'] = {
    vb: VB,
    body:
      star(60, 44, 4) + dot(94, 30, 1.8) + dot(196, 36, 2) +
      // disc dipping behind the first band
      shape(0.35, 'M 152 50 A 22 22 0 1 1 151.9 50 Z') +
      // band 1 (back)
      fill(0.1, 'M 24 104 Q 48 90 72 104 T 120 104 T 168 104 T 216 104 V 156 H 24 Z') +
      line('M 24 104 Q 48 90 72 104 T 120 104 T 168 104 T 216 104') +
      // band 2 (middle, phase-flipped)
      fill(0.2, 'M 24 124 Q 48 138 72 124 T 120 124 T 168 124 T 216 124 V 158 H 24 Z') +
      line('M 24 124 Q 48 138 72 124 T 120 124 T 168 124 T 216 124') +
      // band 3 (front)
      fill(0.3, 'M 24 142 Q 48 130 72 142 T 120 142 T 168 142 T 216 142 V 160 H 24 Z') +
      line('M 24 142 Q 48 130 72 142 T 120 142 T 168 142 T 216 142')
  };

  /* peaks + rising disc + birds */
  scenes['mountain-dawn'] = {
    vb: VB,
    body:
      // rising disc + rays
      fill(0.3, 'M 120 70 A 26 26 0 1 1 119.9 70 Z') +
      line('M 120 58 V 48 M 94 68 L 87 61 M 146 68 L 153 61', ' stroke-opacity="0.6" stroke-width="2"') +
      // back range
      shape(0.1, 'M 24 150 L 80 74 L 118 124 L 148 86 L 216 150 Z') +
      // front peak with snow cap
      shape(0.22, 'M 70 150 L 130 84 L 196 150 Z') +
      shape(0.45, 'M 119 96 L 130 84 L 141 96 L 135 91 L 130 97 L 125 91 Z') +
      // birds
      line('M 60 52 q 5 -6 10 0 q 5 -6 10 0', ' stroke-width="2"') +
      line('M 170 40 q 4 -5 8 0 q 4 -5 8 0', ' stroke-width="2"') +
      line('M 24 150 H 216', ' stroke-opacity="0.4"')
  };

  /* mug with steam curls */
  scenes['hot-drink'] = {
    vb: VB,
    body:
      star(76, 40, 3) + star(168, 34, 3.5) +
      // saucer
      '<ellipse cx="120" cy="146" rx="40" ry="7" fill="' + ACCENT + '" fill-opacity="0.12"/>' +
      // mug body + handle
      shape(0.15, 'M 92 82 L 92 120 Q 92 138 112 138 H 128 Q 148 138 148 120 L 148 82 Z') +
      line('M 148 92 Q 168 90 168 106 Q 168 122 148 118') +
      // rim + coffee surface
      '<ellipse cx="120" cy="82" rx="28" ry="6" fill="' + ACCENT + '" fill-opacity="0.05"/>' +
      '<ellipse cx="120" cy="82" rx="21" ry="4" fill="' + ACCENT + '" fill-opacity="0.35" stroke="none"/>' +
      // steam curls
      '<g stroke="' + ACCENT + '" stroke-opacity="0.8" stroke-width="2.2">' +
        line('M 104 62 C 100 54 108 50 104 42 C 100 36 106 30 104 24') +
        line('M 120 66 C 115 56 125 50 120 40 C 116 33 123 27 120 18') +
        line('M 136 62 C 132 54 140 50 136 42') +
      '</g>'
  };

  /* paper plane + dotted loop-the-loop flight path */
  scenes['paper-plane'] = {
    vb: VB,
    body:
      // dotted flight path ending at the plane's tail
      '<path d="M 38 138 C 58 150 84 148 98 132 C 112 116 102 94 84 98 C 68 102 66 124 86 127 C 110 130 120 112 130 100" stroke="' + ACCENT + '" stroke-opacity="0.8" stroke-width="2" stroke-dasharray="0.2 7.5"/>' +
      // upper wing, keel, center fold
      shape(0.1, 'M 176 52 L 98 88 L 130 96 Z') +
      shape(0.28, 'M 176 52 L 130 96 L 128 118 Z') +
      line('M 176 52 L 130 96', ' stroke-width="2"') +
      star(196, 96, 4) + star(60, 60, 3.5) + dot(190, 130, 1.8) + dot(150, 36, 1.6)
  };

  /* layered arches, modern poster feel */
  scenes['abstract-arches'] = {
    vb: VB,
    body:
      fill(0.4, 'M 120 35 A 11 11 0 1 1 119.9 35 Z') +
      shape(0.1, 'M 48 152 V 84 A 30 30 0 0 1 108 84 V 152') +
      line('M 62 152 V 90 A 16 16 0 0 1 94 90 V 152', ' stroke-width="1.8" stroke-opacity="0.55"') +
      shape(0.24, 'M 92 152 V 98 A 25 25 0 0 1 142 98 V 152') +
      shape(0.14, 'M 134 152 V 78 A 29 29 0 0 1 192 78 V 152') +
      dot(120, 60, 2) + dot(210, 100, 1.8) + star(206, 44, 3.5) +
      line('M 36 152 H 204', ' stroke-opacity="0.5"')
  };

  /* ---- public API -------------------------------------------- */

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function names() {
    return Object.keys(scenes);
  }

  /**
   * Build an svg markup string for a scene.
   * @param {string} name  - scene name (see Illustrations.names())
   * @param {object} [opts]
   * @param {string} [opts.accent] - any CSS color; sets --ill-accent inline
   * @param {string} [opts.title]  - accessible title; without it the svg is aria-hidden
   * @returns {string} svg markup
   */
  function get(name, opts) {
    opts = opts || {};
    var scene = scenes[name];
    if (!scene) {
      throw new Error('[Illustrations] unknown scene "' + name + '". Available: ' + names().join(', '));
    }
    var a11y = opts.title
      ? ' role="img" aria-label="' + esc(opts.title) + '"'
      : ' aria-hidden="true"';
    var style = opts.accent ? ' style="--ill-accent:' + esc(opts.accent) + '"' : '';
    var title = opts.title ? '<title>' + esc(opts.title) + '</title>' : '';
    return '<svg xmlns="http://www.w3.org/2000/svg" class="ill ill-' + name + '" viewBox="' + scene.vb + '"' +
      ' fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"' +
      a11y + style + '>' + title + scene.body + '</svg>';
  }

  /**
   * Inject a scene into an element.
   * @param {string|Element} elOrSelector
   * @param {string} name
   * @param {object} [opts] - same as get()
   * @returns {Element} the host element
   */
  function mount(elOrSelector, name, opts) {
    var el = typeof elOrSelector === 'string' ? document.querySelector(elOrSelector) : elOrSelector;
    if (!el) throw new Error('[Illustrations] mount target not found: ' + elOrSelector);
    el.innerHTML = get(name, opts);
    return el;
  }

  var Illustrations = {
    get: get,
    mount: mount,
    names: names,
  };

  if (typeof module !== 'undefined' && module.exports) { module.exports = Illustrations; } else { global.Illustrations = Illustrations; }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
