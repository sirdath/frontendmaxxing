/* ============================================
   VIDEO PLAYER PRO — Full controller for HTML5 video
   ============================================
   Usage:
     VideoPlayerPro.init('[data-vpp]', {
       chapters: [{time: 30, title: 'Intro'}, ...],
       captions: [{start: 0, end: 4, text: 'Hello'}, ...],
       speeds: [0.5, 0.75, 1, 1.25, 1.5, 2],
       onPlay, onPause, onEnd
     });
   ============================================ */
(function (root) {
  'use strict';
  var defaults = {
    chapters: [], captions: [],
    speeds: [0.5, 0.75, 1, 1.25, 1.5, 2],
    onPlay: null, onPause: null, onEnd: null, onTimeUpdate: null
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
    var video = host.querySelector('video');
    if (!video) return null;

    var bigPlay = host.querySelector('.vpp-bigplay');
    var play = host.querySelector('.vpp-play');
    var track = host.querySelector('.vpp-track');
    var fill = host.querySelector('.vpp-track-fill');
    var thumb = host.querySelector('.vpp-track-thumb');
    var bufEl = host.querySelector('.vpp-track-buf');
    var curEl = host.querySelector('.vpp-time .cur');
    var totEl = host.querySelector('.vpp-time .tot');
    var vol = host.querySelector('.vpp-vol');
    var cc = host.querySelector('.vpp-cc');
    var speed = host.querySelector('.vpp-speed');
    var pip = host.querySelector('.vpp-pip');
    var fs = host.querySelector('.vpp-fs');

    function fmt(s) {
      if (!isFinite(s)) return '0:00';
      var h = Math.floor(s / 3600);
      var m = Math.floor((s % 3600) / 60);
      var sec = Math.floor(s % 60);
      return (h > 0 ? h + ':' + (m < 10 ? '0' : '') : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
    }

    function toggle() {
      if (video.paused) {
        video.play(); host.classList.add('is-playing'); host.classList.remove('is-paused');
        if (play) play.textContent = '❚❚';
        if (typeof o.onPlay === 'function') o.onPlay();
      } else {
        video.pause(); host.classList.remove('is-playing'); host.classList.add('is-paused');
        if (play) play.textContent = '▶';
        if (typeof o.onPause === 'function') o.onPause();
      }
    }
    if (bigPlay) bigPlay.addEventListener('click', toggle);
    if (play) play.addEventListener('click', toggle);
    video.addEventListener('click', toggle);

    video.addEventListener('timeupdate', function () {
      var pct = (video.currentTime / video.duration) * 100;
      if (!isFinite(pct)) pct = 0;
      host.style.setProperty('--vpp-prog', pct + '%');
      if (curEl) curEl.textContent = fmt(video.currentTime);
      if (totEl && video.duration) totEl.textContent = fmt(video.duration);
      // Captions
      if (o.captions.length) {
        var t = video.currentTime;
        var match = o.captions.find(function (c) { return t >= c.start && t < c.end; });
        var capEl = host.querySelector('.vpp-cap-text');
        if (host.classList.contains('is-cc-on') && match) {
          if (!capEl) {
            var w = document.createElement('div'); w.className = 'vpp-cap';
            var s = document.createElement('span'); s.className = 'vpp-cap-text';
            w.appendChild(s); host.appendChild(w); capEl = s;
          }
          capEl.textContent = match.text;
          capEl.parentNode.style.display = '';
        } else if (capEl) {
          capEl.parentNode.style.display = 'none';
        }
      }
      if (typeof o.onTimeUpdate === 'function') o.onTimeUpdate(video.currentTime, video.duration);
    });
    video.addEventListener('progress', function () {
      if (!video.buffered.length || !video.duration) return;
      var pct = (video.buffered.end(video.buffered.length - 1) / video.duration) * 100;
      host.style.setProperty('--vpp-buf', pct + '%');
    });
    video.addEventListener('ended', function () {
      host.classList.remove('is-playing'); host.classList.add('is-paused');
      if (play) play.textContent = '▶';
      if (typeof o.onEnd === 'function') o.onEnd();
    });
    video.addEventListener('waiting', function () { host.classList.add('is-loading'); });
    video.addEventListener('canplay', function () { host.classList.remove('is-loading'); });

    // Track seek
    if (track) {
      track.addEventListener('click', function (e) {
        var r = track.getBoundingClientRect();
        var p = (e.clientX - r.left) / r.width;
        video.currentTime = p * video.duration;
      });
    }

    // Chapter markers
    if (o.chapters.length && track) {
      o.chapters.forEach(function (c) {
        var marker = document.createElement('div');
        marker.className = 'vpp-chap';
        marker.style.left = ((c.time / (video.duration || 1)) * 100) + '%';
        track.appendChild(marker);
        video.addEventListener('loadedmetadata', function () {
          marker.style.left = ((c.time / video.duration) * 100) + '%';
        });
      });
    }

    // Volume
    if (vol) {
      vol.addEventListener('click', function () {
        video.muted = !video.muted;
        vol.textContent = video.muted ? '🔇' : '🔊';
      });
    }

    // Captions toggle
    if (cc) cc.addEventListener('click', function () {
      host.classList.toggle('is-cc-on');
    });

    // Speed
    if (speed) {
      var idx = o.speeds.indexOf(1);
      if (idx === -1) idx = 0;
      speed.addEventListener('click', function () {
        idx = (idx + 1) % o.speeds.length;
        video.playbackRate = o.speeds[idx];
        speed.textContent = o.speeds[idx] + '×';
      });
    }

    // Picture-in-picture
    if (pip && document.pictureInPictureEnabled) {
      pip.addEventListener('click', function () {
        if (document.pictureInPictureElement) document.exitPictureInPicture();
        else video.requestPictureInPicture();
      });
    } else if (pip) pip.style.display = 'none';

    // Fullscreen
    if (fs) {
      fs.addEventListener('click', function () {
        if (document.fullscreenElement === host) document.exitFullscreen();
        else host.requestFullscreen && host.requestFullscreen();
      });
    }

    return { el: host, video: video, play: function () { if (video.paused) toggle(); }, pause: function () { if (!video.paused) toggle(); } };
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var VideoPlayerPro = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = VideoPlayerPro;
  else root.VideoPlayerPro = VideoPlayerPro;
})(typeof window !== 'undefined' ? window : this);
