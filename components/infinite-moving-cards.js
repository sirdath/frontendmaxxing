/* ============================================
   INFINITE MOVING CARDS — Clone the track once so the CSS animation can loop seamlessly
   Inspired by Aceternity UI
   ============================================
   Usage:
     <div class="imc-host" data-speed="40" data-direction="left">
       <ul class="imc-track">
         <li class="imc-card">...</li>  <!-- drop your cards plainly -->
       </ul>
     </div>
     InfiniteMovingCards.init('.imc-host');
   ============================================ */
(function (root) {
  'use strict';

  function create(host) {
    var track = host.querySelector('.imc-track');
    if (!track || track.dataset.cloned === '1') return null;

    // Clone every child once, append, so animation translateX(-50%) is seamless.
    var children = Array.from(track.children);
    children.forEach(function (c) {
      var clone = c.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
    track.dataset.cloned = '1';

    var speed = parseFloat(host.dataset.speed || '40');
    host.style.setProperty('--imc-duration', speed + 's');

    return {
      el: host,
      destroy: function () {
        // remove the cloned half
        var halves = Array.from(track.children);
        var keep = halves.length / 2;
        halves.slice(keep).forEach(function (n) { n.remove(); });
        delete track.dataset.cloned;
      }
    };
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

  var InfiniteMovingCards = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = InfiniteMovingCards;
  else root.InfiniteMovingCards = InfiniteMovingCards;
})(typeof window !== 'undefined' ? window : this);
