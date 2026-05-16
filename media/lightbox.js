/* ============================================
   LIGHTBOX — Full-screen image gallery with keyboard nav
   Inspired by PhotoSwipe / lightGallery
   ============================================
   Usage:
     <a class="lbx-trigger" data-lbx="gal1" href="full1.jpg" data-lbx-cap="Caption">…</a>
     Lightbox.init();
     Lightbox.init({ thumbs: true, caption: true });

   Group images by giving them the same `data-lbx="<id>"`.
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    thumbs: true,
    caption: true,
    closeOnBackdrop: true,
    onChange: null
  };

  var overlay = null;
  var items = [];
  var current = 0;
  var groupId = null;
  var opts = null;

  function init(o) {
    opts = Object.assign({}, defaults, o || {});
    document.addEventListener('click', onTriggerClick);
    return { open: open, close: close, destroy: destroy };
  }

  function destroy() {
    document.removeEventListener('click', onTriggerClick);
    if (overlay) overlay.remove();
  }

  function onTriggerClick(e) {
    var a = e.target.closest('.lbx-trigger, [data-lbx]');
    if (!a) return;
    e.preventDefault();
    var id = a.getAttribute('data-lbx');
    groupId = id;
    items = Array.prototype.slice.call(document.querySelectorAll('[data-lbx="' + id + '"]'));
    current = items.indexOf(a);
    if (current < 0) current = 0;
    open();
  }

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'lbx' + (opts.thumbs ? ' lbx-thumbs-on' : '');
    overlay.innerHTML =
      '<div class="lbx-header">' +
        '<span class="lbx-counter"></span>' +
        '<div class="lbx-header-actions">' +
          '<button class="lbx-action" data-lbx-download>↓</button>' +
          '<button class="lbx-close" data-lbx-close>×</button>' +
        '</div>' +
      '</div>' +
      '<div class="lbx-stage">' +
        '<button class="lbx-nav lbx-prev" data-lbx-prev>‹</button>' +
        '<img class="lbx-image" alt="">' +
        '<button class="lbx-nav lbx-next" data-lbx-next>›</button>' +
      '</div>' +
      (opts.caption ? '<div class="lbx-caption"></div>' : '') +
      (opts.thumbs ? '<div class="lbx-thumbs"></div>' : '');
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      if (e.target.matches('[data-lbx-close]')) close();
      else if (e.target.matches('[data-lbx-prev]')) prev();
      else if (e.target.matches('[data-lbx-next]')) next();
      else if (e.target.matches('[data-lbx-download]')) download();
      else if (opts.closeOnBackdrop && (e.target === overlay || e.target.classList.contains('lbx-stage'))) close();
      var th = e.target.closest('.lbx-thumb');
      if (th) { current = parseInt(th.dataset.i, 10); render(); }
    });

    document.addEventListener('keydown', onKey);
  }

  function render() {
    var a = items[current];
    if (!a) return;
    var src = a.getAttribute('href') || a.getAttribute('data-lbx-src');
    overlay.querySelector('.lbx-image').src = src;
    overlay.querySelector('.lbx-counter').textContent = (current + 1) + ' / ' + items.length;
    if (opts.caption) {
      var cap = a.getAttribute('data-lbx-cap') || (a.querySelector('img') ? a.querySelector('img').alt : '');
      overlay.querySelector('.lbx-caption').textContent = cap || '';
    }
    if (opts.thumbs) {
      var thumbsEl = overlay.querySelector('.lbx-thumbs');
      thumbsEl.innerHTML = items.map(function (it, i) {
        var thumbSrc = it.getAttribute('data-lbx-thumb') || (it.querySelector('img') ? it.querySelector('img').src : it.getAttribute('href'));
        return '<button class="lbx-thumb' + (i === current ? ' is-active' : '') + '" data-i="' + i + '"><img src="' + thumbSrc + '" alt=""></button>';
      }).join('');
    }
    if (typeof opts.onChange === 'function') opts.onChange(current, a);
  }

  function open() {
    if (!overlay) buildOverlay();
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    render();
  }
  function close() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  function prev() { current = (current - 1 + items.length) % items.length; render(); }
  function next() { current = (current + 1) % items.length; render(); }
  function download() {
    var a = items[current];
    if (!a) return;
    var src = a.getAttribute('href') || a.getAttribute('data-lbx-src');
    var link = document.createElement('a');
    link.href = src; link.download = '';
    link.click();
  }

  function onKey(e) {
    if (!overlay || !overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') prev();
    else if (e.key === 'ArrowRight') next();
  }

  var Lightbox = { init: init, open: open, close: close, destroy: destroy };

  if (typeof module !== 'undefined' && module.exports) module.exports = Lightbox;
  else root.Lightbox = Lightbox;
})(typeof window !== 'undefined' ? window : this);
