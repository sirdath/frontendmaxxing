/* ============================================
   COLOR WHEEL — HSL color picker via conic gradient wheel + lightness disc
   Inspired by macOS color picker, Figma, Procreate
   ============================================
   Usage:
     ColorWheel.init('.cwheel', {
       initial: '#ff00aa',
       onChange: function (color) {
         // color: { hex, rgb, hsl }
       }
     });

     instance.set('#00ffff');
     instance.get();   // current color object
     instance.destroy();
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    initial: '#ff0000',
    onChange: null,
    onPick: null         // fired only on pointerup
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(create(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function create(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var ring = el.querySelector('.cwheel-ring');
    var lum = el.querySelector('.cwheel-lum');
    var thumb = el.querySelector('.cwheel-thumb');
    var preview = el.querySelector('.cwheel-preview');
    var readout = el.querySelector('.cwheel-readout');

    var state = rgbToHsl(hexToRgb(o.initial));
    var listeners = [];

    function update() {
      var hue = 'hsl(' + state.h + ', 100%, 50%)';
      el.style.setProperty('--cw-hue', hue);
      var hex = rgbToHex(hslToRgb(state));
      el.style.setProperty('--cw-pick', hex);
      if (readout) readout.textContent = hex;

      // Position thumb on the ring (at hue angle, mid-radius)
      var rect = el.getBoundingClientRect();
      var size = rect.width;
      var radius = size * 0.42;
      var rad = (state.h - 90) * Math.PI / 180;
      if (thumb) {
        thumb.style.left = (size / 2 + Math.cos(rad) * radius) + 'px';
        thumb.style.top = (size / 2 + Math.sin(rad) * radius) + 'px';
      }

      var rgb = hslToRgb(state);
      var color = { hex: hex, rgb: rgb, hsl: { h: state.h, s: state.s, l: state.l } };
      if (typeof o.onChange === 'function') o.onChange(color);
      return color;
    }

    function pickFromRing(e) {
      var rect = el.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var dx = e.clientX - cx;
      var dy = e.clientY - cy;
      var ang = Math.atan2(dy, dx) * 180 / Math.PI + 90;
      if (ang < 0) ang += 360;
      state.h = Math.round(ang);
      update();
    }

    function pickFromLum(e) {
      var rect = lum.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width;
      var y = (e.clientY - rect.top) / rect.height;
      state.s = clamp(Math.round((1 - y) * 100), 0, 100);
      state.l = clamp(Math.round((1 - x) * 50 + 25), 5, 95);
      update();
    }

    function dragHandler(elem, picker) {
      var active = false;
      function down(e) {
        active = true;
        e.preventDefault();
        try { elem.setPointerCapture(e.pointerId); } catch (_) {}
        picker(e);
      }
      function move(e) { if (active) picker(e); }
      function up(e) {
        active = false;
        try { elem.releasePointerCapture(e.pointerId); } catch (_) {}
        if (typeof o.onPick === 'function') o.onPick({
          hex: rgbToHex(hslToRgb(state)),
          hsl: state,
          rgb: hslToRgb(state)
        });
      }
      elem.addEventListener('pointerdown', down);
      elem.addEventListener('pointermove', move);
      elem.addEventListener('pointerup', up);
      elem.addEventListener('pointercancel', up);
      listeners.push([elem, 'pointerdown', down], [elem, 'pointermove', move],
                     [elem, 'pointerup', up], [elem, 'pointercancel', up]);
    }

    if (ring) dragHandler(ring, pickFromRing);
    if (lum) dragHandler(lum, pickFromLum);

    function set(color) {
      if (typeof color === 'string') state = rgbToHsl(hexToRgb(color));
      else if (color.h != null) state = { h: color.h, s: color.s, l: color.l };
      else state = rgbToHsl(color);
      return update();
    }

    function get() { return { hex: rgbToHex(hslToRgb(state)), hsl: state, rgb: hslToRgb(state) }; }

    function destroy() {
      listeners.forEach(function (l) { l[0].removeEventListener(l[1], l[2]); });
    }

    requestAnimationFrame(update);

    return { el: el, set: set, get: get, destroy: destroy };
  }

  // Color math
  function hexToRgb(hex) {
    var h = (hex || '#000').replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function rgbToHex(rgb) {
    var c = function (n) { return ('0' + Math.round(n).toString(16)).slice(-2); };
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
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
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

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  var ColorWheel = { init: init, hexToRgb: hexToRgb, rgbToHex: rgbToHex, rgbToHsl: rgbToHsl, hslToRgb: hslToRgb };
  if (typeof module !== 'undefined' && module.exports) module.exports = ColorWheel;
  else root.ColorWheel = ColorWheel;
})(typeof window !== 'undefined' ? window : this);
