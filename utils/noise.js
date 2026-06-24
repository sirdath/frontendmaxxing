/* ============================================
   NOISE — seedable simplex noise (2D / 3D), CPU, deterministic
   Inspired by Stefan Gustavson / Jonas Wagner simplex-noise (public domain; the
   simplex patent expired in 2022)
   ============================================
   Real coherent noise on the CPU — the vault otherwise has only sin-wave fakes
   (vortex/wavy) and GLSL-locked noise you can't read back. The permutation table
   is shuffled by an INJECTED PRNG, so `Noise.create(R.next)` with the same seed
   gives byte-identical fields — the basis for reproducible flow fields, terrain,
   stippling, and organic motion. Returns values in [-1, 1].

   Usage:
     var R = PRNG.create('dunes');                 // see prng.js
     var N = Noise.create(R.next);                 // inject the generator
     N.noise2D(x * 0.01, y * 0.01);                // [-1,1]
     N.noise3D(x, y, t);                           // animate via the 3rd axis
     N.fbm2D(x, y, { octaves: 5 });                // fractal sum (ridged terrain etc.)
   ============================================ */
(function (root) {
  'use strict';

  var GRAD3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
  var F2 = 0.5 * (Math.sqrt(3) - 1), G2 = (3 - Math.sqrt(3)) / 6;
  var F3 = 1 / 3, G3 = 1 / 6;

  function create(rand) {
    rand = rand || Math.random;
    var p = new Uint8Array(256);
    for (var i = 0; i < 256; i++) p[i] = i;
    for (var i2 = 255; i2 > 0; i2--) { var j = Math.floor(rand() * (i2 + 1)); var t = p[i2]; p[i2] = p[j]; p[j] = t; }
    var perm = new Uint8Array(512), permMod12 = new Uint8Array(512);
    for (var k = 0; k < 512; k++) { perm[k] = p[k & 255]; permMod12[k] = perm[k] % 12; }

    function dot2(g, x, y) { return g[0] * x + g[1] * y; }
    function dot3(g, x, y, z) { return g[0] * x + g[1] * y + g[2] * z; }

    function noise2D(xin, yin) {
      var n0 = 0, n1 = 0, n2 = 0;
      var s = (xin + yin) * F2;
      var i = Math.floor(xin + s), j = Math.floor(yin + s);
      var t = (i + j) * G2;
      var x0 = xin - (i - t), y0 = yin - (j - t);
      var i1, j1;
      if (x0 > y0) { i1 = 1; j1 = 0; } else { i1 = 0; j1 = 1; }
      var x1 = x0 - i1 + G2, y1 = y0 - j1 + G2;
      var x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
      var ii = i & 255, jj = j & 255;
      var t0 = 0.5 - x0 * x0 - y0 * y0;
      if (t0 >= 0) { t0 *= t0; n0 = t0 * t0 * dot2(GRAD3[permMod12[ii + perm[jj]]], x0, y0); }
      var t1 = 0.5 - x1 * x1 - y1 * y1;
      if (t1 >= 0) { t1 *= t1; n1 = t1 * t1 * dot2(GRAD3[permMod12[ii + i1 + perm[jj + j1]]], x1, y1); }
      var t2 = 0.5 - x2 * x2 - y2 * y2;
      if (t2 >= 0) { t2 *= t2; n2 = t2 * t2 * dot2(GRAD3[permMod12[ii + 1 + perm[jj + 1]]], x2, y2); }
      return 70 * (n0 + n1 + n2);
    }

    function noise3D(xin, yin, zin) {
      var n0 = 0, n1 = 0, n2 = 0, n3 = 0;
      var s = (xin + yin + zin) * F3;
      var i = Math.floor(xin + s), j = Math.floor(yin + s), k = Math.floor(zin + s);
      var t = (i + j + k) * G3;
      var x0 = xin - (i - t), y0 = yin - (j - t), z0 = zin - (k - t);
      var i1, j1, k1, i2, j2, k2;
      if (x0 >= y0) {
        if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
        else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
        else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
      } else {
        if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
        else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
        else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      }
      var x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
      var x2 = x0 - i2 + 2 * G3, y2 = y0 - j2 + 2 * G3, z2 = z0 - k2 + 2 * G3;
      var x3 = x0 - 1 + 3 * G3, y3 = y0 - 1 + 3 * G3, z3 = z0 - 1 + 3 * G3;
      var ii = i & 255, jj = j & 255, kk = k & 255;
      var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
      if (t0 >= 0) { t0 *= t0; n0 = t0 * t0 * dot3(GRAD3[permMod12[ii + perm[jj + perm[kk]]]], x0, y0, z0); }
      var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
      if (t1 >= 0) { t1 *= t1; n1 = t1 * t1 * dot3(GRAD3[permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]]], x1, y1, z1); }
      var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
      if (t2 >= 0) { t2 *= t2; n2 = t2 * t2 * dot3(GRAD3[permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]]], x2, y2, z2); }
      var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
      if (t3 >= 0) { t3 *= t3; n3 = t3 * t3 * dot3(GRAD3[permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]]], x3, y3, z3); }
      return 32 * (n0 + n1 + n2 + n3);
    }

    // fractal Brownian motion — layered octaves (terrain, clouds, ridges)
    function fbm2D(x, y, opts) {
      opts = opts || {};
      var oct = opts.octaves || 5, lac = opts.lacunarity || 2, gain = opts.gain || 0.5;
      var amp = 1, freq = 1, sum = 0, norm = 0;
      for (var o = 0; o < oct; o++) {
        sum += amp * noise2D(x * freq, y * freq);
        norm += amp; amp *= gain; freq *= lac;
      }
      return norm > 0 ? sum / norm : 0;
    }

    return { noise2D: noise2D, noise3D: noise3D, fbm2D: fbm2D };
  }

  var Noise = { create: create };

  if (typeof module !== 'undefined' && module.exports) module.exports = Noise;
  else root.Noise = Noise;
})(typeof window !== 'undefined' ? window : this);
