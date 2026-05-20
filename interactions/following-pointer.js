/* ============================================
   FOLLOWING POINTER — Renders a custom cursor + label that lerps after the real cursor
   Inspired by Aceternity UI
   ============================================
   Reads data-label and data-color from the host element.

   Usage:
     FollowingPointer.init('.fp-host');
     // or programmatic:
     FollowingPointer.init('.fp-host', { label: 'Maria', color: '#a855f7', smooth: 0.18 });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = { label: null, color: null, smooth: 0.18 };

  function create(host, opts) {
    var o = Object.assign({}, defaults, opts || {});
    var label = o.label || host.dataset.label || 'You';
    var color = o.color || host.dataset.color || '#a855f7';

    var cursor = document.createElement('div');
    cursor.className = 'fp-cursor';
    cursor.style.setProperty('--fp-color', color);
    cursor.innerHTML =
      '<svg class="fp-arrow" viewBox="0 0 16 16"><path d="M0 0 L16 6 L6 8 L8 16 Z"/></svg>' +
      '<div class="fp-label"></div>';
    cursor.querySelector('.fp-label').textContent = label;
    document.body.appendChild(cursor);

    var x = 0, y = 0, tx = 0, ty = 0, on = false, raf;

    function render() {
      x += (tx - x) * o.smooth;
      y += (ty - y) * o.smooth;
      cursor.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
      raf = requestAnimationFrame(render);
    }
    render();

    function onMove(e) { tx = e.clientX; ty = e.clientY; }
    function onEnter() { on = true; cursor.classList.add('is-on'); }
    function onLeave() { on = false; cursor.classList.remove('is-on'); }

    host.addEventListener('mousemove', onMove);
    host.addEventListener('mouseenter', onEnter);
    host.addEventListener('mouseleave', onLeave);

    return {
      el: host,
      setLabel: function (s) { cursor.querySelector('.fp-label').textContent = s; },
      setColor: function (c) { cursor.style.setProperty('--fp-color', c); },
      destroy: function () {
        cancelAnimationFrame(raf);
        host.removeEventListener('mousemove', onMove);
        host.removeEventListener('mouseenter', onEnter);
        host.removeEventListener('mouseleave', onLeave);
        cursor.remove();
      }
    };
  }

  function init(target, opts) {
    if (typeof target === 'string') {
      var nodes = document.querySelectorAll(target);
      if (nodes.length === 0) return null;
      if (nodes.length === 1) return create(nodes[0], opts);
      var arr = []; nodes.forEach(function (n) { arr.push(create(n, opts)); });
      return arr;
    }
    return create(target, opts);
  }

  var FollowingPointer = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = FollowingPointer;
  else root.FollowingPointer = FollowingPointer;
})(typeof window !== 'undefined' ? window : this);
