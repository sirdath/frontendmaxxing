/* ============================================
   PROGRESS PACK — JS glue: gauge tween + adaptive slider drag
   ============================================
   Usage:
     ProgressPack.gauge('[data-gauge]', { value: 65, label: 'CPU', autoThreshold: true });
     ProgressPack.slider('[data-aslider]', { min: 0, max: 100, value: 50, step: 1, onInput: function (v) {} });
     ProgressPack.lprog('[data-lprog]', { value: 30, onComplete: function () {} });
   ============================================ */
(function (root) {
  'use strict';

  function each(target, fn) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, fn);
  }

  function gauge(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      function set(v) {
        v = Math.max(0, Math.min(100, v));
        host.style.setProperty('--g-pct', v);
        var valEl = host.querySelector('.gauge-val');
        if (valEl) {
          var firstText = valEl.firstChild;
          if (firstText && firstText.nodeType === 3) firstText.nodeValue = Math.round(v);
          else valEl.insertBefore(document.createTextNode(Math.round(v)), valEl.firstChild);
        }
        if (opts.autoThreshold) {
          host.classList.remove('gauge-good', 'gauge-warn', 'gauge-bad');
          if (v >= 80) host.classList.add('gauge-bad');
          else if (v >= 60) host.classList.add('gauge-warn');
          else host.classList.add('gauge-good');
        }
      }
      if (typeof opts.value === 'number') set(opts.value);
      host._setGauge = set;
    });
  }

  function slider(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var track = host.querySelector('.aslider-track');
      var thumb = host.querySelector('.aslider-thumb');
      var bubble = host.querySelector('.aslider-bubble');
      var min = opts.min || 0, max = opts.max || 100, step = opts.step || 1;
      var value = opts.value || min;

      function render() {
        var pct = ((value - min) / (max - min)) * 100;
        host.style.setProperty('--as-pct', pct + '%');
        if (bubble) bubble.textContent = value;
      }
      render();

      var dragging = false;
      host.addEventListener('pointerdown', function (e) {
        dragging = true;
        host.setPointerCapture(e.pointerId);
        move(e);
      });
      host.addEventListener('pointermove', function (e) { if (dragging) move(e); });
      host.addEventListener('pointerup', function (e) {
        dragging = false;
        try { host.releasePointerCapture(e.pointerId); } catch (_) {}
        if (typeof opts.onChange === 'function') opts.onChange(value);
      });
      function move(e) {
        var rect = track.getBoundingClientRect();
        var pct = (e.clientX - rect.left) / rect.width;
        var raw = min + Math.max(0, Math.min(1, pct)) * (max - min);
        value = Math.round(raw / step) * step;
        render();
        if (typeof opts.onInput === 'function') opts.onInput(value);
      }
    });
  }

  function lprog(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var bar = host.querySelector('.lprog-bar > i');
      var pctEl = host.querySelector('.lprog-pct');
      function set(v) {
        v = Math.max(0, Math.min(100, v));
        if (bar) bar.style.setProperty('--lprog-pct', v + '%');
        if (pctEl) pctEl.textContent = Math.round(v) + '%';
        if (v >= 100 && typeof opts.onComplete === 'function') opts.onComplete();
      }
      if (typeof opts.value === 'number') set(opts.value);
      host._setProgress = set;
    });
  }

  var ProgressPack = { gauge: gauge, slider: slider, lprog: lprog };
  if (typeof module !== 'undefined' && module.exports) module.exports = ProgressPack;
  else root.ProgressPack = ProgressPack;
})(typeof window !== 'undefined' ? window : this);
