/* ============================================
   RANGE SLIDER — 2-handle drag with keyboard support
   Inspired by Linear filter / noUiSlider behavior
   ============================================
   Usage:
     RangeSlider.init('[data-range-slider]', {
       min: 0, max: 100,
       low: 20, high: 80,
       step: 1,
       formatLabel: function (v) { return '$' + v; },
       onChange: function (low, high) { … }
     });

   Reads initial values from data-rsl-min/max/low/high if present.
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    min: 0,
    max: 100,
    low: 0,
    high: 100,
    step: 1,
    formatLabel: function (v) { return v; },
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
  function attr(el, name, fallback) {
    var v = parseFloat(el.getAttribute(name));
    return isNaN(v) ? fallback : v;
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    o.min  = attr(el, 'data-rsl-min',  o.min);
    o.max  = attr(el, 'data-rsl-max',  o.max);
    o.low  = attr(el, 'data-rsl-low',  o.low);
    o.high = attr(el, 'data-rsl-high', o.high);
    o.step = attr(el, 'data-rsl-step', o.step);

    if (!el.querySelector('.rsl-track')) {
      el.innerHTML =
        '<div class="rsl-track"></div>' +
        '<div class="rsl-fill"></div>' +
        '<div class="rsl-thumb rsl-thumb-low" tabindex="0"></div>' +
        '<div class="rsl-thumb rsl-thumb-high" tabindex="0"></div>' +
        '<div class="rsl-labels"><span class="rsl-low-label"></span><span class="rsl-high-label"></span></div>';
    }

    var thumbLow  = el.querySelector('.rsl-thumb-low');
    var thumbHigh = el.querySelector('.rsl-thumb-high');
    var lowLabel  = el.querySelector('.rsl-low-label');
    var highLabel = el.querySelector('.rsl-high-label');

    var low  = clamp(o.low,  o.min, o.max);
    var high = clamp(o.high, low,    o.max);

    function pct(v) { return ((v - o.min) / (o.max - o.min)) * 100; }
    function update() {
      el.style.setProperty('--rsl-low',  pct(low) + '%');
      el.style.setProperty('--rsl-high', pct(high) + '%');
      if (lowLabel)  lowLabel.textContent  = o.formatLabel(low);
      if (highLabel) highLabel.textContent = o.formatLabel(high);
    }
    function emit() {
      if (typeof o.onChange === 'function') o.onChange(low, high);
    }

    function snapStep(v) {
      var r = Math.round((v - o.min) / o.step) * o.step + o.min;
      return clamp(r, o.min, o.max);
    }

    function dragThumb(which) {
      var thumb = which === 'low' ? thumbLow : thumbHigh;
      thumb.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        thumb.setPointerCapture(e.pointerId);
        function move(ev) {
          var r = el.getBoundingClientRect();
          var t = clamp((ev.clientX - r.left) / r.width, 0, 1);
          var val = snapStep(o.min + t * (o.max - o.min));
          if (which === 'low')  low  = clamp(val, o.min, high);
          else                  high = clamp(val, low, o.max);
          update();
        }
        function up() {
          thumb.removeEventListener('pointermove', move);
          thumb.removeEventListener('pointerup', up);
          emit();
        }
        thumb.addEventListener('pointermove', move);
        thumb.addEventListener('pointerup', up);
      });
      thumb.addEventListener('keydown', function (e) {
        var amt = e.shiftKey ? o.step * 10 : o.step;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          if (which === 'low')  low  = clamp(low - amt,  o.min, high);
          else                  high = clamp(high - amt, low,   o.max);
          update(); emit();
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          if (which === 'low')  low  = clamp(low + amt,  o.min, high);
          else                  high = clamp(high + amt, low,   o.max);
          update(); emit();
        }
      });
    }

    dragThumb('low');
    dragThumb('high');
    update();

    return {
      el: el,
      getValue: function () { return [low, high]; },
      setValue: function (lo, hi) { low = clamp(lo, o.min, hi); high = clamp(hi, low, o.max); update(); emit(); }
    };
  }

  var RangeSlider = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = RangeSlider;
  else root.RangeSlider = RangeSlider;
})(typeof window !== 'undefined' ? window : this);
