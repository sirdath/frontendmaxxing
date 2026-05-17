/* ============================================
   EMAIL PACK — JS for thread collapse + compose + snooze
   ============================================
   Usage:
     EmailPack.thread('[data-eml-thread]');
     EmailPack.compose('[data-eml-comp]', { onSend: function (data) {} });
     EmailPack.list('[data-eml-list]', { onSelect, onStar });
     EmailPack.snooze('[data-eml-snooze]', { onPick: function (key, time) {} });
   ============================================ */
(function (root) {
  'use strict';

  function each(target, fn) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, fn);
  }

  function thread(target) {
    each(target, function (host) {
      host.querySelectorAll('.eml-thread-msg.is-collapsed').forEach(function (m) {
        m.addEventListener('click', function () { m.classList.remove('is-collapsed'); });
      });
    });
  }

  function compose(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var send = host.querySelector('.eml-comp-send');
      var headBtns = host.querySelectorAll('.eml-comp-head-actions button');
      if (send) send.addEventListener('click', function () {
        var data = {};
        host.querySelectorAll('.eml-comp-field input').forEach(function (i) {
          var lbl = i.previousElementSibling && i.previousElementSibling.textContent.trim().toLowerCase().replace(':', '');
          if (lbl) data[lbl] = i.value;
        });
        var body = host.querySelector('.eml-comp-body');
        if (body) data.body = body.value;
        if (typeof opts.onSend === 'function') opts.onSend(data);
      });
      if (headBtns[0]) headBtns[0].addEventListener('click', function () { host.classList.toggle('is-collapsed'); });
      if (headBtns[1]) headBtns[1].addEventListener('click', function () { host.classList.toggle('is-fullscreen'); });
      if (headBtns[headBtns.length - 1]) headBtns[headBtns.length - 1].addEventListener('click', function () { host.remove(); });
    });
  }

  function list(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      host.querySelectorAll('.eml-row').forEach(function (r) {
        r.addEventListener('click', function (e) {
          if (e.target.closest('.eml-row-pick, .eml-row-star')) return;
          r.classList.remove('is-unread');
          if (typeof opts.onSelect === 'function') opts.onSelect(r);
        });
        var star = r.querySelector('.eml-row-star');
        if (star) star.addEventListener('click', function (e) {
          e.stopPropagation();
          var on = star.classList.toggle('is-starred');
          if (typeof opts.onStar === 'function') opts.onStar(r, on);
        });
      });
    });
  }

  function snooze(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      host.querySelectorAll('.eml-snooze-row').forEach(function (r) {
        r.addEventListener('click', function () {
          if (typeof opts.onPick === 'function') opts.onPick(r.dataset.snooze || r.textContent.trim(), r.dataset.time);
        });
      });
    });
  }

  var EmailPack = { thread: thread, compose: compose, list: list, snooze: snooze };
  if (typeof module !== 'undefined' && module.exports) module.exports = EmailPack;
  else root.EmailPack = EmailPack;
})(typeof window !== 'undefined' ? window : this);
