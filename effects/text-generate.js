/* ============================================
   TEXT GENERATE — Word-by-word fade-in like a typing/streaming model
   Inspired by Aceternity UI
   ============================================
   (Companion to existing effects/text-wave.js which is char-based.)

   Usage:
     <p data-text-generate>The quick brown fox jumps over the lazy dog.</p>
     TextGenerate.init('[data-text-generate]');
     TextGenerate.init('[data-text-generate]', {
       delay: 80,           // ms between words
       duration: 500,       // fade-in duration per word
       blur: 6,             // start blur amount
       start: 'auto'        // 'auto' | 'inview' | 'manual'
     });
     // manual:
     var t = TextGenerate.init('p', { start: 'manual' });
     t.play();
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    delay: 80,
    duration: 500,
    blur: 6,
    start: 'auto'  // 'auto' | 'inview' | 'manual'
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

    var original = el.textContent;
    var words = original.trim().split(/\s+/);
    el.innerHTML = '';
    var spans = words.map(function (w, i) {
      var s = document.createElement('span');
      s.textContent = w;
      s.style.display = 'inline-block';
      s.style.opacity = '0';
      s.style.filter = 'blur(' + o.blur + 'px)';
      s.style.transform = 'translateY(0.25em)';
      s.style.transition =
        'opacity ' + o.duration + 'ms ease, ' +
        'filter '  + o.duration + 'ms ease, ' +
        'transform ' + o.duration + 'ms ease';
      el.appendChild(s);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      return s;
    });

    var played = false;
    var timers = [];

    function play() {
      if (played) return;
      played = true;
      spans.forEach(function (s, i) {
        var t = setTimeout(function () {
          s.style.opacity = '1';
          s.style.filter = 'blur(0px)';
          s.style.transform = 'translateY(0)';
        }, i * o.delay);
        timers.push(t);
      });
    }

    function reset() {
      timers.forEach(function (t) { clearTimeout(t); });
      timers = [];
      played = false;
      spans.forEach(function (s) {
        s.style.opacity = '0';
        s.style.filter = 'blur(' + o.blur + 'px)';
        s.style.transform = 'translateY(0.25em)';
      });
    }

    var io = null;
    if (o.start === 'auto') {
      // Slight delay to let CSS apply first
      requestAnimationFrame(play);
    } else if (o.start === 'inview' && typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { play(); io.disconnect(); }
        });
      }, { threshold: 0.25 });
      io.observe(el);
    }

    function destroy() {
      timers.forEach(function (t) { clearTimeout(t); });
      if (io) io.disconnect();
      el.textContent = original;
    }

    return { el: el, play: play, reset: reset, destroy: destroy };
  }

  var TextGenerate = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = TextGenerate;
  else root.TextGenerate = TextGenerate;
})(typeof window !== 'undefined' ? window : this);
