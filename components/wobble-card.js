/* ============================================
   WOBBLE CARD — Sets tilt + translate CSS vars based on cursor position over the card
   Inspired by Aceternity UI
   ============================================
   Usage:
     WobbleCard.init('.wc-host', {
       maxTilt: 8,        // deg
       maxOffset: 14      // px (translate amount toward cursor)
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = { maxTilt: 8, maxOffset: 14 };

  function create(host, opts) {
    var o = Object.assign({}, defaults, opts || {});
    function onMove(e) {
      var r = host.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width  - 0.5;   // -0.5 → 0.5
      var ny = (e.clientY - r.top)  / r.height - 0.5;
      host.style.setProperty('--ry', (nx *  o.maxTilt).toFixed(2) + 'deg');
      host.style.setProperty('--rx', (ny * -o.maxTilt).toFixed(2) + 'deg');
      host.style.setProperty('--tx', (nx *  o.maxOffset).toFixed(1) + 'px');
      host.style.setProperty('--ty', (ny *  o.maxOffset).toFixed(1) + 'px');
    }
    function onLeave() {
      host.style.setProperty('--rx', '0deg');
      host.style.setProperty('--ry', '0deg');
      host.style.setProperty('--tx', '0px');
      host.style.setProperty('--ty', '0px');
    }
    host.addEventListener('mousemove', onMove);
    host.addEventListener('mouseleave', onLeave);
    return { el: host, destroy: function () {
      host.removeEventListener('mousemove', onMove);
      host.removeEventListener('mouseleave', onLeave);
    }};
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

  var WobbleCard = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = WobbleCard;
  else root.WobbleCard = WobbleCard;
})(typeof window !== 'undefined' ? window : this);
