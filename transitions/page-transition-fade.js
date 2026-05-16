/* ============================================
   PAGE TRANSITION FADE — Intercept clicks on internal links, fade-replace #app
   Inspired by Codrops barba.js style demos
   ============================================
   Usage:
     PageTransitionFade.init({
       container: '#app',
       linkSelector: 'a[data-pt]'
     });

   How it works:
     - Listens for clicks on `linkSelector` whose href is same-origin
     - Fades out the container, fetches the destination HTML, swaps the
       container's inner HTML with the destination's container, updates
       <title> and the URL, then fades back in.
     - Handles back/forward via popstate.
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    container: '#app',
    linkSelector: 'a[data-pt]',
    durationOut: 350,
    durationIn: 400,
    overlay: false
  };

  function init(opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var container = typeof o.container === 'string'
      ? document.querySelector(o.container)
      : o.container;
    if (!container) return { destroy: function () {} };

    var overlayEl = null;
    if (o.overlay) {
      overlayEl = document.createElement('div');
      overlayEl.className = 'pt-fade-overlay';
      document.body.appendChild(overlayEl);
    }

    function onClick(e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      var link = e.target.closest(o.linkSelector);
      if (!link) return;
      var href = link.getAttribute('href');
      if (!href) return;
      var url;
      try { url = new URL(href, location.href); } catch (err) { return; }
      if (url.origin !== location.origin) return;
      e.preventDefault();
      navigate(url.href, /*pushState*/ true);
    }

    function navigate(url, pushState) {
      // Phase 1: fade out current
      container.classList.add('pt-fade-exit', 'pt-fade-exit-active');
      if (overlayEl) overlayEl.classList.add('is-on');

      var fetched = fetch(url, { credentials: 'same-origin' }).then(function (r) { return r.text(); });
      var waited = new Promise(function (r) { setTimeout(r, o.durationOut); });

      Promise.all([fetched, waited]).then(function (vals) {
        var html = vals[0];
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var newContainer = doc.querySelector(o.container);
        if (!newContainer) {
          // Hard navigate as fallback
          location.href = url;
          return;
        }
        if (pushState) history.pushState({ pt: true }, '', url);
        document.title = doc.title;
        container.innerHTML = newContainer.innerHTML;
        container.classList.remove('pt-fade-exit', 'pt-fade-exit-active');
        container.classList.add('pt-fade-enter');
        // Force reflow
        void container.offsetWidth;
        container.classList.add('pt-fade-enter-active');
        if (overlayEl) overlayEl.classList.remove('is-on');
        setTimeout(function () {
          container.classList.remove('pt-fade-enter', 'pt-fade-enter-active');
        }, o.durationIn);
      });
    }

    function onPop() {
      navigate(location.href, /*pushState*/ false);
    }

    document.addEventListener('click', onClick);
    window.addEventListener('popstate', onPop);

    function destroy() {
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onPop);
      if (overlayEl) overlayEl.remove();
    }

    return { destroy: destroy, navigate: navigate };
  }

  var PageTransitionFade = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = PageTransitionFade;
  else root.PageTransitionFade = PageTransitionFade;
})(typeof window !== 'undefined' ? window : this);
