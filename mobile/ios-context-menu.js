/* ============================================
   IOS CONTEXT MENU — Long-press to reveal contextual actions
   ============================================
   Usage:
     IosContextMenu.attach('.target', {
       preview: function (el) { return el.cloneNode(true); }, // returns preview node
       actions: [
         { label: 'Copy',   icon: '⎘', onTap: function () {} },
         { label: 'Share',  icon: '↗', onTap: function () {} },
         { label: 'Delete', icon: '🗑', destructive: true, onTap: function () {} }
       ],
       host: container // overlay attaches inside this (defaults to document.body)
     });
   ============================================ */
(function (root) {
  'use strict';

  var HOLD_MS = 500;

  function attach(target, opts) {
    opts = opts || {};
    var nodes = typeof target === 'string' ? document.querySelectorAll(target) : [target];
    Array.prototype.forEach.call(nodes, function (el) { bind(el, opts); });
  }

  function bind(el, opts) {
    if (el.dataset.iosCmenuBound) return;
    el.dataset.iosCmenuBound = '1';
    var timer = null;
    var startX = 0, startY = 0;

    function start(e) {
      var p = (e.touches && e.touches[0]) || e;
      startX = p.clientX; startY = p.clientY;
      timer = setTimeout(function () { open(el, opts); }, HOLD_MS);
    }
    function move(e) {
      if (!timer) return;
      var p = (e.touches && e.touches[0]) || e;
      if (Math.hypot(p.clientX - startX, p.clientY - startY) > 6) cancel();
    }
    function cancel() {
      if (timer) { clearTimeout(timer); timer = null; }
    }
    el.addEventListener('pointerdown', start);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', cancel);
    el.addEventListener('pointerleave', cancel);
    el.addEventListener('pointercancel', cancel);
    el.addEventListener('contextmenu', function (e) { e.preventDefault(); open(el, opts); });
  }

  function open(el, opts) {
    var host = opts.host || document.body;
    if (typeof host === 'string') host = document.querySelector(host);
    if (!host) return;

    var overlay = document.createElement('div');
    overlay.className = 'ios-cmenu-overlay';

    if (typeof opts.preview === 'function') {
      var prev = document.createElement('div');
      prev.className = 'ios-cmenu-preview';
      var content = opts.preview(el);
      if (content instanceof Node) prev.appendChild(content);
      else if (typeof content === 'string') prev.innerHTML = content;
      overlay.appendChild(prev);
    }

    var menu = document.createElement('div');
    menu.className = 'ios-cmenu';
    (opts.actions || []).forEach(function (a) {
      var btn = document.createElement('button');
      btn.className = 'ios-cmenu-row' + (a.destructive ? ' is-destructive' : '');
      btn.innerHTML =
        '<span class="ios-cmenu-row-label">' + esc(a.label) + '</span>' +
        '<span class="ios-cmenu-row-icon">' + (a.icon || '') + '</span>';
      btn.addEventListener('click', function () {
        close();
        if (typeof a.onTap === 'function') a.onTap();
      });
      menu.appendChild(btn);
    });
    overlay.appendChild(menu);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });

    host.appendChild(overlay);

    function close() {
      overlay.classList.add('is-leaving');
      setTimeout(function () { overlay.remove(); }, 180);
    }

    return { close: close };
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var IosContextMenu = { attach: attach, open: open };
  if (typeof module !== 'undefined' && module.exports) module.exports = IosContextMenu;
  else root.IosContextMenu = IosContextMenu;
})(typeof window !== 'undefined' ? window : this);
