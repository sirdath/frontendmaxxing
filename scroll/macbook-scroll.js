/* ============================================
   MACBOOK SCROLL — drives the .mbs-lid rotateX from scroll progress
   Inspired by Aceternity UI
   ============================================
   Usage:
     MacbookScroll.init('.mbs-host', {
       openStart: -90,   // deg at top (closed)
       openEnd:   -8,    // deg at bottom (open, slight tilt)
       liftStart: 0,
       liftEnd:   -120,  // px the whole stage lifts as it opens
       scaleEnd:  1.05
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    openStart: -90, openEnd: -8,
    liftStart: 0, liftEnd: -120,
    scaleStart: 0.82, scaleEnd: 1.05
  };

  function assign(t){for(var i=1;i<arguments.length;i++){var s=arguments[i];if(!s)continue;for(var k in s)if(Object.prototype.hasOwnProperty.call(s,k))t[k]=s[k];}return t;}
  function lerp(a,b,t){return a+(b-a)*t;}
  function clamp(v,lo,hi){return v<lo?lo:v>hi?hi:v;}

  function create(host, opts) {
    var o = assign({}, defaults, opts || {});
    var stage = host.querySelector('.mbs-stage');
    var lid   = host.querySelector('.mbs-lid');
    if (!lid) return null;

    function onScroll() {
      var rect = host.getBoundingClientRect();
      var vh = window.innerHeight;
      var total = host.offsetHeight - vh;
      var p = clamp(-rect.top / total, 0, 1);

      var rot   = lerp(o.openStart, o.openEnd, p);
      var lift  = lerp(o.liftStart, o.liftEnd, p);
      var scale = lerp(o.scaleStart, o.scaleEnd, p);
      lid.style.transform = 'rotateX(' + rot.toFixed(2) + 'deg)';
      if (stage) stage.style.transform = 'translateY(' + lift.toFixed(1) + 'px) scale(' + scale.toFixed(3) + ')';
    }

    var ticking = false;
    function tick() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { onScroll(); ticking = false; });
    }

    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    onScroll();

    return { el: host, destroy: function () { window.removeEventListener('scroll', tick); window.removeEventListener('resize', tick); } };
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

  var MacbookScroll = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = MacbookScroll;
  else root.MacbookScroll = MacbookScroll;
})(typeof window !== 'undefined' ? window : this);
