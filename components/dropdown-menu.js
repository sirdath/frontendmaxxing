/* ============================================
   DROPDOWN MENU — Toggle, keyboard nav, outside-click close
   Inspired by Radix DropdownMenu
   ============================================
   Usage:
     DropdownMenu.init('[data-dropdown]', {
       onSelect: function (item) { console.log(item.dataset.action); }
     });
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
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var trigger = el.querySelector('.ddm-trigger');
    var menu    = el.querySelector('.ddm-menu');
    if (!trigger || !menu) return { el: el, destroy: function () {} };

    function open()  { el.classList.add('is-open'); }
    function close() { el.classList.remove('is-open'); clearFocus(); }
    function toggle(){ el.classList.contains('is-open') ? close() : open(); }

    function items() {
      return Array.prototype.slice.call(menu.querySelectorAll('.ddm-item:not([disabled])'));
    }
    function clearFocus() {
      menu.querySelectorAll('.ddm-item.is-focused').forEach(function (n) { n.classList.remove('is-focused'); });
    }
    function moveFocus(dir) {
      var list = items();
      if (!list.length) return;
      var current = menu.querySelector('.ddm-item.is-focused');
      var idx = current ? list.indexOf(current) : -1;
      idx = (idx + dir + list.length) % list.length;
      clearFocus();
      list[idx].classList.add('is-focused');
      list[idx].focus();
    }

    function onTriggerClick(e) { e.stopPropagation(); toggle(); }
    function onItemClick(e) {
      var item = e.target.closest('.ddm-item');
      if (!item) return;
      if (typeof o.onSelect === 'function') o.onSelect(item);
      if (o.closeOnSelect) close();
    }
    function onKey(e) {
      if (!el.classList.contains('is-open')) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault(); open();
          setTimeout(function () { moveFocus(1); }, 30);
        }
        return;
      }
      if (e.key === 'ArrowDown') { e.preventDefault(); moveFocus(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); moveFocus(-1); }
      else if (e.key === 'Escape') { close(); trigger.focus(); }
      else if (e.key === 'Enter') {
        var focused = menu.querySelector('.ddm-item.is-focused');
        if (focused) { e.preventDefault(); focused.click(); }
      }
    }
    function onOutside(e) { if (!el.contains(e.target)) close(); }

    trigger.addEventListener('click', onTriggerClick);
    menu.addEventListener('click', onItemClick);
    el.addEventListener('keydown', onKey);
    document.addEventListener('click', onOutside);

    function destroy() {
      trigger.removeEventListener('click', onTriggerClick);
      menu.removeEventListener('click', onItemClick);
      el.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onOutside);
    }

    return { el: el, open: open, close: close, toggle: toggle, destroy: destroy };
  }

  var DropdownMenu = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = DropdownMenu;
  else root.DropdownMenu = DropdownMenu;
})(typeof window !== 'undefined' ? window : this);
