/* ============================================
   MARKDOWN EDITOR — Tiny built-in markdown renderer + split-pane sync
   Inspired by Linear / Bear / GitHub editor (no external markdown lib)
   ============================================
   Usage:
     MarkdownEditor.init('[data-markdown-editor]', {
       value: '',
       mode: 'split',                   // 'edit' | 'split' | 'preview'
       onChange: function (md, html) { … }
     });

   Supports: headings, bold, italic, code (inline/fenced), lists, ordered lists,
   blockquotes, links, images, hr, tables, task lists, hard breaks.
   For richer output swap render() with marked.js / markdown-it.
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    value: '',
    mode: 'split',
    onChange: null
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function escapeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function render(md) {
    var src = md || '';
    var out = '';
    var lines = src.split('\n');
    var i = 0;

    function isBlankIdx(j) { return j >= lines.length || !lines[j].trim(); }

    while (i < lines.length) {
      var line = lines[i];

      // Fenced code
      if (/^```/.test(line)) {
        var lang = line.replace(/^```/, '').trim();
        var buf = [];
        i++;
        while (i < lines.length && !/^```/.test(lines[i])) { buf.push(lines[i]); i++; }
        i++;
        out += '<pre><code class="lang-' + escapeHTML(lang) + '">' + escapeHTML(buf.join('\n')) + '</code></pre>';
        continue;
      }
      // HR
      if (/^[-*_]{3,}\s*$/.test(line)) { out += '<hr>'; i++; continue; }
      // Heading
      var hm = /^(#{1,6})\s+(.*)$/.exec(line);
      if (hm) { out += '<h' + hm[1].length + '>' + inline(hm[2]) + '</h' + hm[1].length + '>'; i++; continue; }
      // Blockquote (collect run)
      if (/^>\s?/.test(line)) {
        var bq = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) {
          bq.push(lines[i].replace(/^>\s?/, ''));
          i++;
        }
        out += '<blockquote>' + render(bq.join('\n')) + '</blockquote>';
        continue;
      }
      // Unordered list
      if (/^[-*+]\s+/.test(line)) {
        var items = [];
        while (i < lines.length && /^[-*+]\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^[-*+]\s+/, ''));
          i++;
        }
        out += '<ul>' + items.map(function (t) {
          var task = /^\[( |x|X)\]\s+/.exec(t);
          if (task) {
            var checked = task[1].toLowerCase() === 'x';
            return '<li><input type="checkbox" disabled' + (checked ? ' checked' : '') + '> ' + inline(t.replace(task[0], '')) + '</li>';
          }
          return '<li>' + inline(t) + '</li>';
        }).join('') + '</ul>';
        continue;
      }
      // Ordered list
      if (/^\d+\.\s+/.test(line)) {
        var items2 = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
          items2.push(lines[i].replace(/^\d+\.\s+/, ''));
          i++;
        }
        out += '<ol>' + items2.map(function (t) { return '<li>' + inline(t) + '</li>'; }).join('') + '</ol>';
        continue;
      }
      // Table (very loose)
      if (/^\|.*\|$/.test(line) && i + 1 < lines.length && /^\|[\s|:-]+\|$/.test(lines[i + 1])) {
        var headers = line.split('|').slice(1, -1).map(function (c) { return c.trim(); });
        i += 2;
        var rows = [];
        while (i < lines.length && /^\|.*\|$/.test(lines[i])) {
          rows.push(lines[i].split('|').slice(1, -1).map(function (c) { return c.trim(); }));
          i++;
        }
        out += '<table><thead><tr>' + headers.map(function (h) { return '<th>' + inline(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
          rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + inline(c) + '</td>'; }).join('') + '</tr>'; }).join('') +
          '</tbody></table>';
        continue;
      }
      // Blank line
      if (!line.trim()) { i++; continue; }

      // Paragraph (collect run of non-blank)
      var para = [line];
      i++;
      while (i < lines.length && lines[i].trim() && !/^#|^>|^[-*+]\s+|^\d+\.\s+|^```|^\|/.test(lines[i])) {
        para.push(lines[i]); i++;
      }
      out += '<p>' + inline(para.join(' ')) + '</p>';
    }
    return out;
  }

  function inline(text) {
    var s = escapeHTML(text);
    // Images
    s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2">');
    // Links
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    // Inline code
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Bold + italic
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    s = s.replace(/_([^_]+)_/g, '<em>$1</em>');
    return s;
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var source = el.querySelector('.md-source');
    var preview = el.querySelector('.md-preview');
    var toolbar = el.querySelector('.md-toolbar');
    if (!source || !preview) return { el: el, destroy: function () {} };

    source.value = o.value;
    setMode(o.mode);
    update();

    function setMode(m) {
      el.setAttribute('data-mode', m);
      Array.prototype.forEach.call(el.querySelectorAll('[data-md-mode]'), function (b) {
        b.classList.toggle('is-active', b.getAttribute('data-md-mode') === m);
      });
    }
    function update() {
      var md = source.value;
      preview.innerHTML = render(md);
      if (typeof o.onChange === 'function') o.onChange(md, preview.innerHTML);
    }
    function wrap(before, after) {
      var s = source.selectionStart, e = source.selectionEnd;
      var v = source.value;
      var inner = v.slice(s, e);
      source.value = v.slice(0, s) + before + inner + (after || '') + v.slice(e);
      source.focus();
      source.selectionStart = s + before.length;
      source.selectionEnd   = s + before.length + inner.length;
      update();
    }
    function onToolbar(e) {
      var b = e.target.closest('button');
      if (!b) return;
      var mode = b.getAttribute('data-md-mode');
      if (mode) { setMode(mode); return; }
      var ins  = b.getAttribute('data-md-insert');
      var end  = b.getAttribute('data-md-end') || '';
      if (ins != null) wrap(ins, end);
    }
    function onKey(e) {
      var mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === 'b') { e.preventDefault(); wrap('**', '**'); }
      else if (e.key === 'i') { e.preventDefault(); wrap('*', '*'); }
      else if (e.key === 'k') { e.preventDefault(); wrap('[', '](url)'); }
    }
    source.addEventListener('input', update);
    if (toolbar) toolbar.addEventListener('click', onToolbar);
    source.addEventListener('keydown', onKey);

    function destroy() {
      source.removeEventListener('input', update);
      if (toolbar) toolbar.removeEventListener('click', onToolbar);
      source.removeEventListener('keydown', onKey);
    }

    return {
      el: el,
      getValue: function () { return source.value; },
      setValue: function (v) { source.value = v; update(); },
      setMode: setMode,
      destroy: destroy
    };
  }

  var MarkdownEditor = { init: init, render: render };

  if (typeof module !== 'undefined' && module.exports) module.exports = MarkdownEditor;
  else root.MarkdownEditor = MarkdownEditor;
})(typeof window !== 'undefined' ? window : this);
