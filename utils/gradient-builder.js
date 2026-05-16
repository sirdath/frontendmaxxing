/* ============================================
   GRADIENT BUILDER — Build, randomize, animate gradients in JS
   Inspired by mesh gradient generators / palette tools
   ============================================
   Usage:
     // Build a CSS gradient string from data
     var g = GradientBuilder.linear(['#c084fc','#38bdf8','#f472b6'], 135);
     el.style.background = g;

     // Random mesh gradient (returns multi-radial background string)
     var mesh = GradientBuilder.randomMesh({ palette: 'aurora', stops: 4 });
     el.style.background = mesh.background;
     el.style.backgroundColor = mesh.backgroundColor;

     // Mouse-tracked holo (sets --hx / --hy on element)
     GradientBuilder.trackHolo(el);

     // Animate a CSS variable holding angle from 0→360 forever
     GradientBuilder.spin(el, '--gb-angle', 6000);

     // Get a curated palette
     GradientBuilder.palettes.aurora       // → ['#00c9a7', '#845ec2', ...]
   ============================================ */
(function (root) {
  'use strict';

  var palettes = {
    aurora:     ['#00c9a7', '#845ec2', '#ff6f91', '#ff9671', '#ffc75f'],
    cosmic:     ['#c084fc', '#38bdf8', '#f472b6', '#fbbf24'],
    sunset:     ['#ff6e7f', '#ffafbd', '#bfe9ff'],
    sunrise:    ['#ff5f6d', '#ffc371'],
    ocean:      ['#2e3192', '#1bffff', '#56ccf2', '#2f80ed'],
    cyberpunk:  ['#ff00d4', '#00f0ff', '#bd00ff'],
    pastel:     ['#fbcfe8', '#bfdbfe', '#bbf7d0', '#fef3c7', '#ddd6fe'],
    iridescent: ['#ff7eb6', '#ffd97e', '#7cf0bd', '#4dabf7', '#b197fc'],
    forest:     ['#4ade80', '#14b8a6', '#0f766e'],
    fire:       ['#fde047', '#fb923c', '#dc2626'],
    mono:       ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.18)'],
    instagram:  ['#515bd4', '#8134af', '#dd2a7b', '#feda77', '#f58529'],
    vercel:     ['#ff0080', '#7928ca', '#0070f3', '#00dfd8'],
    linear:     ['#5e6ad2', '#8b5cf6', '#ec4899'],
    stripe:     ['#635bff', '#3e92cc', '#00d4ff', '#ec4899']
  };

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function rand(min, max) { return Math.random() * (max - min) + min; }

  function _palette(name) {
    if (Array.isArray(name)) return name.slice();
    return (palettes[name] || palettes.aurora).slice();
  }

  // ── Linear gradient string
  function linear(colors, angle, stops) {
    angle = angle != null ? angle : 135;
    var c = _palette(colors);
    var s = c.map(function (col, i) {
      var p = stops && stops[i] != null ? stops[i] : (i / (c.length - 1)) * 100;
      return col + ' ' + p.toFixed(1) + '%';
    });
    return 'linear-gradient(' + angle + 'deg, ' + s.join(', ') + ')';
  }

  // ── Radial gradient string
  function radial(colors, position, shape) {
    var c = _palette(colors);
    position = position || 'center';
    shape = shape || 'circle';
    var s = c.map(function (col, i) { return col + ' ' + ((i / (c.length - 1)) * 100).toFixed(1) + '%'; });
    return 'radial-gradient(' + shape + ' at ' + position + ', ' + s.join(', ') + ')';
  }

  // ── Conic gradient string
  function conic(colors, fromAngle, position) {
    var c = _palette(colors);
    fromAngle = fromAngle || 0;
    position = position || 'center';
    var s = c.map(function (col, i) { return col + ' ' + ((i / (c.length - 1)) * 360).toFixed(1) + 'deg'; });
    return 'conic-gradient(from ' + fromAngle + 'deg at ' + position + ', ' + s.join(', ') + ', ' + c[0] + ' 360deg)';
  }

  // ── Random multi-radial mesh background string
  function randomMesh(opts) {
    opts = opts || {};
    var stops = opts.stops || 4;
    var palette = _palette(opts.palette || 'aurora');
    var bgColor = opts.background || '#050510';
    var radials = [];
    for (var i = 0; i < stops; i++) {
      var x = Math.round(rand(0, 100));
      var y = Math.round(rand(0, 100));
      var color = palette[i % palette.length];
      var alpha = opts.alpha != null ? opts.alpha : rand(0.35, 0.6).toFixed(2);
      radials.push('radial-gradient(at ' + x + '% ' + y + '%, ' + toRGBA(color, alpha) + ' 0%, transparent ' + Math.round(rand(40, 60)) + '%)');
    }
    return {
      background: radials.join(', '),
      backgroundColor: bgColor
    };
  }

  function applyMesh(el, opts) {
    var m = randomMesh(opts);
    el.style.backgroundImage = m.background;
    el.style.backgroundColor = m.backgroundColor;
  }

  // ── Mouse-track holo: sets --hx, --hy, --tx, --ty
  function trackHolo(el, opts) {
    opts = opts || {};
    function onMove(e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top)  / r.height;
      el.style.setProperty('--hx', (px * 100).toFixed(2) + '%');
      el.style.setProperty('--hy', (py * 100).toFixed(2) + '%');
      el.style.setProperty('--tx', (px - 0.5).toFixed(3));
      el.style.setProperty('--ty', (py - 0.5).toFixed(3));
    }
    function onLeave() {
      el.style.setProperty('--hx', '50%');
      el.style.setProperty('--hy', '50%');
      el.style.setProperty('--tx', '0');
      el.style.setProperty('--ty', '0');
    }
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return function destroy() {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }

  // ── Spin a CSS angle variable on an element forever
  function spin(el, varName, durationMs) {
    durationMs = durationMs || 6000;
    varName = varName || '--ga';
    var start = performance.now();
    var raf;
    function tick(t) {
      var elapsed = t - start;
      var deg = (elapsed / durationMs * 360) % 360;
      el.style.setProperty(varName, deg.toFixed(2) + 'deg');
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return function stop() { cancelAnimationFrame(raf); };
  }

  // ── Animate background-position back and forth
  function slide(el, durationMs, from, to) {
    durationMs = durationMs || 8000;
    from = from || '0% 50%';
    to   = to   || '100% 50%';
    el.animate(
      [{ backgroundPosition: from }, { backgroundPosition: to }],
      { duration: durationMs, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' }
    );
  }

  // ── Mix two colors (returns CSS color-mix string)
  function mix(c1, c2, ratio) {
    var p = Math.round((ratio == null ? 50 : ratio * 100));
    return 'color-mix(in oklch, ' + c1 + ' ' + (100 - p) + '%, ' + c2 + ' ' + p + '%)';
  }

  // ── Hex / rgb / rgba helpers
  function toRGBA(color, alpha) {
    if (color.indexOf('rgba') === 0) return color;
    if (color.indexOf('#') === 0) {
      var hex = color.slice(1);
      if (hex.length === 3) hex = hex.split('').map(function (c) { return c + c; }).join('');
      var r = parseInt(hex.slice(0, 2), 16);
      var g = parseInt(hex.slice(2, 4), 16);
      var b = parseInt(hex.slice(4, 6), 16);
      return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
    }
    return color;
  }

  // ── Generate a palette by hue-rotating a base color
  function generatePalette(baseColor, count, saturation, lightness) {
    count = count || 5;
    saturation = saturation != null ? saturation : 70;
    lightness  = lightness  != null ? lightness  : 60;
    var baseHue = hueOf(baseColor) || 240;
    var out = [];
    for (var i = 0; i < count; i++) {
      var h = (baseHue + (i * (360 / count))) % 360;
      out.push('hsl(' + Math.round(h) + ', ' + saturation + '%, ' + lightness + '%)');
    }
    return out;
  }

  function hueOf(color) {
    if (color.indexOf('#') !== 0) return null;
    var hex = color.slice(1);
    if (hex.length === 3) hex = hex.split('').map(function (c) { return c + c; }).join('');
    var r = parseInt(hex.slice(0, 2), 16) / 255;
    var g = parseInt(hex.slice(2, 4), 16) / 255;
    var b = parseInt(hex.slice(4, 6), 16) / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    if (max === min) return 0;
    var d = max - min, h;
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
    return h;
  }

  var GradientBuilder = {
    palettes: palettes,
    linear: linear,
    radial: radial,
    conic: conic,
    randomMesh: randomMesh,
    applyMesh: applyMesh,
    trackHolo: trackHolo,
    spin: spin,
    slide: slide,
    mix: mix,
    toRGBA: toRGBA,
    generatePalette: generatePalette
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = GradientBuilder;
  else root.GradientBuilder = GradientBuilder;
})(typeof window !== 'undefined' ? window : this);
