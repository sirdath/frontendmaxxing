/* ============================================
   GLARE CARD — Sets --mx / --my CSS vars to move the radial glare with cursor
   Inspired by Aceternity UI
   ============================================
   Usage:
     GlareCard.init('.gc-host');
   ============================================ */
(function (root) {
  'use strict';

  function create(host) {
    function onMove(e) {
      var r = host.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width)  * 100;
      var y = ((e.clientY - r.top)  / r.height) * 100;
      host.style.setProperty('--mx', x.toFixed(2) + '%');
      host.style.setProperty('--my', y.toFixed(2) + '%');
    }
    function onLeave() {
      host.style.setProperty('--mx', '50%');
      host.style.setProperty('--my', '50%');
    }
    host.addEventListener('mousemove', onMove);
    host.addEventListener('mouseleave', onLeave);
    return { el: host, destroy: function () {
      host.removeEventListener('mousemove', onMove);
      host.removeEventListener('mouseleave', onLeave);
    }};
  }

  function init(target) {
    if (typeof target === 'string') {
      var nodes = document.querySelectorAll(target);
      if (nodes.length === 0) return null;
      if (nodes.length === 1) return create(nodes[0]);
      var arr = []; nodes.forEach(function (n) { arr.push(create(n)); });
      return arr;
    }
    return create(target);
  }

  var GlareCard = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = GlareCard;
  else root.GlareCard = GlareCard;
})(typeof window !== 'undefined' ? window : this);
