/* ============================================
   GSAP STAGGER GRID — Grid-aware staggered entrance (from center / edges / random)
   Inspired by official GSAP advanced stagger (grid + from) pattern
   ============================================
   Requires GSAP core from CDN. (ScrollTrigger optional.)

   Usage:
     StaggerGrid.init('.grid');                       // animates direct children
     StaggerGrid.init('.grid', {
       item: '.cell',
       from: 'center',          // 'start'|'center'|'edges'|'end'|'random'|[x,y]
       amount: 0.9,
       y: 50, scale: 0.8,
       ease: 'back.out(1.5)',
       scroll: true
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    item: null,
    from: 'center',
    amount: 0.8,
    y: 40,
    scale: 0.85,
    duration: 0.6,
    ease: 'power3.out',
    scroll: false,
    start: 'top 80%'
  };

  function init(target, opts) {
    var gsap = root.gsap;
    if (!gsap) { console.warn('[StaggerGrid] Requires GSAP core.'); return null; }
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var host = typeof target === 'string' ? document.querySelector(target) : target;
    if (!host) return null;
    var items = o.item
      ? host.querySelectorAll(o.item)
      : host.children;
    items = Array.prototype.slice.call(items);
    if (!items.length) return null;

    gsap.set(items, { autoAlpha: 0, y: o.y, scale: o.scale });

    var play = function () {
      gsap.to(items, {
        autoAlpha: 1, y: 0, scale: 1,
        duration: o.duration,
        ease: o.ease,
        overwrite: true,
        stagger: { amount: o.amount, grid: 'auto', from: o.from }
      });
    };

    var st = null;
    if (o.scroll && root.ScrollTrigger) {
      gsap.registerPlugin(root.ScrollTrigger);
      st = root.ScrollTrigger.create({ trigger: host, start: o.start, once: true, onEnter: play });
    } else {
      play();
    }

    return {
      host: host,
      items: items,
      replay: play,
      destroy: function () {
        if (st) st.kill();
        gsap.set(items, { clearProps: 'all' });
      }
    };
  }

  var StaggerGrid = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = StaggerGrid;
  else root.StaggerGrid = StaggerGrid;
})(typeof window !== 'undefined' ? window : this);
