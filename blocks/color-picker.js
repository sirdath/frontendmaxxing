/* ============================================
   COLOR PICKER — Hue + Saturation/Value area + Alpha + Hex input + Swatches
   Inspired by react-colorful / Figma
   ============================================
   Usage:
     ColorPicker.init('[data-color-picker]', {
       value: '#818cf8',
       swatches: ['#ef4444','#f59e0b','#22c55e','#22d3ee','#818cf8','#c084fc','#f472b6','#ffffff'],
       alpha: true,
       onChange: function (hex, hsla) { … }
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    value: '#818cf8',
    alpha: true,
    swatches: [
      '#ffffff','#0c0c14','#ef4444','#f59e0b',
      '#22c55e','#22d3ee','#818cf8','#c084fc'
    ],
    onChange: null
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function hexToRgba(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(function (c) { return c + c; }).join('');
    var a = 1;
    if (hex.length === 8) {
      a = parseInt(hex.slice(6, 8), 16) / 255;
      hex = hex.slice(0, 6);
    }
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: a
    };
  }

  function rgbaToHex(r, g, b, a) {
    var hex = '#' +
      [r, g, b].map(function (n) {
        var h = Math.round(n).toString(16);
        return h.length === 1 ? '0' + h : h;
      }).join('');
    if (a < 1) hex += Math.round(a * 255).toString(16).padStart(2, '0');
    return hex;
  }

  function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var d = max - min;
    var h = 0;
    if (d !== 0) {
      if (max === r)      h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else                h = (r - g) / d + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    var s = max === 0 ? 0 : d / max;
    var v = max;
    return { h: h, s: s, v: v };
  }

  function hsvToRgb(h, s, v) {
    var c = v * s;
    var x = c * (1 - Math.abs((h / 60) % 2 - 1));
    var m = v - c;
    var rgb;
    if (h < 60)       rgb = [c, x, 0];
    else if (h < 120) rgb = [x, c, 0];
    else if (h < 180) rgb = [0, c, x];
    else if (h < 240) rgb = [0, x, c];
    else if (h < 300) rgb = [x, 0, c];
    else              rgb = [c, 0, x];
    return { r: (rgb[0] + m) * 255, g: (rgb[1] + m) * 255, b: (rgb[2] + m) * 255 };
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    if (!el.querySelector('.cp-panel')) {
      el.innerHTML =
        '<button type="button" class="cp-trigger"></button>' +
        '<div class="cp-panel">' +
          '<div class="cp-area"><div class="cp-area-thumb"></div></div>' +
          '<div class="cp-controls">' +
            '<div class="cp-hue"><div class="cp-hue-thumb"></div></div>' +
            (o.alpha ? '<div class="cp-alpha"><div class="cp-alpha-thumb"></div></div>' : '') +
          '</div>' +
          '<div class="cp-bottom"><input class="cp-hex" maxlength="9"><div class="cp-preview"></div></div>' +
          '<div class="cp-swatches"></div>' +
        '</div>';
    }

    var trigger = el.querySelector('.cp-trigger');
    var panel   = el.querySelector('.cp-panel');
    var area    = el.querySelector('.cp-area');
    var areaThumb = el.querySelector('.cp-area-thumb');
    var hueSlider   = el.querySelector('.cp-hue');
    var hueThumb    = el.querySelector('.cp-hue-thumb');
    var alphaSlider = el.querySelector('.cp-alpha');
    var alphaThumb  = alphaSlider && alphaSlider.querySelector('.cp-alpha-thumb');
    var hexInput  = el.querySelector('.cp-hex');
    var preview   = el.querySelector('.cp-preview');
    var swatches  = el.querySelector('.cp-swatches');

    if (!o.alpha) el.classList.add('cp-no-alpha');

    var rgba = hexToRgba(o.value);
    var hsv  = rgbToHsv(rgba.r, rgba.g, rgba.b);
    var alpha = rgba.a;

    function emit() {
      var rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
      var hex = rgbaToHex(rgb.r, rgb.g, rgb.b, alpha);
      el.style.setProperty('--cp-value', hex);
      el.style.setProperty('--cp-hue', hsv.h);
      el.style.setProperty('--cp-sat-x', (hsv.s * 100) + '%');
      el.style.setProperty('--cp-sat-y', ((1 - hsv.v) * 100) + '%');
      el.style.setProperty('--cp-alpha', alpha);
      hexInput.value = hex;
      if (typeof o.onChange === 'function') o.onChange(hex, { h: hsv.h, s: hsv.s, v: hsv.v, a: alpha });
    }

    function paintSwatches() {
      swatches.innerHTML = '';
      o.swatches.forEach(function (c) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'cp-swatch';
        b.style.background = c;
        b.addEventListener('click', function () {
          var x = hexToRgba(c);
          hsv = rgbToHsv(x.r, x.g, x.b);
          alpha = x.a;
          emit();
        });
        swatches.appendChild(b);
      });
    }

    function dragify(target, onDrag) {
      function down(e) {
        e.preventDefault();
        function move(ev) { onDrag(ev); }
        function up() {
          document.removeEventListener('pointermove', move);
          document.removeEventListener('pointerup', up);
        }
        onDrag(e);
        document.addEventListener('pointermove', move);
        document.addEventListener('pointerup', up);
      }
      target.addEventListener('pointerdown', down);
    }

    dragify(area, function (e) {
      var r = area.getBoundingClientRect();
      var x = clamp((e.clientX - r.left) / r.width, 0, 1);
      var y = clamp((e.clientY - r.top)  / r.height, 0, 1);
      hsv.s = x;
      hsv.v = 1 - y;
      emit();
    });

    dragify(hueSlider, function (e) {
      var r = hueSlider.getBoundingClientRect();
      var t = clamp((e.clientX - r.left) / r.width, 0, 1);
      hsv.h = t * 360;
      emit();
    });

    if (alphaSlider) {
      dragify(alphaSlider, function (e) {
        var r = alphaSlider.getBoundingClientRect();
        var t = clamp((e.clientX - r.left) / r.width, 0, 1);
        alpha = t;
        emit();
      });
    }

    hexInput.addEventListener('change', function () {
      var v = hexInput.value.trim();
      if (!/^#?[0-9a-f]{3,8}$/i.test(v)) return;
      var x = hexToRgba(v);
      hsv = rgbToHsv(x.r, x.g, x.b);
      alpha = x.a;
      emit();
    });

    paintSwatches();
    emit();

    function open()  { el.classList.add('is-open'); }
    function close() { el.classList.remove('is-open'); }
    function onTrigger(e) { e.stopPropagation(); el.classList.contains('is-open') ? close() : open(); }
    function onOutside(e) { if (!el.contains(e.target)) close(); }
    if (trigger) trigger.addEventListener('click', onTrigger);
    document.addEventListener('click', onOutside);

    function destroy() {
      if (trigger) trigger.removeEventListener('click', onTrigger);
      document.removeEventListener('click', onOutside);
    }

    return {
      el: el, open: open, close: close, destroy: destroy,
      getValue: function () { return hexInput.value; },
      setValue: function (v) { var x = hexToRgba(v); hsv = rgbToHsv(x.r, x.g, x.b); alpha = x.a; emit(); }
    };
  }

  var ColorPicker = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = ColorPicker;
  else root.ColorPicker = ColorPicker;
})(typeof window !== 'undefined' ? window : this);
