/* ============================================
   PULL TO REFRESH — Trigger a refresh callback when user pulls down past threshold
   Inspired by Twitter / Material PTR
   ============================================
   Usage:
     PullToRefresh.init('.ptr', {
       trigger: 80,                      // px to cross
       resistance: 0.5,                  // 0..1 — drag dampening
       onRefresh: function () {
         return new Promise(function (r) { setTimeout(r, 1200); });
       }
     });

   The container must scroll. PTR only activates when the inner content
   is scrolled to the top.
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    trigger: 80,
    resistance: 0.5,
    onRefresh: null
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    el.style.setProperty('--ptr-trigger', o.trigger + 'px');
    var content = el.querySelector('.ptr-content') || el;
    var indicator = el.querySelector('.ptr-indicator');

    var startY = 0;
    var pull = 0;
    var dragging = false;
    var refreshing = false;

    function topOK() {
      var scroller = content.scrollTop != null ? content : el;
      return (scroller.scrollTop || window.scrollY || 0) <= 0;
    }

    function onDown(e) {
      if (refreshing) return;
      if (!topOK()) return;
      dragging = true;
      startY = e.clientY;
      pull = 0;
    }

    function onMove(e) {
      if (!dragging) return;
      var dy = (e.clientY - startY) * o.resistance;
      if (dy <= 0) {
        pull = 0;
        update();
        return;
      }
      pull = dy;
      update();
    }

    function update() {
      var p = clamp(pull / o.trigger, 0, 1.6);
      content.style.transform = 'translateY(' + pull.toFixed(1) + 'px)';
      if (indicator) indicator.style.marginTop = (-o.trigger + Math.min(pull, o.trigger)) + 'px';
      el.style.setProperty('--ptr-progress', p.toFixed(3));
      el.classList.toggle('is-pulling', pull > 0);
      el.classList.toggle('is-ready', pull >= o.trigger);
    }

    function onUp() {
      if (!dragging) return;
      dragging = false;
      if (pull >= o.trigger) {
        refreshing = true;
        el.classList.remove('is-pulling', 'is-ready');
        el.classList.add('is-refreshing');
        content.style.transform = 'translateY(' + o.trigger + 'px)';
        var p = (typeof o.onRefresh === 'function') ? o.onRefresh() : null;
        Promise.resolve(p).finally(function () {
          el.classList.remove('is-refreshing');
          refreshing = false;
          content.style.transform = '';
          if (indicator) indicator.style.marginTop = '';
          pull = 0;
        });
      } else {
        el.classList.remove('is-pulling', 'is-ready');
        content.style.transform = '';
        if (indicator) indicator.style.marginTop = '';
      }
    }

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);

    function destroy() {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      content.style.transform = '';
      el.classList.remove('is-pulling', 'is-ready', 'is-refreshing');
    }

    return { el: el, destroy: destroy };
  }

  var PullToRefresh = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = PullToRefresh;
  else root.PullToRefresh = PullToRefresh;
})(typeof window !== 'undefined' ? window : this);
