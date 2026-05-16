/* ============================================
   AUDIO WAVEFORM — Render fake or analyzed waveform; play/pause + seek
   Inspired by SoundCloud / wavesurfer.js
   ============================================
   Usage:
     AudioWaveform.init('[data-audio-waveform]', {
       bars: 40,                // visual bar count
       analyze: false,          // true = decode the audio and use real amplitudes (needs CORS)
       heights: null            // optional precomputed array [0..1] of bar heights
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    bars: 40,
    analyze: false,
    heights: null,
    onPlay: null,
    onPause: null
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function fmt(sec) {
    if (isNaN(sec)) return '0:00';
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var audio = el.querySelector('audio');
    var play  = el.querySelector('[data-awav-play]');
    var bars  = el.querySelector('.awav-bars');
    var curEl = el.querySelector('[data-awav-cur]');
    var durEl = el.querySelector('[data-awav-dur]');

    function renderBars(heights) {
      bars.innerHTML = '';
      heights.forEach(function (h) {
        var b = document.createElement('div');
        b.className = 'awav-bar';
        b.style.height = (Math.max(0.15, h) * 100) + '%';
        bars.appendChild(b);
      });
    }

    function fakeHeights(n) {
      var out = [];
      // Smooth pseudo-random with envelope
      for (var i = 0; i < n; i++) {
        var t = i / n;
        var env = Math.sin(t * Math.PI);
        var noise = 0.3 + 0.7 * Math.abs(Math.sin(i * 1.7) + Math.cos(i * 0.7));
        out.push(Math.min(1, env * noise));
      }
      return out;
    }

    var heights = o.heights || fakeHeights(o.bars);
    renderBars(heights);

    function paint() {
      var pct = (audio.currentTime / (audio.duration || 1));
      var idx = Math.round(pct * heights.length);
      Array.prototype.forEach.call(bars.children, function (b, i) {
        b.classList.toggle('is-played', i < idx);
      });
      if (curEl) curEl.textContent = fmt(audio.currentTime);
    }

    function togglePlay() {
      if (audio.paused) audio.play(); else audio.pause();
    }
    function onPlay() {
      play.textContent = '❚❚';
      if (typeof o.onPlay === 'function') o.onPlay();
    }
    function onPause() {
      play.textContent = '▶';
      if (typeof o.onPause === 'function') o.onPause();
    }
    function onTime() { paint(); }
    function onLoaded() { if (durEl) durEl.textContent = fmt(audio.duration); }
    function onBarsClick(e) {
      var r = bars.getBoundingClientRect();
      var t = (e.clientX - r.left) / r.width;
      audio.currentTime = t * audio.duration;
    }

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onLoaded);
    if (play) play.addEventListener('click', togglePlay);
    bars.addEventListener('click', onBarsClick);

    if (audio.readyState >= 1) onLoaded();

    // Optional analyze pass: decode audio buffer + downsample
    if (o.analyze && audio.src) {
      var AC = window.AudioContext || window.webkitAudioContext;
      fetch(audio.src).then(function (r) { return r.arrayBuffer(); })
        .then(function (buf) { return new AC().decodeAudioData(buf); })
        .then(function (decoded) {
          var raw = decoded.getChannelData(0);
          var step = Math.floor(raw.length / o.bars);
          var out = [];
          for (var i = 0; i < o.bars; i++) {
            var sum = 0;
            for (var j = 0; j < step; j++) sum += Math.abs(raw[i * step + j] || 0);
            out.push(sum / step);
          }
          var max = Math.max.apply(null, out) || 1;
          renderBars(out.map(function (v) { return v / max; }));
        }).catch(function () {});
    }

    function destroy() {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onLoaded);
      if (play) play.removeEventListener('click', togglePlay);
      bars.removeEventListener('click', onBarsClick);
    }

    return { el: el, audio: audio, destroy: destroy };
  }

  var AudioWaveform = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = AudioWaveform;
  else root.AudioWaveform = AudioWaveform;
})(typeof window !== 'undefined' ? window : this);
