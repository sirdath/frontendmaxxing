/* ============================================
   SIGNATURE PAD — Smoothed pen-input canvas
   Inspired by WatermelonUI draw-signature
   ============================================
   Usage:
     var pad = SignaturePad.init('[data-sigpad]', {
       strokeColor: '#0a0a14',
       strokeWidth: 2.4,
       smoothing: 0.5,
       onChange: function (isEmpty) {},
       onSave: function (dataUrl) {}
     });
     pad.clear(); pad.toDataURL(); pad.isEmpty();
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    strokeColor: '#0a0a14',
    strokeWidth: 2.4,
    smoothing: 0.5,
    onChange: null,
    onSave: null
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var insts = [];
    Array.prototype.forEach.call(els, function (el) { insts.push(create(el, opts)); });
    return insts.length === 1 ? insts[0] : insts;
  }

  function create(host, opts) {
    var o = mergeOpts(opts);
    var canvas = host.querySelector('.sigpad-canvas');
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var drawing = false, last = null, points = [], empty = true;

    function resize() {
      var rect = canvas.getBoundingClientRect();
      var w = rect.width, h = rect.height;
      var data = empty ? null : canvas.toDataURL();
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = o.strokeColor;
      ctx.lineWidth = o.strokeWidth;
      if (data) {
        var img = new Image();
        img.onload = function () { ctx.drawImage(img, 0, 0, w, h); };
        img.src = data;
      }
    }
    resize();
    window.addEventListener('resize', resize);

    function ptFromEvent(e) {
      var rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    canvas.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      drawing = true;
      try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
      var p = ptFromEvent(e);
      last = p; points = [p];
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    });

    canvas.addEventListener('pointermove', function (e) {
      if (!drawing) return;
      var p = ptFromEvent(e);
      var smooth = o.smoothing;
      var mid = { x: (last.x + p.x) / 2, y: (last.y + p.y) / 2 };
      ctx.quadraticCurveTo(last.x, last.y, mid.x, mid.y);
      ctx.stroke();
      last = p;
      if (empty) {
        empty = false;
        host.classList.add('is-signed');
        if (typeof o.onChange === 'function') o.onChange(false);
      }
    });

    canvas.addEventListener('pointerup', function () {
      if (!drawing) return;
      drawing = false;
      ctx.beginPath();
    });

    function clear() {
      var rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      empty = true;
      host.classList.remove('is-signed');
      if (typeof o.onChange === 'function') o.onChange(true);
    }
    function isEmpty() { return empty; }
    function toDataURL(type) { return canvas.toDataURL(type || 'image/png'); }

    var clearBtn = host.querySelector('.sigpad-clear');
    var saveBtn  = host.querySelector('.sigpad-save');
    if (clearBtn) clearBtn.addEventListener('click', clear);
    if (saveBtn)  saveBtn.addEventListener('click', function () {
      if (empty) return;
      var url = toDataURL();
      if (typeof o.onSave === 'function') o.onSave(url);
    });

    return { el: host, clear: clear, isEmpty: isEmpty, toDataURL: toDataURL };
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var SignaturePad = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = SignaturePad;
  else root.SignaturePad = SignaturePad;
})(typeof window !== 'undefined' ? window : this);
