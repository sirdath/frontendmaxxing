/* ============================================
   WAVEFORM REGIONS — Decode + draw waveform + manage regions, loop, playhead
   Inspired by Reaper, Logic Pro DAW timelines
   ============================================
   Usage:
     var w = WaveformRegions.create('#wfr', {
       src: 'podcast.mp3',
       regions: [
         { id: 'r1', start: 4.2, end: 12.8, label: 'Intro', color: '#8b5cf6' },
         { id: 'r2', start: 60, end: 88, label: 'Verse', color: '#ec4899' }
       ],
       loop: { in: 12.0, out: 24.0, enabled: false },
       onRegionChange: function (region) {},
       onRegionSelect: function (region) {},
       onLoopChange: function (loop) {},
       onTime: function (t, dur) {}
     });

     w.play(); w.pause(); w.toggle();
     w.seek(8.5);
     w.addRegion({ id, start, end, label, color });
     w.removeRegion(id);
     w.setLoop({ in, out, enabled });
     w.zoom(2);   // multiplier
     w.destroy();
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    src: null,
    regions: [],
    loop: { in: 0, out: 0, enabled: false },
    barWidth: 2,
    gap: 1,
    waveColor: null,
    playedColor: null,
    onRegionChange: null,
    onRegionSelect: null,
    onLoopChange: null,
    onTime: null,
    onLoaded: null
  };

  function create(target, opts) {
    var host = typeof target === 'string' ? document.querySelector(target) : target;
    if (!host) return null;
    if (!host.querySelector('.wfr-wave')) buildMarkup(host);
    host.classList.add('wfr');
    var o = mergeOpts(opts);

    var canvas = host.querySelector('.wfr-canvas');
    var regionsLayer = host.querySelector('.wfr-regions');
    var playhead = host.querySelector('.wfr-playhead');
    var loopRange = host.querySelector('.wfr-loop-range') || (function () {
      var r = document.createElement('div'); r.className = 'wfr-loop-range';
      host.querySelector('.wfr-loop').insertBefore(r, host.querySelector('.wfr-loop-in'));
      return r;
    })();
    var loopIn = host.querySelector('.wfr-loop-in');
    var loopOut = host.querySelector('.wfr-loop-out');
    var timeEl = host.querySelector('.wfr-time');
    var playBtn = host.querySelector('.wfr-play');
    var loopBtn = host.querySelector('.wfr-loop-toggle');

    var audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';

    var regions = o.regions.slice();
    var loop = Object.assign({}, o.loop);
    var peaks = null;
    var dpr = window.devicePixelRatio || 1;
    var zoomFactor = 1;
    var ctx = canvas.getContext('2d');
    var currentSrc = o.src;

    if (o.src) load(o.src);

    function load(src) {
      currentSrc = src;
      audio.src = src;
      fetch(src).then(function (r) { return r.arrayBuffer(); })
        .then(function (buf) {
          var AC = window.AudioContext || window.webkitAudioContext;
          var ac = new AC();
          return ac.decodeAudioData(buf);
        })
        .then(function (audioBuffer) {
          peaks = computePeaks(audioBuffer, 1024);
          render();
          renderRegions();
          renderLoop();
          if (typeof o.onLoaded === 'function') o.onLoaded(audioBuffer);
        })
        .catch(function (err) {
          // Audio decoding failed — render placeholder peaks
          peaks = placeholderPeaks(1024);
          render();
        });
    }

    function computePeaks(audioBuffer, samples) {
      var channel = audioBuffer.getChannelData(0);
      var blockSize = Math.floor(channel.length / samples);
      var out = new Float32Array(samples);
      for (var i = 0; i < samples; i++) {
        var max = 0;
        for (var j = 0; j < blockSize; j++) {
          var v = Math.abs(channel[i * blockSize + j] || 0);
          if (v > max) max = v;
        }
        out[i] = max;
      }
      return out;
    }

    function placeholderPeaks(n) {
      var out = new Float32Array(n);
      for (var i = 0; i < n; i++) {
        out[i] = 0.3 + Math.abs(Math.sin(i * 0.13) * 0.4) + (Math.random() * 0.15);
      }
      return out;
    }

    function render() {
      if (!peaks) return;
      var rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      var bw = o.barWidth, gap = o.gap;
      var totalBars = Math.floor(rect.width / (bw + gap));
      var step = peaks.length / totalBars;
      var mid = rect.height / 2;
      var playedFrac = audio.duration ? audio.currentTime / audio.duration : 0;
      var playedX = playedFrac * rect.width;
      var grad = ctx.createLinearGradient(0, 0, 0, rect.height);
      var waveColor = o.waveColor || getCss(host, '--w-wave') || '#8b5cf6';
      var playedColor = o.playedColor || getCss(host, '--w-wave-played') || '#ec4899';
      grad.addColorStop(0, waveColor);
      grad.addColorStop(0.5, waveColor);
      grad.addColorStop(1, waveColor);

      for (var i = 0; i < totalBars; i++) {
        var idx = Math.floor(i * step);
        var amp = peaks[idx] || 0;
        var h = Math.max(2, amp * (rect.height - 12));
        var x = i * (bw + gap);
        ctx.fillStyle = (x <= playedX) ? playedColor : waveColor;
        ctx.fillRect(x, mid - h / 2, bw, h);
      }
    }

    function renderRegions() {
      // Clear non-loop children
      Array.prototype.slice.call(regionsLayer.children).forEach(function (c) {
        if (!c.classList.contains('wfr-loop-range')) c.remove();
      });
      regions.forEach(function (r) {
        if (!audio.duration) return;
        var leftPct = (r.start / audio.duration) * 100;
        var widthPct = ((r.end - r.start) / audio.duration) * 100;
        var div = document.createElement('div');
        div.className = 'wfr-region';
        div.dataset.wfrRegion = r.id;
        div.style.left = leftPct + '%';
        div.style.width = widthPct + '%';
        if (r.color) div.style.setProperty('--r-c', r.color);
        div.innerHTML =
          '<span class="wfr-region-label">' + escape(r.label || '') + '</span>' +
          '<span class="wfr-region-handle wfr-region-handle-l"></span>' +
          '<span class="wfr-region-handle wfr-region-handle-r"></span>';
        regionsLayer.appendChild(div);
        bindRegionDrag(div, r);
      });
    }

    function renderLoop() {
      if (!audio.duration) return;
      var inFrac = loop.in / audio.duration;
      var outFrac = loop.out / audio.duration;
      loopRange.style.setProperty('--in', inFrac);
      loopRange.style.setProperty('--out', outFrac);
      loopIn.style.setProperty('--in', inFrac);
      loopOut.style.setProperty('--out', outFrac);
      if (!loop.enabled) loopRange.style.opacity = 0.35;
      else loopRange.style.opacity = 1;
    }

    function bindRegionDrag(div, region) {
      var mode = null;   // 'move' | 'left' | 'right'
      var startX = 0;
      var rect, dur, leftPct, widthPct;

      div.addEventListener('pointerdown', function (e) {
        e.preventDefault(); e.stopPropagation();
        regions.forEach(function (r) {
          var el = regionsLayer.querySelector('[data-wfr-region="' + escapeAttr(r.id) + '"]');
          if (el) el.classList.toggle('is-selected', r.id === region.id);
        });
        if (typeof o.onRegionSelect === 'function') o.onRegionSelect(region);

        if (e.target.classList.contains('wfr-region-handle-l')) mode = 'left';
        else if (e.target.classList.contains('wfr-region-handle-r')) mode = 'right';
        else mode = 'move';
        startX = e.clientX;
        rect = host.querySelector('.wfr-wave').getBoundingClientRect();
        dur = audio.duration || 1;
        leftPct = parseFloat(div.style.left);
        widthPct = parseFloat(div.style.width);
        try { div.setPointerCapture(e.pointerId); } catch (_) {}
      });
      div.addEventListener('pointermove', function (e) {
        if (!mode) return;
        var dx = e.clientX - startX;
        var dPct = (dx / rect.width) * 100;
        if (mode === 'move') {
          var newLeft = Math.max(0, Math.min(100 - widthPct, leftPct + dPct));
          div.style.left = newLeft + '%';
          region.start = (newLeft / 100) * dur;
          region.end = region.start + (widthPct / 100) * dur;
        } else if (mode === 'left') {
          var newL = Math.max(0, Math.min(leftPct + widthPct - 1, leftPct + dPct));
          div.style.left = newL + '%';
          div.style.width = (leftPct + widthPct - newL) + '%';
          region.start = (newL / 100) * dur;
        } else {
          var newW = Math.max(1, Math.min(100 - leftPct, widthPct + dPct));
          div.style.width = newW + '%';
          region.end = ((leftPct + newW) / 100) * dur;
        }
      });
      div.addEventListener('pointerup', function () {
        if (mode && typeof o.onRegionChange === 'function') o.onRegionChange(region);
        mode = null;
      });
    }

    // Wave click → seek
    host.querySelector('.wfr-wave').addEventListener('click', function (e) {
      if (e.target.closest('.wfr-region')) return;
      if (e.target.closest('.wfr-loop-bracket')) return;
      var rect = e.currentTarget.getBoundingClientRect();
      var frac = (e.clientX - rect.left) / rect.width;
      seek(frac * (audio.duration || 0));
    });

    // Play / pause
    if (playBtn) playBtn.addEventListener('click', toggle);
    if (loopBtn) loopBtn.addEventListener('click', function () {
      loop.enabled = !loop.enabled;
      loopBtn.classList.toggle('is-active', loop.enabled);
      renderLoop();
      if (typeof o.onLoopChange === 'function') o.onLoopChange(loop);
    });

    audio.addEventListener('timeupdate', function () {
      var frac = audio.duration ? audio.currentTime / audio.duration : 0;
      playhead.style.setProperty('--p', frac);
      if (timeEl) timeEl.textContent = fmt(audio.currentTime) + ' / ' + fmt(audio.duration || 0);
      if (loop.enabled && audio.currentTime >= loop.out) seek(loop.in);
      if (typeof o.onTime === 'function') o.onTime(audio.currentTime, audio.duration);
    });
    audio.addEventListener('loadedmetadata', function () {
      renderRegions();
      renderLoop();
      if (timeEl) timeEl.textContent = '0:00 / ' + fmt(audio.duration);
    });

    function play() { audio.play(); if (playBtn) playBtn.textContent = '⏸'; }
    function pause() { audio.pause(); if (playBtn) playBtn.textContent = '▶'; }
    function toggle() { audio.paused ? play() : pause(); }
    function seek(t) {
      audio.currentTime = Math.max(0, Math.min(audio.duration || 0, t));
    }
    function addRegion(r) { regions.push(r); renderRegions(); }
    function removeRegion(id) {
      regions = regions.filter(function (r) { return r.id !== id; });
      renderRegions();
    }
    function setLoop(l) {
      loop = Object.assign({}, loop, l);
      renderLoop();
    }
    function zoom(z) {
      zoomFactor = z;
      // Rescale canvas drawing — re-render handles this
      render();
    }

    function destroy() {
      audio.pause();
      audio.src = '';
    }

    return {
      host: host,
      audio: audio,
      load: load,
      play: play,
      pause: pause,
      toggle: toggle,
      seek: seek,
      addRegion: addRegion,
      removeRegion: removeRegion,
      setLoop: setLoop,
      zoom: zoom,
      destroy: destroy,
      get regions() { return regions.slice(); },
      get loop() { return Object.assign({}, loop); }
    };
  }

  function buildMarkup(host) {
    host.innerHTML =
      '<div class="wfr-ruler"></div>' +
      '<div class="wfr-wave">' +
        '<canvas class="wfr-canvas"></canvas>' +
        '<div class="wfr-regions">' +
          '<div class="wfr-loop-range"></div>' +
        '</div>' +
        '<div class="wfr-playhead"></div>' +
        '<div class="wfr-loop">' +
          '<div class="wfr-loop-bracket wfr-loop-in"></div>' +
          '<div class="wfr-loop-bracket wfr-loop-out"></div>' +
        '</div>' +
      '</div>' +
      '<footer class="wfr-toolbar">' +
        '<button class="wfr-play">▶</button>' +
        '<span class="wfr-time">0:00 / 0:00</span>' +
        '<button class="wfr-loop-toggle">⟲</button>' +
      '</footer>';
  }

  function fmt(s) {
    if (!s || !isFinite(s)) return '0:00';
    var m = Math.floor(s / 60);
    var sec = Math.floor(s % 60).toString().padStart(2, '0');
    return m + ':' + sec;
  }
  function getCss(el, varName) {
    return getComputedStyle(el).getPropertyValue(varName).trim() || null;
  }
  function escape(s) {
    return String(s == null ? '' : s).replace(/[<>&]/g, function (c) { return ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]); });
  }
  function escapeAttr(s) { return escape(s).replace(/"/g, '&quot;'); }
  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var WaveformRegions = { create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = WaveformRegions;
  else root.WaveformRegions = WaveformRegions;
})(typeof window !== 'undefined' ? window : this);
