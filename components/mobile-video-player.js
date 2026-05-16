/* ============================================
   MOBILE VIDEO PLAYER — Tap-to-pause, progress, like
   ============================================
   Usage:
     MobileVideoPlayer.init('[data-mvp]', {
       autoplay: true,
       onLike: function (liked) {},
       onShare: function () {}
     });
   ============================================ */
(function (root) {
  'use strict';
  var defaults = { autoplay: true, onLike: null, onShare: null };

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
    var video = host.querySelector('.mvp-video');
    var progFill = host.querySelector('.mvp-progress > i');

    if (video) {
      if (o.autoplay) {
        video.muted = true; video.loop = true; video.playsInline = true;
        var p = video.play(); if (p && p.catch) p.catch(function () {});
      }
      video.addEventListener('timeupdate', function () {
        if (progFill && video.duration) {
          progFill.style.setProperty('--mvp-prog', ((video.currentTime / video.duration) * 100).toFixed(1) + '%');
        }
      });
      video.addEventListener('click', function () {
        if (video.paused) { video.play(); host.classList.remove('is-paused'); }
        else { video.pause(); host.classList.add('is-paused'); }
      });
    }

    // Like
    var likeBtn = host.querySelector('.mvp-act');
    if (likeBtn) {
      likeBtn.addEventListener('click', function () {
        var liked = likeBtn.classList.toggle('is-liked');
        if (typeof o.onLike === 'function') o.onLike(liked);
      });
    }

    // Mute toggle
    var mute = host.querySelector('.mvp-mute');
    if (mute && video) {
      mute.addEventListener('click', function () {
        video.muted = !video.muted;
        mute.textContent = video.muted ? '🔇' : '🔊';
      });
    }

    // Pause overlay icon
    if (!host.querySelector('.mvp-pause-icon')) {
      var pi = document.createElement('div');
      pi.className = 'mvp-pause-icon';
      pi.textContent = '▶';
      host.appendChild(pi);
    }

    return {
      el: host,
      play: function () { if (video) video.play(); host.classList.remove('is-paused'); },
      pause: function () { if (video) video.pause(); host.classList.add('is-paused'); }
    };
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var MobileVideoPlayer = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = MobileVideoPlayer;
  else root.MobileVideoPlayer = MobileVideoPlayer;
})(typeof window !== 'undefined' ? window : this);
