/* ============================================
   ENCRYPTED TEXT — Char-cycle reveal locking left-to-right
   Inspired by Aceternity EncryptedText, Mr. Robot title sequence
   ============================================
   Usage:
     <div class="enctxt" data-enctxt data-enctxt-target="ANTHROPIC"></div>

     EncryptedText.reveal('[data-enctxt]', {
       chars: '!@#$%^&*ABCDEF0123',
       perChar: 60,
       stagger: 80,
       lockAfter: 6,
       trigger: 'auto'   // 'auto' = on init, 'inview' = on IntersectionObserver, 'manual'
     });

     // Or one-off:
     EncryptedText.reveal(el, { target: 'NEW TEXT' });

     // Manual restart:
     instance.replay();
   ============================================ */
(function (root) {
  'use strict';

  var defaultChars = '!@#$%^&*()_+-=[]{}<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  var defaults = {
    chars: defaultChars,
    perChar: 60,
    stagger: 70,
    lockAfter: 6,
    trigger: 'auto',
    inviewMargin: '0px 0px -10% 0px',
    onComplete: null
  };

  function reveal(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var insts = [];
    Array.prototype.forEach.call(els, function (el) { insts.push(create(el, opts)); });
    return insts.length === 1 ? insts[0] : insts;
  }

  function create(el, opts) {
    var o = mergeOpts(opts);
    var targetText = opts && opts.target || el.dataset.enctxtTarget || el.textContent.trim() || '';
    var chars = (el.dataset.enctxtChars || o.chars || defaultChars);
    var perChar = parseInt(el.dataset.enctxtPerChar, 10) || o.perChar;
    var stagger = parseInt(el.dataset.enctxtStagger, 10) || o.stagger;
    var lockAfter = parseInt(el.dataset.enctxtLockAfter, 10) || o.lockAfter;
    var trigger = el.dataset.enctxtTrigger || o.trigger;

    // Build char spans
    el.innerHTML = '';
    var spans = [];
    for (var i = 0; i < targetText.length; i++) {
      var span = document.createElement('span');
      span.className = 'enctxt-char';
      span.textContent = targetText[i] === ' ' ? ' ' : pick(chars);
      el.appendChild(span);
      spans.push(span);
    }

    var inviewObserver = null;
    var running = false;

    function start() {
      if (running) return;
      running = true;
      var startTime = Date.now();
      var lockedCount = 0;
      var intervals = [];

      spans.forEach(function (span, idx) {
        var lockTime = stagger * idx;
        // Cycle character every perChar ms until lockTime + lockAfter*perChar
        var cycles = 0;
        var iv = setInterval(function () {
          if (Date.now() - startTime >= lockTime + lockAfter * perChar) {
            // Lock
            span.textContent = targetText[idx] === ' ' ? ' ' : targetText[idx];
            span.classList.add('is-locked');
            clearInterval(iv);
            lockedCount++;
            if (lockedCount === spans.length) {
              running = false;
              if (typeof o.onComplete === 'function') o.onComplete(el);
            }
            return;
          }
          if (targetText[idx] === ' ') return; // skip spaces during cycling
          span.textContent = pick(chars);
          cycles++;
        }, perChar);
        intervals.push(iv);
      });
    }

    function replay() {
      // Reset spans to random
      spans.forEach(function (span, i) {
        span.classList.remove('is-locked');
        span.textContent = targetText[i] === ' ' ? ' ' : pick(chars);
      });
      running = false;
      start();
    }

    if (trigger === 'auto') {
      setTimeout(start, 50);
    } else if (trigger === 'inview') {
      inviewObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            start();
            inviewObserver.disconnect();
          }
        });
      }, { rootMargin: o.inviewMargin });
      inviewObserver.observe(el);
    }

    return { el: el, start: start, replay: replay };
  }

  function pick(s) { return s[Math.floor(Math.random() * s.length)]; }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var EncryptedText = { reveal: reveal };
  if (typeof module !== 'undefined' && module.exports) module.exports = EncryptedText;
  else root.EncryptedText = EncryptedText;
})(typeof window !== 'undefined' ? window : this);
