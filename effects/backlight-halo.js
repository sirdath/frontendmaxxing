/* ============================================
   BACKLIGHT HALO — Auto-sample dominant colors from media for the halo glow
   Inspired by Apple TV+, YouTube ambient light, Spotify cover glow
   ============================================
   Usage:
     BacklightHalo.init('[data-bhalo]');

     // Programmatic:
     BacklightHalo.apply(el, { url: 'cover.jpg' });
     BacklightHalo.apply(el, { imageEl: someImg });

     // Returns: { c1, c2, c3, palette: [hex,...] }

   Options (data-attrs or opts):
     samples         — k-means clusters (default 5)
     pickStrategy    — 'top-3' | 'most-saturated' | 'spread'
     animate         — set true to gently shift over time
   ============================================ */
(function (root) {
  'use strict';

  // Reuse GradientExtract if available (in utils/), else inline a tiny version.
  function getExtractor() {
    if (typeof window !== 'undefined' && window.GradientExtract) return window.GradientExtract;
    return TinyExtract;
  }

  var defaults = {
    samples: 5,
    pickStrategy: 'top-3',
    animate: false,
    onColors: null
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target || '[data-bhalo]')
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, function (el) { apply(el, opts); });
  }

  function apply(el, opts) {
    var o = mergeOpts(opts);
    var media = el.querySelector('.bhalo-media') || el.querySelector('img, video');
    var url = (opts && opts.url) || (media && (media.currentSrc || media.src));
    if (!url) return;

    if (media && media.tagName === 'IMG' && !media.complete) {
      media.addEventListener('load', function () { sampleAndApply(el, media, o); }, { once: true });
      media.addEventListener('error', function () {});
      return;
    }
    sampleAndApply(el, media, o);
  }

  function sampleAndApply(el, media, o) {
    var ext = getExtractor();
    var promise = (ext && ext.fromImageEl && media && media.tagName === 'IMG')
      ? Promise.resolve(ext.fromImageEl(media))
      : (ext.fromImage ? ext.fromImage(media.src || media.currentSrc).catch(function () { return null; })
                       : Promise.resolve(null));
    promise.then(function (p) {
      if (!p || !p.palette || !p.palette.length) return;
      var colors = pickColors(p.palette, o.pickStrategy);
      el.style.setProperty('--bh-c1', colors[0]);
      el.style.setProperty('--bh-c2', colors[1] || colors[0]);
      el.style.setProperty('--bh-c3', colors[2] || colors[1] || colors[0]);
      el.classList.add('bhalo-sampled');
      if (o.animate) el.classList.add('bhalo-anim');
      if (typeof o.onColors === 'function') o.onColors({
        c1: colors[0], c2: colors[1] || colors[0], c3: colors[2] || colors[1] || colors[0],
        palette: p.palette
      });
    });
  }

  function pickColors(palette, strategy) {
    if (strategy === 'spread') {
      return spread(palette);
    }
    if (strategy === 'most-saturated') {
      var bySat = palette.slice().sort(function (a, b) { return saturation(b) - saturation(a); });
      return bySat.slice(0, 3);
    }
    return palette.slice(0, 3);
  }

  function spread(palette) {
    if (palette.length <= 3) return palette;
    var first = palette[0];
    var mid = palette[Math.floor(palette.length / 2)];
    var last = palette[palette.length - 1];
    return [first, mid, last];
  }

  function saturation(hex) {
    var rgb = hexToRgb(hex);
    var max = Math.max(rgb[0], rgb[1], rgb[2]);
    var min = Math.min(rgb[0], rgb[1], rgb[2]);
    return max === 0 ? 0 : (max - min) / max;
  }

  function hexToRgb(hex) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  // === Tiny fallback extractor (if utils/gradient-extract.js isn't loaded) ===
  var TinyExtract = {
    fromImageEl: function (img) {
      var canvas = document.createElement('canvas');
      var ratio = img.naturalWidth / img.naturalHeight || 1;
      canvas.width = 32;
      canvas.height = Math.max(1, Math.round(32 / ratio));
      var ctx = canvas.getContext('2d');
      try { ctx.drawImage(img, 0, 0, canvas.width, canvas.height); }
      catch (e) { return { palette: [] }; }
      var data;
      try { data = ctx.getImageData(0, 0, canvas.width, canvas.height).data; }
      catch (e) { return { palette: [] }; }
      // Average + 3 quadrant samples
      var quads = [[0,0,canvas.width/2,canvas.height/2],
                   [canvas.width/2,0,canvas.width/2,canvas.height/2],
                   [0,canvas.height/2,canvas.width/2,canvas.height/2]];
      var palette = quads.map(function (q) { return avgRect(data, canvas.width, q); });
      return { palette: palette };
    },
    fromImage: function (url) {
      return new Promise(function (resolve, reject) {
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () { resolve(TinyExtract.fromImageEl(img)); };
        img.onerror = reject;
        img.src = url;
      });
    }
  };

  function avgRect(data, w, q) {
    var r = 0, g = 0, b = 0, n = 0;
    var x0 = Math.floor(q[0]), y0 = Math.floor(q[1]);
    var x1 = Math.floor(q[0] + q[2]), y1 = Math.floor(q[1] + q[3]);
    for (var y = y0; y < y1; y++) {
      for (var x = x0; x < x1; x++) {
        var i = (y * w + x) * 4;
        r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
      }
    }
    if (n === 0) return '#888';
    r = Math.round(r / n); g = Math.round(g / n); b = Math.round(b / n);
    return '#' + ('0' + r.toString(16)).slice(-2) + ('0' + g.toString(16)).slice(-2) + ('0' + b.toString(16)).slice(-2);
  }

  var BacklightHalo = { init: init, apply: apply };
  if (typeof module !== 'undefined' && module.exports) module.exports = BacklightHalo;
  else root.BacklightHalo = BacklightHalo;
})(typeof window !== 'undefined' ? window : this);
