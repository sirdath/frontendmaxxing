/* ============================================
   RESIZABLE PANELS — Drag handles to resize sibling panels
   Inspired by VSCode / Linear / Notion
   ============================================
   Usage:
     ResizablePanels.init('[data-resizable-panels]', {
       direction: 'horizontal',     // 'horizontal' | 'vertical'
       persistKey: null,            // optional localStorage key
       onResize: function (sizes) { … }
     });

   Reads `direction` from `data-direction` if not in opts.
   Each `.rpan-panel` can have `data-min` / `data-max` in pixels.
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    direction: 'horizontal',
    persistKey: null,
    onResize: null
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    if (el.getAttribute('data-direction') === 'vertical') o.direction = 'vertical';
    if (o.direction === 'vertical') el.classList.add('rpan-vertical');

    var panels = Array.prototype.slice.call(el.querySelectorAll('.rpan-panel'));
    var handles = Array.prototype.slice.call(el.querySelectorAll('.rpan-handle'));
    var axis = o.direction === 'vertical' ? 'Y' : 'X';
    var sizeProp = axis === 'Y' ? 'height' : 'width';
    var clientProp = 'client' + axis;

    // Restore saved sizes
    if (o.persistKey) {
      try {
        var saved = JSON.parse(localStorage.getItem(o.persistKey));
        if (Array.isArray(saved)) panels.forEach(function (p, i) { if (saved[i]) p.style.flex = '0 0 ' + saved[i] + 'px'; });
      } catch (e) {}
    }

    function save() {
      if (!o.persistKey) return;
      var sizes = panels.map(function (p) { return p.getBoundingClientRect()[sizeProp]; });
      try { localStorage.setItem(o.persistKey, JSON.stringify(sizes)); } catch (e) {}
    }

    handles.forEach(function (h, i) {
      var left = panels[i];
      var right = panels[i + 1];
      if (!left || !right) return;
      h.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        h.setPointerCapture(e.pointerId);
        h.classList.add('is-active');
        var startPos = axis === 'Y' ? e.clientY : e.clientX;
        var leftRect = left.getBoundingClientRect();
        var rightRect = right.getBoundingClientRect();
        var leftStart = leftRect[sizeProp];
        var rightStart = rightRect[sizeProp];
        var leftMin = parseFloat(left.getAttribute('data-min')) || 80;
        var leftMax = parseFloat(left.getAttribute('data-max')) || Infinity;
        var rightMin = parseFloat(right.getAttribute('data-min')) || 80;

        function onMove(ev) {
          var pos = axis === 'Y' ? ev.clientY : ev.clientX;
          var delta = pos - startPos;
          var newLeft = Math.max(leftMin, Math.min(leftMax, leftStart + delta));
          var maxAllowed = leftStart + rightStart - rightMin;
          newLeft = Math.min(newLeft, maxAllowed);
          var newRight = leftStart + rightStart - newLeft;
          left.style.flex = '0 0 ' + newLeft + 'px';
          right.style.flex = '0 0 ' + newRight + 'px';
        }
        function onUp() {
          h.classList.remove('is-active');
          document.removeEventListener('pointermove', onMove);
          document.removeEventListener('pointerup', onUp);
          save();
          if (typeof o.onResize === 'function') {
            o.onResize(panels.map(function (p) { return p.getBoundingClientRect()[sizeProp]; }));
          }
        }
        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp);
      });
    });

    function destroy() {
      handles.forEach(function (h) { h.replaceWith(h.cloneNode(true)); });
    }

    return { el: el, destroy: destroy };
  }

  var ResizablePanels = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = ResizablePanels;
  else root.ResizablePanels = ResizablePanels;
})(typeof window !== 'undefined' ? window : this);
