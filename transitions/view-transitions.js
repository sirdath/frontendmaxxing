/* ============================================
   VIEW TRANSITIONS — Wrapper around the View Transitions API
   Inspired by bramus/view-transitions-demos / Chrome team examples
   ============================================
   Browser support: Chrome 111+ / Edge 111+ (and Firefox/Safari behind flags
   or recent versions). Falls back to running the callback without animation.

   Usage:
     // Wrap a DOM mutation so a default cross-fade transition plays.
     ViewTransitions.run(function () {
       document.body.classList.toggle('dark');
     });

     // Named transitions: pair source + dest with view-transition-name in CSS.
     <img id="thumb" style="view-transition-name: hero">
     <img id="hero"  style="view-transition-name: hero">
     ViewTransitions.run(function () { swapImage(); });

     // Use a custom CSS animation:
     ViewTransitions.run(swap, { type: 'slide' });
     // → adds [data-vt-type="slide"] on <html> during the transition;
     //   target this in your CSS via ::view-transition-old(root) etc.
   ============================================ */
(function (root) {
  'use strict';

  function supported() {
    return typeof document !== 'undefined' && typeof document.startViewTransition === 'function';
  }

  function run(callback, opts) {
    opts = opts || {};
    if (typeof callback !== 'function') return Promise.resolve();

    if (!supported()) {
      var r = callback();
      return Promise.resolve(r);
    }

    if (opts.type) document.documentElement.setAttribute('data-vt-type', opts.type);

    var transition = document.startViewTransition(function () {
      return Promise.resolve(callback());
    });

    transition.finished.finally(function () {
      if (opts.type) document.documentElement.removeAttribute('data-vt-type');
    });

    return transition.finished;
  }

  // Helper: animate a single element's geometry change without the View
  // Transitions API (FLIP-style fallback used internally for legacy browsers).
  function flip(el, mutate, opts) {
    opts = opts || {};
    var first = el.getBoundingClientRect();
    mutate();
    var last = el.getBoundingClientRect();
    var dx = first.left - last.left;
    var dy = first.top  - last.top;
    var sx = first.width  / last.width  || 1;
    var sy = first.height / last.height || 1;

    el.animate(
      [
        { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ')' },
        { transform: 'translate(0,0) scale(1,1)' }
      ],
      {
        duration: opts.duration || 400,
        easing: opts.easing || 'cubic-bezier(0.2, 0.9, 0.25, 1)',
        fill: 'both'
      }
    );
  }

  var ViewTransitions = { run: run, flip: flip, supported: supported };

  if (typeof module !== 'undefined' && module.exports) module.exports = ViewTransitions;
  else root.ViewTransitions = ViewTransitions;
})(typeof window !== 'undefined' ? window : this);
