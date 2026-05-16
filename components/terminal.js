/* ============================================
   TERMINAL — Type lines into a fake terminal in sequence
   Inspired by Magic UI
   ============================================
   Usage:
     Terminal.init('[data-terminal]', {
       lines: [
         { type: 'cmd', text: 'pnpm install' },
         { type: 'out', text: 'Resolving dependencies…', delay: 600 },
         { type: 'ok',  text: '✓ Done in 2.4s' }
       ],
       speed: 30,         // ms per character for cmd lines
       lineDelay: 350,    // ms pause between lines
       cursor: true,      // show blinking cursor on active line
       loop: false,
       onDone: function () {}
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    lines: [],
    speed: 30,
    lineDelay: 350,
    cursor: true,
    loop: false,
    onDone: null
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

    var cancelled = false;
    var timer = null;
    var pendingResolve = null;

    function wait(ms) {
      return new Promise(function (resolve) {
        pendingResolve = resolve;
        timer = setTimeout(function () {
          pendingResolve = null;
          resolve();
        }, ms);
      });
    }

    function clearTerm() { el.innerHTML = ''; }

    function makeLine(type) {
      var n = document.createElement('span');
      n.className = 'terminal-line ' + (type || 'out');
      el.appendChild(n);
      return n;
    }

    function makeCursor() {
      var c = document.createElement('span');
      c.className = 'terminal-cursor';
      return c;
    }

    async function typeText(node, text, speed) {
      for (var i = 0; i < text.length; i++) {
        if (cancelled) return;
        node.appendChild(document.createTextNode(text[i]));
        await wait(speed);
      }
    }

    async function runOnce() {
      clearTerm();
      for (var i = 0; i < o.lines.length; i++) {
        if (cancelled) return;
        var line = o.lines[i];
        var node = makeLine(line.type || 'out');
        var cursor = o.cursor ? makeCursor() : null;
        if (cursor) node.appendChild(cursor);

        var text = line.text || '';
        if (line.type === 'cmd') {
          // type character by character
          if (cursor) node.removeChild(cursor);
          await typeText(node, text, line.speed || o.speed);
          if (cursor) node.appendChild(cursor);
        } else {
          if (cursor) node.removeChild(cursor);
          node.appendChild(document.createTextNode(text));
          if (cursor && i === o.lines.length - 1) node.appendChild(cursor);
        }
        if (cursor && i !== o.lines.length - 1) {
          // Remove cursor from non-final lines
          if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
        }

        node.appendChild(document.createTextNode('\n'));
        await wait(line.delay != null ? line.delay : o.lineDelay);
      }
      if (typeof o.onDone === 'function') o.onDone();
    }

    async function run() {
      do {
        await runOnce();
        if (cancelled) return;
        if (o.loop) await wait(1200);
      } while (o.loop && !cancelled);
    }

    run();

    function destroy() {
      cancelled = true;
      if (timer) clearTimeout(timer);
      if (pendingResolve) pendingResolve();
    }

    return { el: el, destroy: destroy };
  }

  var Terminal = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = Terminal;
  else root.Terminal = Terminal;
})(typeof window !== 'undefined' ? window : this);
