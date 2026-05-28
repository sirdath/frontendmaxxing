/* ============================================
   HEADER KIT — Drives headers-pro behaviors (Headroom-style class toggling)
   Inspired by Headroom.js + Bootstrap Scrollspy (IntersectionObserver)
   ============================================
   Toggles classes the CSS reacts to — never sets inline transition styles.

   Usage:
     HeaderKit.init('.hdr', {
       hideOnScroll: true,   // hide on scroll-down, show on scroll-up (.is-pinned/.is-unpinned)
       blurAt: 40,           // px before .is-scrolled (drives blur + shrink); .is-top below it
       tolerance: 6,         // px of scroll before direction flips (debounce jitter)
       offset: 80,           // don't start hiding until this far down
       scrollSpy: true,      // highlight .hdr-link[href="#id"] for the section in view
       progress: true        // fill .hdr-progress > i with scroll-through %
     });

   Also wires: mega-menu (click/keyboard/outside-close), the burger → full-screen
   mobile overlay (scroll-lock + Esc), and ⌘K on the .hdr-cmdk button (dispatches
   a 'cmdk' event you can hook, or focuses [data-command-palette]).
   ============================================ */
(function (root) {
  'use strict';

  var defaults = { hideOnScroll: false, blurAt: 40, tolerance: 6, offset: 80, scrollSpy: false, progress: false };

  function create(hdr, opts) {
    var o = Object.assign({}, defaults, opts || {});
    var lastY = window.scrollY || 0;
    var pinned = true;

    function onScroll() {
      var y = window.scrollY || document.documentElement.scrollTop;
      hdr.classList.toggle('is-top', y < o.blurAt);
      hdr.classList.toggle('is-scrolled', y >= o.blurAt);

      if (o.hideOnScroll && Math.abs(y - lastY) > o.tolerance) {
        var down = y > lastY && y > o.offset;
        if (down && pinned) { pinned = false; hdr.classList.add('is-unpinned'); hdr.classList.remove('is-pinned'); }
        else if (!down && !pinned) { pinned = true; hdr.classList.add('is-pinned'); hdr.classList.remove('is-unpinned'); }
      }
      if (o.progress) {
        var bar = hdr.querySelector('.hdr-progress > i');
        if (bar) { var docH = document.documentElement.scrollHeight - window.innerHeight; bar.style.setProperty('--p', (docH > 0 ? Math.min(1, y / docH) : 0).toFixed(4)); }
      }
      lastY = y;
    }

    var ticking = false;
    function tick() { if (ticking) return; ticking = true; requestAnimationFrame(function () { onScroll(); ticking = false; }); }
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    onScroll();

    /* Mega-menu: open on hover handled by CSS; add click + keyboard + outside-close */
    Array.prototype.forEach.call(hdr.querySelectorAll('.hdr-mega'), function (mega) {
      var trigger = mega.querySelector('.hdr-link, button');
      if (trigger) trigger.addEventListener('click', function (e) { e.preventDefault(); mega.classList.toggle('is-open'); });
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.hdr-mega')) hdr.querySelectorAll('.hdr-mega.is-open').forEach(function (m) { m.classList.remove('is-open'); });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { hdr.querySelectorAll('.hdr-mega.is-open').forEach(function (m) { m.classList.remove('is-open'); }); closeMenu(); } });

    /* Burger → full-screen overlay */
    var burger = hdr.querySelector('.hdr-burger');
    function openMenu() { hdr.classList.add('is-menu-open'); document.documentElement.style.overflow = 'hidden'; }
    function closeMenu() { hdr.classList.remove('is-menu-open'); document.documentElement.style.overflow = ''; }
    if (burger) burger.addEventListener('click', function () { hdr.classList.contains('is-menu-open') ? closeMenu() : openMenu(); });
    hdr.querySelectorAll('.hdr-mobile a').forEach(function (a) { a.addEventListener('click', closeMenu); });

    /* ⌘K command button */
    var cmdk = hdr.querySelector('.hdr-cmdk');
    if (cmdk) cmdk.addEventListener('click', function () {
      hdr.dispatchEvent(new CustomEvent('cmdk', { bubbles: true }));
      var palette = document.querySelector('[data-command-palette] input, [data-command-palette]');
      if (palette && palette.focus) palette.focus();
    });
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (cmdk) cmdk.click(); }
    });

    /* Scroll-spy (IntersectionObserver) */
    var spy = null;
    if (o.scrollSpy && 'IntersectionObserver' in window) {
      var links = Array.prototype.slice.call(hdr.querySelectorAll('.hdr-link[href^="#"]'));
      var map = {}; var sections = [];
      links.forEach(function (a) { var id = a.getAttribute('href').slice(1); var s = document.getElementById(id); if (s) { map[id] = a; sections.push(s); } });
      if (sections.length) {
        spy = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) { if (en.isIntersecting) { links.forEach(function (l) { l.classList.remove('is-active'); }); if (map[en.target.id]) map[en.target.id].classList.add('is-active'); } });
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
        sections.forEach(function (s) { spy.observe(s); });
      }
    }

    return { el: hdr, destroy: function () { window.removeEventListener('scroll', tick); window.removeEventListener('resize', tick); if (spy) spy.disconnect(); closeMenu(); } };
  }

  function init(target, opts) {
    if (typeof target === 'string') { var n = document.querySelector(target); return n ? create(n, opts) : null; }
    return create(target, opts);
  }

  var HeaderKit = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = HeaderKit;
  else root.HeaderKit = HeaderKit;
})(typeof window !== 'undefined' ? window : this);
