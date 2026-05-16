/* ============================================
   CURSOR PAINT — Drag-to-paint with the cursor on a canvas
   ============================================
   Turns any container into a paint surface. Cursor leaves color where it
   drags. Useful for signature pads, doodle canvases, color picker demos,
   "scratch to reveal" moments.

   Usage:
     <canvas class="cpaint" data-cpaint width="640" height="320"></canvas>

     CursorPaint.bind('[data-cpaint]', {
       color: '#8b5cf6',
       lineWidth: 8,
       smoothing: 0.45,        // 0..1 — bezier smoothing
       autoFade: 0,            // ms before strokes fade (0 = persistent)
       rainbow: false,         // continuous hue shift while drawing
       glow: false,            // soft glow on stroke
       eraser: false
     });

     instance.clear();
     instance.exportImage()    // → base64 PNG dataURL
     instance.destroy();

   Toolbar example:
     CursorPaint.bind('#pad', { color: '#fff' });
     CursorPaint.setColor('[data-cpaint]', '#ec4899');
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    color: '#ffffff',
    lineWidth: 8,
    smoothing: 0.4,
    autoFade: 0,
    rainbow: false,
    glow: false,
    eraser: false,
    background: null      // optional fill color
  };

  function bind(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var insts = [];
    Array.prototype.forEach.call(els, function (el) { insts.push(create(el, opts)); });
    return insts.length === 1 ? insts[0] : insts;
  }

  function create(canvas, opts) {
    var o = mergeOpts(opts);
    if (canvas.tagName !== 'CANVAS') return null;
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;

    function resize() {
      var rect = canvas.getBoundingClientRect();
      var w = canvas.width = Math.round(rect.width * dpr);
      var h = canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (o.background) {
        ctx.fillStyle = o.background;
        ctx.fillRect(0, 0, rect.width, rect.height);
      }
    }
    resize();
    window.addEventListener('resize', resize);

    var drawing = false;
    var last = null;
    var hue = 0;

    function getPoint(e) {
      var r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    function down(e) {
      e.preventDefault();
      drawing = true;
      last = getPoint(e);
      try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
    }
    function move(e) {
      if (!drawing) return;
      var p = getPoint(e);
      // Smooth: midpoint between last and current as quad control
      var mid = { x: (last.x + p.x) / 2, y: (last.y + p.y) / 2 };
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = o.lineWidth;
      if (o.eraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = o.rainbow ? 'hsl(' + (hue += 4) % 360 + ', 90%, 60%)' : o.color;
      }
      if (o.glow) {
        ctx.shadowBlur = o.lineWidth * 2;
        ctx.shadowColor = ctx.strokeStyle;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.quadraticCurveTo(mid.x, mid.y, p.x, p.y);
      ctx.stroke();
      last = p;
    }
    function up(e) {
      drawing = false;
      try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
    }

    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);

    // Optional auto-fade
    var fadeIv = null;
    if (o.autoFade > 0) {
      fadeIv = setInterval(function () {
        var rect = canvas.getBoundingClientRect();
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,0.04)';
        ctx.fillRect(0, 0, rect.width, rect.height);
        ctx.restore();
      }, 60);
    }

    function clear() {
      var rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      if (o.background) {
        ctx.fillStyle = o.background;
        ctx.fillRect(0, 0, rect.width, rect.height);
      }
    }
    function exportImage() { return canvas.toDataURL('image/png'); }
    function setColor(c) { o.color = c; o.eraser = false; }
    function setEraser(on) { o.eraser = !!on; }
    function setLineWidth(w) { o.lineWidth = w; }
    function setRainbow(on) { o.rainbow = !!on; }
    function setGlow(on) { o.glow = !!on; }

    function destroy() {
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
      window.removeEventListener('resize', resize);
      if (fadeIv) clearInterval(fadeIv);
    }

    return {
      canvas: canvas,
      clear: clear,
      exportImage: exportImage,
      setColor: setColor,
      setEraser: setEraser,
      setLineWidth: setLineWidth,
      setRainbow: setRainbow,
      setGlow: setGlow,
      destroy: destroy
    };
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var CursorPaint = { bind: bind };
  if (typeof module !== 'undefined' && module.exports) module.exports = CursorPaint;
  else root.CursorPaint = CursorPaint;
})(typeof window !== 'undefined' ? window : this);
