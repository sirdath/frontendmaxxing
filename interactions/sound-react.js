/* ============================================
   SOUND REACT — Drive CSS custom properties from live audio amplitude
   Inspired by audio-reactive web experiments (WebAudio AnalyserNode → CSS vars)
   ============================================
   Reads an <audio>/<video> element or the microphone through a Web Audio
   AnalyserNode and writes normalized levels to CSS custom properties on a target
   element every animation frame — so styling stays in CSS:
     .bar { transform: scaleY(calc(0.2 + var(--snd-level) * 1.8)); }
   Writes --snd-level (overall), --snd-bass, --snd-treble. Freezes for
   prefers-reduced-motion.

   Usage:
     SoundReact.init('.viz', { source: '#track' });   // an <audio id="track">
     SoundReact.init('.viz', { source: 'mic' });       // microphone (asks permission)

   Options: { source, smoothing, vars }   Methods: .start() .stop() .destroy()
   ============================================ */
(function (root) {
  'use strict';

  var defaults = { source: 'mic', smoothing: 0.8 };

  function reducedMotion() {
    return root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function create(el, opts) {
    var o = Object.assign({}, defaults, opts || {});
    var AC = root.AudioContext || root.webkitAudioContext;
    if (!AC) { if (root.console) console.warn('[SoundReact] Web Audio API unavailable'); return null; }

    var ctx, analyser, src, data, raf, running = false;

    function setup(stream) {
      ctx = new AC();
      analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = o.smoothing;
      data = new Uint8Array(analyser.frequencyBinCount);
      if (stream) src = ctx.createMediaStreamSource(stream);
      else { var media = typeof o.source === 'string' ? document.querySelector(o.source) : o.source; if (!media) return; src = ctx.createMediaElementSource(media); src.connect(ctx.destination); }
      src.connect(analyser);
      loop();
    }

    function band(lo, hi) { var s = 0, n = 0; for (var i = lo; i < hi && i < data.length; i++) { s += data[i]; n++; } return n ? (s / n) / 255 : 0; }

    function loop() {
      running = true;
      analyser.getByteFrequencyData(data);
      var level = band(0, data.length);
      el.style.setProperty('--snd-level', level.toFixed(3));
      el.style.setProperty('--snd-bass', band(0, 12).toFixed(3));
      el.style.setProperty('--snd-treble', band(data.length >> 1, data.length).toFixed(3));
      raf = requestAnimationFrame(loop);
    }

    function start() {
      if (running) return;
      if (reducedMotion()) { el.style.setProperty('--snd-level', '0.35'); el.style.setProperty('--snd-bass', '0.35'); el.style.setProperty('--snd-treble', '0.35'); return; }
      if (o.source === 'mic') {
        if (!navigator.mediaDevices) { if (root.console) console.warn('[SoundReact] mic unavailable'); return; }
        navigator.mediaDevices.getUserMedia({ audio: true }).then(setup).catch(function (e) { if (root.console) console.warn('[SoundReact] mic denied', e); });
      } else { setup(null); }
    }

    function stop() { running = false; if (raf) cancelAnimationFrame(raf); if (ctx && ctx.state !== 'closed') ctx.close(); ctx = null; }

    start();
    return { el: el, start: start, stop: stop, destroy: stop };
  }

  function init(target, opts) {
    if (typeof target === 'string') {
      var nodes = document.querySelectorAll(target);
      if (!nodes.length) return null;
      if (nodes.length === 1) return create(nodes[0], opts);
      var arr = []; nodes.forEach(function (n) { arr.push(create(n, opts)); }); return arr;
    }
    return create(target, opts);
  }

  var SoundReact = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = SoundReact;
  else root.SoundReact = SoundReact;
})(typeof window !== 'undefined' ? window : this);
