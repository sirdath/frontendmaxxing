/* ============================================
   TASTE · MOTION-PROFILES (global: MotionProfile) — JS side of the motion layer
   ============================================
   The data provider that mirrors taste/motion.css in JS, so script-driven motion
   (Stagger, Spring, custom transitions) uses the SAME durations/easing/stagger as
   CSS hover/transition timing. Read the profile off the nearest [data-motion]
   ancestor, or apply one imperatively. Respects prefers-reduced-motion.

   Usage:
     <script src="motion-profiles.js"></script>
     <script>
       // read the active profile for an element (walks up to [data-motion]):
       var p = MotionProfile.get(card);        // {durFast,dur,durSlow,ease,stagger}
       el.style.transition = 'transform ' + p.dur + 'ms ' + p.ease;

       // push a profile's tokens onto an element as --m-* inline vars:
       MotionProfile.apply(section, 'playful');

       // stagger a list with the active profile (uses window.Stagger if present):
       MotionProfile.stagger('.card', { from: 'first' });
     </script>

   Profiles mirror taste/motion.css exactly: minimal · standard · playful.
   Methods: get(el) · tokens(name) · apply(el,name) · stagger(sel,opts) · reduced()
   ============================================ */

(function (global) {
  'use strict';

  // Mirrors taste/motion.css. Keep these in sync with the CSS token values.
  var PROFILES = {
    minimal:  { durFast: 90,  dur: 140, durSlow: 200, ease: 'ease-out',                         stagger: 0 },
    standard: { durFast: 120, dur: 200, durSlow: 320, ease: 'cubic-bezier(0.2, 0.8, 0.2, 1)',   stagger: 60 },
    playful:  { durFast: 160, dur: 260, durSlow: 480, ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)', stagger: 90 },
  };
  var DEFAULT = 'standard';

  function reduced() {
    return typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Raw token object for a named profile (falls back to standard).
  // Under reduced-motion, durations/stagger collapse to ~0 (easing kept).
  function tokens(name) {
    var base = PROFILES[name] || PROFILES[DEFAULT];
    if (reduced()) return { durFast: 0, dur: 0, durSlow: 0, ease: base.ease, stagger: 0 };
    return { durFast: base.durFast, dur: base.dur, durSlow: base.durSlow, ease: base.ease, stagger: base.stagger };
  }

  // Resolve the profile for an element by walking up to the nearest [data-motion].
  function get(el) {
    var name = DEFAULT;
    if (el && el.closest) {
      var host = el.closest('[data-motion]');
      if (host) {
        var v = host.getAttribute('data-motion');
        if (PROFILES[v]) name = v;
      }
    }
    return tokens(name);
  }

  // Write a profile's tokens onto an element as inline --m-* custom properties.
  function apply(el, name) {
    if (!el || !el.style) return null;
    var t = tokens(name);
    el.style.setProperty('--m-dur-fast', t.durFast + 'ms');
    el.style.setProperty('--m-dur', t.dur + 'ms');
    el.style.setProperty('--m-dur-slow', t.durSlow + 'ms');
    el.style.setProperty('--m-ease', t.ease);
    el.style.setProperty('--m-stagger', t.stagger + 'ms');
    return t;
  }

  // Convenience bridge to animations/stagger.js using the active profile's timing.
  // Resolves the profile from the first matched element; no-op if Stagger absent.
  function stagger(selector, opts) {
    opts = opts || {};
    var first = typeof document !== 'undefined' ? document.querySelector(selector) : null;
    var t = get(first);
    if (!global.Stagger || typeof global.Stagger.transform !== 'function') return null;
    return global.Stagger.transform(selector, {
      from: opts.fromState || { y: 24, opacity: 0 },
      to: opts.toState || { y: 0, opacity: 1 },
      delay: t.stagger,
      duration: t.dur,
      easing: t.ease,
      // pass through ordering / anything else the caller wants
      order: opts.from,
    });
  }

  var MotionProfile = {
    PROFILES: PROFILES,
    get: get,
    tokens: tokens,
    apply: apply,
    stagger: stagger,
    reduced: reduced,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MotionProfile;
  } else {
    global.MotionProfile = MotionProfile;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
