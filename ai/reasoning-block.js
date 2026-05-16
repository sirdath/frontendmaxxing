/* ============================================
   REASONING BLOCK — Live updating "Thinking…" disclosure controller
   Inspired by Claude extended thinking, o1, Vercel AI Reasoning
   ============================================
   Usage:
     var r = ReasoningBlock.create(targetEl, { autoCollapse: true });
     r.append('First, let me consider...');
     r.append(' Then I need to check...');
     r.done();                 // freezes timer, sets .rsn-done, optionally collapses

     r.start();                // restart timer + open
     r.setLabel('Reflecting');
     r.elapsed();              // returns ms
     r.destroy();

     // Init existing markup:
     ReasoningBlock.init('.rsn');
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    label: 'Thinking',
    icon: '💭',
    autoCollapse: true,
    autoCollapseDelay: 800,
    expandedWhileStreaming: true,
    showElapsed: true
  };

  function create(target, opts) {
    var parent = typeof target === 'string' ? document.querySelector(target) : target;
    if (!parent) return null;
    var o = mergeOpts(opts);

    var el = document.createElement('details');
    el.className = 'rsn rsn-streaming rsn-empty' + (o.autoCollapse ? ' rsn-auto-collapse' : '');
    if (o.expandedWhileStreaming) el.open = true;

    el.innerHTML =
      '<summary class="rsn-head">' +
        '<span class="rsn-icon">' + o.icon + '</span>' +
        '<span class="rsn-label">' + o.label + '</span>' +
        (o.showElapsed ? '<span class="rsn-elapsed">0.0s</span>' : '') +
        '<span class="rsn-chevron">▾</span>' +
      '</summary>' +
      '<div class="rsn-body"></div>';

    parent.appendChild(el);

    var body = el.querySelector('.rsn-body');
    var elapsedEl = el.querySelector('.rsn-elapsed');
    var labelEl = el.querySelector('.rsn-label');

    var startTime = Date.now();
    var endTime = null;
    var timerId = null;
    var hasContent = false;

    function tick() {
      if (!elapsedEl) return;
      var ms = (endTime || Date.now()) - startTime;
      elapsedEl.textContent = formatElapsed(ms);
    }

    function startTimer() {
      stopTimer();
      tick();
      timerId = setInterval(tick, 100);
    }
    function stopTimer() {
      if (timerId) { clearInterval(timerId); timerId = null; }
    }

    function append(chunk) {
      if (!hasContent) {
        hasContent = true;
        el.classList.remove('rsn-empty');
      }
      body.textContent += chunk;
      body.scrollTop = body.scrollHeight;
    }
    function setLabel(label) { labelEl.textContent = label; }
    function setIcon(icon)   { el.querySelector('.rsn-icon').textContent = icon; }
    function elapsed()       { return (endTime || Date.now()) - startTime; }

    function done() {
      endTime = Date.now();
      stopTimer();
      tick();
      el.classList.remove('rsn-streaming', 'rsn-empty');
      el.classList.add('rsn-done');
      if (o.autoCollapse && !el.classList.contains('is-pinned')) {
        setTimeout(function () {
          if (!el.classList.contains('is-pinned')) el.open = false;
        }, o.autoCollapseDelay);
      }
    }

    function pin()    { el.classList.add('is-pinned'); el.open = true; }
    function unpin()  { el.classList.remove('is-pinned'); }
    function expand() { el.open = true; }
    function collapse() { el.open = false; }
    function reset()  {
      body.textContent = '';
      hasContent = false;
      el.classList.add('rsn-empty');
      el.classList.remove('rsn-done');
      el.classList.add('rsn-streaming');
      startTime = Date.now();
      endTime = null;
      startTimer();
    }
    function destroy() {
      stopTimer();
      el.remove();
    }

    startTimer();
    return {
      el: el,
      append: append,
      setLabel: setLabel,
      setIcon: setIcon,
      elapsed: elapsed,
      done: done,
      pin: pin,
      unpin: unpin,
      expand: expand,
      collapse: collapse,
      reset: reset,
      destroy: destroy
    };
  }

  function init(target) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target || '.rsn')
      : (target.length ? target : [target]);
    // <details> handles its own toggle; this is for tracking timer on existing markup
    Array.prototype.forEach.call(els, function (el) {
      if (el.classList.contains('rsn-streaming')) {
        var elapsedEl = el.querySelector('.rsn-elapsed');
        if (!elapsedEl) return;
        var start = Date.now();
        var id = setInterval(function () {
          if (!el.classList.contains('rsn-streaming')) {
            clearInterval(id);
            return;
          }
          elapsedEl.textContent = formatElapsed(Date.now() - start);
        }, 100);
      }
    });
  }

  function formatElapsed(ms) {
    if (ms < 1000) return (ms / 1000).toFixed(1) + 's';
    if (ms < 60000) return (ms / 1000).toFixed(1) + 's';
    var mins = Math.floor(ms / 60000);
    var s = ((ms % 60000) / 1000).toFixed(0);
    return mins + 'm ' + s + 's';
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var ReasoningBlock = { create: create, init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = ReasoningBlock;
  else root.ReasoningBlock = ReasoningBlock;
})(typeof window !== 'undefined' ? window : this);
