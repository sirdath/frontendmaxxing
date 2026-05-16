/* ============================================
   INFINITE CANVAS — Pan + wheel-anchored zoom + viewport math
   Inspired by tldraw, Excalidraw, Figma
   ============================================
   Usage:
     var canvas = InfiniteCanvas.init('.icv', {
       minZoom: 0.1, maxZoom: 8, initialZoom: 1,
       onTransform: function ({ tx, ty, zoom }) { ... },
       enablePan: true,
       enableZoom: true,
       enableSpaceDrag: true,
       enableMarquee: false,
       onMarquee: function ({ x, y, w, h, world: {x,y,w,h} }) {}
     });

     // Manual control:
     canvas.setZoom(1.5);                // around viewport center
     canvas.setZoom(1.5, { x: 200, y: 100 });   // around a screen point
     canvas.panTo(100, 200);             // world coords
     canvas.zoomToFit(bounds);
     canvas.screenToWorld({ x, y });
     canvas.worldToScreen({ x, y });
     canvas.reset();
     canvas.destroy();
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    minZoom: 0.1,
    maxZoom: 8,
    initialZoom: 1,
    zoomSpeed: 0.0012,
    pinchSpeed: 0.012,
    enablePan: true,
    enableZoom: true,
    enableSpaceDrag: true,
    enableMarquee: false,
    onTransform: null,
    onMarquee: null,
    inertia: 0.92,
    keyboardPanStep: 40
  };

  function init(target, opts) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return null;
    var o = mergeOpts(opts);

    var state = { tx: 0, ty: 0, zoom: o.initialZoom };
    var panning = false;
    var spaceDown = false;
    var lastX = 0, lastY = 0;
    var vx = 0, vy = 0;
    var inertiaRAF = null;

    var hud = el.querySelector('.icv-hud');

    function apply() {
      el.style.setProperty('--icv-tx', state.tx + 'px');
      el.style.setProperty('--icv-ty', state.ty + 'px');
      el.style.setProperty('--icv-zoom', state.zoom);
      if (hud) {
        var lv = hud.querySelector('.icv-hud-level');
        if (lv) lv.textContent = Math.round(state.zoom * 100) + '%';
      }
      if (typeof o.onTransform === 'function') o.onTransform({ tx: state.tx, ty: state.ty, zoom: state.zoom });
    }

    function setZoom(z, anchor) {
      var newZoom = Math.max(o.minZoom, Math.min(o.maxZoom, z));
      if (anchor) {
        // Zoom toward a screen point: keep world point under cursor fixed
        var wx = (anchor.x - state.tx) / state.zoom;
        var wy = (anchor.y - state.ty) / state.zoom;
        state.tx = anchor.x - wx * newZoom;
        state.ty = anchor.y - wy * newZoom;
      }
      state.zoom = newZoom;
      apply();
    }

    function panBy(dx, dy) {
      state.tx += dx;
      state.ty += dy;
      apply();
    }

    function panTo(wx, wy) {
      var rect = el.getBoundingClientRect();
      state.tx = rect.width / 2 - wx * state.zoom;
      state.ty = rect.height / 2 - wy * state.zoom;
      apply();
    }

    function zoomToFit(bounds, padding) {
      padding = padding == null ? 60 : padding;
      var rect = el.getBoundingClientRect();
      var scaleX = (rect.width - padding * 2) / bounds.width;
      var scaleY = (rect.height - padding * 2) / bounds.height;
      var z = Math.min(scaleX, scaleY, o.maxZoom);
      z = Math.max(z, o.minZoom);
      state.zoom = z;
      state.tx = rect.width / 2 - (bounds.x + bounds.width / 2) * z;
      state.ty = rect.height / 2 - (bounds.y + bounds.height / 2) * z;
      apply();
    }

    function reset() {
      state.tx = 0; state.ty = 0; state.zoom = o.initialZoom;
      apply();
    }

    function screenToWorld(p) {
      return { x: (p.x - state.tx) / state.zoom, y: (p.y - state.ty) / state.zoom };
    }
    function worldToScreen(p) {
      return { x: p.x * state.zoom + state.tx, y: p.y * state.zoom + state.ty };
    }

    function getRel(e) {
      var rect = el.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    // ===== Pan =====
    function onPointerDown(e) {
      if (!o.enablePan) return;
      // Only middle button, space-drag, or empty-canvas click
      var allowPan = e.button === 1 || spaceDown || (e.button === 0 && (e.target === el || e.target.classList.contains('icv-grid') || e.target.classList.contains('icv-world')));
      if (e.button === 0 && o.enableMarquee && !allowPan) {
        startMarquee(e);
        return;
      }
      if (!allowPan) return;
      e.preventDefault();
      panning = true;
      lastX = e.clientX; lastY = e.clientY;
      vx = vy = 0;
      el.classList.add('is-panning');
      try { el.setPointerCapture(e.pointerId); } catch (_) {}
      cancelInertia();
    }
    function onPointerMove(e) {
      if (!panning) return;
      var dx = e.clientX - lastX;
      var dy = e.clientY - lastY;
      vx = dx; vy = dy;
      lastX = e.clientX; lastY = e.clientY;
      panBy(dx, dy);
    }
    function onPointerUp(e) {
      if (!panning) return;
      panning = false;
      el.classList.remove('is-panning');
      try { el.releasePointerCapture(e.pointerId); } catch (_) {}
      // Inertia
      startInertia();
    }

    function startInertia() {
      cancelInertia();
      function step() {
        if (Math.abs(vx) < 0.2 && Math.abs(vy) < 0.2) return;
        panBy(vx, vy);
        vx *= o.inertia; vy *= o.inertia;
        inertiaRAF = requestAnimationFrame(step);
      }
      inertiaRAF = requestAnimationFrame(step);
    }
    function cancelInertia() {
      if (inertiaRAF) { cancelAnimationFrame(inertiaRAF); inertiaRAF = null; }
    }

    // ===== Wheel zoom =====
    function onWheel(e) {
      if (!o.enableZoom) return;
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        // Pinch-zoom (trackpad sends ctrlKey)
        var p = getRel(e);
        var dz = Math.exp(-e.deltaY * o.pinchSpeed);
        setZoom(state.zoom * dz, p);
      } else if (e.shiftKey) {
        // Shift+wheel = horizontal pan
        panBy(-e.deltaY, 0);
      } else if (e.altKey) {
        // Alt+wheel = zoom
        var p2 = getRel(e);
        var dz2 = Math.exp(-e.deltaY * o.zoomSpeed * 2);
        setZoom(state.zoom * dz2, p2);
      } else {
        // Wheel pan
        panBy(-e.deltaX, -e.deltaY);
      }
    }

    // ===== Touch pinch =====
    var touchState = null;
    function onTouchStart(e) {
      if (e.touches.length === 2) {
        var t1 = e.touches[0], t2 = e.touches[1];
        var rect = el.getBoundingClientRect();
        touchState = {
          dist: Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY),
          zoom: state.zoom,
          cx: (t1.clientX + t2.clientX) / 2 - rect.left,
          cy: (t1.clientY + t2.clientY) / 2 - rect.top
        };
      }
    }
    function onTouchMove(e) {
      if (touchState && e.touches.length === 2) {
        e.preventDefault();
        var t1 = e.touches[0], t2 = e.touches[1];
        var d = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        setZoom(touchState.zoom * d / touchState.dist, { x: touchState.cx, y: touchState.cy });
      }
    }
    function onTouchEnd() { touchState = null; }

    // ===== Space-drag =====
    function onKeyDown(e) {
      if (!o.enableSpaceDrag) return;
      if (e.code === 'Space' && !spaceDown && document.activeElement === document.body) {
        e.preventDefault();
        spaceDown = true;
        el.style.cursor = 'grab';
      }
      // Keyboard pan
      if (e.code === 'ArrowLeft')  panBy(o.keyboardPanStep, 0);
      if (e.code === 'ArrowRight') panBy(-o.keyboardPanStep, 0);
      if (e.code === 'ArrowUp')    panBy(0, o.keyboardPanStep);
      if (e.code === 'ArrowDown')  panBy(0, -o.keyboardPanStep);
      // Zoom presets
      if ((e.ctrlKey || e.metaKey) && e.key === '0') { e.preventDefault(); reset(); }
      if ((e.ctrlKey || e.metaKey) && e.key === '=') { e.preventDefault(); setZoom(state.zoom * 1.2); }
      if ((e.ctrlKey || e.metaKey) && e.key === '-') { e.preventDefault(); setZoom(state.zoom / 1.2); }
    }
    function onKeyUp(e) {
      if (e.code === 'Space') { spaceDown = false; el.style.cursor = ''; }
    }

    // ===== Marquee =====
    var marquee = null;
    var marqueeStart = null;
    function startMarquee(e) {
      var p = getRel(e);
      marqueeStart = p;
      marquee = document.createElement('div');
      marquee.className = 'icv-marquee';
      marquee.style.left = p.x + 'px';
      marquee.style.top = p.y + 'px';
      el.appendChild(marquee);
      var move = function (ev) {
        var pp = getRel(ev);
        var x = Math.min(marqueeStart.x, pp.x);
        var y = Math.min(marqueeStart.y, pp.y);
        var w = Math.abs(pp.x - marqueeStart.x);
        var h = Math.abs(pp.y - marqueeStart.y);
        marquee.style.left = x + 'px';
        marquee.style.top = y + 'px';
        marquee.style.width = w + 'px';
        marquee.style.height = h + 'px';
      };
      var up = function (ev) {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        var pp = getRel(ev);
        var x = Math.min(marqueeStart.x, pp.x);
        var y = Math.min(marqueeStart.y, pp.y);
        var w = Math.abs(pp.x - marqueeStart.x);
        var h = Math.abs(pp.y - marqueeStart.y);
        var world = {
          x: (x - state.tx) / state.zoom,
          y: (y - state.ty) / state.zoom,
          w: w / state.zoom,
          h: h / state.zoom
        };
        if (marquee && marquee.parentNode) marquee.parentNode.removeChild(marquee);
        marquee = null;
        if (typeof o.onMarquee === 'function') o.onMarquee({ x: x, y: y, w: w, h: h, world: world });
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    }

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // HUD wiring
    if (hud) {
      hud.querySelectorAll('[data-icv-action]').forEach(function (b) {
        b.addEventListener('click', function () {
          var a = b.dataset.icvAction;
          if (a === 'zoom-in')  setZoom(state.zoom * 1.2);
          if (a === 'zoom-out') setZoom(state.zoom / 1.2);
          if (a === 'reset')    reset();
        });
      });
      var lv = hud.querySelector('.icv-hud-level');
      if (lv) lv.addEventListener('click', reset);
    }

    apply();

    function destroy() {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      cancelInertia();
    }

    return {
      el: el,
      setZoom: setZoom,
      panBy: panBy,
      panTo: panTo,
      zoomToFit: zoomToFit,
      reset: reset,
      screenToWorld: screenToWorld,
      worldToScreen: worldToScreen,
      getTransform: function () { return { tx: state.tx, ty: state.ty, zoom: state.zoom }; },
      destroy: destroy
    };
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var InfiniteCanvas = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = InfiniteCanvas;
  else root.InfiniteCanvas = InfiniteCanvas;
})(typeof window !== 'undefined' ? window : this);
