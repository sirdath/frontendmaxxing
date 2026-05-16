/* ============================================
   VOICE TRANSCRIBE — Web Speech API live transcript
   ============================================
   Usage:
     var t = VoiceTranscribe.init('[data-vtra]', {
       lang: 'en-US',
       continuous: true,
       interimResults: true,
       onFinal: function (text) {},
       onInterim: function (text) {},
       onLevel: function (db01) {}
     });
     t.start(); t.pause(); t.stop();
   ============================================ */
(function (root) {
  'use strict';
  var defaults = {
    lang: 'en-US',
    continuous: true,
    interimResults: true,
    onFinal: null,
    onInterim: null,
    onStart: null,
    onStop: null,
    onLevel: null
  };

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
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      host.querySelector('.vtra-status').textContent = 'Web Speech API not supported';
      return { el: host, start: function () {}, stop: function () {}, pause: function () {} };
    }

    var rec = new SR();
    rec.lang = o.lang;
    rec.continuous = o.continuous;
    rec.interimResults = o.interimResults;

    var finalEl = host.querySelector('.vtra-final');
    var interimEl = host.querySelector('.vtra-interim');
    var durEl = host.querySelector('.vtra-dur');
    var meterFill = host.querySelector('.vtra-meter-fill');
    var pauseBtn = host.querySelector('.vtra-pause');
    var stopBtn = host.querySelector('.vtra-stop');

    var paused = false, listening = false, startedAt = 0, durTimer, finalText = '';
    var audioCtx, analyser, micStream, raf;

    rec.onresult = function (e) {
      var interim = '';
      for (var i = e.resultIndex; i < e.results.length; i++) {
        var r = e.results[i];
        if (r.isFinal) {
          finalText += r[0].transcript + ' ';
          if (typeof o.onFinal === 'function') o.onFinal(r[0].transcript);
        } else {
          interim += r[0].transcript;
        }
      }
      if (finalEl) finalEl.textContent = finalText;
      if (interimEl) interimEl.textContent = interim;
      if (interim && typeof o.onInterim === 'function') o.onInterim(interim);
    };
    rec.onerror = function (e) {
      host.querySelector('.vtra-status').textContent = 'Error: ' + e.error;
    };
    rec.onend = function () {
      if (listening && !paused) {
        try { rec.start(); } catch (_) {}
      }
    };

    function fmt(s) {
      var m = Math.floor(s / 60); var r = Math.floor(s % 60);
      return m + ':' + (r < 10 ? '0' : '') + r;
    }

    function setupMeter() {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        micStream = stream;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var src = audioCtx.createMediaStreamSource(stream);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        src.connect(analyser);
        var data = new Uint8Array(analyser.frequencyBinCount);
        function tick() {
          analyser.getByteFrequencyData(data);
          var sum = 0;
          for (var i = 0; i < data.length; i++) sum += data[i];
          var lvl = Math.min(1, (sum / data.length) / 80);
          if (meterFill) meterFill.style.setProperty('--lvl', (lvl * 100).toFixed(0) + '%');
          if (typeof o.onLevel === 'function') o.onLevel(lvl);
          if (listening) raf = requestAnimationFrame(tick);
        }
        tick();
      }).catch(function () {});
    }
    function teardownMeter() {
      if (raf) cancelAnimationFrame(raf);
      if (micStream) micStream.getTracks().forEach(function (t) { t.stop(); });
      if (audioCtx && audioCtx.state !== 'closed') audioCtx.close();
    }

    function start() {
      if (listening) return;
      listening = true; paused = false; finalText = '';
      if (finalEl) finalEl.textContent = '';
      if (interimEl) interimEl.textContent = '';
      host.classList.add('is-listening');
      host.classList.remove('is-paused');
      try { rec.start(); } catch (_) {}
      setupMeter();
      startedAt = Date.now();
      if (durEl) {
        durEl.textContent = '0:00';
        durTimer = setInterval(function () {
          if (!paused) durEl.textContent = fmt((Date.now() - startedAt) / 1000);
        }, 500);
      }
      if (typeof o.onStart === 'function') o.onStart();
    }
    function pause() {
      paused = !paused;
      host.classList.toggle('is-paused', paused);
      if (paused) { try { rec.stop(); } catch (_) {} }
      else { try { rec.start(); } catch (_) {} startedAt = Date.now() - (parseDuration(durEl) * 1000); }
    }
    function parseDuration(el) {
      if (!el) return 0;
      var p = el.textContent.split(':');
      return parseInt(p[0], 10) * 60 + parseInt(p[1] || '0', 10);
    }
    function stop() {
      listening = false; paused = false;
      host.classList.remove('is-listening', 'is-paused');
      try { rec.stop(); } catch (_) {}
      teardownMeter();
      if (durTimer) clearInterval(durTimer);
      if (typeof o.onStop === 'function') o.onStop(finalText.trim());
    }

    if (pauseBtn) pauseBtn.addEventListener('click', pause);
    if (stopBtn) stopBtn.addEventListener('click', stop);

    return { el: host, start: start, stop: stop, pause: pause, get text() { return finalText.trim(); } };
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var VoiceTranscribe = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = VoiceTranscribe;
  else root.VoiceTranscribe = VoiceTranscribe;
})(typeof window !== 'undefined' ? window : this);
