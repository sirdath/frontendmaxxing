/* ============================================
   TREE MENU — Toggle nested nodes + keyboard nav (←/→/↑/↓/Enter)
   ============================================
   Usage:
     TreeMenu.init('[data-tmenu]', {
       expandAll: false,
       onSelect: function (node, label) {}
     });
   ============================================ */
(function (root) {
  'use strict';
  var defaults = { expandAll: false, onSelect: null };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var insts = [];
    Array.prototype.forEach.call(els, function (el) { insts.push(create(el, opts)); });
    return insts.length === 1 ? insts[0] : insts;
  }

  function create(host, opts) {
    var o = mergeOpts(opts);
    var nodes = host.querySelectorAll('.tmenu-node');
    nodes.forEach(function (n) {
      if (!n.querySelector(':scope > .tmenu-children')) n.classList.add('is-leaf');
      if (o.expandAll && !n.classList.contains('is-leaf')) n.classList.add('is-open');
    });

    host.addEventListener('click', function (e) {
      var row = e.target.closest('.tmenu-row');
      if (!row) return;
      var node = row.parentElement;
      if (!node.classList.contains('is-leaf')) {
        node.classList.toggle('is-open');
      }
      // Mark active
      host.querySelectorAll('.tmenu-node.is-active').forEach(function (n) { n.classList.remove('is-active'); });
      node.classList.add('is-active');
      if (typeof o.onSelect === 'function') {
        o.onSelect(node, row.textContent.trim());
      }
    });

    host.addEventListener('keydown', function (e) {
      var row = document.activeElement.closest('.tmenu-row');
      if (!row) return;
      var node = row.parentElement;
      if (e.key === 'ArrowRight') {
        if (!node.classList.contains('is-leaf')) {
          if (!node.classList.contains('is-open')) {
            node.classList.add('is-open');
          } else {
            var first = node.querySelector('.tmenu-children > .tmenu-node > .tmenu-row');
            if (first) first.focus();
          }
          e.preventDefault();
        }
      } else if (e.key === 'ArrowLeft') {
        if (node.classList.contains('is-open')) {
          node.classList.remove('is-open');
        } else {
          var parent = node.parentElement.closest('.tmenu-node');
          if (parent) parent.querySelector(':scope > .tmenu-row').focus();
        }
        e.preventDefault();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        var rows = Array.prototype.slice.call(host.querySelectorAll('.tmenu-row'));
        var visible = rows.filter(function (r) { return r.offsetParent !== null; });
        var i = visible.indexOf(row);
        var next = visible[i + (e.key === 'ArrowDown' ? 1 : -1)];
        if (next) next.focus();
        e.preventDefault();
      }
    });

    function expandAll() { host.querySelectorAll('.tmenu-node').forEach(function (n) { if (!n.classList.contains('is-leaf')) n.classList.add('is-open'); }); }
    function collapseAll() { host.querySelectorAll('.tmenu-node').forEach(function (n) { n.classList.remove('is-open'); }); }
    return { el: host, expandAll: expandAll, collapseAll: collapseAll };
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var TreeMenu = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = TreeMenu;
  else root.TreeMenu = TreeMenu;
})(typeof window !== 'undefined' ? window : this);
