/* ============================================
   CURSOR REPEL — Push elements away from the cursor (or pull them toward it)
   ============================================
   Each target element drifts away from (or toward) the cursor with spring
   physics. Great for playful product pages, "scattered" galleries that
   reassemble, and interactive headlines.

   Usage:
     <div class="repel-stage" data-repel>
       <span class="repel-item">A</span>
       <span class="repel-item">B</span>
       <span class="repel-item">C</span>
     </div>

     CursorRepel.init('.repel-stage', {
       mode: 'repel',         // 'repel' | 'attract'
       radius: 200,           // px — falloff distance
       strength: 80,          // max displacement
       lerp: 0.18,            // spring rate
       itemSelector: '.repel-item'
     });

     instance.destroy();
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    mode: 'repel',
    radius: 200,
    strength: 80,
    lerp: 0.18,
    itemSelector: '[data-repel-item], .repel-item',
    rotate: false,           // also tilt items
    fadeOut: false           // fade items further from cursor
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var insts = [];
    Array.prototype.forEach.call(els, function (el) { insts.push(create(el, opts)); });
    return insts.length === 1 ? insts[0] : insts;
  }

  function create(stage, opts) {
    var o = mergeOpts(opts);
    var items = Array.from(stage.querySelectorAll(o.itemSelector)).map(function (el) {
      el.style.willChange = 'transform';
      return { el: el, x: 0, y: 0, tx: 0, ty: 0 };
    });

    var mouse = { x: -9999, y: -9999, inside: false };
    var rafId = null;

    function onMove(e) {
      var r = stage.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.inside = true;
      if (!rafId) tick();
    }
    function onLeave() {
      mouse.inside = false;
      mouse.x = -9999;
      mouse.y = -9999;
    }
    function tick() {
      var active = false;
      items.forEach(function (item) {
        var r = item.el.getBoundingClientRect();
        var sr = stage.getBoundingClientRect();
        var cx = r.left - sr.left + r.width / 2;
        var cy = r.top - sr.top + r.height / 2;
        if (mouse.inside) {
          var dx = mouse.x - cx;
          var dy = mouse.y - cy;
          var dist = Math.hypot(dx, dy);
          if (dist < o.radius && dist > 0) {
            var falloff = (1 - dist / o.radius);
            var force = falloff * o.strength;
            var dir = (o.mode === 'repel' ? -1 : 1);
            item.tx = dir * (dx / dist) * force;
            item.ty = dir * (dy / dist) * force;
          } else {
            item.tx = 0; item.ty = 0;
          }
        } else {
          item.tx = 0; item.ty = 0;
        }
        item.x += (item.tx - item.x) * o.lerp;
        item.y += (item.ty - item.y) * o.lerp;
        var rotateStr = '';
        if (o.rotate) {
          rotateStr = ' rotate(' + (item.x * 0.3).toFixed(2) + 'deg)';
        }
        item.el.style.transform = 'translate(' + item.x.toFixed(1) + 'px,' + item.y.toFixed(1) + 'px)' + rotateStr;
        if (o.fadeOut && mouse.inside) {
          var d = Math.hypot(item.x, item.y);
          item.el.style.opacity = Math.max(0.3, 1 - d / (o.strength * 1.6)).toFixed(2);
        }
        if (Math.abs(item.tx - item.x) > 0.1 || Math.abs(item.ty - item.y) > 0.1) active = true;
      });
      rafId = active ? requestAnimationFrame(tick) : null;
    }

    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);

    function destroy() {
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(rafId);
      items.forEach(function (i) { i.el.style.transform = ''; i.el.style.opacity = ''; });
    }

    return { stage: stage, destroy: destroy };
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var CursorRepel = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = CursorRepel;
  else root.CursorRepel = CursorRepel;
})(typeof window !== 'undefined' ? window : this);
