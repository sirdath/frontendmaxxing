/* ============================================
   IMAGE REVEAL MASK — Toggle .is-revealed when element enters viewport
   Inspired by Codrops image reveal demos
   ============================================
   Usage:
     ImageRevealMask.init('[data-irm]');
     ImageRevealMask.init('[data-irm]', {
       threshold: 0.25,
       once: true,           // remove .is-revealed when out of view if false
       delay: 0
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    threshold: 0.25,
    once: true,
    delay: 0
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    // If irm-bars variant and no bars present, inject 4 bars
    if (el.classList.contains('irm-bars') && !el.querySelector('.irm-bar')) {
      for (var i = 0; i < 4; i++) {
        var b = document.createElement('span');
        b.className = 'irm-bar';
        el.appendChild(b);
      }
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          setTimeout(function () { el.classList.add('is-revealed'); }, o.delay);
          if (o.once) io.unobserve(el);
        } else if (!o.once) {
          el.classList.remove('is-revealed');
        }
      });
    }, { threshold: o.threshold });
    io.observe(el);

    function destroy() {
      io.disconnect();
      el.classList.remove('is-revealed');
    }

    return { el: el, destroy: destroy };
  }

  var ImageRevealMask = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = ImageRevealMask;
  else root.ImageRevealMask = ImageRevealMask;
})(typeof window !== 'undefined' ? window : this);
