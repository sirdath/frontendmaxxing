/* ============================================
   VOICE INPUT — Mic button controller with Web Speech + live waveform
   Inspired by ChatGPT voice mode, Whisper UIs
   ============================================
   Uses:
     - SpeechRecognition (WebKit/Chromium) for free in-browser transcription
     - Web Audio API for live waveform visualization
     - MediaRecorder fallback if you want to upload to Whisper

   Usage:
     VoiceInput.bind('[data-vin]', {
       lang: 'en-US',
       continuous: false,
       interim: true,
       autoStop: 3000,                // ms of silence before auto-stop
       onTranscript: function (text, isFinal) { console.log(text); },
       onAudio: function (blob) {},        // receives the MediaRecorder result blob
       onStart, onStop, onError
     });

     // Programmatic:
     instance.start();
     instance.stop();
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    lang: 'en-US',
    continuous: false,
    interim: true,
    autoStop: null,           // ms of silence
    record: false,            // also record MediaRecorder blob
    onTranscript: null,
    onAudio: null,
    onStart: null,
    onStop: null,
    onError: null,
    showTranscript: true
  };

  function bind(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var insts = [];
    Array.prototype.forEach.call(els, function (el) { insts.push(create(el, opts)); });
    return insts.length === 1 ? insts[0] : insts;
  }

  function create(button, opts) {
    var o = mergeOpts(opts);
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;

    var bars = button.querySelectorAll('.vin-bar');
    var timer = button.querySelector('.vin-timer');
    var transcriptEl = null;
    var recognition = null;
    var audioCtx = null;
    var analyser = null;
    var recAnimId = null;
    var mediaRecorder = null;
    var chunks = [];
    var startTime = 0;
    var timerId = null;
    var silenceTimeoutId = null;
    var lastSpeechAt = 0;

    function start() {
      if (button.classList.contains('is-recording') || button.classList.contains('is-processing')) return;

      if (SR) {
        recognition = new SR();
        recognition.lang = o.lang;
        recognition.continuous = o.continuous;
        recognition.interimResults = o.interim;
        recognition.onresult = function (e) {
          var interim = '', final = '';
          for (var i = e.resultIndex; i < e.results.length; i++) {
            if (e.results[i].isFinal) final += e.results[i][0].transcript;
            else interim += e.results[i][0].transcript;
          }
          if (typeof o.onTranscript === 'function') {
            if (final) o.onTranscript(final, true);
            if (interim) o.onTranscript(interim, false);
          }
          if (o.showTranscript) showTranscript(final + interim, !!final);
          if (interim || final) lastSpeechAt = Date.now();
        };
        recognition.onerror = function (e) {
          button.classList.add('is-error');
          if (typeof o.onError === 'function') o.onError(e.error);
          setTimeout(function () { button.classList.remove('is-error'); }, 1500);
          stop();
        };
        recognition.onend = function () { stop(); };
        try { recognition.start(); } catch (e) { /* may throw if already running */ }
      }

      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        // Audio analyser for waveform
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var src = audioCtx.createMediaStreamSource(stream);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        src.connect(analyser);
        animateWave();

        // Optional MediaRecorder
        if (o.record) {
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = function (e) { if (e.data.size) chunks.push(e.data); };
          mediaRecorder.onstop = function () {
            var blob = new Blob(chunks, { type: 'audio/webm' });
            chunks = [];
            if (typeof o.onAudio === 'function') o.onAudio(blob);
            stream.getTracks().forEach(function (t) { t.stop(); });
          };
          mediaRecorder.start();
        } else {
          // Stop tracks on stop
          button._stream = stream;
        }

        button.classList.add('is-recording');
        startTime = Date.now();
        lastSpeechAt = Date.now();
        startTimer();
        if (o.autoStop) startSilenceWatch();
        if (typeof o.onStart === 'function') o.onStart();
      }).catch(function (err) {
        if (typeof o.onError === 'function') o.onError(err);
      });
    }

    function stop() {
      if (!button.classList.contains('is-recording')) return;
      button.classList.remove('is-recording');
      button.classList.add('is-processing');
      stopTimer();
      stopSilenceWatch();
      cancelAnimationFrame(recAnimId);
      bars.forEach(function (b) { b.style.transform = 'scaleY(0.15)'; });

      if (recognition) {
        try { recognition.stop(); } catch (_) {}
        recognition = null;
      }
      if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
      if (button._stream) {
        button._stream.getTracks().forEach(function (t) { t.stop(); });
        button._stream = null;
      }
      if (audioCtx) { audioCtx.close(); audioCtx = null; }

      setTimeout(function () {
        button.classList.remove('is-processing');
        if (typeof o.onStop === 'function') o.onStop();
        hideTranscript();
      }, 400);
    }

    function toggle() {
      if (button.classList.contains('is-recording')) stop();
      else start();
    }

    function animateWave() {
      if (!analyser) return;
      var buf = new Uint8Array(analyser.frequencyBinCount);
      function tick() {
        analyser.getByteFrequencyData(buf);
        // Map first N bins → bars
        for (var i = 0; i < bars.length; i++) {
          var idx = Math.floor((i / bars.length) * buf.length * 0.6);
          var v = Math.min(1, buf[idx] / 220);
          bars[i].style.transform = 'scaleY(' + Math.max(0.15, v).toFixed(2) + ')';
        }
        recAnimId = requestAnimationFrame(tick);
      }
      tick();
    }

    function startTimer() {
      stopTimer();
      tick();
      timerId = setInterval(tick, 200);
    }
    function tick() {
      if (!timer) return;
      var s = Math.floor((Date.now() - startTime) / 1000);
      timer.textContent = Math.floor(s / 60) + ':' + (s % 60).toString().padStart(2, '0');
    }
    function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }

    function startSilenceWatch() {
      stopSilenceWatch();
      silenceTimeoutId = setInterval(function () {
        if (Date.now() - lastSpeechAt > o.autoStop) stop();
      }, 300);
    }
    function stopSilenceWatch() { if (silenceTimeoutId) { clearInterval(silenceTimeoutId); silenceTimeoutId = null; } }

    function showTranscript(text, isFinal) {
      if (!transcriptEl) {
        transcriptEl = document.createElement('div');
        transcriptEl.className = 'vin-transcript';
        button.appendChild(transcriptEl);
      }
      transcriptEl.innerHTML = '<span class="' + (isFinal ? '' : 'vin-transcript-interim') + '">' + escape(text) + '</span>';
    }
    function hideTranscript() {
      if (transcriptEl) { transcriptEl.remove(); transcriptEl = null; }
    }

    button.addEventListener('click', toggle);

    function destroy() {
      stop();
      button.removeEventListener('click', toggle);
    }

    return { el: button, start: start, stop: stop, toggle: toggle, destroy: destroy };
  }

  function escape(s) {
    return String(s == null ? '' : s).replace(/[<>&]/g, function (c) {
      return ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]);
    });
  }
  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var VoiceInput = { bind: bind };
  if (typeof module !== 'undefined' && module.exports) module.exports = VoiceInput;
  else root.VoiceInput = VoiceInput;
})(typeof window !== 'undefined' ? window : this);
