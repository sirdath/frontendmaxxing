/* ============================================
   VIDEO PLAYER — Custom controls for HTML5 <video>
   Inspired by Plyr / Mux Player / YouTube
   ============================================
   Usage:
     VideoPlayer.init('[data-video-player]', {
       autoplay: false,
       muted: false,
       loop: false,
       onPlay: function () {},
       onPause: function () {},
       onEnded: function () {}
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    autoplay: false,
    muted: false,
    loop: false,
    onPlay: null,
    onPause: null,
    onEnded: null
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function fmtTime(sec) {
    if (isNaN(sec)) return '0:00';
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var video = el.querySelector('video');
    if (!video) return { el: el, destroy: function () {} };
    video.controls = false;
    if (o.muted) video.muted = true;
    if (o.loop) video.loop = true;
    if (o.autoplay) video.autoplay = true;

    var bigPlay = el.querySelector('.vpl-big-play');
    var playBtn = el.querySelector('[data-vpl-play]');
    var muteBtn = el.querySelector('[data-vpl-mute]');
    var fsBtn   = el.querySelector('[data-vpl-fs]');
    var curEl   = el.querySelector('[data-vpl-cur]');
    var durEl   = el.querySelector('[data-vpl-dur]');
    var progress= el.querySelector('.vpl-progress');
    var volume  = el.querySelector('.vpl-volume');

    function togglePlay() {
      if (video.paused) video.play(); else video.pause();
    }
    function onPlay() {
      el.classList.add('is-playing');
      if (playBtn) playBtn.textContent = '❚❚';
      if (typeof o.onPlay === 'function') o.onPlay();
    }
    function onPause() {
      el.classList.remove('is-playing');
      if (playBtn) playBtn.textContent = '▶';
      if (typeof o.onPause === 'function') o.onPause();
    }
    function onEnded() {
      el.classList.remove('is-playing');
      if (typeof o.onEnded === 'function') o.onEnded();
    }
    function onTimeUpdate() {
      var pct = (video.currentTime / (video.duration || 1)) * 100;
      el.style.setProperty('--vpl-prog', pct + '%');
      if (curEl) curEl.textContent = fmtTime(video.currentTime);
    }
    function onProgress() {
      if (video.buffered && video.buffered.length) {
        var end = video.buffered.end(video.buffered.length - 1);
        el.style.setProperty('--vpl-buf', (end / video.duration * 100) + '%');
      }
    }
    function onLoaded() {
      if (durEl) durEl.textContent = fmtTime(video.duration);
    }
    function onVolume() {
      el.style.setProperty('--vpl-vol', (video.muted ? 0 : video.volume * 100) + '%');
      if (muteBtn) muteBtn.textContent = video.muted || video.volume === 0 ? '🔇' : '🔊';
    }
    function onProgressClick(e) {
      var r = progress.getBoundingClientRect();
      var t = (e.clientX - r.left) / r.width;
      video.currentTime = t * video.duration;
    }
    function onVolumeClick(e) {
      var r = volume.getBoundingClientRect();
      var v = (e.clientX - r.left) / r.width;
      video.volume = Math.max(0, Math.min(1, v));
      video.muted = video.volume === 0;
      onVolume();
    }
    function toggleMute() { video.muted = !video.muted; onVolume(); }
    function toggleFs() {
      if (!document.fullscreenElement) el.requestFullscreen();
      else document.exitFullscreen();
    }

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('progress', onProgress);
    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('volumechange', onVolume);
    if (bigPlay) bigPlay.addEventListener('click', togglePlay);
    if (playBtn) playBtn.addEventListener('click', togglePlay);
    if (muteBtn) muteBtn.addEventListener('click', toggleMute);
    if (fsBtn)   fsBtn.addEventListener('click', toggleFs);
    if (progress) progress.addEventListener('click', onProgressClick);
    if (volume)  volume.addEventListener('click', onVolumeClick);
    el.addEventListener('click', function (e) {
      if (e.target === video) togglePlay();
    });

    onVolume();
    if (video.readyState >= 1) onLoaded();

    function destroy() {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('progress', onProgress);
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('volumechange', onVolume);
    }

    return { el: el, video: video, play: function () { video.play(); }, pause: function () { video.pause(); }, destroy: destroy };
  }

  var VideoPlayer = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = VideoPlayer;
  else root.VideoPlayer = VideoPlayer;
})(typeof window !== 'undefined' ? window : this);
