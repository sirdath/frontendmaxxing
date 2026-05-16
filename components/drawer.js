/* ============================================
   DRAWER — Open/close, ESC, click-outside, focus trap basics
   Inspired by Radix Sheet / Vaul
   ============================================
   Usage:
     Drawer.init('.drw');           // binds [data-drawer-open]/[data-drawer-close]
     Drawer.open('#myDrawer');
     Drawer.close('#myDrawer');
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    closeOnOverlay: true,
    closeOnEscape: true,
    onOpen: null,
    onClose: null
  };

  var openInstances = new Set();

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    bindTriggers();
    return instances.length === 1 ? instances[0] : instances;
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var overlay = el.querySelector('.drw-overlay');

    function open() {
      el.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      openInstances.add(instance);
      if (typeof o.onOpen === 'function') o.onOpen(el);
    }
    function close() {
      el.classList.remove('is-open');
      openInstances.delete(instance);
      if (!openInstances.size) document.body.style.overflow = '';
      if (typeof o.onClose === 'function') o.onClose(el);
    }
    function onOverlayClick(e) {
      if (e.target === overlay && o.closeOnOverlay) close();
    }
    function onClick(e) {
      var closer = e.target.closest('[data-drawer-close]');
      if (closer && el.contains(closer)) close();
    }
    function onKey(e) {
      if (e.key === 'Escape' && o.closeOnEscape && el.classList.contains('is-open')) close();
    }

    if (overlay) overlay.addEventListener('click', onOverlayClick);
    el.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);

    var instance = {
      el: el, open: open, close: close,
      destroy: function () {
        if (overlay) overlay.removeEventListener('click', onOverlayClick);
        el.removeEventListener('click', onClick);
        document.removeEventListener('keydown', onKey);
      }
    };
    return instance;
  }

  function bindTriggers() {
    if (bindTriggers._done) return;
    bindTriggers._done = true;
    document.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-drawer-open]');
      if (!opener) return;
      var sel = opener.getAttribute('data-drawer-open');
      var drawer = document.querySelector(sel);
      if (drawer) drawer.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  }

  function openById(sel) { var d = document.querySelector(sel); if (d) d.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
  function closeById(sel) { var d = document.querySelector(sel); if (d) d.classList.remove('is-open'); document.body.style.overflow = ''; }

  var Drawer = { init: init, open: openById, close: closeById };

  if (typeof module !== 'undefined' && module.exports) module.exports = Drawer;
  else root.Drawer = Drawer;
})(typeof window !== 'undefined' ? window : this);
