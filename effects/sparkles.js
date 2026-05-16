/* ============================================
   SPARKLES — Spawn twinkling dots into a container
   Inspired by Aceternity UI
   ============================================
   Usage:
     Sparkles.init('[data-sparkles]');
     Sparkles.init('[data-sparkles]', {
       count: 80,
       minSize: 1,
       maxSize: 3,
       minDuration: 1.2,
       maxDuration: 3.5,
       color: '#ffffff'
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    count: 60,
    minSize: 1,
    maxSize: 3,
    minDuration: 1.2,
    maxDuration: 3.5,
    color: null    // null = use CSS --spark-color
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    // Wipe existing
    var existing = el.querySelectorAll('.spark');
    Array.prototype.forEach.call(existing, function (n) { n.remove(); });

    var nodes = [];
    for (var i = 0; i < o.count; i++) {
      var s = document.createElement('span');
      s.className = 'spark';
      var size = rand(o.minSize, o.maxSize);
      s.style.left = rand(0, 100).toFixed(2) + '%';
      s.style.top  = rand(0, 100).toFixed(2) + '%';
      s.style.setProperty('--spark-size', size.toFixed(2) + 'px');
      s.style.setProperty('--spark-duration', rand(o.minDuration, o.maxDuration).toFixed(2) + 's');
      s.style.setProperty('--spark-delay', rand(0, o.maxDuration).toFixed(2) + 's');
      if (o.color) s.style.background = o.color;
      el.appendChild(s);
      nodes.push(s);
    }

    function destroy() {
      nodes.forEach(function (n) { n.remove(); });
      nodes = [];
    }

    return { el: el, nodes: nodes, destroy: destroy };
  }

  var Sparkles = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = Sparkles;
  else root.Sparkles = Sparkles;
})(typeof window !== 'undefined' ? window : this);
