/* ============================================
   GSAP COUNTER — Animated number count-up with formatting + scroll trigger
   Inspired by official GSAP snap/onUpdate counter pattern
   ============================================
   Requires GSAP core from CDN. (ScrollTrigger optional, default on if present.)

   Usage:
     <span class="stat" data-to="12480">0</span>
     Counter.init('.stat');
     Counter.init('.stat', {
       to: 99.9, decimals: 1, suffix: '%', duration: 2,
       separator: ',', ease: 'power1.out', scroll: true
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    to: null,
    from: 0,
    duration: 2,
    decimals: 0,
    separator: ',',
    prefix: '',
    suffix: '',
    ease: 'power1.out',
    scroll: true,
    start: 'top 85%'
  };

  function format(v, o) {
    var n = v.toFixed(o.decimals);
    if (o.separator) {
      var parts = n.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, o.separator);
      n = parts.join('.');
    }
    return o.prefix + n + o.suffix;
  }

  function init(target, opts) {
    var gsap = root.gsap;
    if (!gsap) { console.warn('[Counter] Requires GSAP core.'); return null; }

    var nodes = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target instanceof Element ? [target] : target);
    var instances = [];
    Array.prototype.forEach.call(nodes, function (el) { instances.push(create(el, opts, gsap)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function create(el, opts, gsap) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    if (o.to === null) o.to = parseFloat(el.getAttribute('data-to') || el.textContent || '0');

    var proxy = { v: o.from };
    el.textContent = format(o.from, o);

    var build = function () {
      return gsap.to(proxy, {
        v: o.to,
        duration: o.duration,
        ease: o.ease,
        onUpdate: function () { el.textContent = format(proxy.v, o); },
        onComplete: function () { el.textContent = format(o.to, o); }
      });
    };

    var tween = null, st = null;
    var run = function () { proxy.v = o.from; if (tween) tween.kill(); tween = build(); };

    if (o.scroll && root.ScrollTrigger) {
      gsap.registerPlugin(root.ScrollTrigger);
      st = root.ScrollTrigger.create({ trigger: el, start: o.start, once: true, onEnter: run });
    } else {
      run();
    }

    return {
      el: el,
      replay: run,
      destroy: function () {
        if (st) st.kill();
        if (tween) tween.kill();
      }
    };
  }

  var Counter = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = Counter;
  else root.Counter = Counter;
})(typeof window !== 'undefined' ? window : this);
