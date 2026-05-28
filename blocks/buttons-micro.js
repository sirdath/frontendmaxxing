/* ============================================
   BUTTON MICRO — Click micro-interaction driver (confetti / particles / ripple / checkmark)
   Inspired by uiverse.io + feedback/emoji-spree.js
   ============================================
   Auto-detects the effect from the button's class. Zero dependencies —
   confetti/particles are short-lived absolutely-positioned DOM spans.

   Usage:
     ButtonMicro.init('.mibtn');
     // emoji burst: <button class="mibtn mibtn-emoji" data-emoji="🎉">Party</button>

   Variants handled: ripple, ripple-point, jelly, checkmark, shockwave,
                     confetti, particle, sparkle, emoji
   ============================================ */
(function (root) {
  'use strict';

  var CONFETTI = ['#a855f7','#ec4899','#f59e0b','#10b981','#06b6d4','#f43f5e'];

  function rand(a, b) { return a + Math.random() * (b - a); }

  function ripple(el, e, fromPoint) {
    var r = el.getBoundingClientRect();
    var span = document.createElement('span');
    span.className = 'mi-ripple';
    var size = Math.max(r.width, r.height) * 2;
    span.style.width = span.style.height = size + 'px';
    span.style.left = (fromPoint ? (e.clientX - r.left) : r.width / 2) + 'px';
    span.style.top  = (fromPoint ? (e.clientY - r.top)  : r.height / 2) + 'px';
    el.appendChild(span);
    setTimeout(function () { span.remove(); }, 650);
  }

  function shockwave(el) {
    var span = document.createElement('span');
    span.className = 'mi-wave';
    el.appendChild(span);
    setTimeout(function () { span.remove(); }, 650);
  }

  function jelly(el) {
    el.classList.remove('is-jelly');
    void el.offsetWidth;
    el.classList.add('is-jelly');
    setTimeout(function () { el.classList.remove('is-jelly'); }, 520);
  }

  function checkmark(el) {
    el.classList.add('is-done');
  }

  // Particle burst from the button center. kind: 'confetti'|'particle'|'sparkle'|'emoji'
  function burst(el, kind, emoji) {
    var r = el.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var n = kind === 'sparkle' ? 14 : 22;
    for (var i = 0; i < n; i++) {
      var p = document.createElement('span');
      p.className = 'mi-particle';
      var a = rand(0, Math.PI * 2);
      var dist = rand(40, 120);
      var dx = Math.cos(a) * dist;
      var dy = Math.sin(a) * dist - rand(10, 40); // bias upward
      if (kind === 'emoji') {
        p.textContent = emoji || '🎉';
        p.style.fontSize = rand(14, 24) + 'px';
      } else if (kind === 'sparkle') {
        p.textContent = '✦';
        p.style.color = CONFETTI[i % CONFETTI.length];
        p.style.fontSize = rand(10, 20) + 'px';
      } else if (kind === 'confetti') {
        p.style.width = rand(6, 10) + 'px';
        p.style.height = rand(8, 14) + 'px';
        p.style.background = CONFETTI[i % CONFETTI.length];
        p.style.borderRadius = '2px';
      } else { // particle
        var s = rand(4, 8);
        p.style.width = p.style.height = s + 'px';
        p.style.background = CONFETTI[i % CONFETTI.length];
        p.style.borderRadius = '50%';
      }
      p.style.left = cx + 'px';
      p.style.top = cy + 'px';
      document.body.appendChild(p);
      animateParticle(p, dx, dy, kind);
    }
  }

  function animateParticle(p, dx, dy, kind) {
    var start = performance.now();
    var dur = rand(600, 1000);
    var rot = rand(-360, 360);
    var gravity = kind === 'confetti' ? 160 : 90;
    function tick(now) {
      var t = Math.min(1, (now - start) / dur);
      var x = dx * t;
      var y = dy * t + gravity * t * t;
      p.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + (rot * t) + 'deg)';
      p.style.opacity = (1 - t).toFixed(2);
      if (t < 1) requestAnimationFrame(tick);
      else p.remove();
    }
    requestAnimationFrame(tick);
  }

  function create(el) {
    var cls = el.classList;
    el.addEventListener('click', function (e) {
      if (cls.contains('mibtn-ripple'))        ripple(el, e, false);
      if (cls.contains('mibtn-ripple-point'))  ripple(el, e, true);
      if (cls.contains('mibtn-shockwave'))      shockwave(el);
      if (cls.contains('mibtn-jelly'))          jelly(el);
      if (cls.contains('mibtn-checkmark'))      checkmark(el);
      if (cls.contains('mibtn-confetti'))       burst(el, 'confetti');
      if (cls.contains('mibtn-particle'))       burst(el, 'particle');
      if (cls.contains('mibtn-sparkle'))        burst(el, 'sparkle');
      if (cls.contains('mibtn-emoji'))          burst(el, 'emoji', el.dataset.emoji);
    });
    return { el: el, reset: function () { el.classList.remove('is-done'); } };
  }

  function init(target) {
    if (typeof target === 'string') {
      var nodes = document.querySelectorAll(target);
      if (nodes.length === 0) return null;
      if (nodes.length === 1) return create(nodes[0]);
      var arr = []; nodes.forEach(function (n) { arr.push(create(n)); });
      return arr;
    }
    return create(target);
  }

  var ButtonMicro = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = ButtonMicro;
  else root.ButtonMicro = ButtonMicro;
})(typeof window !== 'undefined' ? window : this);
