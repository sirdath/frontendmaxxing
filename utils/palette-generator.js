/* ============================================
   PALETTE GENERATOR — Color-theory harmonious palettes from a seed color
   Inspired by Adobe Color, Coolors.co, paletton.com
   ============================================
   Feed it one color, get back a curated palette via classic color schemes.
   Returns hex strings + CSS gradient strings + WCAG contrast info.

   Usage:
     PaletteGenerator.complementary('#ec4899');
       → { name: 'complementary', colors: ['#ec4899', '#48ecae'], gradients: { linear, radial, conic } }

     PaletteGenerator.triadic('#ec4899');
       → 3 colors 120° apart

     PaletteGenerator.analogous('#ec4899', { count: 5, spread: 30 });
       → 5 colors within ±30° hue

     PaletteGenerator.splitComplementary('#ec4899');
     PaletteGenerator.tetradic('#ec4899');
     PaletteGenerator.square('#ec4899');
     PaletteGenerator.monochromatic('#ec4899', { count: 5 });
     PaletteGenerator.shades('#ec4899', { count: 5 });        // dark→base
     PaletteGenerator.tints('#ec4899', { count: 5 });         // base→light
     PaletteGenerator.tones('#ec4899', { count: 5 });         // muted

     // One-stop:
     PaletteGenerator.generate('#ec4899', 'triadic');
     PaletteGenerator.all('#ec4899');     // returns every scheme

     // Random:
     PaletteGenerator.random('aurora');   // pick from named seed palettes
     PaletteGenerator.surprise();         // anything goes

     // Sort / contrast:
     PaletteGenerator.sortByHue(colors);
     PaletteGenerator.sortByLightness(colors);
     PaletteGenerator.contrast('#000', '#fff');   // WCAG ratio
     PaletteGenerator.bestText(bgHex);             // returns '#000' or '#fff' for max contrast
   ============================================ */
(function (root) {
  'use strict';

  // ====== Color math primitives ======

  function hexToRgb(hex) {
    var h = (hex || '#000').replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function rgbToHex(rgb) {
    var c = function (n) { return ('0' + clampInt(n).toString(16)).slice(-2); };
    return '#' + c(rgb.r) + c(rgb.g) + c(rgb.b);
  }

  function rgbToHsl(rgb) {
    var r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        default: h = (r - g) / d + 4;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  function hslToRgb(hsl) {
    var h = hsl.h / 360, s = hsl.s / 100, l = hsl.l / 100;
    var r, g, b;
    if (s === 0) { r = g = b = l; }
    else {
      var hue2rgb = function (p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  }

  function clampInt(n) { return Math.max(0, Math.min(255, Math.round(n))); }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function mod360(h) { return ((h % 360) + 360) % 360; }

  function hslHex(h, s, l) {
    return rgbToHex(hslToRgb({ h: mod360(h), s: clamp(s, 0, 100), l: clamp(l, 0, 100) }));
  }

  function shiftHue(hex, deg) {
    var hsl = rgbToHsl(hexToRgb(hex));
    return hslHex(hsl.h + deg, hsl.s, hsl.l);
  }

  // ====== Schemes ======

  function complementary(hex) {
    var colors = [hex, shiftHue(hex, 180)];
    return wrap('complementary', colors);
  }

  function triadic(hex) {
    var colors = [hex, shiftHue(hex, 120), shiftHue(hex, 240)];
    return wrap('triadic', colors);
  }

  function splitComplementary(hex) {
    var colors = [hex, shiftHue(hex, 150), shiftHue(hex, 210)];
    return wrap('split-complementary', colors);
  }

  function tetradic(hex) {
    var colors = [hex, shiftHue(hex, 60), shiftHue(hex, 180), shiftHue(hex, 240)];
    return wrap('tetradic', colors);
  }

  function square(hex) {
    var colors = [hex, shiftHue(hex, 90), shiftHue(hex, 180), shiftHue(hex, 270)];
    return wrap('square', colors);
  }

  function analogous(hex, opts) {
    opts = opts || {};
    var count = opts.count || 5;
    var spread = opts.spread != null ? opts.spread : 30;   // ± degrees
    var hsl = rgbToHsl(hexToRgb(hex));
    var step = (spread * 2) / Math.max(1, count - 1);
    var colors = [];
    for (var i = 0; i < count; i++) {
      colors.push(hslHex(hsl.h - spread + step * i, hsl.s, hsl.l));
    }
    return wrap('analogous', colors);
  }

  function monochromatic(hex, opts) {
    opts = opts || {};
    var count = opts.count || 5;
    var hsl = rgbToHsl(hexToRgb(hex));
    var minL = opts.minL != null ? opts.minL : 20;
    var maxL = opts.maxL != null ? opts.maxL : 90;
    var step = (maxL - minL) / Math.max(1, count - 1);
    var colors = [];
    for (var i = 0; i < count; i++) {
      colors.push(hslHex(hsl.h, hsl.s, minL + step * i));
    }
    return wrap('monochromatic', colors);
  }

  function shades(hex, opts) {
    opts = opts || {};
    var count = opts.count || 5;
    var hsl = rgbToHsl(hexToRgb(hex));
    var colors = [];
    for (var i = 0; i < count; i++) {
      var f = i / Math.max(1, count - 1);
      colors.push(hslHex(hsl.h, hsl.s, hsl.l * (1 - f * 0.85)));
    }
    return wrap('shades', colors);
  }

  function tints(hex, opts) {
    opts = opts || {};
    var count = opts.count || 5;
    var hsl = rgbToHsl(hexToRgb(hex));
    var colors = [];
    for (var i = 0; i < count; i++) {
      var f = i / Math.max(1, count - 1);
      colors.push(hslHex(hsl.h, hsl.s * (1 - f * 0.5), hsl.l + (100 - hsl.l) * f * 0.85));
    }
    return wrap('tints', colors);
  }

  function tones(hex, opts) {
    opts = opts || {};
    var count = opts.count || 5;
    var hsl = rgbToHsl(hexToRgb(hex));
    var colors = [];
    for (var i = 0; i < count; i++) {
      var f = i / Math.max(1, count - 1);
      colors.push(hslHex(hsl.h, hsl.s * (1 - f * 0.7), hsl.l));
    }
    return wrap('tones', colors);
  }

  function compound(hex) {
    // Aka double-split: base + complement's neighbors
    var colors = [hex, shiftHue(hex, 30), shiftHue(hex, 180), shiftHue(hex, 210)];
    return wrap('compound', colors);
  }

  function generate(hex, scheme) {
    var s = (scheme || 'triadic').toLowerCase();
    if (PaletteGenerator[s]) return PaletteGenerator[s](hex);
    return triadic(hex);
  }

  function all(hex) {
    return {
      complementary: complementary(hex),
      triadic: triadic(hex),
      splitComplementary: splitComplementary(hex),
      tetradic: tetradic(hex),
      square: square(hex),
      analogous: analogous(hex),
      monochromatic: monochromatic(hex),
      shades: shades(hex),
      tints: tints(hex),
      tones: tones(hex),
      compound: compound(hex)
    };
  }

  // ====== Random ======

  var seedPalettes = {
    aurora:   ['#a855f7', '#ec4899', '#06b6d4'],
    sunset:   ['#f97316', '#ec4899', '#f59e0b'],
    cosmic:   ['#6d28d9', '#db2777', '#0891b2'],
    cyber:    ['#00ffff', '#ff00ff', '#00ff7f'],
    ocean:    ['#0ea5e9', '#06b6d4', '#14b8a6'],
    pastel:   ['#c4b5fd', '#fbcfe8', '#a5f3fc'],
    fire:     ['#fbbf24', '#f97316', '#ef4444'],
    mint:     ['#34d399', '#22d3ee', '#14b8a6']
  };

  function random(seedName) {
    if (seedName && seedPalettes[seedName]) {
      return wrap('seed:' + seedName, seedPalettes[seedName].slice());
    }
    var keys = Object.keys(seedPalettes);
    var pick = keys[Math.floor(Math.random() * keys.length)];
    return wrap('seed:' + pick, seedPalettes[pick].slice());
  }

  function surprise() {
    var schemes = ['triadic', 'analogous', 'tetradic', 'splitComplementary', 'compound'];
    var hue = Math.floor(Math.random() * 360);
    var sat = 55 + Math.random() * 40;
    var lig = 45 + Math.random() * 20;
    var hex = hslHex(hue, sat, lig);
    var scheme = schemes[Math.floor(Math.random() * schemes.length)];
    return generate(hex, scheme);
  }

  // ====== Output formatting ======

  function wrap(name, colors) {
    return {
      name: name,
      colors: colors,
      gradients: {
        linear: 'linear-gradient(135deg, ' + colors.join(', ') + ')',
        linearH: 'linear-gradient(90deg, ' + colors.join(', ') + ')',
        radial: 'radial-gradient(circle at center, ' + colors.join(', ') + ')',
        conic: 'conic-gradient(from 0deg, ' + colors.join(', ') + ', ' + colors[0] + ')'
      },
      meta: {
        contrastWB: colors.map(function (c) {
          return { hex: c, vsWhite: contrast(c, '#ffffff').toFixed(2), vsBlack: contrast(c, '#000000').toFixed(2), bestText: bestText(c) };
        })
      }
    };
  }

  // ====== Utilities ======

  function sortByHue(colors) {
    return colors.slice().sort(function (a, b) {
      return rgbToHsl(hexToRgb(a)).h - rgbToHsl(hexToRgb(b)).h;
    });
  }

  function sortByLightness(colors) {
    return colors.slice().sort(function (a, b) {
      return rgbToHsl(hexToRgb(a)).l - rgbToHsl(hexToRgb(b)).l;
    });
  }

  // WCAG relative luminance
  function relLum(hex) {
    var rgb = hexToRgb(hex);
    var ch = function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * ch(rgb.r) + 0.7152 * ch(rgb.g) + 0.0722 * ch(rgb.b);
  }

  function contrast(a, b) {
    var la = relLum(a), lb = relLum(b);
    var L1 = Math.max(la, lb), L2 = Math.min(la, lb);
    return (L1 + 0.05) / (L2 + 0.05);
  }

  function bestText(bgHex) {
    return contrast(bgHex, '#ffffff') >= contrast(bgHex, '#000000') ? '#ffffff' : '#000000';
  }

  function mix(a, b, ratio) {
    ratio = ratio == null ? 0.5 : ratio;
    var A = hexToRgb(a), B = hexToRgb(b);
    return rgbToHex({
      r: A.r + (B.r - A.r) * ratio,
      g: A.g + (B.g - A.g) * ratio,
      b: A.b + (B.b - A.b) * ratio
    });
  }

  // Apply a generated palette to CSS variables on an element
  function applyToCSS(el, palette, prefix) {
    prefix = prefix || '--palette';
    palette.colors.forEach(function (c, i) {
      el.style.setProperty(prefix + '-' + i, c);
    });
    el.style.setProperty(prefix + '-gradient', palette.gradients.linear);
  }

  var PaletteGenerator = {
    // Schemes
    complementary: complementary,
    triadic: triadic,
    splitComplementary: splitComplementary,
    tetradic: tetradic,
    square: square,
    analogous: analogous,
    monochromatic: monochromatic,
    shades: shades,
    tints: tints,
    tones: tones,
    compound: compound,
    generate: generate,
    all: all,
    // Random
    random: random,
    surprise: surprise,
    // Utilities
    hexToRgb: hexToRgb,
    rgbToHex: rgbToHex,
    rgbToHsl: rgbToHsl,
    hslToRgb: hslToRgb,
    hslHex: hslHex,
    shiftHue: shiftHue,
    sortByHue: sortByHue,
    sortByLightness: sortByLightness,
    contrast: contrast,
    bestText: bestText,
    mix: mix,
    applyToCSS: applyToCSS,
    seedPalettes: seedPalettes
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = PaletteGenerator;
  else root.PaletteGenerator = PaletteGenerator;
})(typeof window !== 'undefined' ? window : this);
