/* ============================================
   GRAVITY — Lightweight 2D physics for DOM elements (Matter.js-lite)
   Inspired by Fancy Components "Gravity", physics playgrounds
   ============================================
   Drops DOM elements as rigid bodies into a gravity well. Elements bounce
   off floor / walls / other elements, can be flicked, attracted to cursor, etc.

   Usage:
     <div class="grv-stage" data-grv style="height: 400px;">
       <span class="grv-body" data-grv-body>Hi</span>
       <span class="grv-body" data-grv-body>👋</span>
       <span class="grv-body" data-grv-body>🚀</span>
     </div>

     Gravity.create('[data-grv]', {
       gravity: 0.5,
       bounce: 0.55,
       friction: 0.985,
       cursorMode: 'attract' | 'repel' | 'none',
       cursorStrength: 600,
       boundary: 'floor' | 'walls' | 'all'    // default 'all'
     });

   Methods:
     instance.add(el)            — add a new body
     instance.remove(el)
     instance.shake(strength)    — apply random impulses
     instance.flick(el, vx, vy)
     instance.pause(); .play();
     instance.destroy();
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    gravity: 0.5,
    bounce: 0.55,
    friction: 0.985,
    cursorMode: 'none',
    cursorStrength: 600,
    boundary: 'all',
    enableDrag: true
  };

  function create(target, opts) {
    var stage = typeof target === 'string' ? document.querySelector(target) : target;
    if (!stage) return null;
    var o = mergeOpts(opts);

    var bodies = [];
    var mouseX = 0, mouseY = 0, mouseActive = false;
    var rafId = null;
    var dragging = null;
    var paused = false;
    var lastT = 0;

    if (getComputedStyle(stage).position === 'static') stage.style.position = 'relative';
    stage.style.userSelect = 'none';

    // Initialize bodies from markup
    stage.querySelectorAll('[data-grv-body]').forEach(addBody);

    function addBody(el) {
      var r = el.getBoundingClientRect();
      var sRect = stage.getBoundingClientRect();
      var w = r.width;
      var h = r.height;
      var body = {
        el: el,
        x: parseFloat(el.dataset.grvX) || (sRect.width / 2 - w / 2) + (Math.random() - 0.5) * 100,
        y: parseFloat(el.dataset.grvY) || -h - Math.random() * 100,
        vx: parseFloat(el.dataset.grvVx) || 0,
        vy: parseFloat(el.dataset.grvVy) || 0,
        w: w, h: h,
        bounce: parseFloat(el.dataset.grvBounce) || o.bounce
      };
      el.style.position = 'absolute';
      el.style.top = '0';
      el.style.left = '0';
      el.style.willChange = 'transform';
      bodies.push(body);
      if (o.enableDrag) bindDrag(el, body);
    }

    function removeBody(el) {
      bodies = bodies.filter(function (b) {
        if (b.el === el) { el.style.transform = ''; return false; }
        return true;
      });
    }

    function bindDrag(el, body) {
      el.style.cursor = 'grab';
      var lastPx = 0, lastPy = 0;
      var lastTime = 0;
      function down(e) {
        e.preventDefault();
        dragging = { body: body, ox: e.clientX, oy: e.clientY, sx: body.x, sy: body.y };
        body.vx = body.vy = 0;
        lastPx = e.clientX; lastPy = e.clientY;
        lastTime = Date.now();
        el.style.cursor = 'grabbing';
        try { el.setPointerCapture(e.pointerId); } catch (_) {}
      }
      function move(e) {
        if (!dragging || dragging.body !== body) return;
        body.x = dragging.sx + (e.clientX - dragging.ox);
        body.y = dragging.sy + (e.clientY - dragging.oy);
        var dt = (Date.now() - lastTime) || 16;
        body.vx = (e.clientX - lastPx) / dt * 16;
        body.vy = (e.clientY - lastPy) / dt * 16;
        lastPx = e.clientX; lastPy = e.clientY;
        lastTime = Date.now();
      }
      function up(e) {
        if (dragging && dragging.body === body) {
          dragging = null;
          el.style.cursor = 'grab';
          try { el.releasePointerCapture(e.pointerId); } catch (_) {}
        }
      }
      el.addEventListener('pointerdown', down);
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    }

    stage.addEventListener('pointermove', function (e) {
      var r = stage.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
      mouseActive = true;
    });
    stage.addEventListener('pointerleave', function () { mouseActive = false; });

    function step() {
      if (paused) { rafId = requestAnimationFrame(step); return; }
      var rect = stage.getBoundingClientRect();
      var W = rect.width, H = rect.height;

      bodies.forEach(function (b) {
        if (dragging && dragging.body === b) {
          b.el.style.transform = 'translate(' + b.x + 'px, ' + b.y + 'px)';
          return;
        }

        // Gravity
        b.vy += o.gravity;

        // Cursor attraction / repulsion
        if (mouseActive && o.cursorMode !== 'none') {
          var dx = (mouseX - (b.x + b.w / 2));
          var dy = (mouseY - (b.y + b.h / 2));
          var dist = Math.hypot(dx, dy) || 1;
          var f = o.cursorStrength / (dist * dist + 50);
          if (o.cursorMode === 'attract') {
            b.vx += dx / dist * f;
            b.vy += dy / dist * f;
          } else if (o.cursorMode === 'repel') {
            b.vx -= dx / dist * f;
            b.vy -= dy / dist * f;
          }
        }

        // Friction
        b.vx *= o.friction;
        b.vy *= o.friction;

        // Integrate
        b.x += b.vx;
        b.y += b.vy;

        // Boundaries
        if (o.boundary === 'all' || o.boundary === 'floor') {
          if (b.y + b.h > H) {
            b.y = H - b.h;
            b.vy = -b.vy * b.bounce;
            b.vx *= 0.92;   // floor friction
          }
        }
        if (o.boundary === 'all' || o.boundary === 'walls') {
          if (b.x < 0) { b.x = 0; b.vx = -b.vx * b.bounce; }
          if (b.x + b.w > W) { b.x = W - b.w; b.vx = -b.vx * b.bounce; }
        }

        // Body-body collisions (simple AABB)
        for (var i = 0; i < bodies.length; i++) {
          var other = bodies[i];
          if (other === b) continue;
          if (b.x < other.x + other.w &&
              b.x + b.w > other.x &&
              b.y < other.y + other.h &&
              b.y + b.h > other.y) {
            // Resolve along smaller overlap axis
            var overlapX = Math.min(b.x + b.w - other.x, other.x + other.w - b.x);
            var overlapY = Math.min(b.y + b.h - other.y, other.y + other.h - b.y);
            if (overlapX < overlapY) {
              if (b.x < other.x) { b.x -= overlapX / 2; other.x += overlapX / 2; }
              else { b.x += overlapX / 2; other.x -= overlapX / 2; }
              var t = b.vx; b.vx = other.vx * b.bounce; other.vx = t * b.bounce;
            } else {
              if (b.y < other.y) { b.y -= overlapY / 2; other.y += overlapY / 2; }
              else { b.y += overlapY / 2; other.y -= overlapY / 2; }
              var ty = b.vy; b.vy = other.vy * b.bounce; other.vy = ty * b.bounce;
            }
          }
        }

        b.el.style.transform = 'translate(' + b.x.toFixed(1) + 'px, ' + b.y.toFixed(1) + 'px)';
      });

      rafId = requestAnimationFrame(step);
    }
    rafId = requestAnimationFrame(step);

    function shake(strength) {
      strength = strength || 12;
      bodies.forEach(function (b) {
        b.vx += (Math.random() - 0.5) * strength;
        b.vy -= Math.random() * strength;
      });
    }
    function flick(el, vx, vy) {
      bodies.forEach(function (b) {
        if (b.el === el) { b.vx = vx; b.vy = vy; }
      });
    }

    function pause() { paused = true; }
    function play()  { paused = false; }
    function destroy() {
      cancelAnimationFrame(rafId);
      bodies.forEach(function (b) {
        b.el.style.transform = '';
        b.el.style.position = '';
        b.el.style.cursor = '';
      });
    }

    return {
      stage: stage,
      add: addBody,
      remove: removeBody,
      shake: shake,
      flick: flick,
      pause: pause,
      play: play,
      destroy: destroy,
      get bodies() { return bodies; }
    };
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var Gravity = { create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = Gravity;
  else root.Gravity = Gravity;
})(typeof window !== 'undefined' ? window : this);
