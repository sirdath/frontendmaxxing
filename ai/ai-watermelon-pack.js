/* ============================================
   AI WATERMELON PACK — JS glue
   Voice-note playback simulation + contextual-ai-bar keyboard binding
   ============================================
   Usage:
     AIWmPack.voice('[data-aiwm-voice]', { duration: 12, peaks: [0.4,0.6,...] });
     AIWmPack.ctxbar('[data-aiwm-ctxbar]', { hotkey: 'k', onSubmit: function (text) {} });
   ============================================ */
(function (root) {
  'use strict';

  function each(target, fn) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, fn);
  }

  function voice(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var wave = host.querySelector('.aiwm-voice-wave');
      var play = host.querySelector('.aiwm-voice-play');
      var durEl = host.querySelector('.aiwm-voice-dur');
      var bars = opts.bars || 28;
      var peaks = opts.peaks || Array.from({ length: bars }, function () { return 0.2 + Math.random() * 0.8; });
      if (wave && !wave.children.length) {
        peaks.forEach(function (p) {
          var i = document.createElement('i');
          i.style.setProperty('--bar-h', (p * 100).toFixed(0) + '%');
          wave.appendChild(i);
        });
      }
      var total = opts.duration || 10;
      function fmt(s) {
        var m = Math.floor(s / 60), r = Math.floor(s % 60);
        return m + ':' + (r < 10 ? '0' : '') + r;
      }
      if (durEl) durEl.textContent = fmt(total);
      var playing = false, progress = 0, raf;
      if (play) play.addEventListener('click', function () {
        playing = !playing;
        host.classList.toggle('is-playing', playing);
        play.textContent = playing ? '❚❚' : '▶';
        var start = performance.now() - progress * 1000;
        function tick(now) {
          if (!playing) return;
          progress = (now - start) / 1000;
          if (progress >= total) { progress = total; playing = false; host.classList.remove('is-playing'); play.textContent = '▶'; }
          var pct = progress / total;
          var idx = Math.floor(pct * peaks.length);
          var bs = wave.querySelectorAll('i');
          bs.forEach(function (b, i) { b.classList.toggle('is-played', i < idx); });
          if (durEl) durEl.textContent = fmt(total - progress);
          if (playing) raf = requestAnimationFrame(tick);
        }
        raf = requestAnimationFrame(tick);
      });
    });
  }

  function ctxbar(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var input = host.querySelector('.aiwm-ctxbar-input');
      if (!input) return;
      if (opts.hotkey) {
        var key = opts.hotkey.toLowerCase();
        document.addEventListener('keydown', function (e) {
          if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === key) {
            input.focus();
            e.preventDefault();
          }
        });
      }
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          if (typeof opts.onSubmit === 'function') opts.onSubmit(input.value);
        } else if (e.key === 'Escape') {
          input.blur();
        }
      });
    });
  }

  var AIWmPack = { voice: voice, ctxbar: ctxbar };
  if (typeof module !== 'undefined' && module.exports) module.exports = AIWmPack;
  else root.AIWmPack = AIWmPack;
})(typeof window !== 'undefined' ? window : this);
