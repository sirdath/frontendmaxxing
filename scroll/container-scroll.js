/* ============================================
   CONTAINER SCROLL ANIMATION — drives the .csa-frame's rotateX/scale from scroll progress
   Inspired by Aceternity UI
   ============================================
   Usage:
     ContainerScroll.init('.csa-host', {
       rotateStart: 22,   // deg at top of scroll range
       rotateEnd:   0,    // deg at bottom
       scaleStart:  0.78,
       scaleEnd:    1.04,
       titleLift:   80    // px the title floats up as you scroll
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    rotateStart: 22, rotateEnd: 0,
    scaleStart: 0.78, scaleEnd: 1.04,
    titleLift: 80
  };

  function assign(t){for(var i=1;i<arguments.length;i++){var s=arguments[i];if(!s)continue;for(var k in s)if(Object.prototype.hasOwnProperty.call(s,k))t[k]=s[k];}return t;}
  function lerp(a,b,t){return a+(b-a)*t;}
  function clamp(v,lo,hi){return v<lo?lo:v>hi?hi:v;}

  function create(host, opts) {
    var o = assign({}, defaults, opts || {});
    var frame = host.querySelector('.csa-frame');
    var title = host.querySelector('.csa-title');
    if (!frame) return null;

    function onScroll() {
      var rect = host.getBoundingClientRect();
      var vh = window.innerHeight;
      // Progress: 0 when host top hits viewport top, 1 when host bottom hits viewport bottom
      var total = host.offsetHeight - vh;
      var raw = -rect.top / total;
      var p = clamp(raw, 0, 1);

      var rot   = lerp(o.rotateStart, o.rotateEnd, p);
      var scale = lerp(o.scaleStart, o.scaleEnd, p);
      frame.style.transform = 'rotateX(' + rot.toFixed(2) + 'deg) scale(' + scale.toFixed(3) + ')';

      if (title) {
        title.style.transform = 'translateY(' + (-p * o.titleLift).toFixed(1) + 'px)';
        title.style.opacity = clamp(1 - p * 1.2, 0, 1).toFixed(3);
      }
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

    return {
      el: host,
      destroy: function () {
        window.removeEventListener('scroll', tick);
        window.removeEventListener('resize', tick);
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

  var ContainerScroll = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = ContainerScroll;
  else root.ContainerScroll = ContainerScroll;
})(typeof window !== 'undefined' ? window : this);
