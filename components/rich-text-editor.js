/* ============================================
   RICH TEXT EDITOR — execCommand-based contenteditable editor
   Inspired by Notion / Medium / lightweight WYSIWYG patterns
   ============================================
   Usage:
     RichTextEditor.init('[data-rich-text-editor]', {
       onChange: function (html) { … },
       sanitize: true,    // strip script/style tags
       keyboard: true     // ⌘B / ⌘I / ⌘U / ⌘K
     });

   Toolbar buttons map to `data-cmd` (document.execCommand) and optionally
   `data-arg` or `data-prompt` (prompt user for value, e.g. URL).
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    onChange: null,
    sanitize: true,
    keyboard: true
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function sanitize(html) {
    return html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
               .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
               .replace(/\son\w+="[^"]*"/gi, '')
               .replace(/\son\w+='[^']*'/gi, '');
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var content = el.querySelector('.rte-content');
    var toolbar = el.querySelector('.rte-toolbar');
    if (!content) return { el: el, destroy: function () {} };

    function exec(cmd, arg) {
      content.focus();
      document.execCommand(cmd, false, arg);
      onInput();
      updateState();
    }

    function onClickToolbar(e) {
      var btn = e.target.closest('button[data-cmd]');
      if (!btn) return;
      var cmd = btn.getAttribute('data-cmd');
      var arg = btn.getAttribute('data-arg');
      var prompt = btn.getAttribute('data-prompt');
      if (prompt) {
        var v = window.prompt(prompt + ':');
        if (!v) return;
        arg = v;
      }
      exec(cmd, arg);
    }

    function onInput() {
      if (o.sanitize) {
        var clean = sanitize(content.innerHTML);
        if (clean !== content.innerHTML) content.innerHTML = clean;
      }
      if (typeof o.onChange === 'function') o.onChange(content.innerHTML);
    }

    function updateState() {
      if (!toolbar) return;
      Array.prototype.forEach.call(toolbar.querySelectorAll('button[data-cmd]'), function (btn) {
        var cmd = btn.getAttribute('data-cmd');
        try { btn.classList.toggle('is-active', document.queryCommandState(cmd)); }
        catch (e) {}
      });
    }

    function onKey(e) {
      if (!o.keyboard) return;
      var mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === 'b') { e.preventDefault(); exec('bold'); }
      else if (e.key === 'i') { e.preventDefault(); exec('italic'); }
      else if (e.key === 'u') { e.preventDefault(); exec('underline'); }
      else if (e.key === 'k') {
        e.preventDefault();
        var url = window.prompt('URL:');
        if (url) exec('createLink', url);
      }
    }

    if (toolbar) toolbar.addEventListener('click', onClickToolbar);
    content.addEventListener('input', onInput);
    content.addEventListener('keyup', updateState);
    content.addEventListener('mouseup', updateState);
    content.addEventListener('keydown', onKey);

    // Floating toolbar (bubble menu)
    if (el.classList.contains('rte-floating-tb')) {
      content.addEventListener('mouseup', positionFloat);
      content.addEventListener('keyup', positionFloat);
      function positionFloat() {
        var sel = window.getSelection();
        if (!sel || sel.isCollapsed) { el.classList.remove('has-selection'); return; }
        var r = sel.getRangeAt(0).getBoundingClientRect();
        el.classList.add('has-selection');
        if (toolbar) {
          toolbar.style.position = 'fixed';
          toolbar.style.left = (r.left + r.width / 2 - toolbar.offsetWidth / 2) + 'px';
          toolbar.style.top  = (r.top - toolbar.offsetHeight - 6) + 'px';
        }
      }
    }

    function destroy() {
      if (toolbar) toolbar.removeEventListener('click', onClickToolbar);
      content.removeEventListener('input', onInput);
      content.removeEventListener('keyup', updateState);
      content.removeEventListener('mouseup', updateState);
      content.removeEventListener('keydown', onKey);
    }

    return {
      el: el,
      getHTML: function () { return content.innerHTML; },
      setHTML: function (h) { content.innerHTML = (o.sanitize ? sanitize(h) : h); onInput(); },
      exec: exec,
      destroy: destroy
    };
  }

  var RichTextEditor = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = RichTextEditor;
  else root.RichTextEditor = RichTextEditor;
})(typeof window !== 'undefined' ? window : this);
