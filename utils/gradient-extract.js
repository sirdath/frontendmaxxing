/* ============================================
   GRADIENT EXTRACT — Pull dominant color palette from an image
   Inspired by Spotify, Apple Music album art palettes, color-thief
   ============================================
   Usage:
     GradientExtract.fromImage('cover.jpg').then(function (palette) {
       // palette = { dominant, accent, light, dark, palette: [hex, hex, ...] }
       el.style.background = 'linear-gradient(135deg,' + palette.palette.join(',') + ')';
     });

     GradientExtract.fromImageEl(document.querySelector('img')).then(...)
     GradientExtract.applyTo(el, 'cover.jpg', { type: 'linear', angle: 135 });
   ============================================ */
(function (root) {
  'use strict';

  function fromImage(src, opts) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function () { resolve(fromImageEl(img, opts)); };
      img.onerror = reject;
      img.src = src;
    });
  }

  function fromImageEl(img, opts) {
    opts = opts || {};
    var k = opts.count || 6;
    var sample = opts.sample || 64;
    var canvas = document.createElement('canvas');
    var ratio = img.naturalWidth / img.naturalHeight || 1;
    canvas.width = sample;
    canvas.height = Math.round(sample / ratio);
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    var data;
    try {
      data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    } catch (e) {
      return { dominant: '#888', palette: ['#888'], error: e };
    }

    var pixels = [];
    for (var i = 0; i < data.length; i += 4) {
      var a = data[i + 3];
      if (a < 250) continue;
      pixels.push([data[i], data[i + 1], data[i + 2]]);
    }
    if (!pixels.length) return { dominant: '#888', palette: ['#888'] };

    var centroids = kMeans(pixels, k);

    // Sort by frequency (cluster size) descending, then by saturation
    centroids.sort(function (a, b) {
      return b.size - a.size;
    });

    var palette = centroids.map(function (c) { return rgbToHex(c.color); });
    var sortedBySat = centroids.slice().sort(function (a, b) {
      return saturation(b.color) - saturation(a.color);
    });

    return {
      dominant: palette[0],
      accent: rgbToHex(sortedBySat[0].color),
      light: rgbToHex(centroids.slice().sort(function (a, b) { return lum(b.color) - lum(a.color); })[0].color),
      dark:  rgbToHex(centroids.slice().sort(function (a, b) { return lum(a.color) - lum(b.color); })[0].color),
      palette: palette
    };
  }

  function applyTo(el, src, opts) {
    opts = opts || {};
    return fromImage(src, opts).then(function (p) {
      var type = opts.type || 'linear';
      var angle = opts.angle == null ? 135 : opts.angle;
      var colors = (opts.count ? p.palette.slice(0, opts.count) : p.palette).join(',');
      var bg;
      if (type === 'radial')      bg = 'radial-gradient(circle at center,' + colors + ')';
      else if (type === 'conic')  bg = 'conic-gradient(from 0deg,' + colors + ')';
      else                        bg = 'linear-gradient(' + angle + 'deg,' + colors + ')';
      el.style.background = bg;
      return p;
    });
  }

  // K-means clustering for color quantization
  function kMeans(points, k, iters) {
    iters = iters || 8;
    if (points.length <= k) {
      return points.map(function (p) { return { color: p, size: 1 }; });
    }
    // Initialize centroids randomly from points
    var centers = [];
    for (var i = 0; i < k; i++) {
      centers.push(points[Math.floor(Math.random() * points.length)].slice());
    }
    var assignments = new Array(points.length);

    for (var it = 0; it < iters; it++) {
      // Assign
      for (var p = 0; p < points.length; p++) {
        var best = 0, bd = Infinity;
        for (var c = 0; c < k; c++) {
          var d = dist(points[p], centers[c]);
          if (d < bd) { bd = d; best = c; }
        }
        assignments[p] = best;
      }
      // Update
      var sums = []; for (var s = 0; s < k; s++) sums.push([0, 0, 0, 0]);
      for (var pp = 0; pp < points.length; pp++) {
        var a = assignments[pp];
        sums[a][0] += points[pp][0];
        sums[a][1] += points[pp][1];
        sums[a][2] += points[pp][2];
        sums[a][3] += 1;
      }
      for (var cc = 0; cc < k; cc++) {
        if (sums[cc][3] > 0) {
          centers[cc] = [
            Math.round(sums[cc][0] / sums[cc][3]),
            Math.round(sums[cc][1] / sums[cc][3]),
            Math.round(sums[cc][2] / sums[cc][3])
          ];
        }
      }
    }
    var sizes = new Array(k).fill(0);
    for (var aa = 0; aa < assignments.length; aa++) sizes[assignments[aa]]++;
    return centers.map(function (c, i) { return { color: c, size: sizes[i] }; });
  }

  function dist(a, b) {
    var dr = a[0] - b[0], dg = a[1] - b[1], db = a[2] - b[2];
    return dr * dr + dg * dg + db * db;
  }

  function rgbToHex(rgb) {
    var c = function (n) { return ('0' + Math.round(n).toString(16)).slice(-2); };
    return '#' + c(rgb[0]) + c(rgb[1]) + c(rgb[2]);
  }

  function lum(c) {
    return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
  }

  function saturation(c) {
    var max = Math.max(c[0], c[1], c[2]);
    var min = Math.min(c[0], c[1], c[2]);
    return max === 0 ? 0 : (max - min) / max;
  }

  var GradientExtract = {
    fromImage: fromImage,
    fromImageEl: fromImageEl,
    applyTo: applyTo,
    rgbToHex: rgbToHex
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = GradientExtract;
  else root.GradientExtract = GradientExtract;
})(typeof window !== 'undefined' ? window : this);
