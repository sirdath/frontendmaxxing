/* ============================================
   SVG GRADIENT DEFS — Reusable <defs> blocks for SVG icons & shapes
   Inspired by Heroicons, Lucide gradient icons, Stripe brand SVG defs
   ============================================
   Usage:
     // Inject the shared defs block into the page (once):
     SvgDefs.mount();

     // Reference in any SVG:
     <svg><path fill="url(#grad-aurora)" .../></svg>

     // Build a custom one-off gradient:
     var id = SvgDefs.linear({ colors: ['#ff00aa', '#00ffff'], angle: 45 });
     // → returns the generated id

     // Build a radial:
     SvgDefs.radial({ colors: ['#fff', '#000'], cx: 0.5, cy: 0.5, r: 0.6 });

     // Build a multi-stop palette ID:
     SvgDefs.palette('cosmic'); // returns 'grad-cosmic' and mounts if missing
   ============================================ */
(function (root) {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var defsEl = null;
  var counter = 0;

  // Standard palette presets (match library color naming)
  var palettes = {
    aurora:    ['#a855f7', '#ec4899', '#06b6d4'],
    sunset:    ['#f97316', '#ec4899', '#f59e0b'],
    cosmic:    ['#6d28d9', '#db2777', '#0891b2'],
    cyber:     ['#00ffff', '#ff00ff', '#00ff7f'],
    ocean:     ['#0ea5e9', '#06b6d4', '#14b8a6'],
    fire:      ['#fbbf24', '#f97316', '#ef4444'],
    mint:      ['#34d399', '#22d3ee', '#14b8a6'],
    rose:      ['#fb7185', '#f43f5e', '#ec4899'],
    gold:      ['#fef3c7', '#fbbf24', '#d97706'],
    mono:      ['#ffffff', '#c4c4c4', '#6b6b6b'],
    violet:    ['#6366f1', '#8b5cf6', '#a855f7'],
    pastel:    ['#c4b5fd', '#fbcfe8', '#a5f3fc'],
    instagram: ['#515bd4', '#8134af', '#dd2a7b', '#feda77', '#f58529'],
    rainbow:   ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'],
    vercel:    ['#ec4899', '#8b5cf6', '#06b6d4'],
    stripe:    ['#635bff', '#9d4edd', '#22d3ee'],
    apple:     ['#ffffff', '#8b8b8b']
  };

  function mount() {
    if (defsEl) return defsEl;
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';
    defsEl = document.createElementNS(SVG_NS, 'defs');
    svg.appendChild(defsEl);
    document.body.appendChild(svg);
    // Pre-mount all named palettes
    Object.keys(palettes).forEach(function (name) {
      linear({ id: 'grad-' + name, colors: palettes[name], angle: 135 });
    });
    return defsEl;
  }

  function ensureDefs() { return defsEl || mount(); }

  function linear(opts) {
    opts = opts || {};
    var id = opts.id || ('lg-' + (++counter));
    if (document.getElementById(id)) return id;
    var defs = ensureDefs();
    var grad = document.createElementNS(SVG_NS, 'linearGradient');
    grad.setAttribute('id', id);
    var angle = opts.angle == null ? 135 : opts.angle;
    var rad = angle * Math.PI / 180;
    var x1 = 0.5 - Math.cos(rad) / 2, y1 = 0.5 - Math.sin(rad) / 2;
    var x2 = 0.5 + Math.cos(rad) / 2, y2 = 0.5 + Math.sin(rad) / 2;
    grad.setAttribute('x1', x1); grad.setAttribute('y1', y1);
    grad.setAttribute('x2', x2); grad.setAttribute('y2', y2);
    addStops(grad, opts.colors || ['#000', '#fff'], opts.stops);
    defs.appendChild(grad);
    return id;
  }

  function radial(opts) {
    opts = opts || {};
    var id = opts.id || ('rg-' + (++counter));
    if (document.getElementById(id)) return id;
    var defs = ensureDefs();
    var grad = document.createElementNS(SVG_NS, 'radialGradient');
    grad.setAttribute('id', id);
    grad.setAttribute('cx', opts.cx == null ? 0.5 : opts.cx);
    grad.setAttribute('cy', opts.cy == null ? 0.5 : opts.cy);
    grad.setAttribute('r', opts.r == null ? 0.5 : opts.r);
    addStops(grad, opts.colors || ['#fff', '#000'], opts.stops);
    defs.appendChild(grad);
    return id;
  }

  function addStops(parent, colors, stops) {
    colors.forEach(function (c, i) {
      var stop = document.createElementNS(SVG_NS, 'stop');
      var pct = stops ? stops[i] : (i / Math.max(1, colors.length - 1)) * 100;
      stop.setAttribute('offset', pct + '%');
      stop.setAttribute('stop-color', c);
      parent.appendChild(stop);
    });
  }

  function palette(name) {
    if (!palettes[name]) return null;
    ensureDefs();
    return 'grad-' + name;
  }

  // Returns an SVG defs block as a string (for SSR or pasting into <svg> markup)
  function defsString() {
    var parts = ['<defs>'];
    Object.keys(palettes).forEach(function (name) {
      var colors = palettes[name];
      parts.push('<linearGradient id="grad-' + name + '" x1="0" y1="0" x2="1" y2="1">');
      colors.forEach(function (c, i) {
        var pct = (i / Math.max(1, colors.length - 1)) * 100;
        parts.push('<stop offset="' + pct + '%" stop-color="' + c + '"/>');
      });
      parts.push('</linearGradient>');
    });
    parts.push('</defs>');
    return parts.join('');
  }

  function remove(id) {
    var n = document.getElementById(id);
    if (n) n.remove();
  }

  var SvgDefs = {
    mount: mount,
    linear: linear,
    radial: radial,
    palette: palette,
    defsString: defsString,
    remove: remove,
    palettes: palettes
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = SvgDefs;
  else root.SvgDefs = SvgDefs;
})(typeof window !== 'undefined' ? window : this);
