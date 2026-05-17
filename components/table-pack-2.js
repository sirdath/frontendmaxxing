/* ============================================
   TABLE PACK 2 — Sort + filter + pagination + selection + expand
   ============================================
   Usage:
     TablePack2.init('[data-tbp2]', {
       data: [{id, name, status, ...}],
       columns: [{key, label, sortable, render, accessor}],
       pageSize: 20,
       onSelect: function (selected) {},
       onRow: function (row, e) {}
     });
   ============================================ */
(function (root) {
  'use strict';

  function each(target, fn) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, fn);
  }

  function init(target, opts) {
    opts = opts || {};
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var insts = [];
    Array.prototype.forEach.call(els, function (el) { insts.push(create(el, opts)); });
    return insts.length === 1 ? insts[0] : insts;
  }

  function create(host, opts) {
    var data = opts.data || [];
    var cols = opts.columns || [];
    var pageSize = opts.pageSize || 20;
    var page = 0, sortKey = null, sortDir = 'asc', filter = '', selected = new Set();

    var search = host.querySelector('.tbp2-toolbar-search');
    var tbody = host.querySelector('tbody') || (function () {
      var t = host.querySelector('table');
      if (!t) {
        t = document.createElement('table');
        host.appendChild(t);
      }
      var b = document.createElement('tbody');
      t.appendChild(b);
      return b;
    })();
    var theadRow = host.querySelector('thead tr');
    var foot = host.querySelector('.tbp2-foot');

    // Build thead if not present
    if (theadRow && theadRow.children.length === 0) {
      cols.forEach(function (c) {
        var th = document.createElement('th');
        th.textContent = c.label || c.key;
        if (c.sortable !== false) th.classList.add('sortable');
        th.dataset.key = c.key;
        theadRow.appendChild(th);
      });
    }

    // Sort handlers
    host.querySelectorAll('thead th.sortable').forEach(function (th) {
      th.addEventListener('click', function () {
        var k = th.dataset.key || th.textContent.trim();
        if (sortKey === k) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        else { sortKey = k; sortDir = 'asc'; }
        host.querySelectorAll('thead th.sortable').forEach(function (x) {
          x.classList.remove('is-sorted', 'asc', 'desc');
        });
        th.classList.add('is-sorted', sortDir);
        page = 0; render();
      });
    });

    // Search
    if (search) {
      search.addEventListener('input', function () {
        filter = search.value.toLowerCase().trim();
        page = 0; render();
      });
    }

    function getSorted() {
      var rows = data.slice();
      if (filter) {
        rows = rows.filter(function (r) {
          return cols.some(function (c) {
            var v = c.accessor ? c.accessor(r) : r[c.key];
            return String(v).toLowerCase().indexOf(filter) !== -1;
          });
        });
      }
      if (sortKey) {
        var col = cols.find(function (c) { return c.key === sortKey; });
        rows.sort(function (a, b) {
          var av = col && col.accessor ? col.accessor(a) : a[sortKey];
          var bv = col && col.accessor ? col.accessor(b) : b[sortKey];
          if (av < bv) return sortDir === 'asc' ? -1 : 1;
          if (av > bv) return sortDir === 'asc' ? 1 : -1;
          return 0;
        });
      }
      return rows;
    }

    function render() {
      var rows = getSorted();
      var total = rows.length;
      var pages = Math.max(1, Math.ceil(total / pageSize));
      page = Math.max(0, Math.min(page, pages - 1));
      var slice = rows.slice(page * pageSize, page * pageSize + pageSize);
      tbody.innerHTML = '';
      slice.forEach(function (r) {
        var tr = document.createElement('tr');
        if (selected.has(r.id)) tr.classList.add('is-picked');
        cols.forEach(function (c) {
          var td = document.createElement('td');
          var v = c.accessor ? c.accessor(r) : r[c.key];
          if (typeof c.render === 'function') td.innerHTML = c.render(v, r);
          else td.textContent = v == null ? '' : v;
          tr.appendChild(td);
        });
        if (typeof opts.onRow === 'function') {
          tr.addEventListener('click', function (e) { opts.onRow(r, e, tr); });
        }
        tbody.appendChild(tr);
      });
      if (!slice.length) {
        var empty = document.createElement('tr');
        var td = document.createElement('td');
        td.colSpan = cols.length;
        td.className = 'tbp2-empty';
        td.textContent = 'No results';
        empty.appendChild(td);
        tbody.appendChild(empty);
      }
      // Foot
      if (foot) {
        foot.innerHTML = '';
        var info = document.createElement('div');
        info.textContent = total === 0 ? '0 rows' :
          ((page * pageSize + 1) + '–' + Math.min((page + 1) * pageSize, total) + ' of ' + total);
        var pager = document.createElement('div');
        pager.className = 'tbp2-pager';
        pager.innerHTML =
          '<button data-act="first" ' + (page === 0 ? 'disabled' : '') + '>«</button>' +
          '<button data-act="prev"  ' + (page === 0 ? 'disabled' : '') + '>‹</button>' +
          '<button class="is-active">' + (page + 1) + ' / ' + pages + '</button>' +
          '<button data-act="next"  ' + (page >= pages - 1 ? 'disabled' : '') + '>›</button>' +
          '<button data-act="last"  ' + (page >= pages - 1 ? 'disabled' : '') + '>»</button>';
        pager.addEventListener('click', function (e) {
          var b = e.target.closest('button[data-act]');
          if (!b) return;
          var a = b.dataset.act;
          if (a === 'first') page = 0;
          if (a === 'prev')  page = Math.max(0, page - 1);
          if (a === 'next')  page = Math.min(pages - 1, page + 1);
          if (a === 'last')  page = pages - 1;
          render();
        });
        foot.appendChild(info);
        foot.appendChild(pager);
      }
    }

    render();

    return {
      el: host,
      refresh: render,
      setData: function (d) { data = d; render(); },
      getSelected: function () { return Array.from(selected); }
    };
  }

  var TablePack2 = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = TablePack2;
  else root.TablePack2 = TablePack2;
})(typeof window !== 'undefined' ? window : this);
