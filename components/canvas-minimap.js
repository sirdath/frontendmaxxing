/* ============================================
   CANVAS MINIMAP — Bidirectional viewport rect (drag rect to pan, pan to move rect)
   Inspired by tldraw, Figma minimaps
   ============================================
   Usage:
     // 1) Bind to an InfiniteCanvas instance:
     var canvas = InfiniteCanvas.init('.icv');
     var minimap = CanvasMinimap.bind('.cmm', {
       canvas: canvas,                       // or '.icv' selector
       getBounds: function () { ... },       // optional: returns world bbox to render
       nodeSelector: '.icv-node',             // selector for shapes to draw as rects
       renderShape: function (ctx, el, mm) { ... }   // custom shape draw
     });

     minimap.refresh();      // re-render from current scene
     minimap.destroy();
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    canvas: null,
    nodeSelector: '.icv-node, .icv-world > *',
    padding: 60,
    minWorldSize: 1200,
    renderShape: null,
    fillColor: 'rgba(139, 92, 246, 0.5)',
    strokeColor: 'rgba(139, 92, 246, 0.8)'
  };

  function bind(target, opts) {
    var mm = typeof target === 'string' ? document.querySelector(target) : target;
    if (!mm) return null;
    var o = mergeOpts(opts);

    var canvas = typeof o.canvas === 'string'
      ? findCanvas(o.canvas)
      : (o.canvas && o.canvas.el ? o.canvas : findCanvas(o.canvas));
    if (!canvas) {
      console.warn('CanvasMinimap: canvas not found');
      return null;
    }
    var canvasEl = canvas.el || canvas;
    var infinite = canvas.setZoom ? canvas : null;

    var cnv = mm.querySelector('.cmm-canvas');
    if (!cnv) {
      cnv = document.createElement('canvas');
      cnv.className = 'cmm-canvas';
      mm.appendChild(cnv);
    }
    var viewport = mm.querySelector('.cmm-viewport');
    if (!viewport) {
      viewport = document.createElement('div');
      viewport.className = 'cmm-viewport';
      mm.appendChild(viewport);
    }

    var ctx = cnv.getContext('2d');
    var dpr = window.devicePixelRatio || 1;

    function resize() {
      var rect = mm.getBoundingClientRect();
      cnv.width = rect.width * dpr;
      cnv.height = rect.height * dpr;
      cnv.style.width = rect.width + 'px';
      cnv.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function getNodeBounds() {
      var nodes = canvasEl.querySelectorAll(o.nodeSelector);
      if (!nodes.length) return { x: 0, y: 0, w: o.minWorldSize, h: o.minWorldSize * 0.75 };
      var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      Array.prototype.forEach.call(nodes, function (n) {
        var x = parseFloat(n.style.left || 0);
        var y = parseFloat(n.style.top || 0);
        var r = n.getBoundingClientRect();
        var w = r.width / (infinite ? infinite.getTransform().zoom : 1);
        var h = r.height / (infinite ? infinite.getTransform().zoom : 1);
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x + w);
        maxY = Math.max(maxY, y + h);
      });
      // Pad
      var pad = o.padding;
      return {
        x: minX - pad, y: minY - pad,
        w: Math.max(o.minWorldSize, maxX - minX + pad * 2),
        h: Math.max(o.minWorldSize * 0.75, maxY - minY + pad * 2)
      };
    }

    function render() {
      resize();
      var rect = mm.getBoundingClientRect();
      var bounds = (o.getBounds ? o.getBounds() : getNodeBounds());
      var scaleX = rect.width / bounds.w;
      var scaleY = rect.height / bounds.h;
      var scale = Math.min(scaleX, scaleY);
      var offsetX = (rect.width - bounds.w * scale) / 2;
      var offsetY = (rect.height - bounds.h * scale) / 2;

      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw shapes
      var nodes = canvasEl.querySelectorAll(o.nodeSelector);
      Array.prototype.forEach.call(nodes, function (n) {
        var x = parseFloat(n.style.left || 0) - bounds.x;
        var y = parseFloat(n.style.top || 0) - bounds.y;
        var z = infinite ? infinite.getTransform().zoom : 1;
        var r = n.getBoundingClientRect();
        var w = r.width / z;
        var h = r.height / z;
        var mx = offsetX + x * scale;
        var my = offsetY + y * scale;
        var mw = Math.max(1, w * scale);
        var mh = Math.max(1, h * scale);
        if (typeof o.renderShape === 'function') {
          o.renderShape(ctx, n, { x: mx, y: my, w: mw, h: mh, scale: scale });
        } else {
          ctx.fillStyle = o.fillColor;
          ctx.strokeStyle = o.strokeColor;
          ctx.fillRect(mx, my, mw, mh);
          ctx.strokeRect(mx + 0.5, my + 0.5, mw, mh);
        }
      });

      // Update viewport rectangle
      if (infinite) {
        var t = infinite.getTransform();
        var cRect = canvasEl.getBoundingClientRect();
        var viewW = cRect.width / t.zoom;
        var viewH = cRect.height / t.zoom;
        var viewX = -t.tx / t.zoom;
        var viewY = -t.ty / t.zoom;
        var vx = offsetX + (viewX - bounds.x) * scale;
        var vy = offsetY + (viewY - bounds.y) * scale;
        var vw = viewW * scale;
        var vh = viewH * scale;
        viewport.style.setProperty('--cmm-vx', vx + 'px');
        viewport.style.setProperty('--cmm-vy', vy + 'px');
        viewport.style.setProperty('--cmm-vw', vw + 'px');
        viewport.style.setProperty('--cmm-vh', vh + 'px');
        viewport._state = { bounds: bounds, scale: scale, offsetX: offsetX, offsetY: offsetY };
      }
    }

    // Re-render on canvas transform or on a tick (for now: poll at low rate + observe resize)
    var pollId = setInterval(render, 200);
    var ro = new ResizeObserver(render);
    ro.observe(mm);
    ro.observe(canvasEl);

    // Bidirectional drag — drag the viewport rectangle to pan the canvas
    var dragging = false, dragOffset = null;
    viewport.addEventListener('pointerdown', function (e) {
      if (!infinite) return;
      e.preventDefault(); e.stopPropagation();
      dragging = true;
      viewport.classList.add('is-dragging');
      try { viewport.setPointerCapture(e.pointerId); } catch (_) {}
      var vRect = viewport.getBoundingClientRect();
      dragOffset = { x: e.clientX - vRect.left, y: e.clientY - vRect.top };
    });
    viewport.addEventListener('pointermove', function (e) {
      if (!dragging || !viewport._state) return;
      var mmRect = mm.getBoundingClientRect();
      var localX = e.clientX - mmRect.left - dragOffset.x;
      var localY = e.clientY - mmRect.top - dragOffset.y;
      var s = viewport._state;
      var worldX = (localX - s.offsetX) / s.scale + s.bounds.x;
      var worldY = (localY - s.offsetY) / s.scale + s.bounds.y;
      var t = infinite.getTransform();
      var cRect = canvasEl.getBoundingClientRect();
      // We want viewX = worldX  → tx = -worldX * zoom
      infinite.panBy(-worldX * t.zoom - t.tx, -worldY * t.zoom - t.ty);
    });
    viewport.addEventListener('pointerup', function (e) {
      dragging = false;
      viewport.classList.remove('is-dragging');
      try { viewport.releasePointerCapture(e.pointerId); } catch (_) {}
    });

    // Click anywhere on minimap (not on viewport) to center
    cnv.addEventListener('click', function (e) {
      if (!infinite || !viewport._state) return;
      var mmRect = mm.getBoundingClientRect();
      var localX = e.clientX - mmRect.left;
      var localY = e.clientY - mmRect.top;
      var s = viewport._state;
      var worldX = (localX - s.offsetX) / s.scale + s.bounds.x;
      var worldY = (localY - s.offsetY) / s.scale + s.bounds.y;
      infinite.panTo(worldX, worldY);
    });

    function destroy() {
      clearInterval(pollId);
      ro.disconnect();
    }

    render();

    return { el: mm, refresh: render, destroy: destroy };
  }

  function findCanvas(sel) {
    var el = typeof sel === 'string' ? document.querySelector(sel) : sel;
    if (!el) return null;
    return el;
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var CanvasMinimap = { bind: bind };
  if (typeof module !== 'undefined' && module.exports) module.exports = CanvasMinimap;
  else root.CanvasMinimap = CanvasMinimap;
})(typeof window !== 'undefined' ? window : this);
