/* ============================================
   GSAP TEXT SCRAMBLE — Decode/scramble-in text (zero-plugin, gsap.ticker driven)
   Inspired by official GSAP ScrambleTextPlugin behavior (re-implemented dependency-free)
   ============================================
   Requires GSAP core from CDN (uses gsap.ticker + gsap.utils).

   Usage:
     TextScramble.init('.glitch-h1');
     var s = TextScramble.init(el, { chars: '!<>-_\\/[]{}—=+*^?#', duration: 1.2 });
     s.to('NEW TEXT');     // scramble to a new string on demand
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    chars: '!<>-_\\/[]{}—=+*^?#________',
    duration: 1.1,
    scroll: false,
    start: 'top 85%'
  };

  function init(target, opts) {
    var gsap = root.gsap;
    if (!gsap) { console.warn('[TextScramble] Requires GSAP core.'); return null; }
    var nodes = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target instanceof Element ? [target] : target);
    var instances = [];
    Array.prototype.forEach.call(nodes, function (el) { instances.push(create(el, opts, gsap)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function create(el, opts, gsap) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var finalText = el.textContent;
    var frame = 0, queue = [], rafBound = null, resolveFn = null;
    var rnd = function () { return o.chars[Math.floor(Math.random() * o.chars.length)]; };

    function setText(newText) {
      var old = el.textContent;
      var len = Math.max(old.length, newText.length);
      queue = [];
      var totalFrames = Math.round(o.duration * 60);
      for (var i = 0; i < len; i++) {
        var from = old[i] || '';
        var to = newText[i] || '';
        var startF = Math.floor(Math.random() * totalFrames * 0.5);
        var endF = startF + Math.floor(Math.random() * totalFrames * 0.5) + 8;
        queue.push({ from: from, to: to, start: startF, end: endF, char: null });
      }
      frame = 0;
      if (rafBound) gsap.ticker.remove(rafBound);
      rafBound = update;
      gsap.ticker.add(rafBound);
      return new Promise(function (res) { resolveFn = res; });
    }

    function update() {
      var out = '', done = 0;
      for (var i = 0; i < queue.length; i++) {
        var q = queue[i];
        if (frame >= q.end) { done++; out += q.to; }
        else if (frame >= q.start) {
          if (!q.char || Math.random() < 0.28) q.char = rnd();
          out += '<span style="opacity:0.65">' + q.char + '</span>';
        } else { out += q.from; }
      }
      el.innerHTML = out;
      if (done === queue.length) {
        gsap.ticker.remove(rafBound);
        el.textContent = queue.map(function (q) { return q.to; }).join('');
        if (resolveFn) resolveFn();
      } else { frame++; }
    }

    var st = null;
    var run = function () { setText(finalText); };
    el.textContent = '';
    if (o.scroll && root.ScrollTrigger) {
      gsap.registerPlugin(root.ScrollTrigger);
      st = root.ScrollTrigger.create({ trigger: el, start: o.start, once: true, onEnter: run });
    } else { run(); }

    return {
      el: el,
      to: setText,
      replay: run,
      destroy: function () { if (rafBound) gsap.ticker.remove(rafBound); if (st) st.kill(); el.textContent = finalText; }
    };
  }

  var TextScramble = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = TextScramble;
  else root.TextScramble = TextScramble;
})(typeof window !== 'undefined' ? window : this);
