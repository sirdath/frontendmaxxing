/* ============================================
   AUDIO VISUALIZER — Live Web Audio analyser → canvas (bars / wave / radial)
   Inspired by classic WebAudio AnalyserNode visualizers
   ============================================
   A REALTIME analyser visualizer driven by the microphone or a playing
   <audio>/<video> element. For a static seek/scrub waveform of a clip use
   media/audio-waveform.js instead — this one animates live input.
   Creates its own <canvas> inside the target (or reuses a child canvas), DPR-aware.

   Usage:
     AudioVisualizer.init('.viz', { source: 'mic', mode: 'radial' });
     AudioVisualizer.init('.viz', { source: '#track', mode: 'bars' });

   Modes: bars · wave · radial   Options: { source, mode, color, bg }
   Methods: .start() .stop() .destroy()
   ============================================ */
(function (root) {
  'use strict';

  var defaults = { source: 'mic', mode: 'bars', color: null, bg: null };

  function reducedMotion() {
    return root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  function cssVar(el, name, fallback) {
    var v = getComputedStyle(el).getPropertyValue(name);
    return (v && v.trim()) || fallback;
  }

  function create(host, opts) {
    var o = Object.assign({}, defaults, opts || {});
    var AC = root.AudioContext || root.webkitAudioContext;
    if (!AC) { if (root.console) console.warn('[AudioVisualizer] Web Audio API unavailable'); return null; }

    var canvas = host.querySelector('canvas');
    if (!canvas) { canvas = document.createElement('canvas'); host.appendChild(canvas); }
    var g = canvas.getContext('2d');
    var color = o.color || cssVar(host, '--accent', '#7c5cff');
    var bg = o.bg || cssVar(host, '--surface', 'transparent');

    var ctx, analyser, src, freq, time, raf, running = false;

    function size() {
      var dpr = root.devicePixelRatio || 1;
      var r = host.getBoundingClientRect();
      canvas.width = Math.max(1, r.width * dpr);
      canvas.height = Math.max(1, (r.height || 160) * dpr);
      canvas.style.width = '100%'; canvas.style.height = (r.height ? '' : '160px');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function setup(stream) {
      ctx = new AC();
      analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      freq = new Uint8Array(analyser.frequencyBinCount);
      time = new Uint8Array(analyser.fftSize);
      if (stream) src = ctx.createMediaStreamSource(stream);
      else { var media = typeof o.source === 'string' ? document.querySelector(o.source) : o.source; if (!media) return; src = ctx.createMediaElementSource(media); src.connect(ctx.destination); }
      src.connect(analyser);
      size(); loop();
    }

    function clear(w, h) { if (o.bg || bg !== 'transparent') { g.fillStyle = bg; g.fillRect(0, 0, w, h); } else g.clearRect(0, 0, w, h); }

    function drawBars(w, h) {
      analyser.getByteFrequencyData(freq);
      var bars = 64, step = Math.floor(freq.length / bars), bw = w / bars;
      g.fillStyle = color;
      for (var i = 0; i < bars; i++) { var v = freq[i * step] / 255; var bh = v * h; g.fillRect(i * bw, h - bh, bw * 0.7, bh); }
    }
    function drawWave(w, h) {
      analyser.getByteTimeDomainData(time);
      g.lineWidth = 2; g.strokeStyle = color; g.beginPath();
      for (var i = 0; i < time.length; i++) { var x = (i / time.length) * w, y = (time[i] / 255) * h; i ? g.lineTo(x, y) : g.moveTo(x, y); }
      g.stroke();
    }
    function drawRadial(w, h) {
      analyser.getByteFrequencyData(freq);
      var cx = w / 2, cy = h / 2, r0 = Math.min(w, h) * 0.18, bars = 96, step = Math.floor(freq.length / bars);
      g.strokeStyle = color; g.lineWidth = (Math.PI * 2 * r0) / bars * 0.6;
      for (var i = 0; i < bars; i++) { var v = freq[i * step] / 255, a = (i / bars) * Math.PI * 2, len = r0 + v * Math.min(w, h) * 0.32; g.beginPath(); g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); g.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len); g.stroke(); }
    }

    function loop() {
      running = true;
      var w = canvas.width / (root.devicePixelRatio || 1), h = canvas.height / (root.devicePixelRatio || 1);
      clear(w, h);
      (o.mode === 'wave' ? drawWave : o.mode === 'radial' ? drawRadial : drawBars)(w, h);
      raf = requestAnimationFrame(loop);
    }

    function start() {
      if (running) return;
      if (reducedMotion()) { size(); clear(canvas.width, canvas.height); return; } // static, no live loop
      if (o.source === 'mic') {
        if (!navigator.mediaDevices) { if (root.console) console.warn('[AudioVisualizer] mic unavailable'); return; }
        navigator.mediaDevices.getUserMedia({ audio: true }).then(setup).catch(function (e) { if (root.console) console.warn('[AudioVisualizer] mic denied', e); });
      } else { setup(null); }
    }

    function stop() { running = false; if (raf) cancelAnimationFrame(raf); if (ctx && ctx.state !== 'closed') ctx.close(); ctx = null; }

    root.addEventListener('resize', size);
    start();
    return { el: host, canvas: canvas, start: start, stop: stop, destroy: function () { stop(); root.removeEventListener('resize', size); } };
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

  var AudioVisualizer = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = AudioVisualizer;
  else root.AudioVisualizer = AudioVisualizer;
})(typeof window !== 'undefined' ? window : this);
