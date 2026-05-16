/* ============================================
   WORKSPACE SWITCHER — Open/close menu, switch active workspace
   Inspired by Linear / Slack / Notion
   ============================================
   Usage:
     WorkspaceSwitcher.init('[data-workspace-switcher]', {
       onSwitch: function (id, name) { … }
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    onSwitch: null,
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

    var trigger = el.querySelector('.wss-trigger');
    var menu    = el.querySelector('.wss-menu');
    if (!trigger || !menu) return { el: el, destroy: function () {} };

    function open()  { el.classList.add('is-open'); }
    function close() { el.classList.remove('is-open'); }
    function toggle(){ el.classList.contains('is-open') ? close() : open(); }

    function onTrigger(e) { e.stopPropagation(); toggle(); }
    function onMenuClick(e) {
      var opt = e.target.closest('.wss-option');
      if (!opt) return;
      if (opt.classList.contains('wss-option-action')) {
        if (typeof o.onAction === 'function') o.onAction(opt.textContent.trim(), opt);
      } else {
        // Switch active
        var prev = menu.querySelector('.wss-option.is-active');
        if (prev) prev.classList.remove('is-active');
        opt.classList.add('is-active');
        var name = (opt.querySelector('.wss-option-name') || opt).textContent.trim();
        var logo = opt.querySelector('.wss-option-logo');
        var triggerLogo = el.querySelector('.wss-logo');
        var triggerName = el.querySelector('.wss-name');
        if (logo && triggerLogo) triggerLogo.textContent = logo.textContent;
        if (triggerName) triggerName.textContent = name;
        if (typeof o.onSwitch === 'function') o.onSwitch(opt.getAttribute('data-id'), name);
      }
      close();
    }
    function onOutside(e) { if (!el.contains(e.target)) close(); }

    trigger.addEventListener('click', onTrigger);
    menu.addEventListener('click', onMenuClick);
    document.addEventListener('click', onOutside);

    function destroy() {
      trigger.removeEventListener('click', onTrigger);
      menu.removeEventListener('click', onMenuClick);
      document.removeEventListener('click', onOutside);
    }

    return { el: el, open: open, close: close, toggle: toggle, destroy: destroy };
  }

  var WorkspaceSwitcher = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = WorkspaceSwitcher;
  else root.WorkspaceSwitcher = WorkspaceSwitcher;
})(typeof window !== 'undefined' ? window : this);
