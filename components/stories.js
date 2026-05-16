/* ============================================
   STORIES — Auto-advancing story player with tap nav
   ============================================
   Usage:
     Stories.init('[data-stories]', {
       slides: [
         { type: 'image', src: '...', duration: 5000 },
         { type: 'video', src: '...' },
         { type: 'text',  text: 'Hello', bg: 'linear-gradient(...)', duration: 4000 }
       ],
       onEnd: function () { … }
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    slides: [],
    autoplay: true,
    defaultDuration: 5000,
    onChange: null,
    onEnd: null
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

    var bars = el.querySelector('.strs-bars');
    var stage = el.querySelector('.strs-stage');
    if (!bars || !stage || !o.slides.length) return { el: el, destroy: function () {} };

    var idx = 0;
    var startedAt = 0;
    var elapsed = 0;
    var paused = false;
    var raf = null;

    // Build bars
    bars.innerHTML = o.slides.map(function () { return '<div class="strs-bar"><span></span></div>'; }).join('');
    // Build slides
    stage.innerHTML = o.slides.map(function (s, i) {
      var inner = '';
      if (s.type === 'image') inner = '<img src="' + s.src + '" alt="">';
      else if (s.type === 'video') inner = '<video src="' + s.src + '" autoplay muted playsinline></video>';
      else if (s.type === 'text') inner = '<div class="strs-slide-text" style="background:' + (s.bg || '#222') + ';">' + (s.text || '') + '</div>';
      return '<div class="strs-slide" data-i="' + i + '">' + inner + '</div>';
    }).join('');

    function show(i) {
      if (i >= o.slides.length) { stop(); if (typeof o.onEnd === 'function') o.onEnd(); return; }
      if (i < 0) i = 0;
      idx = i;
      Array.prototype.forEach.call(stage.children, function (c, k) { c.classList.toggle('is-active', k === i); });
      Array.prototype.forEach.call(bars.children, function (b, k) {
        b.classList.toggle('is-done', k < i);
        b.querySelector('span').style.setProperty('--p', k < i ? '100%' : '0%');
      });
      elapsed = 0;
      startedAt = performance.now();
      // For videos: defer to video duration
      var slide = stage.children[i];
      var video = slide && slide.querySelector('video');
      if (video) {
        video.currentTime = 0;
        video.play();
      }
      if (typeof o.onChange === 'function') o.onChange(i, o.slides[i]);
    }

    function tick() {
      if (paused) { raf = requestAnimationFrame(tick); return; }
      var slide = o.slides[idx];
      var duration = slide.duration || o.defaultDuration;
      var slideEl = stage.children[idx];
      var video = slideEl && slideEl.querySelector('video');
      if (video && video.duration) duration = video.duration * 1000;

      elapsed = performance.now() - startedAt;
      var p = Math.min(1, elapsed / duration);
      var bar = bars.children[idx];
      if (bar) bar.querySelector('span').style.setProperty('--p', (p * 100) + '%');

      if (p >= 1) {
        show(idx + 1);
        if (idx >= o.slides.length) return;
      }
      raf = requestAnimationFrame(tick);
    }

    function start() { if (raf) cancelAnimationFrame(raf); show(0); raf = requestAnimationFrame(tick); }
    function stop() { if (raf) cancelAnimationFrame(raf); raf = null; }
    function next() { show(idx + 1); }
    function prev() { show(idx - 1); }
    function pause() { paused = true; startedAt = performance.now() - elapsed; }
    function resume() { paused = false; startedAt = performance.now() - elapsed; }

    // Click zones
    el.querySelector('[data-strs-prev]') && el.querySelector('[data-strs-prev]').addEventListener('click', prev);
    el.querySelector('[data-strs-next]') && el.querySelector('[data-strs-next]').addEventListener('click', next);
    el.querySelector('[data-strs-close]') && el.querySelector('[data-strs-close]').addEventListener('click', stop);

    // Hold-to-pause
    el.addEventListener('pointerdown', pause);
    el.addEventListener('pointerup', resume);
    el.addEventListener('pointercancel', resume);

    if (o.autoplay) start();

    function destroy() {
      stop();
      el.removeEventListener('pointerdown', pause);
      el.removeEventListener('pointerup', resume);
      el.removeEventListener('pointercancel', resume);
    }

    return { el: el, start: start, stop: stop, next: next, prev: prev, destroy: destroy };
  }

  var Stories = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = Stories;
  else root.Stories = Stories;
})(typeof window !== 'undefined' ? window : this);
