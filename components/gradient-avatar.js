/* ============================================
   GRADIENT AVATAR — Generate consistent gradient avatars from a string hash
   Inspired by Discord, GitHub identicons, Stripe, Boring Avatars
   ============================================
   Hashes a string (username, email, user id) into a hue + style and writes
   `--gav-c1/-c2/-c3` CSS variables onto the element. Pairs with .gav styles
   in `gradient-avatar.css`.

   Usage:
     <span class="gav" data-gav="dimo@email.com">DA</span>
     <span class="gav gav-conic" data-gav="anthropic"></span>
     <span class="gav gav-mesh" data-gav-seed="user-1234"
                                 data-gav-name="Dath Vader"></span>

     GradientAvatar.init('[data-gav], [data-gav-seed]');

     // Programmatic:
     var p = GradientAvatar.colorsFromString('claude');
     // → { c1, c2, c3, hue }

     GradientAvatar.render(targetEl, 'username', {
       initials: true,        // auto-derive initials from data-gav-name or the seed
       palette: null,         // optional: override colors
       style: 'linear'        // or 'conic', 'mesh', 'radial', etc.
     });

     // Build a standalone <svg> avatar (for use anywhere, even outside DOM):
     var svgString = GradientAvatar.svg('claude@anthropic.com', {
       size: 64, style: 'conic', initials: 'CA'
     });
     // Use as: <img src={'data:image/svg+xml;utf8,' + encodeURIComponent(svgString)}>

     // Get just the palette:
     GradientAvatar.palette('claude');
     // → ['#...', '#...', '#...']
   ============================================ */
(function (root) {
  'use strict';

  // Deterministic 32-bit hash (FNV-1a-ish)
  function hash(str) {
    str = String(str || '');
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return h;
  }

  // From a hash, derive (hue, saturation, lightness) for the seed
  function seedColors(seed, opts) {
    opts = opts || {};
    var h = hash(seed);
    var hue = h % 360;
    // Second hue offset by 120 + small variation; third by 240
    var spread = 60 + ((h >> 8) % 80);   // 60-140°
    var sat = 60 + ((h >> 16) % 30);     // 60-90
    var lig = 50 + ((h >> 24) % 15);     // 50-65
    var c1 = hslToHex(hue, sat, lig);
    var c2 = hslToHex(mod(hue + spread, 360), sat, lig);
    var c3 = hslToHex(mod(hue + spread * 2, 360), sat, lig - 5);
    return {
      c1: c1, c2: c2, c3: c3,
      hue: hue,
      hsl: { h: hue, s: sat, l: lig }
    };
  }

  function hslToHex(h, s, l) {
    h /= 360; s /= 100; l /= 100;
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
    var c = function (n) { return ('0' + Math.round(n * 255).toString(16)).slice(-2); };
    return '#' + c(r) + c(g) + c(b);
  }

  function mod(n, m) { return ((n % m) + m) % m; }

  function initialsFrom(name, seed) {
    var s = name || seed || '';
    s = s.replace(/[<>]/g, '').trim();
    if (!s) return '?';
    if (s.indexOf('@') !== -1) s = s.split('@')[0];
    s = s.replace(/[._\-]/g, ' ');
    var words = s.split(/\s+/).filter(Boolean);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }

  // Pick best text color (white or black) for given bg hue/lightness
  function bestText(c1) {
    var rgb = hexToRgb(c1);
    var lum = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
    return lum > 145 ? '#0a0a14' : '#ffffff';
  }

  function hexToRgb(hex) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function render(el, seed, opts) {
    opts = opts || {};
    var p = opts.palette || seedColors(seed);
    el.style.setProperty('--gav-c1', p.c1);
    el.style.setProperty('--gav-c2', p.c2);
    el.style.setProperty('--gav-c3', p.c3);
    el.style.setProperty('--gav-fg', opts.fg || bestText(p.c2));
    if (opts.initials !== false && !el.querySelector('img, .gav-inner')) {
      var text = typeof opts.initials === 'string'
        ? opts.initials
        : initialsFrom(opts.name || el.dataset.gavName, seed);
      if (!el.querySelector('.gav-initials')) {
        var span = document.createElement('span');
        span.className = 'gav-initials';
        span.textContent = text;
        el.appendChild(span);
      } else {
        el.querySelector('.gav-initials').textContent = text;
      }
    }
    if (opts.style) {
      ['linear', 'radial', 'conic', 'mesh', 'stripes', 'dots', 'rings', 'spiral', 'holo'].forEach(function (s) {
        el.classList.remove('gav-' + s);
      });
      el.classList.add('gav-' + opts.style);
    }
    return p;
  }

  function init(target) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target || '[data-gav]')
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, function (el) {
      var seed = el.dataset.gavSeed || el.dataset.gav || el.textContent || '';
      var opts = {
        name: el.dataset.gavName,
        style: el.dataset.gavStyle,
        initials: el.dataset.gavInitials !== undefined ? el.dataset.gavInitials : true
      };
      render(el, seed, opts);
    });
  }

  function palette(seed) {
    var p = seedColors(seed);
    return [p.c1, p.c2, p.c3];
  }

  function colorsFromString(seed) {
    return seedColors(seed);
  }

  // Standalone SVG (for use as <img src="data:image/svg+xml;…">)
  function svg(seed, opts) {
    opts = opts || {};
    var size = opts.size || 64;
    var p = opts.palette ? { c1: opts.palette[0], c2: opts.palette[1], c3: opts.palette[2] } : seedColors(seed);
    var fg = opts.fg || bestText(p.c2);
    var initials = opts.initials || initialsFrom(opts.name, seed);
    var style = opts.style || 'linear';

    var id = 'gav-' + (hash(seed) % 100000);
    var defs = '';
    var fill = '';

    if (style === 'linear') {
      defs = '<linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0%" stop-color="' + p.c1 + '"/>' +
        '<stop offset="50%" stop-color="' + p.c2 + '"/>' +
        '<stop offset="100%" stop-color="' + p.c3 + '"/></linearGradient>';
      fill = 'url(#' + id + ')';
    } else if (style === 'radial') {
      defs = '<radialGradient id="' + id + '" cx="35%" cy="35%" r="65%">' +
        '<stop offset="0%" stop-color="' + p.c1 + '"/>' +
        '<stop offset="50%" stop-color="' + p.c2 + '"/>' +
        '<stop offset="100%" stop-color="' + p.c3 + '"/></radialGradient>';
      fill = 'url(#' + id + ')';
    } else {
      // SVG can't do conic — fallback to linear
      defs = '<linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0%" stop-color="' + p.c1 + '"/>' +
        '<stop offset="50%" stop-color="' + p.c2 + '"/>' +
        '<stop offset="100%" stop-color="' + p.c3 + '"/></linearGradient>';
      fill = 'url(#' + id + ')';
    }

    var fontSize = Math.round(size * 0.42);
    var radius = opts.shape === 'square' ? 0 : (opts.shape === 'rounded' ? size * 0.2 : size / 2);

    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' +
      '<defs>' + defs + '</defs>' +
      '<rect width="' + size + '" height="' + size + '" rx="' + radius + '" ry="' + radius + '" fill="' + fill + '"/>' +
      '<text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" ' +
      'fill="' + fg + '" font-family="system-ui,sans-serif" font-weight="600" ' +
      'font-size="' + fontSize + '">' + escapeXml(initials) + '</text>' +
      '</svg>';
  }

  function svgDataUri(seed, opts) {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg(seed, opts));
  }

  function escapeXml(s) {
    return String(s).replace(/[<>&"']/g, function (c) {
      return ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]);
    });
  }

  var GradientAvatar = {
    init: init,
    render: render,
    palette: palette,
    colorsFromString: colorsFromString,
    initialsFrom: initialsFrom,
    svg: svg,
    svgDataUri: svgDataUri,
    hash: hash,
    hslToHex: hslToHex
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = GradientAvatar;
  else root.GradientAvatar = GradientAvatar;
})(typeof window !== 'undefined' ? window : this);
