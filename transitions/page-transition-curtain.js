/* ============================================
   PAGE TRANSITION CURTAIN — Wipe overlay between routes
   Inspired by Codrops Barba.js demos
   ============================================
   Usage:
     PageTransitionCurtain.init({
       container: '#app',
       linkSelector: 'a[data-ptc]',
       direction: 'rtl',         // ltr | rtl | ttb | btt | diagonal
       color: '#0c0c14',
       duration: 550,            // ms (match CSS transition)
       loader: true              // show spinner in center
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    container: '#app',
    linkSelector: 'a[data-ptc]',
    direction: 'rtl',
    color: null,
    duration: 550,
    loader: true
  };

  function init(opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var container = typeof o.container === 'string'
      ? document.querySelector(o.container)
      : o.container;
    if (!container) return { destroy: function () {} };

    var curtain = document.createElement('div');
    curtain.className = 'ptc-curtain ptc-' + o.direction;
    if (o.color) curtain.style.setProperty('--ptc-bg', o.color);
    if (o.loader) {
      var l = document.createElement('div');
      l.className = 'ptc-loader';
      curtain.appendChild(l);
    }
    document.body.appendChild(curtain);

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
      navigate(url.href, /*push*/ true);
    }

    function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

    function navigate(url, pushState) {
      curtain.classList.remove('ptc-out');
      curtain.classList.add('ptc-in');
      var fetched = fetch(url, { credentials: 'same-origin' }).then(function (r) { return r.text(); });
      var waited = wait(o.duration);

      Promise.all([fetched, waited]).then(function (vals) {
        var html = vals[0];
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var newContainer = doc.querySelector(o.container);
        if (!newContainer) { location.href = url; return; }
        if (pushState) history.pushState({ ptc: true }, '', url);
        document.title = doc.title;
        container.innerHTML = newContainer.innerHTML;
        window.scrollTo(0, 0);
        curtain.classList.remove('ptc-in');
        curtain.classList.add('ptc-out');
        setTimeout(function () { curtain.classList.remove('ptc-out'); }, o.duration);
      });
    }

    function onPop() { navigate(location.href, /*push*/ false); }

    document.addEventListener('click', onClick);
    window.addEventListener('popstate', onPop);

    function destroy() {
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onPop);
      curtain.remove();
    }

    return { destroy: destroy, navigate: navigate };
  }

  var PageTransitionCurtain = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = PageTransitionCurtain;
  else root.PageTransitionCurtain = PageTransitionCurtain;
})(typeof window !== 'undefined' ? window : this);
