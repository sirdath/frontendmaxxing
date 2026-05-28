/* ============================================
   SHARE BUTTONS — Wires share intents, copy-link, and the native Web Share API
   Inspired by AddToAny / publisher share bars
   ============================================
   Usage:
     ShareButtons.init('.shb');
     ShareButtons.init('.shb', { url: 'https://…', title: 'Title', text: 'Summary' });

   Reads url/title/text from data-share-url / -title / -text on the .shb
   container, falling back to document.title + location.href.
   Each button declares its network via data-share="x|facebook|linkedin|
   whatsapp|telegram|reddit|pinterest|email|copy|native".
   ============================================ */
(function (root) {
  'use strict';

  var INTENTS = {
    x:        function (u, t)    { return 'https://twitter.com/intent/tweet?url=' + u + '&text=' + t; },
    facebook: function (u)       { return 'https://www.facebook.com/sharer/sharer.php?u=' + u; },
    linkedin: function (u)       { return 'https://www.linkedin.com/sharing/share-offsite/?url=' + u; },
    whatsapp: function (u, t)    { return 'https://api.whatsapp.com/send?text=' + t + '%20' + u; },
    telegram: function (u, t)    { return 'https://t.me/share/url?url=' + u + '&text=' + t; },
    reddit:   function (u, t)    { return 'https://www.reddit.com/submit?url=' + u + '&title=' + t; },
    pinterest:function (u, t)    { return 'https://pinterest.com/pin/create/button/?url=' + u + '&description=' + t; },
    email:    function (u, t)    { return 'mailto:?subject=' + t + '&body=' + u; }
  };

  function create(el, opts) {
    opts = opts || {};
    function ctx() {
      var url   = opts.url   || el.dataset.shareUrl   || location.href;
      var title = opts.title || el.dataset.shareTitle || document.title;
      var text  = opts.text  || el.dataset.shareText  || title;
      return { url: url, title: title, text: text, eu: encodeURIComponent(url), et: encodeURIComponent(text), eti: encodeURIComponent(title) };
    }

    function openPopup(href) {
      window.open(href, '_blank', 'noopener,noreferrer,width=600,height=540');
    }

    el.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-share]'); if (!btn) return;
      var kind = btn.dataset.share;
      var c = ctx();

      if (kind === 'copy') {
        var write = navigator.clipboard ? navigator.clipboard.writeText(c.url) : Promise.reject();
        write.then(function () { flash(btn); }).catch(function () {
          // fallback
          var ta = document.createElement('textarea'); ta.value = c.url; document.body.appendChild(ta);
          ta.select(); try { document.execCommand('copy'); flash(btn); } catch (_) {} ta.remove();
        });
        return;
      }
      if (kind === 'native') {
        if (navigator.share) navigator.share({ title: c.title, text: c.text, url: c.url }).catch(function () {});
        else openPopup(INTENTS.x(c.eu, c.et)); // graceful fallback
        return;
      }
      var fn = INTENTS[kind];
      if (fn) {
        var href = fn(c.eu, kind === 'email' ? c.eti : c.et, c.eti);
        if (kind === 'email') location.href = href; else openPopup(href);
      }
    });

    function flash(btn) {
      var lbl = btn.querySelector('.shb-label');
      var prev = lbl ? lbl.textContent : null;
      btn.classList.add('is-copied');
      if (lbl) lbl.textContent = 'Copied';
      setTimeout(function () { btn.classList.remove('is-copied'); if (lbl && prev !== null) lbl.textContent = prev; }, 1600);
    }

    // Hide the native button if the API is unavailable (desktop)
    var nativeBtn = el.querySelector('[data-share="native"]');
    if (nativeBtn && !navigator.share) nativeBtn.style.display = 'none';

    return { el: el };
  }

  function init(target, opts) {
    if (typeof target === 'string') {
      var nodes = document.querySelectorAll(target);
      if (nodes.length === 0) return null;
      if (nodes.length === 1) return create(nodes[0], opts);
      var arr = []; nodes.forEach(function (n) { arr.push(create(n, opts)); });
      return arr;
    }
    return create(target, opts);
  }

  var ShareButtons = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = ShareButtons;
  else root.ShareButtons = ShareButtons;
})(typeof window !== 'undefined' ? window : this);
