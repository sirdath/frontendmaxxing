/* ============================================
   COUNT UP — Animate a numeric label from one value to another
   Inspired by CountUp.js (smaller / no deps / IO-aware)
   ============================================
   Usage:
     <span data-count-up="42">0</span>
     CountUp.init('[data-count-up]');

     // Or programmatically:
     CountUp.to('#stat', 1234, { duration: 1500, decimals: 0, prefix: '$', suffix: 'k' });

   Options:
     duration   (ms, default 1600)
     decimals   (default 0)
     separator  (default ',' — thousands separator; pass '' to disable)
     prefix     (default '')
     suffix     (default '')
     easing     (default 'easeOutQuint')
     trigger    'inview' | 'auto' | 'manual'  (default 'inview' when [data-count-up])
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    duration: 1600,
    decimals: 0,
    separator: ',',
    prefix: '',
    suffix: '',
    easing: 'easeOutQuint',
    trigger: 'inview'
  };

  var EASINGS = {
    linear:        function (t) { return t; },
    easeOutQuad:   function (t) { return 1 - (1 - t) * (1 - t); },
    easeOutCubic:  function (t) { return 1 - Math.pow(1 - t, 3); },
    easeOutQuint:  function (t) { return 1 - Math.pow(1 - t, 5); },
    easeOutExpo:   function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
  };

  function format(v, o) {
    var n = parseFloat(v.toFixed(o.decimals));
    var parts = n.toFixed(o.decimals).split('.');
    if (o.separator) parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, o.separator);
    return (o.prefix || '') + parts.join('.') + (o.suffix || '');
  }

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(setup(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function setup(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var to = parseFloat(el.getAttribute('data-count-up'));
    if (isNaN(to)) to = parseFloat(el.textContent) || 0;
    var from = parseFloat(el.getAttribute('data-count-from'));
    if (isNaN(from)) from = 0;
    var dur = parseFloat(el.getAttribute('data-count-duration')) || o.duration;
    var dec = parseInt(el.getAttribute('data-count-decimals'), 10);
    if (isNaN(dec)) dec = o.decimals;

    var perElOpts = {
      duration: dur,
      decimals: dec,
      separator: o.separator,
      prefix:   el.getAttribute('data-count-prefix') || o.prefix,
      suffix:   el.getAttribute('data-count-suffix') || o.suffix,
      easing:   o.easing
    };

    el.textContent = format(from, perElOpts);

    function play() {
      to_(el, to, perElOpts, from);
    }

    if (o.trigger === 'inview') {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { play(); io.unobserve(el); }
        });
      }, { threshold: 0.3 });
      io.observe(el);
    } else if (o.trigger === 'auto') {
      play();
    }
    return { el: el, play: play };
  }

  function to_(el, value, opts, fromOverride) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var from = fromOverride != null ? fromOverride : parseFloat((el.textContent || '0').replace(/[^\d.\-]/g, '')) || 0;
    var ease = EASINGS[o.easing] || EASINGS.easeOutQuint;
    var t0 = null;

    function step(t) {
      if (t0 == null) t0 = t;
      var p = Math.min(1, (t - t0) / o.duration);
      var v = from + (value - from) * ease(p);
      el.textContent = format(v, o);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function to(target, value, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, function (el) { to_(el, value, opts); });
  }

  var CountUp = { init: init, to: to };

  if (typeof module !== 'undefined' && module.exports) module.exports = CountUp;
  else root.CountUp = CountUp;
})(typeof window !== 'undefined' ? window : this);
