/* ============================================
   PRNG — seedable, deterministic random (byte-identical across engines)
   Inspired by bryc's PRNG collection (public domain) — xmur3 / mulberry32 / sfc32
   ============================================
   The determinism substrate generative work needs: Math.random() can't be
   reseeded, so "same seed → same art" is impossible with it. This is a tiny,
   reproducible generator + the helpers a sketch actually uses. A string seed
   uses sfc32 (128-bit state, long period); a number seed uses mulberry32.
   Pair with noise.js for flow fields / terrain, and with the reproducible-render
   gate (same-seed = same-pixels).

   Usage:
     var R = PRNG.create('sunset-42');     // string OR number seed
     R.next();                              // [0,1)
     R.float(10, 20); R.int(1, 6); R.bool(0.3); R.sign();
     R.pick(palette); R.shuffle(items); R.gaussian(0, 1);
   ============================================ */
(function (root) {
  'use strict';

  // string -> 32-bit seed sequence
  function xmur3(str) {
    var i = 0, h = 1779033703 ^ str.length;
    for (; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return (h ^= h >>> 16) >>> 0;
    };
  }
  // 32-bit seed -> generator
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // 128-bit state -> generator (longer period, better distribution)
  function sfc32(a, b, c, d) {
    return function () {
      a |= 0; b |= 0; c |= 0; d |= 0;
      var t = (((a + b) | 0) + d) | 0;
      d = (d + 1) | 0;
      a = b ^ (b >>> 9);
      b = (c + (c << 3)) | 0;
      c = (c << 21) | (c >>> 11);
      c = (c + t) | 0;
      return (t >>> 0) / 4294967296;
    };
  }

  function create(seed) {
    var rand;
    if (typeof seed === 'string') {
      var h = xmur3(seed);
      rand = sfc32(h(), h(), h(), h());
    } else {
      rand = mulberry32(((seed >>> 0) || 1));
    }
    for (var w = 0; w < 12; w++) rand();   // warm up

    var api = {
      next: rand,
      float: function (min, max) {
        if (min == null) return rand();
        if (max == null) { max = min; min = 0; }
        return min + rand() * (max - min);
      },
      int: function (min, max) { return Math.floor(api.float(min, max + 1)); },   // inclusive
      bool: function (p) { return rand() < (p == null ? 0.5 : p); },
      sign: function () { return rand() < 0.5 ? -1 : 1; },
      pick: function (arr) { return arr[Math.floor(rand() * arr.length)]; },
      weighted: function (items, weights) {
        var total = 0, i; for (i = 0; i < weights.length; i++) total += weights[i];
        var r = rand() * total; for (i = 0; i < items.length; i++) { r -= weights[i]; if (r <= 0) return items[i]; }
        return items[items.length - 1];
      },
      shuffle: function (arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rand() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
        return a;
      },
      gaussian: function (mean, sd) {
        var u = 1 - rand(), v = rand();
        var n = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
        return (mean || 0) + n * (sd == null ? 1 : sd);
      }
    };
    return api;
  }

  var PRNG = { create: create, xmur3: xmur3, mulberry32: mulberry32, sfc32: sfc32 };

  if (typeof module !== 'undefined' && module.exports) module.exports = PRNG;
  else root.PRNG = PRNG;
})(typeof window !== 'undefined' ? window : this);
