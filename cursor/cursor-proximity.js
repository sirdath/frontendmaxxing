/* ============================================
   CURSOR PROXIMITY — Ripple / glow effects triggered when cursor approaches
   ============================================
   When the cursor gets within `radius` of a target element, the element
   reacts — a ripple emanates, a glow fades in, scale ticks up, etc.

   Usage:
     CursorProximity.init('.proximity-target', {
       radius: 120,         // px — proximity range
       effect: 'ripple',    // 'ripple' | 'glow' | 'scale' | 'tilt' | 'wobble' | 'rise'
       continuous: false    // if true, ripples emit every frame inside radius
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    radius: 120,
    effect: 'ripple',
    continuous: false,
    color: '#8b5cf6',
    cooldown: 600
  };

  var instances = [];
  var bound = false;
  var mouseX = -9999, mouseY = -9999;

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var o = mergeOpts(opts);

    if (!bound) {
      window.addEventListener('pointermove', function (e) {
        mouseX = e.clientX; mouseY = e.clientY;
      });
      requestAnimationFrame(tick);
      bound = true;
    }

    Array.prototype.forEach.call(els, function (el) {
      instances.push({ el: el, opts: o, lastTrigger: 0, isClose: false });
      if (o.effect === 'glow' || o.effect === 'scale') {
        el.style.transition = 'box-shadow 0.32s ease, transform 0.32s ease';
      }
    });
  }

  function tick() {
    var now = Date.now();
    instances.forEach(function (inst) {
      var r = inst.el.getBoundingClientRect();
      var cx = r.left + r.width / 2;
      var cy = r.top + r.height / 2;
      var d = Math.hypot(mouseX - cx, mouseY - cy);
      var close = d < inst.opts.radius;

      if (close && (!inst.isClose || inst.opts.continuous)) {
        if (now - inst.lastTrigger > inst.opts.cooldown || inst.opts.continuous) {
          trigger(inst, d);
          inst.lastTrigger = now;
        }
      }
      inst.isClose = close;

      // Continuous effects react every frame
      if (inst.opts.effect === 'glow') {
        var intensity = close ? (1 - d / inst.opts.radius) : 0;
        inst.el.style.boxShadow = intensity > 0
          ? '0 0 ' + (intensity * 24) + 'px ' + (intensity * 6) + 'px ' + inst.opts.color
          : '';
      } else if (inst.opts.effect === 'scale') {
        var s = close ? 1 + (1 - d / inst.opts.radius) * 0.12 : 1;
        inst.el.style.transform = 'scale(' + s.toFixed(3) + ')';
      } else if (inst.opts.effect === 'tilt') {
        var dx = (mouseX - cx) / inst.opts.radius;
        var dy = (mouseY - cy) / inst.opts.radius;
        if (close) {
          inst.el.style.transform = 'perspective(600px) rotateX(' + (-dy * 10).toFixed(1) + 'deg) rotateY(' + (dx * 10).toFixed(1) + 'deg)';
        } else {
          inst.el.style.transform = '';
        }
      } else if (inst.opts.effect === 'rise') {
        var lift = close ? (1 - d / inst.opts.radius) * -8 : 0;
        inst.el.style.transform = 'translateY(' + lift.toFixed(1) + 'px)';
      } else if (inst.opts.effect === 'wobble') {
        if (close) {
          var t = now * 0.005;
          inst.el.style.transform = 'rotate(' + (Math.sin(t) * 2).toFixed(2) + 'deg)';
        } else {
          inst.el.style.transform = '';
        }
      }
    });
    requestAnimationFrame(tick);
  }

  function trigger(inst, distance) {
    if (inst.opts.effect === 'ripple') emitRipple(inst, distance);
  }

  function emitRipple(inst, distance) {
    var r = inst.el.getBoundingClientRect();
    var ripple = document.createElement('div');
    ripple.style.cssText = [
      'position: fixed',
      'left: ' + (r.left + r.width / 2) + 'px',
      'top: ' + (r.top + r.height / 2) + 'px',
      'width: 8px',
      'height: 8px',
      'margin: -4px 0 0 -4px',
      'border-radius: 50%',
      'border: 2px solid ' + inst.opts.color,
      'pointer-events: none',
      'z-index: 9999',
      'transform: translate(-50%, -50%)',
      'animation: cprx-ripple 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards'
    ].join(';');
    document.body.appendChild(ripple);
    setTimeout(function () { if (ripple.parentNode) ripple.parentNode.removeChild(ripple); }, 800);

    if (!document.getElementById('cprx-style')) {
      var s = document.createElement('style');
      s.id = 'cprx-style';
      s.textContent = '@keyframes cprx-ripple { 0% { opacity: 1; transform: translate(-50%, -50%) scale(0.6); } 100% { opacity: 0; transform: translate(-50%, -50%) scale(12); } }';
      document.head.appendChild(s);
    }
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var CursorProximity = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = CursorProximity;
  else root.CursorProximity = CursorProximity;
})(typeof window !== 'undefined' ? window : this);
