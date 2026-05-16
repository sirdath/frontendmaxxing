/* ============================================
   FAMILY BUTTON — Toggle open/closed on trigger click; outside-click closes
   Inspired by cult-ui Family Button
   ============================================
   Usage:
     FamilyButton.init('.fam', {
       closeOnOutside: true,
       onAction: function (key, el) { console.log('action', key); }
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    closeOnOutside: true,
    closeOnSelect: true,
    onOpen: null,
    onClose: null,
    onAction: null
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

    var trigger = el.querySelector('.fam-trigger');
    var actions = el.querySelectorAll('.fam-action');

    function open() {
      el.classList.add('is-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
      if (typeof o.onOpen === 'function') o.onOpen(el);
    }
    function close() {
      el.classList.remove('is-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      if (typeof o.onClose === 'function') o.onClose(el);
    }
    function toggle() {
      if (el.classList.contains('is-open')) close(); else open();
    }

    function onTrigger(e) {
      e.stopPropagation();
      toggle();
    }

    function onAction(e) {
      var key = this.getAttribute('data-fam-action');
      if (typeof o.onAction === 'function') o.onAction(key, this);
      if (o.closeOnSelect) close();
    }

    function onOutside(e) {
      if (!el.contains(e.target)) close();
    }

    if (trigger) trigger.addEventListener('click', onTrigger);
    actions.forEach(function (a) { a.addEventListener('click', onAction); });
    if (o.closeOnOutside) document.addEventListener('click', onOutside);

    function destroy() {
      if (trigger) trigger.removeEventListener('click', onTrigger);
      actions.forEach(function (a) { a.removeEventListener('click', onAction); });
      document.removeEventListener('click', onOutside);
      close();
    }

    return { el: el, open: open, close: close, toggle: toggle, destroy: destroy };
  }

  var FamilyButton = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = FamilyButton;
  else root.FamilyButton = FamilyButton;
})(typeof window !== 'undefined' ? window : this);
