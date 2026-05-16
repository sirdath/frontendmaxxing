/* ============================================
   CLIP TRIM — Drag in/out handles to trim a range
   ============================================
   Usage:
     ClipTrim.init('[data-clip-trim]', {
       duration: 5,
       inSec: 1.2, outSec: 4.0,
       onChange: function (inSec, outSec) { … }
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    duration: 10,
    inSec: 1,
    outSec: 9,
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

  function fmt(sec) {
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    var d = Math.floor((sec - Math.floor(sec)) * 10);
    return m + ':' + (s < 10 ? '0' : '') + s + '.' + d;
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var bar = el.querySelector('.trim-bar');
    var inH = el.querySelector('.trim-in');
    var outH = el.querySelector('.trim-out');
    var sel = el.querySelector('.trim-sel');
    var times = el.querySelectorAll('.trim-times span');
    if (!bar || !inH || !outH) return { el: el, destroy: function () {} };

    var inV = o.inSec, outV = o.outSec;

    function paint() {
      var inPct = (inV / o.duration) * 100;
      var outPct = (outV / o.duration) * 100;
      inH.style.left = inPct + '%';
      outH.style.left = outPct + '%';
      sel.style.setProperty('--in', inPct + '%');
      sel.style.setProperty('--out', outPct + '%');
      if (times[0]) times[0].textContent = fmt(inV);
      if (times[2]) times[2].textContent = fmt(outV);
      if (times[1]) times[1].textContent = fmt(outV - inV) + ' selected';
    }

    function dragHandle(handle, which) {
      handle.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        handle.setPointerCapture(e.pointerId);
        var rect = bar.getBoundingClientRect();
        function move(ev) {
          var pct = (ev.clientX - rect.left) / rect.width;
          pct = Math.max(0, Math.min(1, pct));
          var t = pct * o.duration;
          if (which === 'in') inV = Math.min(t, outV - 0.1);
          else outV = Math.max(t, inV + 0.1);
          paint();
          if (typeof o.onChange === 'function') o.onChange(inV, outV);
        }
        function up() {
          handle.removeEventListener('pointermove', move);
          handle.removeEventListener('pointerup', up);
        }
        handle.addEventListener('pointermove', move);
        handle.addEventListener('pointerup', up);
      });
    }
    dragHandle(inH, 'in');
    dragHandle(outH, 'out');
    paint();

    return {
      el: el,
      getRange: function () { return [inV, outV]; },
      setRange: function (i, o2) { inV = i; outV = o2; paint(); }
    };
  }

  var ClipTrim = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = ClipTrim;
  else root.ClipTrim = ClipTrim;
})(typeof window !== 'undefined' ? window : this);
