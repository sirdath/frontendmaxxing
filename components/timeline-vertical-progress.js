/* ============================================
   TIMELINE VERTICAL PROGRESS — Bind --tlvp-progress to scroll, mark items as reached
   Inspired by Aceternity / Magic UI
   ============================================
   Usage:
     TimelineVerticalProgress.init('[data-tlvp]', {
       trigger: 0.5    // viewport fraction at which an item is "reached"
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    trigger: 0.5
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var items = Array.prototype.slice.call(el.querySelectorAll('.tlvp-item'));
    var raf = null, pending = false;

    function update() {
      pending = false;
      var r = el.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      // Progress: 0 when section top is at vh*trigger, 1 when section bottom is at vh*trigger
      var triggerY = vh * o.trigger;
      var startY = r.top;
      var endY   = r.bottom;
      var total  = endY - startY;
      var done   = clamp((triggerY - startY) / total, 0, 1);
      el.style.setProperty('--tlvp-progress', done.toFixed(4));

      items.forEach(function (item) {
        var ir = item.getBoundingClientRect();
        var reached = (ir.top + ir.height * 0.3) < triggerY;
        item.classList.toggle('is-reached', reached);
      });
    }

    function onScroll() {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    function destroy() {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      el.style.removeProperty('--tlvp-progress');
      items.forEach(function (i) { i.classList.remove('is-reached'); });
    }

    return { el: el, destroy: destroy };
  }

  var TimelineVerticalProgress = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = TimelineVerticalProgress;
  else root.TimelineVerticalProgress = TimelineVerticalProgress;
})(typeof window !== 'undefined' ? window : this);
