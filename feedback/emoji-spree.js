/* ============================================
   EMOJI SPREE — Particle burst from chip click point
   ============================================
   Usage:
     EmojiSpree.init('[data-espree]', {
       count: 8,                     // particles per click
       extra: ['✨', '⭐', '💖'],     // additional pool to mix in
       toggle: true,                 // toggles is-picked on chip
       onPick: function (emoji, el) {}
     });

     // Or directly spawn at coordinates:
     EmojiSpree.burst(x, y, ['🎉', '✨'], 12);
   ============================================ */
(function (root) {
  'use strict';
  var defaults = { count: 8, extra: ['✨'], toggle: true, onPick: null };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var insts = [];
    Array.prototype.forEach.call(els, function (el) { insts.push(create(el, opts)); });
    return insts.length === 1 ? insts[0] : insts;
  }

  function create(host, opts) {
    var o = mergeOpts(opts);
    host.addEventListener('click', function (e) {
      var chip = e.target.closest('.espree-chip');
      if (!chip) return;
      var match = chip.textContent.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u);
      var emoji = match ? match[0] : '✨';
      var pool = [emoji].concat(o.extra || []);
      var rect = chip.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      burst(cx, cy, pool, o.count, host.classList.contains('espree-vertical'));
      if (o.toggle) chip.classList.toggle('is-picked');
      if (typeof o.onPick === 'function') o.onPick(emoji, chip);
    });
    return { el: host };
  }

  function burst(x, y, pool, count, vertical) {
    count = count || 8;
    pool = pool || ['✨'];
    for (var i = 0; i < count; i++) {
      var p = document.createElement('div');
      p.className = 'espree-particle';
      p.textContent = pool[Math.floor(Math.random() * pool.length)];
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      var spread = 80;
      var dx = (Math.random() - 0.5) * spread;
      var dy = (Math.random() - 0.5) * spread - 20;
      var rot = (Math.random() - 0.5) * 90;
      if (vertical) {
        p.style.setProperty('--drift', ((Math.random() - 0.5) * 120) + 'px');
      } else {
        p.style.transform = 'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px))';
      }
      p.style.setProperty('--rot', rot + 'deg');
      p.style.animationDelay = (i * 0.03) + 's';
      document.body.appendChild(p);
      setTimeout((function (el) { return function () { el.remove(); }; })(p), 2200);
    }
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var EmojiSpree = { init: init, burst: burst };
  if (typeof module !== 'undefined' && module.exports) module.exports = EmojiSpree;
  else root.EmojiSpree = EmojiSpree;
})(typeof window !== 'undefined' ? window : this);
