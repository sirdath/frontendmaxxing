/* ============================================
   ANIME RECIPES — anime.js-style helpers, zero deps
   Inspired by juliangarnier/anime
   ============================================
   This is a small motion library covering ~80% of what people use anime.js
   for: timeline, stagger, keyframe tween, with cubic-bezier easings and a
   tiny transform DSL. NOT an anime.js drop-in — surface is simpler.

   Usage:
     AnimeRecipes.tween('.box', {
       to:       { x: 200, y: 60, scale: 1.2, rotate: 45, opacity: 0.5 },
       duration: 800,
       easing:   'easeOutCubic',
       delay:    AnimeRecipes.stagger(80),   // staggered delay
       onUpdate: function (p) { … },
       onDone:   function () { … }
     });

     // Sequenced timeline:
     var tl = AnimeRecipes.timeline();
     tl.add('.a', { to: { x: 100 }, duration: 400 })
       .add('.b', { to: { y: 60  }, duration: 300 }, '-=100')   // overlap 100ms
       .play();
   ============================================ */
(function (root) {
  'use strict';

  // ── Easings ──
  var easings = {
    linear: function (t) { return t; },
    easeInQuad:    function (t) { return t * t; },
    easeOutQuad:   function (t) { return t * (2 - t); },
    easeInOutQuad: function (t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; },
    easeInCubic:    function (t) { return t * t * t; },
    easeOutCubic:   function (t) { return (--t) * t * t + 1; },
    easeInOutCubic: function (t) { return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; },
    easeOutBack:    function (t) { var c = 1.70158; return 1 + (--t) * t * ((c + 1) * t + c); },
    easeOutElastic: function (t) {
      var c = (2 * Math.PI) / 3;
      return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c) + 1;
    },
    spring: function (t) {
      // Damped spring-ish ease
      return 1 - Math.exp(-6 * t) * Math.cos(t * 9);
    }
  };

  function lerp(a, b, t) { return a + (b - a) * t; }

  function buildTransform(state) {
    var parts = [];
    if (state.x != null || state.y != null) parts.push('translate3d(' + (state.x || 0) + 'px,' + (state.y || 0) + 'px,0)');
    if (state.scale != null) parts.push('scale(' + state.scale + ')');
    if (state.rotate != null) parts.push('rotate(' + state.rotate + 'deg)');
    return parts.join(' ');
  }

  function applyState(el, state) {
    if (state.x != null || state.y != null || state.scale != null || state.rotate != null) {
      el.style.transform = buildTransform(state);
    }
    if (state.opacity != null) el.style.opacity = state.opacity;
    if (state.bg) el.style.background = state.bg;
    if (state.color) el.style.color = state.color;
  }

  function stagger(amount, opts) {
    opts = opts || {};
    var from = opts.from || 0;     // 'first' (default 0), 'last', 'center', or numeric
    return function (i, len) {
      var idx;
      if (from === 'last') idx = len - 1 - i;
      else if (from === 'center') idx = Math.abs(i - (len - 1) / 2);
      else if (typeof from === 'number') idx = Math.abs(i - from);
      else idx = i;
      return idx * amount;
    };
  }

  function _tweenSingle(el, params) {
    var from = {};
    var to = params.to || {};
    for (var k in to) {
      if (k === 'x' || k === 'y' || k === 'rotate') from[k] = 0;
      else if (k === 'scale') from[k] = 1;
      else if (k === 'opacity') from[k] = parseFloat(getComputedStyle(el).opacity);
      else from[k] = null;
    }
    if (params.from) for (var k2 in params.from) from[k2] = params.from[k2];

    var dur = params.duration != null ? params.duration : 600;
    var ease = easings[params.easing] || easings.easeOutCubic;
    var t0 = null;
    var rafId = null;
    var done = false;

    function step(now) {
      if (t0 == null) t0 = now;
      var p = Math.min(1, (now - t0) / dur);
      var eased = ease(p);
      var state = {};
      for (var k in to) {
        state[k] = lerp(from[k] || 0, to[k], eased);
      }
      applyState(el, state);
      if (typeof params.onUpdate === 'function') params.onUpdate(p, el);
      if (p < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        done = true;
        if (typeof params.onDone === 'function') params.onDone(el);
      }
    }

    function start(extraDelay) {
      setTimeout(function () { rafId = requestAnimationFrame(step); }, extraDelay || 0);
    }
    function cancel() { if (rafId) cancelAnimationFrame(rafId); }

    return { start: start, cancel: cancel, duration: dur };
  }

  function tween(target, params) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el, i) {
      var p = Object.assign({}, params);
      var delay = p.delay;
      if (typeof delay === 'function') delay = delay(i, els.length);
      else if (delay == null) delay = 0;
      var inst = _tweenSingle(el, p);
      inst.start(delay);
      instances.push(inst);
    });
    return {
      cancel: function () { instances.forEach(function (x) { x.cancel(); }); }
    };
  }

  function timeline() {
    var steps = [];
    var cursor = 0;

    function add(target, params, offset) {
      var startAt = cursor;
      if (typeof offset === 'string') {
        if (offset.indexOf('-=') === 0) startAt = cursor - parseFloat(offset.slice(2));
        else if (offset.indexOf('+=') === 0) startAt = cursor + parseFloat(offset.slice(2));
      } else if (typeof offset === 'number') {
        startAt = offset;
      }
      steps.push({ target: target, params: params, start: startAt });
      var dur = (params.duration != null ? params.duration : 600);
      cursor = startAt + dur;
      return api;
    }

    function play() {
      steps.forEach(function (s) {
        var p = Object.assign({}, s.params);
        var d = p.delay || 0;
        p.delay = s.start + (typeof d === 'function' ? 0 : d);
        tween(s.target, p);
      });
    }

    var api = { add: add, play: play, total: function () { return cursor; } };
    return api;
  }

  var AnimeRecipes = {
    tween: tween,
    timeline: timeline,
    stagger: stagger,
    easings: easings
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = AnimeRecipes;
  else root.AnimeRecipes = AnimeRecipes;
})(typeof window !== 'undefined' ? window : this);
