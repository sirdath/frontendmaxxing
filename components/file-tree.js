/* ============================================
   FILE TREE — Collapsible tree behavior + JSON renderer
   Inspired by Magic UI / VSCode
   ============================================
   Usage:
     // Bind to existing markup:
     FileTree.init('.file-tree');

     // Render from a data tree:
     FileTree.init('.file-tree', {
       data: [
         { name: 'src', type: 'folder', open: true, children: [
             { name: 'index.js',  type: 'file', icon: 'js' },
             { name: 'styles.css', type: 'file', icon: 'css' }
         ]},
         { name: 'README.md', type: 'file', icon: 'md' }
       ],
       onSelect: function (path, node) { console.log(path); }
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    data: null,
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

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    if (o.data) {
      el.innerHTML = renderNodes(o.data, /*depth*/ 0);
    }

    function onClick(e) {
      var row = e.target.closest('.ft-row');
      if (!row) return;
      var li = row.parentElement;
      if (!li) return;
      if (li.classList.contains('ft-folder')) {
        li.classList.toggle('ft-open');
      } else if (li.classList.contains('ft-file')) {
        // Active state
        el.querySelectorAll('.ft-row.ft-active').forEach(function (r) { r.classList.remove('ft-active'); });
        row.classList.add('ft-active');
        if (typeof o.onSelect === 'function') {
          o.onSelect(pathOf(li), li);
        }
      }
    }

    function pathOf(li) {
      var parts = [];
      var cur = li;
      while (cur && cur !== el) {
        if (cur.tagName === 'LI') {
          var name = cur.querySelector(':scope > .ft-row > .ft-name');
          if (name) parts.unshift(name.textContent);
        }
        cur = cur.parentElement;
      }
      return parts.join('/');
    }

    el.addEventListener('click', onClick);

    function destroy() {
      el.removeEventListener('click', onClick);
    }

    return { el: el, destroy: destroy };
  }

  function renderNodes(nodes, depth) {
    if (!nodes || !nodes.length) return '';
    var html = '';
    nodes.forEach(function (n) {
      html += renderNode(n, depth);
    });
    return html;
  }

  function renderNode(n, depth) {
    var isFolder = n.type === 'folder' || !!n.children;
    var openClass = isFolder && n.open ? ' ft-open' : '';
    var iconClass = isFolder
      ? 'ft-icon-folder'
      : 'ft-icon-' + (n.icon || guessIcon(n.name));
    var arrow = isFolder
      ? '<span class="ft-arrow"></span>'
      : '<span class="ft-arrow ft-arrow-blank"></span>';
    var meta = n.meta ? '<span class="ft-meta">' + escape(n.meta) + '</span>' : '';
    var childrenHTML = isFolder
      ? '<ul>' + renderNodes(n.children || [], depth + 1) + '</ul>'
      : '';
    return (
      '<li class="' + (isFolder ? 'ft-folder' : 'ft-file') + openClass + '">' +
        '<span class="ft-row">' + arrow +
          '<span class="ft-icon ' + iconClass + '"></span>' +
          '<span class="ft-name">' + escape(n.name || '') + '</span>' +
          meta +
        '</span>' +
        childrenHTML +
      '</li>'
    );
  }

  function guessIcon(name) {
    var m = /\.([^.]+)$/.exec(name || '');
    if (!m) return 'folder';
    var ext = m[1].toLowerCase();
    if (ext === 'js' || ext === 'mjs' || ext === 'cjs') return 'js';
    if (ext === 'ts' || ext === 'tsx') return 'ts';
    if (ext === 'css' || ext === 'scss' || ext === 'sass') return 'css';
    if (ext === 'html' || ext === 'htm') return 'html';
    if (ext === 'json') return 'json';
    if (ext === 'md' || ext === 'mdx') return 'md';
    if (['png','jpg','jpeg','svg','gif','webp'].indexOf(ext) !== -1) return 'img';
    return 'md';
  }

  function escape(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var FileTree = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = FileTree;
  else root.FileTree = FileTree;
})(typeof window !== 'undefined' ? window : this);
