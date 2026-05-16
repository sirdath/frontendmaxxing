/* ============================================
   DECORATIVE CURSOR — Pointer-following replacement cursor
   ============================================
   Usage:
     DecorativeCursor.init({
       shape: '★',           // or HTML string for icon
       size: 28,
       color: '#8b5cf6',
       hideNative: true,
       trail: false,          // particle trail
       hoverSelector: 'a, button, [data-cursor-hover]',
       clickSelector: 'a, button'
     });
     DecorativeCursor.destroy();
   ============================================ */
(function (root) {
  'use strict';
  var defaults = {
    shape: '★',
    size: 28,
    color: null,
    hideNative: true,
    trail: false,
    hoverSelector: 'a, button, [data-cursor-hover]',
    clickSelector: 'a, button, [data-cursor-hover]'
  };

  var state = null;

  function init(opts) {
    if (state) destroy();
    var o = Object.assign({}, defaults, opts || {});
    var dot = document.createElement('div');
    dot.className = 'dc-dot';
    dot.innerHTML = o.shape;
    dot.style.fontSize = o.size + 'px';
    if (o.color) {
      dot.style.color = o.color;
      dot.style.textShadow = '0 0 12px ' + o.color.replace(')', ', 0.6)').replace('rgb', 'rgba');
    }
    document.body.appendChild(dot);

    if (o.hideNative) document.body.classList.add('dc-host');
    if (o.trail) document.body.classList.add('dc-trail-host');

    state = { o: o, dot: dot, handlers: [] };

    var move = function (e) {
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      if (o.trail) spawnTrail(e.clientX, e.clientY);
    };
    var down = function () { dot.classList.add('is-down'); };
    var up = function () { dot.classList.remove('is-down'); };

    document.addEventListener('pointermove', move);
    document.addEventListener('pointerdown', down);
    document.addEventListener('pointerup', up);
    state.handlers.push(['pointermove', move], ['pointerdown', down], ['pointerup', up]);

    // Hover targets
    if (o.hoverSelector) {
      var over = function (e) {
        if (e.target.closest && e.target.closest(o.hoverSelector)) dot.classList.add('is-hover');
      };
      var out = function (e) {
        if (e.target.closest && e.target.closest(o.hoverSelector)) dot.classList.remove('is-hover');
      };
      document.addEventListener('pointerover', over);
      document.addEventListener('pointerout', out);
      state.handlers.push(['pointerover', over], ['pointerout', out]);
    }

    function spawnTrail(x, y) {
      var bit = document.createElement('div');
      bit.className = 'dc-trail-bit';
      bit.style.color = dot.style.color || '#8b5cf6';
      bit.style.left = x + 'px';
      bit.style.top = y + 'px';
      document.body.appendChild(bit);
      setTimeout(function () { bit.remove(); }, 600);
    }

    return {
      destroy: destroy,
      setShape: function (s) { dot.innerHTML = s; },
      setColor: function (c) { dot.style.color = c; }
    };
  }

  function destroy() {
    if (!state) return;
    state.handlers.forEach(function (h) { document.removeEventListener(h[0], h[1]); });
    if (state.dot) state.dot.remove();
    document.body.classList.remove('dc-host', 'dc-trail-host');
    state = null;
  }

  var DecorativeCursor = { init: init, destroy: destroy };
  if (typeof module !== 'undefined' && module.exports) module.exports = DecorativeCursor;
  else root.DecorativeCursor = DecorativeCursor;
})(typeof window !== 'undefined' ? window : this);
