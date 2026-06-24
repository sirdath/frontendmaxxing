/* ============================================
   OKLCH RAMP — perceptually-even color ramps from one hue (vanilla, zero-dep)
   Inspired by Björn Ottosson's OKLab / CSS Color 4 · refactoringui ramp rules
   ============================================
   Author color the way premium systems do (Stripe/Linear): in OKLCH, where
   lightness is perceptually uniform, so a ramp stepped by L looks evenly spaced
   with no manual nudging — impossible in HSL. Generates a hand-tuned-FEELING
   N-step ramp from a single hue (or an accent hex), SATURATING the extremes so
   light tints don't go pale-grey and dark shades don't go black-grey. All math
   is vanilla; no dependency.

   Usage:
     OklchRamp.ramp(264, { steps: 9, chroma: 0.13 });   // -> [{L,C,H,hex}, …]
     OklchRamp.fromAccent('#6d5cff');                    // ramp around that hue
     OklchRamp.toHex(0.62, 0.0, 0);                      // '#…'  OKLCH -> sRGB
     OklchRamp.fromHex('#3b82f6');                       // -> {L,C,H}
   ============================================ */
(function (root) {
  'use strict';

  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function round(x, n) { var f = Math.pow(10, n || 4); return Math.round(x * f) / f; }
  function gamma(c) { return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; }
  function ungamma(c) { return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function hex2(x) { var h = Math.round(clamp01(x) * 255).toString(16); return h.length < 2 ? '0' + h : h; }

  // OKLCH (L 0..1, C 0..~0.37, H deg) -> sRGB hex (out-of-gamut channels are clamped)
  function toHex(L, C, H) {
    var hr = H * Math.PI / 180;
    var a = C * Math.cos(hr), b = C * Math.sin(hr);
    var l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    var m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    var s_ = L - 0.0894841775 * a - 1.2914855480 * b;
    var l = l_ * l_ * l_, m = m_ * m_ * m_, s = s_ * s_ * s_;
    var r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    var g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    var bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
    return '#' + hex2(gamma(r)) + hex2(gamma(g)) + hex2(gamma(bl));
  }

  // sRGB hex -> OKLCH { L, C, H }
  function fromHex(hex) {
    var h = String(hex).replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var r = ungamma(parseInt(h.slice(0, 2), 16) / 255);
    var g = ungamma(parseInt(h.slice(2, 4), 16) / 255);
    var b = ungamma(parseInt(h.slice(4, 6), 16) / 255);
    var l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    var m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    var s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    var L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
    var A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
    var B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
    var H = Math.atan2(B, A) * 180 / Math.PI; if (H < 0) H += 360;
    return { L: round(L), C: round(Math.sqrt(A * A + B * B)), H: round(H, 2) };
  }

  // an N-step ramp at one hue: L stepped evenly (perceptually uniform), C boosted
  // toward both ends so tints/shades stay saturated instead of going chalky-grey.
  function ramp(hue, opts) {
    opts = opts || {};
    var steps = opts.steps || 9;
    var baseC = opts.chroma != null ? opts.chroma : 0.13;
    var lMax = opts.lMax != null ? opts.lMax : 0.97;
    var lMin = opts.lMin != null ? opts.lMin : 0.18;
    var out = [];
    for (var i = 0; i < steps; i++) {
      var L = steps === 1 ? (lMax + lMin) / 2 : lMax - i * (lMax - lMin) / (steps - 1);
      var dist = Math.abs(L - 0.62);                 // distance from mid-lightness
      var C = Math.min(0.22, baseC * (1 + dist * 0.7));   // saturate the extremes
      out.push({ L: round(L), C: round(C), H: round(hue, 2), hex: toHex(L, C, hue) });
    }
    return out;
  }

  // ramp built around an accent color's HUE (its own L/C are ignored — we want a
  // full, even ladder, not just lighter/darker versions of one swatch)
  function fromAccent(hex, opts) {
    return ramp(fromHex(hex).H, opts);
  }

  var OklchRamp = { toHex: toHex, fromHex: fromHex, ramp: ramp, fromAccent: fromAccent };

  if (typeof module !== 'undefined' && module.exports) module.exports = OklchRamp;
  else root.OklchRamp = OklchRamp;
})(typeof window !== 'undefined' ? window : this);
