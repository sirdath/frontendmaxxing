/* ============================================
   AOS LITE — Toggle .aos-animate on elements as they enter viewport
   Inspired by michalsnik/aos (much smaller, attribute-driven)
   ============================================
   Usage:
     AosLite.init();              // observes everything matching [data-aos]
     AosLite.init({ once: false, threshold: 0.15 });

   Per-element overrides via attributes:
     data-aos          — animation name (required for styling)
     data-aos-delay    — ms (overrides default)
     data-aos-duration — ms
     data-aos-once     — 'true' or 'false'
     data-aos-anchor   — selector of trigger element
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    once: true,
    threshold: 0.15,
    rootMargin: '0px 0px -10% 0px'
  };

  function init(opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var els = Array.prototype.slice.call(document.querySelectorAll('[data-aos]'));
    var anchorMap = new Map();

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var anchored = anchorMap.get(entry.target);
        var targets = anchored || [entry.target];
        if (entry.isIntersecting) {
          targets.forEach(function (t) {
            var delay = parseInt(t.getAttribute('data-aos-delay') || '0', 10);
            var dur   = parseInt(t.getAttribute('data-aos-duration') || '0', 10);
            if (dur) t.style.transitionDuration = dur + 'ms';
            if (delay) t.style.transitionDelay = delay + 'ms';
            t.classList.add('aos-animate');
          });
          var once = (entry.target.getAttribute('data-aos-once') || (o.once ? 'true' : 'false')) === 'true';
          if (once) io.unobserve(entry.target);
        } else if (!o.once) {
          targets.forEach(function (t) { t.classList.remove('aos-animate'); });
        }
      });
    }, { threshold: o.threshold, rootMargin: o.rootMargin });

    els.forEach(function (el) {
      var anchorSel = el.getAttribute('data-aos-anchor');
      if (anchorSel) {
        var anchor = document.querySelector(anchorSel);
        if (anchor) {
          var group = anchorMap.get(anchor) || [];
          group.push(el);
          anchorMap.set(anchor, group);
          io.observe(anchor);
          return;
        }
      }
      io.observe(el);
    });

    function refresh() {
      // Re-scan for new [data-aos] elements added after init
      var newEls = document.querySelectorAll('[data-aos]:not(.aos-animate)');
      newEls.forEach(function (el) { io.observe(el); });
    }

    function destroy() { io.disconnect(); }

    return { refresh: refresh, destroy: destroy };
  }

  var AosLite = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = AosLite;
  else root.AosLite = AosLite;
})(typeof window !== 'undefined' ? window : this);
