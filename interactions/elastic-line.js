/* ============================================
   ELASTIC LINE — Spring-driven SVG curve that bows toward cursor
   Inspired by Fancy Components Elastic Line, Codrops experiments
   ============================================
   Usage:
     ElasticLine.init('[data-eln]', {
       stiffness: 0.1,        // 0..1 — pull-back rate
       damping: 0.85,         // 0..1 — energy loss per frame
       strength: 1,           // multiplier on cursor influence
       activeOnHover: false,  // if true, only flex on hover (else always)
       gradient: false        // if true, inject a default linearGradient
     });

   instance.snap();           // instantly return to rest
   instance.destroy();
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    stiffness: 0.1,
    damping: 0.85,
    strength: 1,
    activeOnHover: false,
    gradient: false
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
    var svg = host.querySelector('.eln-svg');
    var path = host.querySelector('.eln-path');
    if (!svg || !path) return null;

    // Inject default gradient if requested
    if (o.gradient && !host.querySelector('linearGradient')) {
      var ns = 'http://www.w3.org/2000/svg';
      var defs = svg.querySelector('defs') || svg.insertBefore(document.createElementNS(ns, 'defs'), svg.firstChild);
      var lg = document.createElementNS(ns, 'linearGradient');
      lg.id = 'eln-gradient';
      lg.setAttribute('x1', '0%'); lg.setAttribute('y1', '0%');
      lg.setAttribute('x2', '100%'); lg.setAttribute('y2', '0%');
      [['0%', '#8b5cf6'], ['50%', '#ec4899'], ['100%', '#06b6d4']].forEach(function (s) {
        var stop = document.createElementNS(ns, 'stop');
        stop.setAttribute('offset', s[0]); stop.setAttribute('stop-color', s[1]);
        lg.appendChild(stop);
      });
      defs.appendChild(lg);
      path.setAttribute('stroke', 'url(#eln-gradient)');
    }

    var state = {
      cx: 0.5,      // 0..1 horizontal position of cursor (normalized)
      cy: 0.5,      // 0..1 vertical
      vx: 0, vy: 0, // current pull
      tx: 0.5, ty: 0.5,   // target
      active: !o.activeOnHover
    };

    var rafId = null;
    var rect = null;

    function updateRect() { rect = svg.getBoundingClientRect(); }
    updateRect();
    window.addEventListener('resize', updateRect);

    function onMove(e) {
      if (!state.active) return;
      var t = e.touches ? e.touches[0] : e;
      state.tx = (t.clientX - rect.left) / rect.width;
      state.ty = (t.clientY - rect.top) / rect.height;
    }
    function onLeave() {
      state.tx = 0.5;
      state.ty = 0.5;
      if (o.activeOnHover) state.active = false;
    }
    function onEnter() {
      updateRect();
      if (o.activeOnHover) state.active = true;
    }

    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    host.addEventListener('pointerenter', onEnter);

    function step() {
      // Spring: vx += (tx - cx) * stiffness, vx *= damping
      var dx = (state.tx - state.cx) * o.stiffness;
      var dy = (state.ty - state.cy) * o.stiffness;
      state.vx = (state.vx + dx) * o.damping;
      state.vy = (state.vy + dy) * o.damping;
      state.cx += state.vx;
      state.cy += state.vy;

      // Update SVG path — quadratic with control point at cursor
      var vb = svg.viewBox && svg.viewBox.baseVal;
      var W = (vb && vb.width) || rect.width;
      var H = (vb && vb.height) || rect.height;

      var startX = 0, startY = H / 2;
      var endX = W, endY = H / 2;
      // Control point gets stronger pull along Y when cursor is near middle
      var pull = (state.cy - 0.5) * H * 2 * o.strength;
      var cpx = state.cx * W;
      var cpy = startY + pull;
      // Q curve has control * 2 - midpoint behavior; we want passing-near-cursor look
      // So derive cpy so curve apex roughly = (cpx, state.cy * H)
      // For a quadratic Bezier B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2,
      // at t=0.5 → 0.25 P0 + 0.5 P1 + 0.25 P2
      // To make B(0.5) = target = (cpx, state.cy * H), and P0/P2 fixed at midline,
      // P1 = (target - 0.25*(P0+P2)) * 2
      var targetY = state.cy * H;
      var midY = (startY + endY) / 2;
      var P1y = (targetY - midY) * 2 + midY;
      var P1x = cpx;
      path.setAttribute('d', 'M' + startX + ',' + startY + ' Q' + P1x + ',' + P1y + ' ' + endX + ',' + endY);

      rafId = requestAnimationFrame(step);
    }
    rafId = requestAnimationFrame(step);

    function snap() {
      state.cx = state.tx = 0.5;
      state.cy = state.ty = 0.5;
      state.vx = state.vy = 0;
    }

    function destroy() {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateRect);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      host.removeEventListener('pointerenter', onEnter);
    }

    return { host: host, snap: snap, destroy: destroy };
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var ElasticLine = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = ElasticLine;
  else root.ElasticLine = ElasticLine;
})(typeof window !== 'undefined' ? window : this);
