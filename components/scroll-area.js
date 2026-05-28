/* ============================================
   SCROLL AREA — Toggles edge-fade classes for .sa-fade containers
   Inspired by Radix ScrollArea
   ============================================
   Only needed for the .sa-fade edge-mask behavior — the custom scrollbar
   itself is pure CSS. Adds .is-top/.is-bottom (vertical) or .is-start/.is-end
   (.sa-x horizontal) depending on scroll position so the right edge fades.

   Usage:
     ScrollArea.init('.sa-fade');
   ============================================ */
(function (root) {
  'use strict';

  function create(el) {
    var horizontal = el.classList.contains('sa-x');

    function update() {
      if (horizontal) {
        var atStart = el.scrollLeft <= 1;
        var atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
        el.classList.toggle('is-start', atStart);
        el.classList.toggle('is-end', atEnd);
      } else {
        var atTop = el.scrollTop <= 1;
        var atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
        el.classList.toggle('is-top', atTop);
        el.classList.toggle('is-bottom', atBottom);
      }
    }

    el.addEventListener('scroll', update, { passive: true });
    var ro = ('ResizeObserver' in window) ? new ResizeObserver(update) : null;
    if (ro) ro.observe(el);
    // also observe content changes
    var mo = ('MutationObserver' in window) ? new MutationObserver(update) : null;
    if (mo) mo.observe(el, { childList: true, subtree: true });
    update();

    return {
      el: el,
      refresh: update,
      destroy: function () { el.removeEventListener('scroll', update); if (ro) ro.disconnect(); if (mo) mo.disconnect(); }
    };
  }

  function init(target) {
    if (typeof target === 'string') {
      var nodes = document.querySelectorAll(target);
      if (nodes.length === 0) return null;
      if (nodes.length === 1) return create(nodes[0]);
      var arr = []; nodes.forEach(function (n) { arr.push(create(n)); });
      return arr;
    }
    return create(target);
  }

  var ScrollArea = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = ScrollArea;
  else root.ScrollArea = ScrollArea;
})(typeof window !== 'undefined' ? window : this);
