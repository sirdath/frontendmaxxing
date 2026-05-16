/* ============================================
   COOKIE CONSENT — Persist choice, fire callbacks
   ============================================
   Usage:
     CookieConsent.init('[data-cookie-consent]', {
       persistKey: 'cookies-v1',
       onChoice: function (choice) {   // 'accept' | 'reject' | { necessary, analytics, marketing }
         if (choice === 'accept') enableAnalytics();
       }
     });
   ============================================ */
(function (root) {
  'use strict';

  function init(target, opts) {
    opts = opts || {};
    var key = 'cck-' + (opts.persistKey || 'consent');
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return null;

    var existing = localStorage.getItem(key);
    if (existing) {
      el.classList.add('is-dismissed');
      if (typeof opts.onChoice === 'function') {
        try { opts.onChoice(JSON.parse(existing)); } catch (e) { opts.onChoice(existing); }
      }
      return null;
    }

    function choose(val) {
      try { localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val)); } catch (e) {}
      el.classList.add('is-dismissed');
      if (typeof opts.onChoice === 'function') opts.onChoice(val);
    }

    function readPrefs() {
      var out = { necessary: true, analytics: false, marketing: false };
      el.querySelectorAll('.cck-prefs input[type="checkbox"]').forEach(function (cb) {
        var k = cb.getAttribute('name');
        if (k) out[k] = cb.checked;
      });
      return out;
    }

    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cck-action]');
      if (!b) return;
      var action = b.getAttribute('data-cck-action');
      if (action === 'accept')    choose('accept');
      else if (action === 'reject') choose('reject');
      else if (action === 'customize') el.classList.toggle('is-customizing');
      else if (action === 'save')   choose(readPrefs());
    });

    return { el: el, dismiss: function () { el.classList.add('is-dismissed'); } };
  }

  var CookieConsent = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = CookieConsent;
  else root.CookieConsent = CookieConsent;
})(typeof window !== 'undefined' ? window : this);
