/* ============================================
   JSON EDITOR — Collapsible tree viewer for JSON data
   Inspired by devtools JSON viewer
   ============================================
   Usage:
     JsonEditor.create('[data-json-editor]', { data: { … }, expandLevel: 2 });
   ============================================ */
(function (root) {
  'use strict';

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function render(value, key, depth, expandLevel) {
    var collapsed = depth >= expandLevel;
    if (value === null) {
      return renderLeaf(key, '<span class="jse-null">null</span>');
    }
    var t = typeof value;
    if (t === 'string')  return renderLeaf(key, '<span class="jse-string">"' + escapeHTML(value) + '"</span>');
    if (t === 'number')  return renderLeaf(key, '<span class="jse-number">' + value + '</span>');
    if (t === 'boolean') return renderLeaf(key, '<span class="jse-bool">' + value + '</span>');
    if (Array.isArray(value)) return renderObj(key, value, '[', ']', value.length, depth, expandLevel, collapsed);
    if (t === 'object') return renderObj(key, value, '{', '}', Object.keys(value).length, depth, expandLevel, collapsed);
    return renderLeaf(key, escapeHTML(String(value)));
  }

  function renderLeaf(key, valHTML) {
    return '<div class="jse-leaf">' +
      (key != null ? '<span class="jse-key">' + escapeHTML(key) + '</span><span class="jse-brace">: </span>' : '') +
      valHTML +
      '<span class="jse-comma">,</span>' +
      '</div>';
  }

  function renderObj(key, obj, open, close, count, depth, expandLevel, collapsed) {
    var entries = Array.isArray(obj) ? obj : Object.keys(obj);
    var inner = '';
    if (Array.isArray(obj)) {
      for (var i = 0; i < obj.length; i++) inner += render(obj[i], null, depth + 1, expandLevel);
    } else {
      Object.keys(obj).forEach(function (k) {
        inner += render(obj[k], k, depth + 1, expandLevel);
      });
    }
    return '<div class="jse-node' + (collapsed ? ' jse-collapsed' : '') + '">' +
      '<span class="jse-summary">' +
        '<button class="jse-toggle" data-jse-toggle></button>' +
        (key != null ? '<span class="jse-key">' + escapeHTML(key) + '</span><span class="jse-brace">: </span>' : '') +
        '<span class="jse-brace">' + open + '</span>' +
        '<span class="jse-count">' + count + ' item' + (count === 1 ? '' : 's') + '</span>' +
      '</span>' +
      '<div class="jse-node-content">' + inner + '</div>' +
      '<span class="jse-brace">' + close + '</span>' +
      '<span class="jse-comma">,</span>' +
    '</div>';
  }

  function create(target, opts) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return null;
    opts = opts || {};
    el.classList.add('jse');
    el.innerHTML = render(opts.data, null, 0, opts.expandLevel != null ? opts.expandLevel : 2);

    el.addEventListener('click', function (e) {
      var t = e.target.closest('[data-jse-toggle]');
      if (!t) return;
      var node = t.closest('.jse-node');
      if (node) node.classList.toggle('jse-collapsed');
    });

    return { el: el };
  }

  var JsonEditor = { create: create };

  if (typeof module !== 'undefined' && module.exports) module.exports = JsonEditor;
  else root.JsonEditor = JsonEditor;
})(typeof window !== 'undefined' ? window : this);
