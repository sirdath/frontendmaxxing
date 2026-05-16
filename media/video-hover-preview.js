/* ============================================
   VIDEO HOVER PREVIEW — Lazily inject + autoplay video on tile hover
   Inspired by Vimeo / Netflix browse / Codrops demos
   ============================================
   Usage:
     <div class="vhp" data-vhp data-vhp-src="trailer.mp4">
       <img class="vhp-poster" src="poster.jpg" alt="">
     </div>
     VideoHoverPreview.init('[data-vhp]');
     VideoHoverPreview.init('[data-vhp]', {
       muted: true,
       loop: true,
       playsInline: true,
       startDelay: 220   // ms before play (debounces flickery hover)
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    muted: true,
    loop: true,
    playsInline: true,
    startDelay: 220
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var src = el.getAttribute('data-vhp-src') || el.getAttribute('data-vhp') || '';
    var video = null;
    var timer = null;

    function makeVideo() {
      if (video) return video;
      video = document.createElement('video');
      video.src = src;
      video.muted = o.muted;
      video.loop  = o.loop;
      if (o.playsInline) video.setAttribute('playsinline', '');
      video.preload = 'metadata';
      el.appendChild(video);
      return video;
    }

    function onEnter() {
      clearTimeout(timer);
      timer = setTimeout(function () {
        var v = makeVideo();
        v.currentTime = 0;
        v.play().catch(function () {});
        el.classList.add('is-playing');
      }, o.startDelay);
    }
    function onLeave() {
      clearTimeout(timer);
      el.classList.remove('is-playing');
      if (video) {
        try { video.pause(); } catch (e) {}
      }
    }

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('focus', onEnter);
    el.addEventListener('blur',  onLeave);

    function destroy() {
      clearTimeout(timer);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('focus', onEnter);
      el.removeEventListener('blur',  onLeave);
      el.classList.remove('is-playing');
      if (video) { video.remove(); video = null; }
    }

    return { el: el, destroy: destroy };
  }

  var VideoHoverPreview = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = VideoHoverPreview;
  else root.VideoHoverPreview = VideoHoverPreview;
})(typeof window !== 'undefined' ? window : this);
