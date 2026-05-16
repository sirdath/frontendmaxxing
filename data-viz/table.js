/* ============================================
   TABLE — Sortable, selectable, paginated (client-side)
   Inspired by TanStack Table / Linear
   ============================================
   Usage:
     Table.init('[data-table]', {
       selectable: true,
       pageSize: 10,
       onSort: function (col, dir) {},
       onSelect: function (selectedRows) {}
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    selectable: false,
    pageSize: 0,         // 0 = no pagination
    onSort: null,
    onSelect: null
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function createInstance(table, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var tbody = table.tBodies[0];
    var thead = table.tHead;
    var allRows = Array.prototype.slice.call(tbody.rows);

    // ── Selection
    if (o.selectable) {
      // Inject select-all column
      var th = document.createElement('th');
      th.className = 'tbl-select-col';
      th.innerHTML = '<input type="checkbox" data-select-all>';
      thead.rows[0].insertBefore(th, thead.rows[0].firstChild);
      allRows.forEach(function (r) {
        var td = document.createElement('td');
        td.className = 'tbl-select-col';
        td.innerHTML = '<input type="checkbox" data-row-select>';
        r.insertBefore(td, r.firstChild);
      });
    }

    function selectedRows() {
      return allRows.filter(function (r) {
        var cb = r.querySelector('[data-row-select]');
        return cb && cb.checked;
      });
    }

    function emitSelect() {
      if (typeof o.onSelect === 'function') o.onSelect(selectedRows());
    }

    function onCheckChange(e) {
      var t = e.target;
      if (t.matches('[data-select-all]')) {
        allRows.forEach(function (r) {
          var cb = r.querySelector('[data-row-select]');
          if (cb) { cb.checked = t.checked; r.classList.toggle('is-selected', t.checked); }
        });
        emitSelect();
      } else if (t.matches('[data-row-select]')) {
        t.closest('tr').classList.toggle('is-selected', t.checked);
        emitSelect();
      }
    }

    // ── Sorting
    function sortBy(col, dir) {
      var headers = Array.prototype.slice.call(thead.querySelectorAll('th[data-sort]'));
      var idx = headers.findIndex(function (h) { return h.getAttribute('data-sort') === col; }) +
                (o.selectable ? 1 : 0);
      var rows = Array.prototype.slice.call(tbody.rows);
      var numeric = headers[idx - (o.selectable ? 1 : 0)] && headers[idx - (o.selectable ? 1 : 0)].hasAttribute('data-numeric');
      rows.sort(function (a, b) {
        var av = a.cells[idx] ? a.cells[idx].textContent.trim() : '';
        var bv = b.cells[idx] ? b.cells[idx].textContent.trim() : '';
        if (numeric) {
          var an = parseFloat(av.replace(/[^\d.\-]/g, '')) || 0;
          var bn = parseFloat(bv.replace(/[^\d.\-]/g, '')) || 0;
          return dir === 'asc' ? an - bn : bn - an;
        }
        return dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
      rows.forEach(function (r) { tbody.appendChild(r); });
      headers.forEach(function (h) { h.classList.remove('is-asc', 'is-desc'); });
      var active = thead.querySelector('th[data-sort="' + col + '"]');
      if (active) active.classList.add(dir === 'asc' ? 'is-asc' : 'is-desc');
      if (typeof o.onSort === 'function') o.onSort(col, dir);
      if (page) renderPage();
    }

    function onHeaderClick(e) {
      var th = e.target.closest('th[data-sort]');
      if (!th) return;
      var col = th.getAttribute('data-sort');
      var current = th.classList.contains('is-asc') ? 'asc' : th.classList.contains('is-desc') ? 'desc' : null;
      var next = current === 'asc' ? 'desc' : 'asc';
      sortBy(col, next);
    }

    // ── Pagination
    var page = null;
    if (o.pageSize > 0) {
      page = { idx: 0 };
      var pag = document.createElement('div');
      pag.className = 'tbl-pagination';
      pag.innerHTML = '<div><span class="tbl-page-info"></span></div><div><button data-prev disabled>Prev</button> <button data-next>Next</button></div>';
      table.parentElement.appendChild(pag);
      pag.addEventListener('click', function (e) {
        var total = Math.ceil(allRows.length / o.pageSize);
        if (e.target.matches('[data-prev]') && page.idx > 0) page.idx--;
        else if (e.target.matches('[data-next]') && page.idx < total - 1) page.idx++;
        else return;
        renderPage();
      });
    }
    function renderPage() {
      var rows = Array.prototype.slice.call(tbody.rows);
      var start = page.idx * o.pageSize;
      rows.forEach(function (r, i) {
        r.style.display = (i >= start && i < start + o.pageSize) ? '' : 'none';
      });
      var total = Math.ceil(rows.length / o.pageSize);
      var pag = table.parentElement.querySelector('.tbl-pagination');
      if (pag) {
        pag.querySelector('.tbl-page-info').textContent = 'Page ' + (page.idx + 1) + ' of ' + total + ' · ' + rows.length + ' rows';
        pag.querySelector('[data-prev]').disabled = page.idx === 0;
        pag.querySelector('[data-next]').disabled = page.idx >= total - 1;
      }
    }
    if (page) renderPage();

    thead.addEventListener('click', onHeaderClick);
    if (o.selectable) table.addEventListener('change', onCheckChange);

    function destroy() {
      thead.removeEventListener('click', onHeaderClick);
      if (o.selectable) table.removeEventListener('change', onCheckChange);
    }

    return { el: table, sortBy: sortBy, getSelected: selectedRows, destroy: destroy };
  }

  var Table = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = Table;
  else root.Table = Table;
})(typeof window !== 'undefined' ? window : this);
