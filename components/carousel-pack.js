/* ============================================
   CAROUSEL PACK — JS glue for split-accordion + grid disclosure
   ============================================
   Usage:
     CarouselPack.split('[data-car-split]', { onToggle: function (open) {} });
     CarouselPack.grid('[data-car-grid]', { onPick: function (el) {} });
   ============================================ */
(function (root) {
  'use strict';

  function each(target, fn) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, fn);
  }

  function split(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var head = host.querySelector('.car-split-head');
      if (!head) return;
      head.addEventListener('click', function () {
        var open = host.classList.toggle('is-open');
        if (typeof opts.onToggle === 'function') opts.onToggle(open);
      });
    });
  }

  function grid(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      host.addEventListener('click', function (e) {
        var item = e.target.closest('.car-grid-item');
        if (!item) return;
        var wasOpen = item.classList.contains('is-open');
        host.querySelectorAll('.car-grid-item.is-open').forEach(function (el) { el.classList.remove('is-open'); });
        if (!wasOpen) item.classList.add('is-open');
        if (typeof opts.onPick === 'function') opts.onPick(item);
      });
    });
  }

  var CarouselPack = { split: split, grid: grid };
  if (typeof module !== 'undefined' && module.exports) module.exports = CarouselPack;
  else root.CarouselPack = CarouselPack;
})(typeof window !== 'undefined' ? window : this);
