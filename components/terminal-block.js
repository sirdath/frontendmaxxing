/* ============================================
   TERMINAL BLOCK — Controller: create, append output, set state, copy, rerun
   Inspired by Warp terminal blocks
   ============================================
   Usage:
     var block = TerminalBlock.create(parentEl, {
       cmd: 'npm run build',
       cwd: '~/proj',
       onCopy: function (text) {},
       onLink: function (block) {},
       onRerun: function (cmd) {}
     });

     block.appendOutput('Building...\n');
     block.setState('running');
     block.setState('success', { exitCode: 0, duration: 1230 });   // ms
     block.collapse(); block.expand();
     block.destroy();

     // Init existing markup:
     TerminalBlock.init('.tblk');
   ============================================ */
(function (root) {
  'use strict';

  var idCounter = 0;
  var defaults = {
    cmd: '',
    cwd: '',
    state: 'running',
    onCopy: null,
    onLink: null,
    onRerun: null,
    collapsible: true
  };

  function create(parent, opts) {
    var p = typeof parent === 'string' ? document.querySelector(parent) : parent;
    if (!p) return null;
    var o = mergeOpts(opts);
    var id = 'tblk-' + (++idCounter);

    var el = document.createElement('div');
    el.className = 'tblk tblk-' + o.state;
    el.id = id;
    el.innerHTML =
      '<header class="tblk-head">' +
        '<span class="tblk-status"></span>' +
        '<code class="tblk-cmd"></code>' +
        '<span class="tblk-meta">' +
          '<span class="tblk-cwd"></span>' +
          '<span class="tblk-time"></span>' +
          '<span class="tblk-exit" hidden></span>' +
        '</span>' +
        '<div class="tblk-actions">' +
          '<button class="tblk-copy" aria-label="Copy">⧉</button>' +
          '<button class="tblk-link" aria-label="Permalink">🔗</button>' +
          '<button class="tblk-rerun" aria-label="Rerun">↻</button>' +
          (o.collapsible ? '<button class="tblk-collapse" aria-label="Collapse">▾</button>' : '') +
        '</div>' +
      '</header>' +
      '<pre class="tblk-output"></pre>';

    p.appendChild(el);

    var cmdEl = el.querySelector('.tblk-cmd');
    var cwdEl = el.querySelector('.tblk-cwd');
    var timeEl = el.querySelector('.tblk-time');
    var exitEl = el.querySelector('.tblk-exit');
    var statusEl = el.querySelector('.tblk-status');
    var outputEl = el.querySelector('.tblk-output');
    var copyBtn = el.querySelector('.tblk-copy');
    var linkBtn = el.querySelector('.tblk-link');
    var rerunBtn = el.querySelector('.tblk-rerun');
    var collapseBtn = el.querySelector('.tblk-collapse');

    cmdEl.textContent = o.cmd;
    cwdEl.textContent = o.cwd || '';
    statusEl.textContent = stateGlyph(o.state);

    var startTime = Date.now();
    var endTime = null;
    var timerId = null;
    function tick() {
      if (timeEl) timeEl.textContent = formatDuration((endTime || Date.now()) - startTime);
    }
    function startTimer() {
      stopTimer();
      tick();
      timerId = setInterval(tick, 200);
    }
    function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }
    if (o.state === 'running') startTimer();

    el.querySelector('.tblk-head').addEventListener('click', function (e) {
      if (e.target.closest('.tblk-actions')) return;
      if (!o.collapsible) return;
      el.classList.toggle('is-collapsed');
    });

    copyBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var text = (cmdEl.textContent.replace(/^\$ /, '') + '\n' + outputEl.textContent).trim();
      navigator.clipboard && navigator.clipboard.writeText(text);
      flashButton(copyBtn, '✓');
      if (typeof o.onCopy === 'function') o.onCopy(text);
    });
    linkBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var url = window.location.origin + window.location.pathname + '#' + id;
      navigator.clipboard && navigator.clipboard.writeText(url);
      flashButton(linkBtn, '✓');
      if (typeof o.onLink === 'function') o.onLink({ el: el, id: id, url: url });
    });
    rerunBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (typeof o.onRerun === 'function') o.onRerun(o.cmd);
    });

    function appendOutput(text) {
      outputEl.textContent += text;
      outputEl.scrollTop = outputEl.scrollHeight;
    }
    function setOutput(text) { outputEl.textContent = text; }
    function clear() { outputEl.textContent = ''; }

    function setState(state, info) {
      el.classList.remove('tblk-running', 'tblk-success', 'tblk-error', 'tblk-cancelled');
      el.classList.add('tblk-' + state);
      statusEl.textContent = stateGlyph(state);
      o.state = state;

      if (state !== 'running') {
        endTime = Date.now();
        stopTimer();
        tick();
        if (info && info.exitCode !== undefined) {
          exitEl.hidden = false;
          exitEl.textContent = String(info.exitCode);
        }
      } else {
        endTime = null;
        startTimer();
      }
    }

    function collapse() { el.classList.add('is-collapsed'); }
    function expand()   { el.classList.remove('is-collapsed'); }
    function destroy()  { stopTimer(); el.remove(); }

    function flashButton(btn, glyph) {
      var orig = btn.textContent;
      btn.textContent = glyph;
      setTimeout(function () { btn.textContent = orig; }, 800);
    }

    return {
      el: el,
      appendOutput: appendOutput,
      setOutput: setOutput,
      clear: clear,
      setState: setState,
      collapse: collapse,
      expand: expand,
      destroy: destroy
    };
  }

  function init(target) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target || '.tblk')
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, function (el) {
      if (el.dataset.tblkBound) return;
      el.dataset.tblkBound = '1';
      var head = el.querySelector('.tblk-head');
      if (head) {
        head.addEventListener('click', function (e) {
          if (e.target.closest('.tblk-actions')) return;
          el.classList.toggle('is-collapsed');
        });
      }
      var copy = el.querySelector('.tblk-copy');
      if (copy) copy.addEventListener('click', function (e) {
        e.stopPropagation();
        var cmd = (el.querySelector('.tblk-cmd') || {}).textContent || '';
        var out = (el.querySelector('.tblk-output') || {}).textContent || '';
        navigator.clipboard && navigator.clipboard.writeText((cmd.replace(/^\$ /, '') + '\n' + out).trim());
      });
    });
  }

  function stateGlyph(state) {
    return { success: '✓', error: '✕', cancelled: '⊘', running: '' }[state] || '';
  }
  function formatDuration(ms) {
    if (ms < 1000) return ms + 'ms';
    if (ms < 60000) return (ms / 1000).toFixed(1) + 's';
    var m = Math.floor(ms / 60000);
    var s = Math.floor((ms % 60000) / 1000);
    return m + 'm ' + s + 's';
  }
  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var TerminalBlock = { create: create, init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = TerminalBlock;
  else root.TerminalBlock = TerminalBlock;
})(typeof window !== 'undefined' ? window : this);
