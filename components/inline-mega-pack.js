/* ============================================
   INLINE MEGA PACK — JS glue
   ============================================
   Usage:
     InlineMega.threeDot('[data-imp-3dot]', { onAction: function (name) {} });
     InlineMega.itable('[data-imp-itable]', { onChange, onAdd });
     InlineMega.dtabs('[data-imp-dtabs]', { onChange: function (i) {} });
     InlineMega.journal('[data-imp-journal]', { onPick: function (date) {} });
     InlineMega.xtool('[data-imp-xtool]');
     InlineMega.pricing('[data-imp-pricing]', { onPeriod, onExpand });
   ============================================ */
(function (root) {
  'use strict';

  function each(target, fn) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, fn);
  }

  function threeDot(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var trig = host.querySelector('.imp-3dot-trig');
      var menu = host.querySelector('.imp-3dot-menu');
      if (trig) trig.addEventListener('click', function (e) {
        e.stopPropagation();
        host.classList.toggle('is-open');
      });
      document.addEventListener('click', function () {
        host.classList.remove('is-open');
        host.querySelectorAll('.imp-3dot-item.is-confirming').forEach(function (i) { i.classList.remove('is-confirming'); });
      });
      if (menu) menu.addEventListener('click', function (e) {
        var item = e.target.closest('.imp-3dot-item');
        if (!item) return;
        if (item.classList.contains('danger') && !item.classList.contains('is-confirming')) {
          // First click — show confirm state
          host.querySelectorAll('.imp-3dot-item.is-confirming').forEach(function (i) { i.classList.remove('is-confirming'); });
          item.classList.add('is-confirming');
          e.stopPropagation();
          return;
        }
        host.classList.remove('is-open');
        if (typeof opts.onAction === 'function') opts.onAction(item.dataset.action || item.textContent.trim().split('—')[0].trim(), item);
      });
    });
  }

  function itable(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      host.addEventListener('dblclick', function (e) {
        var td = e.target.closest('td');
        if (!td || td.hasAttribute('data-no-edit')) return;
        td.setAttribute('contenteditable', 'true');
        td.focus();
      });
      host.addEventListener('blur', function (e) {
        var td = e.target.closest('td[contenteditable="true"]');
        if (!td) return;
        td.removeAttribute('contenteditable');
        if (typeof opts.onChange === 'function') opts.onChange(td);
      }, true);
      var add = host.querySelector('.imp-itable-add');
      if (add) add.addEventListener('click', function () {
        if (typeof opts.onAdd === 'function') opts.onAdd(host);
      });
    });
  }

  function dtabs(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var tabs = host.querySelectorAll('.imp-dtabs-tab');
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () {
          tabs.forEach(function (x) { x.classList.remove('is-active'); });
          t.classList.add('is-active');
          if (typeof opts.onChange === 'function') opts.onChange(i, t);
        });
      });
    });
  }

  function journal(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      host.querySelectorAll('.imp-journal-day').forEach(function (d) {
        d.addEventListener('click', function () {
          host.querySelectorAll('.imp-journal-day.is-active').forEach(function (x) { x.classList.remove('is-active'); });
          d.classList.add('is-active');
          if (typeof opts.onPick === 'function') opts.onPick(d.dataset.date || d.textContent.trim());
        });
      });
    });
  }

  function xtool(target) {
    each(target, function (host) {
      var trig = host.querySelector('.imp-xtool-trig');
      if (trig) trig.addEventListener('click', function () { host.classList.toggle('is-open'); });
    });
  }

  function pricing(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      host.querySelectorAll('.imp-pricing-toggle button').forEach(function (b, i) {
        b.addEventListener('click', function () {
          host.querySelectorAll('.imp-pricing-toggle button').forEach(function (x) { x.classList.remove('is-active'); });
          b.classList.add('is-active');
          if (typeof opts.onPeriod === 'function') opts.onPeriod(b.textContent.trim());
        });
      });
      var exp = host.querySelector('.imp-pricing-expand');
      if (exp) exp.addEventListener('click', function () {
        var open = host.classList.toggle('is-open');
        exp.textContent = open ? 'Show less' : 'Show all features';
        if (typeof opts.onExpand === 'function') opts.onExpand(open);
      });
    });
  }

  var InlineMega = { threeDot: threeDot, itable: itable, dtabs: dtabs, journal: journal, xtool: xtool, pricing: pricing };
  if (typeof module !== 'undefined' && module.exports) module.exports = InlineMega;
  else root.InlineMega = InlineMega;
})(typeof window !== 'undefined' ? window : this);
