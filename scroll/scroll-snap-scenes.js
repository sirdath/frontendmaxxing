/* ============================================
   SCROLL SNAP SCENES — Add .is-active to the visible scene; manage pagination
   Inspired by Codrops scroll demos
   ============================================
   Usage:
     ScrollSnapScenes.init('.snap-scenes', {
       pagination: '.snap-pagination'   // optional
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    pagination: null,
    threshold: 0.55
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

    var scenes = Array.prototype.slice.call(el.querySelectorAll('.snap-scene'));
    if (!scenes.length) return { el: el, destroy: function () {} };

    var pagination = null;
    var pagBtns = [];
    if (o.pagination) {
      pagination = typeof o.pagination === 'string'
        ? document.querySelector(o.pagination)
        : o.pagination;
      if (pagination) {
        pagination.innerHTML = '';
        scenes.forEach(function (s, i) {
          var b = document.createElement('button');
          b.setAttribute('aria-label', 'Scene ' + (i + 1));
          b.addEventListener('click', function () {
            s.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
          pagination.appendChild(b);
          pagBtns.push(b);
        });
      }
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && e.intersectionRatio >= o.threshold) {
          scenes.forEach(function (s) { s.classList.remove('is-active'); });
          e.target.classList.add('is-active');
          if (pagBtns.length) {
            var idx = scenes.indexOf(e.target);
            pagBtns.forEach(function (b, i) { b.classList.toggle('is-active', i === idx); });
          }
        }
      });
    }, { root: el, threshold: [0, o.threshold, 1] });

    scenes.forEach(function (s) { io.observe(s); });

    function destroy() {
      io.disconnect();
      scenes.forEach(function (s) { s.classList.remove('is-active'); });
      if (pagination) pagination.innerHTML = '';
    }

    return { el: el, destroy: destroy };
  }

  var ScrollSnapScenes = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = ScrollSnapScenes;
  else root.ScrollSnapScenes = ScrollSnapScenes;
})(typeof window !== 'undefined' ? window : this);
