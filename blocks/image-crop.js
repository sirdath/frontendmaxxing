/* ============================================
   IMAGE CROP — Drag-to-move + drag-to-resize selection
   ============================================
   Usage:
     ImageCrop.init('[data-image-crop]', {
       aspect: null,    // e.g. 1 for square, 16/9, or null = free
       onChange: function (rect) { … },  // { x, y, w, h } in percent
       onCrop:   function (dataURL) {…}  // produces cropped result via canvas
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    aspect: null,
    onChange: null,
    onCrop: null
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

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var img = el.querySelector('img');
    var sel = el.querySelector('.icrop-sel');
    if (!img || !sel) return { el: el, destroy: function () {} };

    var rect = { x: 10, y: 10, w: 80, h: 80 }; // percent

    function paint() {
      el.style.setProperty('--x', rect.x + '%');
      el.style.setProperty('--y', rect.y + '%');
      el.style.setProperty('--w', rect.w + '%');
      el.style.setProperty('--h', rect.h + '%');
      el.style.setProperty('--mask',
        'linear-gradient(#000 0 0)' +
        ' '); // (we keep simple semi-transparent overlay; selection has its own border)
      if (typeof o.onChange === 'function') o.onChange(Object.assign({}, rect));
    }
    paint();

    function applyAspect() {
      if (!o.aspect) return;
      var bounds = el.getBoundingClientRect();
      // Keep width, derive height to maintain aspect
      rect.h = (rect.w * bounds.width / o.aspect) / bounds.height * 100;
      rect.h = clamp(rect.h, 5, 100 - rect.y);
    }

    function startDrag(target, mode) {
      target.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        e.stopPropagation();
        target.setPointerCapture(e.pointerId);
        var b = el.getBoundingClientRect();
        var startX = e.clientX, startY = e.clientY;
        var start = { x: rect.x, y: rect.y, w: rect.w, h: rect.h };
        function move(ev) {
          var dxPct = (ev.clientX - startX) / b.width * 100;
          var dyPct = (ev.clientY - startY) / b.height * 100;
          if (mode === 'move') {
            rect.x = clamp(start.x + dxPct, 0, 100 - start.w);
            rect.y = clamp(start.y + dyPct, 0, 100 - start.h);
          } else if (mode === 'se') {
            rect.w = clamp(start.w + dxPct, 5, 100 - start.x);
            rect.h = clamp(start.h + dyPct, 5, 100 - start.y);
            if (o.aspect) applyAspect();
          } else if (mode === 'ne') {
            rect.y = clamp(start.y + dyPct, 0, start.y + start.h - 5);
            rect.h = clamp(start.h - dyPct, 5, start.y + start.h);
            rect.w = clamp(start.w + dxPct, 5, 100 - start.x);
            if (o.aspect) applyAspect();
          } else if (mode === 'sw') {
            rect.x = clamp(start.x + dxPct, 0, start.x + start.w - 5);
            rect.w = clamp(start.w - dxPct, 5, start.x + start.w);
            rect.h = clamp(start.h + dyPct, 5, 100 - start.y);
            if (o.aspect) applyAspect();
          } else if (mode === 'nw') {
            rect.x = clamp(start.x + dxPct, 0, start.x + start.w - 5);
            rect.y = clamp(start.y + dyPct, 0, start.y + start.h - 5);
            rect.w = clamp(start.w - dxPct, 5, start.x + start.w);
            rect.h = clamp(start.h - dyPct, 5, start.y + start.h);
            if (o.aspect) applyAspect();
          }
          paint();
        }
        function up() {
          target.removeEventListener('pointermove', move);
          target.removeEventListener('pointerup', up);
        }
        target.addEventListener('pointermove', move);
        target.addEventListener('pointerup', up);
      });
    }

    startDrag(sel, 'move');
    el.querySelectorAll('.icrop-handle').forEach(function (h) {
      var mode = h.classList.contains('nw') ? 'nw' :
                 h.classList.contains('ne') ? 'ne' :
                 h.classList.contains('sw') ? 'sw' : 'se';
      startDrag(h, mode);
    });

    function crop() {
      return new Promise(function (resolve) {
        var i = new Image();
        i.crossOrigin = 'anonymous';
        i.onload = function () {
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          var sx = (rect.x / 100) * i.naturalWidth;
          var sy = (rect.y / 100) * i.naturalHeight;
          var sw = (rect.w / 100) * i.naturalWidth;
          var sh = (rect.h / 100) * i.naturalHeight;
          canvas.width = sw; canvas.height = sh;
          ctx.drawImage(i, sx, sy, sw, sh, 0, 0, sw, sh);
          var url = canvas.toDataURL('image/png');
          resolve(url);
          if (typeof o.onCrop === 'function') o.onCrop(url);
        };
        i.src = img.src;
      });
    }

    return {
      el: el,
      getRect: function () { return Object.assign({}, rect); },
      crop: crop,
      destroy: function () {}
    };
  }

  var ImageCrop = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = ImageCrop;
  else root.ImageCrop = ImageCrop;
})(typeof window !== 'undefined' ? window : this);
