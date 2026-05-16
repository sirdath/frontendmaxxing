/* ============================================
   DYNAMIC ISLAND — Toggle / auto-expand the pill
   Inspired by cult-ui / Apple Dynamic Island
   ============================================
   Usage:
     DynamicIsland.init('.di');
     DynamicIsland.init('.di', { autoCollapse: 4000 });

     // Programmatic:
     var di = DynamicIsland.init('.di');
     di.expand();
     di.collapse();
     di.toggle();

     // Or call class API directly:
     DynamicIsland.expand('.di');
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    autoCollapse: 0,    // ms; 0 = never
    onExpand: null,
    onCollapse: null
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

    var timer = null;

    function expand() {
      el.classList.add('is-expanded');
      if (typeof o.onExpand === 'function') o.onExpand(el);
      if (o.autoCollapse && !el.classList.contains('di-static')) {
        clearTimeout(timer);
        timer = setTimeout(collapse, o.autoCollapse);
      }
    }
    function collapse() {
      el.classList.remove('is-expanded');
      if (typeof o.onCollapse === 'function') o.onCollapse(el);
    }
    function toggle() {
      if (el.classList.contains('is-expanded')) collapse(); else expand();
    }

    function onClick(e) {
      toggle();
      e.stopPropagation();
    }
    el.addEventListener('click', onClick);

    function destroy() {
      el.removeEventListener('click', onClick);
      clearTimeout(timer);
      collapse();
    }

    return { el: el, expand: expand, collapse: collapse, toggle: toggle, destroy: destroy };
  }

  function expandFn(target) { setBatch(target, true); }
  function collapseFn(target) { setBatch(target, false); }
  function setBatch(target, on) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, function (el) { el.classList.toggle('is-expanded', on); });
  }

  var DynamicIsland = { init: init, expand: expandFn, collapse: collapseFn };

  if (typeof module !== 'undefined' && module.exports) module.exports = DynamicIsland;
  else root.DynamicIsland = DynamicIsland;
})(typeof window !== 'undefined' ? window : this);
