/* ============================================
   IMAGE GRADIENT — Wrap any PNG, SVG, or logo in a gradient programmatically
   Inspired by Vercel logos, Apple keynote color treatments, brand reveal moments
   ============================================
   Auto-detects the element type and applies the right technique:
     - <img> with PNG/JPG/WebP source  → wraps in mask-image + gradient div
     - <img> with SVG source           → fetches, inlines, then injects gradient defs
     - inline <svg>                    → injects <defs> and rewires fill attributes
     - any <element> with `data-src`   → mask-image + gradient
     - .imggrad CSS class              → already styled, just sets --src

   Usage:
     ImageGradient.apply('img.logo', { palette: 'aurora' });
     ImageGradient.apply('svg.icon', { palette: 'cosmic', strokes: false });

     // Direct methods:
     ImageGradient.mask(imgEl,  { palette: 'sunset' });   // force mask technique
     ImageGradient.fill(svgEl,  { palette: 'cyber' });    // force SVG-defs technique
     ImageGradient.inline(imgEl, { palette: 'aurora' });  // fetch+inline an external SVG <img>

     // Halo (gradient drop-shadow around the alpha — doesn't change colors):
     ImageGradient.halo(target, { palette: 'cyber', intensity: 'strong', pulse: true });

     // Auto-init from data attributes:
     ImageGradient.init('[data-img-gradient]');
     // Reads: data-img-gradient="aurora"
     //        data-img-gradient-method="mask|fill|halo|auto"
     //        data-img-gradient-intensity="soft|strong|extreme"

   Palettes:
     aurora, sunset, cosmic, cyber, ocean, fire, mint, rose, gold,
     pastel, mono, apple, holo, instagram, stripe, vercel, discord,
     spotify, twitter, rainbow, chrome
   ============================================ */
(function (root) {
  'use strict';

  var palettes = {
    aurora:    { type: 'linear', angle: 135, colors: ['#a855f7', '#ec4899', '#06b6d4'] },
    sunset:    { type: 'linear', angle: 135, colors: ['#f97316', '#ec4899', '#f59e0b'] },
    cosmic:    { type: 'linear', angle: 135, colors: ['#6d28d9', '#db2777', '#0891b2'] },
    cyber:     { type: 'linear', angle: 135, colors: ['#00ffff', '#ff00ff', '#00ff7f'] },
    ocean:     { type: 'linear', angle: 135, colors: ['#0ea5e9', '#06b6d4', '#14b8a6'] },
    fire:      { type: 'linear', angle: 135, colors: ['#fbbf24', '#f97316', '#ef4444'] },
    mint:      { type: 'linear', angle: 135, colors: ['#34d399', '#22d3ee', '#14b8a6'] },
    rose:      { type: 'linear', angle: 135, colors: ['#fb7185', '#f43f5e', '#ec4899'] },
    gold:      { type: 'linear', angle: 135, colors: ['#fef3c7', '#fbbf24', '#d97706'] },
    violet:    { type: 'linear', angle: 135, colors: ['#6366f1', '#8b5cf6', '#a855f7'] },
    pastel:    { type: 'linear', angle: 135, colors: ['#c4b5fd', '#fbcfe8', '#a5f3fc'] },
    mono:      { type: 'linear', angle: 135, colors: ['#ffffff', '#c4c4c4', '#6b6b6b'] },
    apple:     { type: 'linear', angle: 180, colors: ['#ffffff', '#ffffff', '#8b8b8b'] },
    holo:      { type: 'conic',  angle: 0,   colors: ['#ff00aa', '#00ffff', '#aaff00', '#ffaa00', '#ff00ff', '#00aaff', '#ff00aa'] },
    chrome:    { type: 'linear', angle: 135, colors: ['#d4d4d4', '#ffffff', '#808080', '#ffffff', '#c0c0c0'] },
    rainbow:   { type: 'linear', angle: 90,  colors: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'] },
    instagram: { type: 'linear', angle: 45,  colors: ['#515bd4', '#8134af', '#dd2a7b', '#feda77', '#f58529'] },
    stripe:    { type: 'linear', angle: 135, colors: ['#635bff', '#9d4edd', '#22d3ee'] },
    vercel:    { type: 'linear', angle: 90,  colors: ['#ec4899', '#8b5cf6', '#06b6d4'] },
    discord:   { type: 'linear', angle: 135, colors: ['#5865f2', '#404eed'] },
    spotify:   { type: 'linear', angle: 135, colors: ['#1ed760', '#1db954'] },
    twitter:   { type: 'linear', angle: 135, colors: ['#1da1f2', '#14a1f2'] }
  };

  var defaults = {
    palette: 'aurora',
    method: 'auto',         // 'auto' | 'mask' | 'fill' | 'halo' | 'inline'
    strokes: false,         // for SVG fill — also apply gradient to strokes
    intensity: 'normal',    // halo: 'soft' | 'normal' | 'strong' | 'extreme'
    pulse: false,           // halo: animate breathing
    angle: null,            // override gradient angle
    colors: null            // override colors array
  };

  var svgIdCounter = 0;

  function init(target) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target || '[data-img-gradient]')
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, function (el) {
      var opts = {
        palette: el.dataset.imgGradient || 'aurora',
        method:  el.dataset.imgGradientMethod || 'auto',
        intensity: el.dataset.imgGradientIntensity || 'normal',
        pulse: el.dataset.imgGradientPulse === 'true'
      };
      apply(el, opts);
    });
  }

  function apply(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var o = mergeOpts(opts);
    var out = [];
    Array.prototype.forEach.call(els, function (el) { out.push(dispatch(el, o)); });
    return out.length === 1 ? out[0] : out;
  }

  function dispatch(el, o) {
    var method = o.method;
    if (method === 'auto') {
      if (el.tagName === 'svg' || el.tagName === 'SVG') method = 'fill';
      else if (el.tagName === 'IMG' && /\.svg(\?|$)/i.test(el.src)) method = 'inline';
      else method = 'mask';
    }
    if (method === 'mask')   return mask(el, o);
    if (method === 'fill')   return fill(el, o);
    if (method === 'inline') return inline(el, o);
    if (method === 'halo')   return halo(el, o);
    return null;
  }

  // === Mask technique — works for PNG, JPG, external SVG ===
  function mask(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var o = mergeOpts(opts);
    var p = palettes[o.palette] || palettes.aurora;
    var bg = buildBackground(p, o);

    Array.prototype.forEach.call(els, function (el) {
      var src = el.src || el.dataset.src;
      if (!src) return;
      var rect = el.getBoundingClientRect();
      var w = rect.width || el.naturalWidth || 200;
      var h = rect.height || el.naturalHeight || 200;

      // Replace <img> with a div if not already a div/.imggrad
      if (el.tagName === 'IMG') {
        var wrap = document.createElement('div');
        wrap.className = el.className;
        wrap.style.cssText = el.style.cssText;
        wrap.style.display = 'inline-block';
        wrap.style.width = w + 'px';
        wrap.style.height = h + 'px';
        wrap.style.background = bg;
        wrap.style.backgroundSize = '200% 200%';
        wrap.style.webkitMask = 'url("' + src + '") center / contain no-repeat';
        wrap.style.mask = 'url("' + src + '") center / contain no-repeat';
        wrap.dataset.imgGradientApplied = o.palette;
        el.parentNode.replaceChild(wrap, el);
        return { el: wrap, original: el };
      }
      // Otherwise: just style the element directly
      el.style.background = bg;
      el.style.backgroundSize = '200% 200%';
      el.style.webkitMask = 'url("' + src + '") center / contain no-repeat';
      el.style.mask = 'url("' + src + '") center / contain no-repeat';
      el.dataset.imgGradientApplied = o.palette;
      return { el: el };
    });
  }

  // === Fill technique — for inline <svg> ===
  function fill(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var o = mergeOpts(opts);
    var p = palettes[o.palette] || palettes.aurora;

    Array.prototype.forEach.call(els, function (svg) {
      if (!svg.tagName || svg.tagName.toLowerCase() !== 'svg') return;
      var id = injectGradient(svg, p, o);
      // Rewire fills (skip "none" fills — they're intentional)
      var nodes = svg.querySelectorAll('path, circle, rect, ellipse, polygon, polyline, g[fill]');
      nodes.forEach(function (n) {
        var current = n.getAttribute('fill');
        if (current === 'none') return;
        n.setAttribute('fill', 'url(#' + id + ')');
      });
      if (o.strokes) {
        var stroked = svg.querySelectorAll('[stroke]');
        stroked.forEach(function (n) {
          if (n.getAttribute('stroke') === 'none') return;
          n.setAttribute('stroke', 'url(#' + id + ')');
        });
      }
      svg.dataset.imgGradientApplied = o.palette;
    });
  }

  function injectGradient(svg, p, o) {
    var NS = 'http://www.w3.org/2000/svg';
    var defs = svg.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS(NS, 'defs');
      svg.insertBefore(defs, svg.firstChild);
    }
    var id = 'imggrad-' + (++svgIdCounter);
    var grad;
    if (p.type === 'conic') {
      // SVG doesn't support conic, approximate with linear
      grad = document.createElementNS(NS, 'linearGradient');
      var angle = o.angle != null ? o.angle : (p.angle || 0);
      setAngle(grad, angle);
    } else {
      grad = document.createElementNS(NS, 'linearGradient');
      var ang = o.angle != null ? o.angle : (p.angle || 135);
      setAngle(grad, ang);
    }
    grad.setAttribute('id', id);
    var colors = o.colors || p.colors;
    colors.forEach(function (c, i) {
      var stop = document.createElementNS(NS, 'stop');
      stop.setAttribute('offset', ((i / Math.max(1, colors.length - 1)) * 100) + '%');
      stop.setAttribute('stop-color', c);
      grad.appendChild(stop);
    });
    defs.appendChild(grad);
    return id;
  }

  function setAngle(grad, angle) {
    var rad = (angle - 90) * Math.PI / 180;
    var x1 = 0.5 - Math.cos(rad) / 2, y1 = 0.5 - Math.sin(rad) / 2;
    var x2 = 0.5 + Math.cos(rad) / 2, y2 = 0.5 + Math.sin(rad) / 2;
    grad.setAttribute('x1', x1.toFixed(3));
    grad.setAttribute('y1', y1.toFixed(3));
    grad.setAttribute('x2', x2.toFixed(3));
    grad.setAttribute('y2', y2.toFixed(3));
  }

  // === Inline an external SVG <img> then apply fill ===
  function inline(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var o = mergeOpts(opts);
    var promises = [];
    Array.prototype.forEach.call(els, function (img) {
      if (img.tagName !== 'IMG') return;
      var src = img.src;
      var p = fetch(src).then(function (r) { return r.text(); }).then(function (text) {
        var doc = new DOMParser().parseFromString(text, 'image/svg+xml');
        var svg = doc.documentElement;
        if (img.width) svg.setAttribute('width', img.width);
        if (img.height) svg.setAttribute('height', img.height);
        if (img.className) svg.setAttribute('class', img.className);
        if (!svg.getAttribute('xmlns')) svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        img.parentNode.replaceChild(svg, img);
        fill(svg, o);
        return svg;
      });
      promises.push(p);
    });
    return Promise.all(promises);
  }

  // === Halo — multi-color drop-shadow chain around alpha ===
  var intensityMap = {
    soft:    [4,  10, 18],
    normal:  [8,  16, 28],
    strong:  [14, 28, 50],
    extreme: [24, 48, 80]
  };

  function halo(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var o = mergeOpts(opts);
    var p = palettes[o.palette] || palettes.aurora;
    var blurs = intensityMap[o.intensity] || intensityMap.normal;
    var cols = o.colors || p.colors;
    var c1 = cols[0], c2 = cols[1] || c1, c3 = cols[2] || c2;
    var filterStr =
      'drop-shadow(0 0 ' + blurs[0] + 'px ' + c1 + ') ' +
      'drop-shadow(0 0 ' + blurs[1] + 'px ' + c2 + ') ' +
      'drop-shadow(0 0 ' + blurs[2] + 'px ' + c3 + ')';

    Array.prototype.forEach.call(els, function (el) {
      el.style.filter = filterStr;
      if (o.pulse) {
        var anim = el.animate(
          [
            { filter: filterStr },
            { filter:
              'drop-shadow(0 0 ' + (blurs[0] * 1.8) + 'px ' + c1 + ') ' +
              'drop-shadow(0 0 ' + (blurs[1] * 1.8) + 'px ' + c2 + ') ' +
              'drop-shadow(0 0 ' + (blurs[2] * 1.8) + 'px ' + c3 + ')' },
            { filter: filterStr }
          ],
          { duration: 2400, iterations: Infinity, easing: 'ease-in-out' }
        );
        el.dataset.imgGradientHaloAnim = '1';
      }
      el.dataset.imgGradientApplied = o.palette;
    });
  }

  function remove(target) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, function (el) {
      el.style.background = '';
      el.style.webkitMask = '';
      el.style.mask = '';
      el.style.filter = '';
      delete el.dataset.imgGradientApplied;
    });
  }

  function buildBackground(p, o) {
    var colors = o.colors || p.colors;
    var angle = o.angle != null ? o.angle : (p.angle || 135);
    if (p.type === 'conic') return 'conic-gradient(from ' + angle + 'deg, ' + colors.join(',') + ')';
    return 'linear-gradient(' + angle + 'deg, ' + colors.join(',') + ')';
  }

  function mergeOpts(opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var ImageGradient = {
    init: init,
    apply: apply,
    mask: mask,
    fill: fill,
    inline: inline,
    halo: halo,
    remove: remove,
    palettes: palettes
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = ImageGradient;
  else root.ImageGradient = ImageGradient;
})(typeof window !== 'undefined' ? window : this);
