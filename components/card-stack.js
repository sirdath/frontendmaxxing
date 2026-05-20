/* ============================================
   CARD STACK — Auto-rotates the top card to the back on a timer (or click)
   Inspired by Aceternity UI
   ============================================
   Usage:
     CardStack.init('.cs-host', { interval: 4000 });   // 0 = no auto-rotate
   ============================================ */
(function (root) {
  'use strict';

  function create(host, opts) {
    opts = Object.assign({ interval: 4000 }, opts || {});
    var cards = Array.from(host.querySelectorAll('.cs-card'));
    if (cards.length < 2) return null;

    // Initial layout: cards[0] front, cards[1] mid, cards[2] back, rest hidden
    function layout() {
      cards.forEach(function (c, i) {
        c.dataset.pos = i < 3 ? i : '99';
        if (i >= 3) c.style.display = 'none';
      });
    }
    layout();

    var timer = null;
    function rotate() {
      var first = cards.shift();
      first.dataset.pos = 'leaving';
      setTimeout(function () {
        first.dataset.pos = '99';
        cards.push(first);
        layout();
      }, 550);
    }

    function start() {
      if (!opts.interval) return;
      stop();
      timer = setInterval(rotate, opts.interval);
    }
    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    host.addEventListener('click', function () { rotate(); start(); });
    host.addEventListener('mouseenter', stop);
    host.addEventListener('mouseleave', start);
    start();

    return { el: host, next: rotate, destroy: function () { stop(); } };
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

  var CardStack = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = CardStack;
  else root.CardStack = CardStack;
})(typeof window !== 'undefined' ? window : this);
