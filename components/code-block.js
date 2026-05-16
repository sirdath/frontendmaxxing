/* ============================================
   CODE BLOCK — Copy, line numbers, diff prefixes, tiny tokenizer
   Inspired by GitHub / Shiki / Prism (but much smaller)
   ============================================
   Usage:
     CodeBlock.init('[data-code-block]', { highlight: true });

   The included tokenizer is intentionally tiny (~7 rules per supported
   language). For deeper accuracy, swap in Prism/Shiki later.

   Languages: js, ts, css, html, json, md (basic)
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    highlight: true,
    onCopy: null
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
    return s.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var TOKENS = {
    js: [
      { re: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g,   cls: 'cbk-cm' },
      { re: /('[^'\\]*(?:\\.[^'\\]*)*'|"[^"\\]*(?:\\.[^"\\]*)*"|`[^`]*`)/g, cls: 'cbk-str' },
      { re: /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|this|class|extends|export|import|from|as|default|async|await|try|catch|throw|typeof|instanceof|in|of|null|undefined|true|false)\b/g, cls: 'cbk-kw' },
      { re: /\b(\d+\.?\d*|\.\d+)\b/g,           cls: 'cbk-num' },
      { re: /\b([a-zA-Z_$][\w$]*)(?=\s*\()/g,   cls: 'cbk-fn' }
    ],
    ts: null,    // assigned below = same as js for now
    css: [
      { re: /(\/\*[\s\S]*?\*\/)/g,              cls: 'cbk-cm' },
      { re: /([.#][a-zA-Z_-][\w-]*|::?[a-zA-Z-]+)/g, cls: 'cbk-kw' },
      { re: /([a-zA-Z-]+)(?=\s*:)/g,            cls: 'cbk-fn' },
      { re: /('[^']*'|"[^"]*")/g,               cls: 'cbk-str' },
      { re: /(-?\d+(\.\d+)?(px|em|rem|%|vw|vh|s|ms|deg|fr)?)\b/g, cls: 'cbk-num' }
    ],
    html: [
      { re: /(&lt;!--[\s\S]*?--&gt;)/g,         cls: 'cbk-cm' },
      { re: /(&lt;\/?[a-zA-Z][\w-]*)/g,         cls: 'cbk-kw' },
      { re: /([a-zA-Z-]+)(?==)/g,               cls: 'cbk-fn' },
      { re: /(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;)/g, cls: 'cbk-str' }
    ],
    json: [
      { re: /(&quot;[^&]*?&quot;)(?=\s*:)/g,    cls: 'cbk-fn' },
      { re: /(&quot;[^&]*?&quot;)/g,            cls: 'cbk-str' },
      { re: /\b(true|false|null)\b/g,            cls: 'cbk-kw' },
      { re: /\b(\d+\.?\d*)\b/g,                  cls: 'cbk-num' }
    ],
    md: [
      { re: /(^|\n)(#{1,6}\s.+)/g,              cls: 'cbk-kw' },
      { re: /(\*\*[^*]+\*\*|__[^_]+__)/g,        cls: 'cbk-kw' },
      { re: /(\*[^*\n]+\*|_[^_\n]+_)/g,          cls: 'cbk-str' },
      { re: /(`[^`]+`)/g,                         cls: 'cbk-fn' }
    ]
  };
  TOKENS.ts = TOKENS.js;
  TOKENS.jsx = TOKENS.js;
  TOKENS.tsx = TOKENS.js;

  function highlight(code, lang) {
    var rules = TOKENS[lang];
    if (!rules) return escapeHTML(code);
    var esc = escapeHTML(code);
    rules.forEach(function (r) {
      esc = esc.replace(r.re, function (m, g1) {
        return '<span class="' + r.cls + '">' + (g1 || m) + '</span>';
      });
    });
    return esc;
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var lang = el.getAttribute('data-lang') || 'js';
    var pre  = el.querySelector('pre');
    var code = pre && pre.querySelector('code');
    if (!code) return { el: el, destroy: function () {} };

    var raw = code.textContent.replace(/^\n/, '').replace(/\n+$/, '');
    var lines = raw.split('\n');

    // Build line markup
    code.innerHTML = lines.map(function (line, i) {
      var stripped = line;
      var lineClass = 'cbk-line';
      if (el.classList.contains('cbk-diff')) {
        if (line.indexOf('+ ') === 0) { lineClass += ' is-added';   stripped = line.slice(2); }
        else if (line.indexOf('- ') === 0) { lineClass += ' is-removed'; stripped = line.slice(2); }
      }
      var content = o.highlight ? highlight(stripped, lang) : escapeHTML(stripped);
      return '<span class="' + lineClass + '">' +
        '<span class="cbk-line-num">' + (i + 1) + '</span>' +
        '<span class="cbk-line-content">' + content + '</span>' +
        '</span>';
    }).join('\n');

    var copyBtn = el.querySelector('.cbk-copy');
    function onCopy() {
      navigator.clipboard.writeText(raw).then(function () {
        copyBtn.classList.add('is-copied');
        var prev = copyBtn.textContent;
        copyBtn.textContent = 'Copied ✓';
        setTimeout(function () { copyBtn.classList.remove('is-copied'); copyBtn.textContent = prev || 'Copy'; }, 1500);
        if (typeof o.onCopy === 'function') o.onCopy(raw);
      });
    }
    if (copyBtn) copyBtn.addEventListener('click', onCopy);

    function destroy() {
      if (copyBtn) copyBtn.removeEventListener('click', onCopy);
    }

    return { el: el, destroy: destroy };
  }

  var CodeBlock = { init: init, highlight: highlight };

  if (typeof module !== 'undefined' && module.exports) module.exports = CodeBlock;
  else root.CodeBlock = CodeBlock;
})(typeof window !== 'undefined' ? window : this);
