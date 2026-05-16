/* ============================================
   ANNOUNCEMENT BAR — Dismiss + persist in localStorage
   ============================================
   Usage:
     AnnouncementBar.init('[data-announcement-bar]', {
       persistKey: 'launch-2026',
       onDismiss: function () { … }
     });
   ============================================ */
(function (root) {
  'use strict';

  function init(target, opts) {
    opts = opts || {};
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) {
      var key = opts.persistKey || el.getAttribute('data-annb-key');
      if (key && localStorage.getItem('annb-' + key) === '1') {
        el.classList.add('is-dismissed');
        return;
      }
      var close = el.querySelector('[data-annb-close]');
      function dismiss() {
        el.classList.add('is-dismissed');
        if (key) { try { localStorage.setItem('annb-' + key, '1'); } catch (e) {} }
        if (typeof opts.onDismiss === 'function') opts.onDismiss(el);
      }
      if (close) close.addEventListener('click', dismiss);
      instances.push({ el: el, dismiss: dismiss });
    });
    return instances.length === 1 ? instances[0] : instances;
  }

  var AnnouncementBar = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = AnnouncementBar;
  else root.AnnouncementBar = AnnouncementBar;
})(typeof window !== 'undefined' ? window : this);
