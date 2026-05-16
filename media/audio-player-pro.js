/* ============================================
   AUDIO PLAYER PRO — HTMLAudioElement-backed player with bar waveform
   ============================================
   Usage:
     AudioPlayerPro.init('[data-apro]', {
       src: optional override of data-src,
       bars: 64,
       peaks: optional precomputed array,
       onPlay: function () {}, onPause, onTimeUpdate, onEnd
     });
   ============================================ */
(function (root) {
  'use strict';
  var defaults = { bars: 64, peaks: null, onPlay: null, onPause: null, onTimeUpdate: null, onEnd: null };

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
    var src = o.src || host.dataset.src;
    var audio = host.querySelector('audio') || (function () {
      var a = document.createElement('audio'); a.preload = 'metadata'; host.appendChild(a); return a;
    })();
    if (src) audio.src = src;

    var play = host.querySelector('.apro-play');
    var waveEl = host.querySelector('.apro-wave');
    var curEl = host.querySelector('.apro-cur');
    var durEl = host.querySelector('.apro-dur');

    // Generate bar elements
    if (waveEl && !waveEl.children.length) {
      var peaks = o.peaks || Array.from({ length: o.bars }, function () { return 0.15 + Math.random() * 0.85; });
      peaks.forEach(function (p) {
        var i = document.createElement('i');
        i.style.setProperty('--bar-h', (p * 100).toFixed(0) + '%');
        waveEl.appendChild(i);
      });
    }
    var bars = waveEl ? waveEl.querySelectorAll('i') : [];

    function fmt(s) {
      if (!isFinite(s)) return '0:00';
      var m = Math.floor(s / 60); var r = Math.floor(s % 60);
      return m + ':' + (r < 10 ? '0' : '') + r;
    }

    function renderProgress() {
      var dur = audio.duration || 1;
      var pct = audio.currentTime / dur;
      var idx = Math.floor(pct * bars.length);
      bars.forEach(function (b, i) { b.classList.toggle('is-played', i < idx); });
      if (curEl) curEl.textContent = fmt(audio.currentTime);
      if (durEl && isFinite(audio.duration)) durEl.textContent = fmt(audio.duration);
    }

    audio.addEventListener('loadedmetadata', renderProgress);
    audio.addEventListener('timeupdate', function () {
      renderProgress();
      if (typeof o.onTimeUpdate === 'function') o.onTimeUpdate(audio.currentTime, audio.duration);
    });
    audio.addEventListener('ended', function () {
      host.classList.remove('is-playing');
      if (play) play.textContent = '▶';
      if (typeof o.onEnd === 'function') o.onEnd();
    });

    function toggle() {
      if (audio.paused) {
        audio.play();
        host.classList.add('is-playing');
        if (play) play.textContent = '❚❚';
        if (typeof o.onPlay === 'function') o.onPlay();
      } else {
        audio.pause();
        host.classList.remove('is-playing');
        if (play) play.textContent = '▶';
        if (typeof o.onPause === 'function') o.onPause();
      }
    }
    if (play) play.addEventListener('click', toggle);

    if (waveEl) {
      waveEl.addEventListener('click', function (e) {
        var r = waveEl.getBoundingClientRect();
        var pct = (e.clientX - r.left) / r.width;
        if (audio.duration) audio.currentTime = pct * audio.duration;
        renderProgress();
      });
    }

    return { el: host, audio: audio, play: function () { if (audio.paused) toggle(); }, pause: function () { if (!audio.paused) toggle(); } };
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var AudioPlayerPro = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = AudioPlayerPro;
  else root.AudioPlayerPro = AudioPlayerPro;
})(typeof window !== 'undefined' ? window : this);
