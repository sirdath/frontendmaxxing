/* ============================================
   BUTTON TEXT-FX — Scramble-decode / typing / count-up button labels
   Inspired by creative-coding text effects + uiverse.io
   ============================================
   Auto-detects the variant from the class. Triggers on hover by default.

   Usage:
     ButtonTextFx.init('.txbtn-scramble');                 // decode on hover
     ButtonTextFx.init('.txbtn-typing', {text: 'Deploy'}); // type on hover
     ButtonTextFx.init('.txbtn-count', {to: 1280, prefix:'$'});

   Options: trigger ('hover'|'click'), speed, chars (scramble pool),
            to/from/prefix/suffix (count), text (typing override)
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    trigger: 'hover',
    speed: 30,
    chars: '!<>-_\\/[]{}—=+*^?#________',
    to: null, from: 0, prefix: '', suffix: '', duration: 900,
    text: null
  };

  function scramble(el, finalText, o) {
    var frame = 0, raf;
    var queue = [];
    var fromText = el.textContent;
    var len = Math.max(fromText.length, finalText.length);
    for (var i = 0; i < len; i++) {
      var start = Math.floor(Math.random() * 20);
      var end = start + Math.floor(Math.random() * 20);
      queue.push({ from: fromText[i] || '', to: finalText[i] || '', start: start, end: end, ch: '' });
    }
    function tick() {
      var out = '', done = 0;
      for (var i = 0; i < queue.length; i++) {
        var q = queue[i];
        if (frame >= q.end) { done++; out += q.to; }
        else if (frame >= q.start) {
          if (!q.ch || Math.random() < 0.28) q.ch = o.chars[Math.floor(Math.random() * o.chars.length)];
          out += '<span style="opacity:0.7">' + q.ch + '</span>';
        } else { out += q.from; }
      }
      el.innerHTML = out;
      if (done === queue.length) return;
      frame++;
      raf = requestAnimationFrame(tick);
    }
    cancelAnimationFrame(raf);
    frame = 0; tick();
  }

  function typing(el, text, o) {
    var i = 0;
    el.classList.add('is-typing');
    function tick() {
      el.textContent = text.slice(0, i);
      if (i++ <= text.length) setTimeout(tick, o.speed + Math.random() * 40);
      else el.classList.remove('is-typing');
    }
    tick();
  }

  function countUp(el, o) {
    var start = performance.now();
    function tick(now) {
      var p = Math.min(1, (now - start) / o.duration);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(o.from + (o.to - o.from) * eased);
      el.textContent = o.prefix + val.toLocaleString() + o.suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function create(el, opts) {
    var o = Object.assign({}, defaults, opts || {});
    var finalText = (o.text != null ? o.text : el.textContent).trim();
    var isScramble = el.classList.contains('txbtn-scramble');
    var isTyping   = el.classList.contains('txbtn-typing');
    var isCount    = el.classList.contains('txbtn-count');

    function run() {
      if (isScramble) scramble(el, finalText, o);
      else if (isTyping) typing(el, finalText, o);
      else if (isCount && o.to != null) countUp(el, o);
    }

    var evt = o.trigger === 'click' ? 'click' : 'mouseenter';
    el.addEventListener(evt, run);

    return { el: el, run: run, destroy: function () { el.removeEventListener(evt, run); } };
  }

  function init(target, opts) {
    if (typeof target === 'string') {
      var nodes = document.querySelectorAll(target);
      if (nodes.length === 0) return null;
      if (nodes.length === 1) return create(nodes[0], opts);
      var arr = []; nodes.forEach(function (n) { arr.push(create(n, opts)); });
      return arr;
    }
    return create(target, opts);
  }

  var ButtonTextFx = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = ButtonTextFx;
  else root.ButtonTextFx = ButtonTextFx;
})(typeof window !== 'undefined' ? window : this);
