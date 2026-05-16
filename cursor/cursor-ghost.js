/* ============================================
   CURSOR GHOST — A secondary cursor that lags behind the real one
   ============================================
   Renders one or more "ghost" cursors that follow the real cursor with spring
   lag. Used for fancy mouse-trail effects, dual-cursor brand moments, or
   simulated cooperative cursors.

   Usage:
     // Basic — one ghost that lags behind
     CursorGhost.init({ count: 1, lag: 0.18, color: '#ec4899' });

     // Multiple ghosts with cascade lag
     CursorGhost.init({ count: 5, lag: 0.15, cascade: 0.5, color: ['#8b5cf6','#ec4899','#06b6d4'] });

     // Specific style
     CursorGhost.init({ style: 'square', size: 30 });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    count: 1,
    lag: 0.18,         // 0..1 — spring rate (lower = laggier)
    cascade: 0.4,      // when count > 1, each subsequent ghost lags this much more
    style: 'ring',     // 'ring', 'dot', 'square', 'cross', 'emoji'
    size: 30,
    color: '#ffffff',
    emoji: '✨',
    blendMode: 'difference'
  };

  var state = { ghosts: [], rafId: null, mx: -9999, my: -9999, bound: false };

  function init(opts) {
    destroy();
    var o = mergeOpts(opts);
    state.opts = o;

    var colors = Array.isArray(o.color) ? o.color : [o.color];

    for (var i = 0; i < o.count; i++) {
      var g = document.createElement('div');
      g.className = 'cghost cghost-' + o.style;
      var col = colors[i % colors.length];
      var size = o.size;
      g.style.cssText = [
        'position: fixed',
        'pointer-events: none',
        'z-index: ' + (99990 - i),
        'left: 0',
        'top: 0',
        'width: ' + size + 'px',
        'height: ' + size + 'px',
        'transform: translate(-50%, -50%)',
        'transition: none',
        'will-change: transform',
        'mix-blend-mode: ' + o.blendMode,
        'color: ' + col
      ].join(';');
      applyStyle(g, o.style, col, size, o);
      document.body.appendChild(g);
      state.ghosts.push({
        el: g,
        x: -9999,
        y: -9999,
        lag: o.lag * Math.pow(1 - o.cascade, i)
      });
    }

    if (!state.bound) {
      window.addEventListener('pointermove', onMove);
      state.bound = true;
    }
    if (!state.rafId) tick();
    return { destroy: destroy };
  }

  function applyStyle(el, style, color, size, opts) {
    switch (style) {
      case 'dot':
        el.style.background = color;
        el.style.borderRadius = '50%';
        break;
      case 'square':
        el.style.background = color;
        break;
      case 'cross':
        el.innerHTML = '<svg viewBox="0 0 24 24" style="width:100%;height:100%"><line x1="12" y1="2" x2="12" y2="22" stroke="' + color + '" stroke-width="2"/><line x1="2" y1="12" x2="22" y2="12" stroke="' + color + '" stroke-width="2"/></svg>';
        break;
      case 'emoji':
        el.style.background = 'transparent';
        el.style.fontSize = (size * 0.9) + 'px';
        el.style.display = 'grid';
        el.style.placeItems = 'center';
        el.textContent = opts.emoji;
        break;
      case 'ring':
      default:
        el.style.border = '2px solid ' + color;
        el.style.borderRadius = '50%';
        break;
    }
  }

  function onMove(e) {
    state.mx = e.clientX;
    state.my = e.clientY;
  }

  function tick() {
    state.ghosts.forEach(function (g) {
      if (g.x === -9999) { g.x = state.mx; g.y = state.my; return; }
      g.x += (state.mx - g.x) * g.lag;
      g.y += (state.my - g.y) * g.lag;
      g.el.style.transform = 'translate(' + g.x.toFixed(1) + 'px,' + g.y.toFixed(1) + 'px) translate(-50%,-50%)';
    });
    state.rafId = requestAnimationFrame(tick);
  }

  function destroy() {
    if (state.rafId) cancelAnimationFrame(state.rafId);
    state.rafId = null;
    state.ghosts.forEach(function (g) { if (g.el.parentNode) g.el.parentNode.removeChild(g.el); });
    state.ghosts = [];
    if (state.bound) {
      window.removeEventListener('pointermove', onMove);
      state.bound = false;
    }
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var CursorGhost = { init: init, destroy: destroy };
  if (typeof module !== 'undefined' && module.exports) module.exports = CursorGhost;
  else root.CursorGhost = CursorGhost;
})(typeof window !== 'undefined' ? window : this);
