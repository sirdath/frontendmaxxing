/* ============================================
   CONTEXT MENU — Position a menu at cursor on right-click
   Inspired by Linear / Notion / macOS context menus
   ============================================
   Usage:
     <div data-context-menu="#myMenu">…</div>
     <div id="myMenu" class="ctx ddm-menu">…</div>
     ContextMenu.init('[data-context-menu]', {
       onSelect: function (item, targetEl) { … }
     });

   Or attach a menu to any element:
     ContextMenu.attach(triggerEl, menuEl, opts);
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    onSelect: null,
    closeOnSelect: true
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) {
      var sel = el.getAttribute('data-context-menu');
      var menu = sel && document.querySelector(sel);
      if (menu) instances.push(attach(el, menu, opts));
    });
    return instances.length === 1 ? instances[0] : instances;
  }

  function attach(trigger, menu, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    function open(x, y, targetEl) {
      menu.classList.add('is-open');
      var r = menu.getBoundingClientRect();
      var clampedX = Math.min(x, window.innerWidth - r.width - 8);
      var clampedY = Math.min(y, window.innerHeight - r.height - 8);
      menu.style.left = clampedX + 'px';
      menu.style.top  = clampedY + 'px';
      menu.style.setProperty('--ctx-x', clampedX + 'px');
      menu.style.setProperty('--ctx-y', clampedY + 'px');
      menu.dataset.targetTarget = '';
      menu._target = targetEl;
    }
    function close() { menu.classList.remove('is-open'); }

    function onContext(e) {
      e.preventDefault();
      open(e.clientX, e.clientY, e.target);
    }
    function onMenuClick(e) {
      var item = e.target.closest('.ddm-item, [data-ctx-item]');
      if (!item) return;
      if (typeof o.onSelect === 'function') o.onSelect(item, menu._target);
      if (o.closeOnSelect) close();
    }
    function onOutside(e) {
      if (!menu.contains(e.target)) close();
    }
    function onKey(e) { if (e.key === 'Escape') close(); }

    trigger.addEventListener('contextmenu', onContext);
    menu.addEventListener('click', onMenuClick);
    document.addEventListener('click', onOutside);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', close, true);

    function destroy() {
      trigger.removeEventListener('contextmenu', onContext);
      menu.removeEventListener('click', onMenuClick);
      document.removeEventListener('click', onOutside);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', close, true);
    }

    return { trigger: trigger, menu: menu, open: open, close: close, destroy: destroy };
  }

  var ContextMenu = { init: init, attach: attach };

  if (typeof module !== 'undefined' && module.exports) module.exports = ContextMenu;
  else root.ContextMenu = ContextMenu;
})(typeof window !== 'undefined' ? window : this);
