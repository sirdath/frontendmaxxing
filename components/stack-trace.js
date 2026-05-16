/* ============================================
   STACK TRACE — Renderer + toggle (in-app vs vendor) + frame expansion
   Inspired by Sentry stack-trace UI
   ============================================
   Usage:
     StackTrace.render(targetEl, {
       error: { type: 'TypeError', message: "Cannot read 'foo' of undefined" },
       frames: [
         { fn: 'handleRequest', path: 'app/handlers/user.js', line: 42, col: 18,
           inApp: true, isError: true,
           source: ['function handleRequest(req) {', '  const user = req.user;', '  return user.profile.foo;', '}'],
           sourceStart: 40, errorLine: 42,
           locals: { user: undefined, 'req.user': null } },
         { fn: 'router.dispatch', path: 'node_modules/router/index.js', line: 312, inApp: false },
         ...
       ],
       defaultShow: 'app'   // 'app' | 'vendor' | 'all'
     });

     // Init existing markup:
     StackTrace.init('.stk');

   Frame expand/collapse, vendor fold-up, app/vendor tabs all wired automatically.
   ============================================ */
(function (root) {
  'use strict';

  function render(target, data) {
    var host = typeof target === 'string' ? document.querySelector(target) : target;
    if (!host) return null;
    host.classList.add('stk');
    host.dataset.stkShow = data.defaultShow || 'app';

    var error = data.error || {};
    var frames = data.frames || [];
    var errorFrame = frames.find(function (f) { return f.isError; }) || frames[0] || {};

    host.innerHTML =
      '<header class="stk-head">' +
        '<div class="stk-title">' + escape((error.type ? error.type + ': ' : '') + (error.message || '')) + '</div>' +
        '<div class="stk-meta">' +
          '<span class="stk-file">' + escape(errorFrame.path || '') + '</span>' +
          (errorFrame.line ? '<span class="stk-loc">line ' + errorFrame.line + (errorFrame.col ? ', col ' + errorFrame.col : '') + '</span>' : '') +
        '</div>' +
        '<div class="stk-toggle">' +
          '<button data-stk-toggle="app" class="' + (data.defaultShow !== 'vendor' && data.defaultShow !== 'all' ? 'is-on' : '') + '">App frames</button>' +
          '<button data-stk-toggle="all" class="' + (data.defaultShow === 'all' ? 'is-on' : '') + '">All</button>' +
          '<button data-stk-toggle="vendor" class="' + (data.defaultShow === 'vendor' ? 'is-on' : '') + '">Vendor</button>' +
        '</div>' +
      '</header>' +
      '<ol class="stk-frames"></ol>';

    var list = host.querySelector('.stk-frames');
    frames.forEach(function (frame, i) {
      var li = document.createElement('li');
      li.className = 'stk-frame ' + (frame.inApp ? 'in-app' : 'vendor') + (frame.isError ? ' is-error' : '') + (frame.isError ? ' is-expanded' : '');
      li.innerHTML =
        '<div class="stk-frame-head">' +
          '<span class="stk-fn">' + escape(frame.fn || '<anonymous>') + '</span>' +
          '<span class="stk-at">at</span>' +
          '<span class="stk-path">' + escape(frame.path || '') + '</span>' +
          (frame.line ? '<span class="stk-line">' + frame.line + '</span>' : '') +
          '<span class="stk-chevron">▾</span>' +
        '</div>' +
        '<div class="stk-frame-body">' +
          renderSource(frame) +
          renderLocals(frame.locals) +
        '</div>';
      list.appendChild(li);
    });

    // Bind toggles
    host.querySelectorAll('[data-stk-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        host.dataset.stkShow = btn.dataset.stkToggle;
        host.querySelectorAll('[data-stk-toggle]').forEach(function (b) { b.classList.remove('is-on'); });
        btn.classList.add('is-on');
      });
    });

    // Bind frame heads
    bindFrameHeads(host);

    return host;
  }

  function renderSource(frame) {
    if (!frame.source) return '';
    var start = frame.sourceStart || frame.line || 1;
    var errorLine = frame.errorLine || frame.line;
    var html = '<ol class="stk-source" start="' + start + '">';
    frame.source.forEach(function (line, i) {
      var num = start + i;
      var cls = num === errorLine ? 'is-error-line' : '';
      html += '<li class="' + cls + '">' + escape(line || ' ') + '</li>';
    });
    html += '</ol>';
    return html;
  }

  function renderLocals(locals) {
    if (!locals) return '';
    var keys = Object.keys(locals);
    if (!keys.length) return '';
    var html = '<div class="stk-locals"><div class="stk-locals-title">Locals</div>';
    keys.forEach(function (k) {
      var v = locals[k];
      var t = typeof v;
      var cls = 'is-' + t;
      var display;
      if (v === undefined) { display = 'undefined'; cls = 'is-undefined'; }
      else if (v === null) { display = 'null'; cls = 'is-null'; }
      else if (t === 'string') display = '"' + v + '"';
      else if (t === 'object') {
        try { display = JSON.stringify(v); } catch (e) { display = String(v); }
        cls = 'is-object';
      } else display = String(v);
      html += '<div class="stk-local">' +
        '<span class="stk-key">' + escape(k) + '</span>' +
        '<span class="stk-val ' + cls + '">' + escape(display) + '</span>' +
      '</div>';
    });
    html += '</div>';
    return html;
  }

  function bindFrameHeads(host) {
    host.querySelectorAll('.stk-frame-head').forEach(function (h) {
      h.addEventListener('click', function () {
        h.parentNode.classList.toggle('is-expanded');
      });
    });
  }

  function init(target) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target || '.stk')
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, function (el) {
      if (el.dataset.stkBound) return;
      el.dataset.stkBound = '1';
      bindFrameHeads(el);
      el.querySelectorAll('[data-stk-toggle]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          el.dataset.stkShow = btn.dataset.stkToggle;
          el.querySelectorAll('[data-stk-toggle]').forEach(function (b) { b.classList.remove('is-on'); });
          btn.classList.add('is-on');
        });
      });
    });
  }

  function escape(s) {
    return String(s == null ? '' : s).replace(/[<>&]/g, function (c) {
      return ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]);
    });
  }

  var StackTrace = { render: render, init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = StackTrace;
  else root.StackTrace = StackTrace;
})(typeof window !== 'undefined' ? window : this);
