/* ============================================
   SIDEBAR NAV — collapse toggle + nested groups + mobile drawer + persistence
   Inspired by shadcn/ui Sidebar (SidebarProvider/Trigger/Rail)
   ============================================
   Usage:
     SidebarNav.init('.snav', {
       collapsed: false,        // start collapsed (icon rail)
       persistKey: 'sidebar',   // localStorage key to remember collapsed state
       onNavigate: function (item) { … }   // fired when an .snav-item is clicked
     });
     // mobile trigger: any <button class="snav-burger"> toggles the drawer.
   ============================================ */
(function (root) {
  'use strict';

  function create(snav, opts) {
    opts = opts || {};

    /* Restore persisted collapsed state */
    if (opts.persistKey) {
      try { if (localStorage.getItem('snav:' + opts.persistKey) === '1') snav.classList.add('is-collapsed'); } catch (e) {}
    }
    if (opts.collapsed) snav.classList.add('is-collapsed');

    function setCollapsed(on) {
      snav.classList.toggle('is-collapsed', on);
      if (opts.persistKey) { try { localStorage.setItem('snav:' + opts.persistKey, on ? '1' : '0'); } catch (e) {} }
    }

    /* Collapse toggle */
    var toggle = snav.querySelector('.snav-toggle');
    if (toggle) toggle.addEventListener('click', function () { setCollapsed(!snav.classList.contains('is-collapsed')); });

    /* Nested group expand/collapse */
    snav.addEventListener('click', function (e) {
      var trig = e.target.closest('.snav-group-trigger');
      if (trig) { e.preventDefault(); var g = trig.closest('.snav-group'); if (g) {
        // expanding a group in rail mode? auto-expand the rail first
        if (snav.classList.contains('is-collapsed')) setCollapsed(false);
        g.classList.toggle('is-open');
      } return; }

      var item = e.target.closest('.snav-item:not(.snav-group-trigger)');
      if (item) {
        snav.querySelectorAll('.snav-item.is-active').forEach(function (i) { i.classList.remove('is-active'); });
        item.classList.add('is-active');
        if (typeof opts.onNavigate === 'function') opts.onNavigate(item);
        if (window.matchMedia('(max-width: 860px)').matches) closeDrawer();
      }
    });

    /* Mobile drawer: burger + scrim + Esc */
    var scrim = document.querySelector('.snav-scrim');
    if (!scrim) { scrim = document.createElement('div'); scrim.className = 'snav-scrim'; snav.parentNode.insertBefore(scrim, snav.nextSibling); }
    function openDrawer() { snav.classList.add('is-open'); document.documentElement.style.overflow = 'hidden'; }
    function closeDrawer() { snav.classList.remove('is-open'); document.documentElement.style.overflow = ''; }
    document.querySelectorAll('.snav-burger').forEach(function (b) { b.addEventListener('click', function () { snav.classList.contains('is-open') ? closeDrawer() : openDrawer(); }); });
    scrim.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });

    return {
      el: snav,
      collapse: function () { setCollapsed(true); },
      expand: function () { setCollapsed(false); },
      toggle: function () { setCollapsed(!snav.classList.contains('is-collapsed')); },
      open: openDrawer, close: closeDrawer
    };
  }

  function init(target, opts) {
    if (typeof target === 'string') { var n = document.querySelector(target); return n ? create(n, opts) : null; }
    return create(target, opts);
  }

  var SidebarNav = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = SidebarNav;
  else root.SidebarNav = SidebarNav;
})(typeof window !== 'undefined' ? window : this);
