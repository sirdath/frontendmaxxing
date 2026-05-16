/* ============================================
   MISC WATERMELON PACK — JS glue
   Theme toggle, drag-stack, blob-button cursor tracking, drawer
   ============================================
   Usage:
     MiscWMPack.theme('[data-mwm-theme]', { onChange: function (isDark) {} });
     MiscWMPack.dragstack('[data-mwm-dragstk]', { onSwipe: function (dir, card) {} });
     MiscWMPack.blob('.mwm-bbtn');     // auto-binds cursor tracking
     MiscWMPack.drawer('[data-mwm-drawer]', { onOpen, onClose });
   ============================================ */
(function (root) {
  'use strict';

  function each(target, fn) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, fn);
  }

  function theme(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      host.addEventListener('click', function () {
        host.classList.toggle('is-dark');
        var isDark = host.classList.contains('is-dark');
        document.documentElement.classList.toggle('dark', isDark);
        if (typeof opts.onChange === 'function') opts.onChange(isDark);
      });
    });
  }

  function dragstack(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      bindTop(host);
      function bindTop(h) {
        var cards = h.querySelectorAll('.mwm-dragstk-card');
        if (!cards.length) return;
        var top = cards[0];
        var startX = 0, startY = 0, dragging = false;
        top.addEventListener('pointerdown', function (e) {
          dragging = true; startX = e.clientX; startY = e.clientY;
          top.classList.add('is-dragging');
          try { top.setPointerCapture(e.pointerId); } catch (_) {}
        });
        top.addEventListener('pointermove', function (e) {
          if (!dragging) return;
          var dx = e.clientX - startX, dy = e.clientY - startY;
          top.style.transform = 'translate(' + dx + 'px, ' + dy + 'px) rotate(' + (dx / 16) + 'deg)';
        });
        top.addEventListener('pointerup', function (e) {
          if (!dragging) return;
          dragging = false;
          top.classList.remove('is-dragging');
          var dx = e.clientX - startX, dy = e.clientY - startY;
          var threshold = 80;
          if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
            var dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
            top.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            top.style.transform = 'translate(' + (dx * 6) + 'px, ' + (dy * 6) + 'px) rotate(' + (dx / 6) + 'deg)';
            top.style.opacity = '0';
            setTimeout(function () {
              top.remove();
              if (typeof opts.onSwipe === 'function') opts.onSwipe(dir, top);
              bindTop(h);
            }, 320);
          } else {
            top.style.transform = '';
          }
        });
      }
    });
  }

  function blob(target) {
    each(target, function (host) {
      host.addEventListener('pointermove', function (e) {
        var r = host.getBoundingClientRect();
        host.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        host.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  function drawer(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      function open() {
        host.classList.add('is-open');
        if (typeof opts.onOpen === 'function') opts.onOpen();
      }
      function close() {
        host.classList.remove('is-open');
        if (typeof opts.onClose === 'function') opts.onClose();
      }
      host._open = open;
      host._close = close;

      // Drag-to-dismiss via handle
      var handle = host.querySelector('.mwm-drawer-handle');
      if (handle) {
        var startY = 0, dy = 0, dragging = false;
        handle.addEventListener('pointerdown', function (e) {
          dragging = true; startY = e.clientY; dy = 0;
          try { handle.setPointerCapture(e.pointerId); } catch (_) {}
          host.style.transition = 'none';
        });
        handle.addEventListener('pointermove', function (e) {
          if (!dragging) return;
          dy = Math.max(0, e.clientY - startY);
          host.style.transform = 'translateY(' + dy + 'px)';
        });
        handle.addEventListener('pointerup', function () {
          if (!dragging) return;
          dragging = false;
          host.style.transition = '';
          if (dy > 100) close();
          host.style.transform = '';
        });
      }
    });
  }

  var MiscWMPack = { theme: theme, dragstack: dragstack, blob: blob, drawer: drawer };
  if (typeof module !== 'undefined' && module.exports) module.exports = MiscWMPack;
  else root.MiscWMPack = MiscWMPack;
})(typeof window !== 'undefined' ? window : this);
