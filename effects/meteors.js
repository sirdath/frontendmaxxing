/* ============================================
   METEORS — Spawn diagonal falling streaks
   Inspired by Magic UI / Aceternity UI
   ============================================
   Usage:
     Meteors.init('.meteors');
     Meteors.init('.meteors', {
       count: 30,
       minDuration: 3,
       maxDuration: 8,
       minDelay: 0,
       maxDelay: 4
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    count: 20,
    minDuration: 3,
    maxDuration: 8,
    minDelay: 0,
    maxDelay: 5
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

    // Wipe any existing meteors
    var existing = el.querySelectorAll('.meteor');
    Array.prototype.forEach.call(existing, function (m) { m.remove(); });

    var nodes = [];
    for (var i = 0; i < o.count; i++) {
      var m = document.createElement('span');
      m.className = 'meteor';
      m.style.setProperty('--meteor-x', rand(0, 100).toFixed(2) + '%');
      m.style.setProperty('--meteor-d', rand(o.minDuration, o.maxDuration).toFixed(2) + 's');
      m.style.setProperty('--meteor-delay', rand(o.minDelay, o.maxDelay).toFixed(2) + 's');
      el.appendChild(m);
      nodes.push(m);
    }

    function destroy() {
      nodes.forEach(function (n) { n.remove(); });
      nodes = [];
    }

    return { el: el, nodes: nodes, destroy: destroy };
  }

  var Meteors = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = Meteors;
  else root.Meteors = Meteors;
})(typeof window !== 'undefined' ? window : this);
