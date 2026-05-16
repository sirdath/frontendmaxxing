/* ============================================
   PAGINATION — Render numeric pagination + bind onPage
   Inspired by GitHub / Linear / Stripe Dashboard
   ============================================
   Usage:
     Pagination.init('[data-pagination]', {
       total: 120,
       page: 1,
       pageSize: 10,
       maxButtons: 7,
       onPage: function (page) { … }
     });

   Also supports infinite-scroll triggers:
     Pagination.infinite('.pag-sentinel', { onLoad: function () { … } });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    total: 0,
    page: 1,
    pageSize: 10,
    maxButtons: 7,
    onPage: null
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

    o.total = parseInt(el.getAttribute('data-pag-total'), 10) || o.total;
    o.page  = parseInt(el.getAttribute('data-pag-page'),  10) || o.page;
    o.pageSize = parseInt(el.getAttribute('data-pag-size'), 10) || o.pageSize;
    var totalPages = Math.max(1, Math.ceil(o.total / o.pageSize));

    function render() {
      var p = o.page;
      var m = totalPages;
      var btns = [];
      btns.push('<button class="pag-prev" data-page="' + (p - 1) + '" ' + (p <= 1 ? 'disabled' : '') + '>‹</button>');

      // Determine page numbers to show
      function add(n) { btns.push('<button class="pag-page' + (n === p ? ' is-active' : '') + '" data-page="' + n + '">' + n + '</button>'); }
      function ell()  { btns.push('<span class="pag-ellipsis">…</span>'); }

      if (m <= o.maxButtons) {
        for (var i = 1; i <= m; i++) add(i);
      } else {
        add(1);
        var start = Math.max(2, p - 2);
        var end   = Math.min(m - 1, p + 2);
        if (start > 2) ell();
        for (var j = start; j <= end; j++) add(j);
        if (end < m - 1) ell();
        add(m);
      }
      btns.push('<button class="pag-next" data-page="' + (p + 1) + '" ' + (p >= m ? 'disabled' : '') + '>›</button>');
      el.innerHTML = btns.join('');
    }

    function onClick(e) {
      var b = e.target.closest('[data-page]');
      if (!b) return;
      var next = parseInt(b.getAttribute('data-page'), 10);
      if (isNaN(next) || next < 1 || next > totalPages || next === o.page) return;
      o.page = next;
      el.setAttribute('data-pag-page', next);
      render();
      if (typeof o.onPage === 'function') o.onPage(next);
    }

    el.addEventListener('click', onClick);
    render();

    function destroy() { el.removeEventListener('click', onClick); }

    return {
      el: el,
      go: function (p) { o.page = p; render(); if (typeof o.onPage === 'function') o.onPage(p); },
      destroy: destroy
    };
  }

  function infinite(target, opts) {
    opts = opts || {};
    var sentinel = typeof target === 'string' ? document.querySelector(target) : target;
    if (!sentinel) return null;
    var loading = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !loading) {
          loading = true;
          Promise.resolve(opts.onLoad && opts.onLoad()).then(function () { loading = false; });
        }
      });
    }, { rootMargin: opts.rootMargin || '200px' });
    io.observe(sentinel);
    return { stop: function () { io.disconnect(); } };
  }

  var Pagination = { init: init, infinite: infinite };

  if (typeof module !== 'undefined' && module.exports) module.exports = Pagination;
  else root.Pagination = Pagination;
})(typeof window !== 'undefined' ? window : this);
