/* ============================================
   MICRO INTERACTIONS PACK — Toggle handlers
   ============================================
   Usage:
     MicroIx.like('[data-mi-like]', { onToggle: fn });
     MicroIx.copy('[data-mi-copy]', { text: () => 'value' });
     MicroIx.share('[data-mi-share]');
     MicroIx.follow('[data-mi-follow]', { onToggle: fn });
     MicroIx.bookmark('[data-mi-bm]', { onToggle: fn });
     MicroIx.draft('[data-mi-draft]', { simulate: true });
     MicroIx.kbd('[data-mi-kbd]', { combo: 'mod+k', onTrigger: fn });
   ============================================ */
(function (root) {
  'use strict';

  function each(target, fn) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, fn);
  }

  function like(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      host.addEventListener('click', function () {
        var on = host.classList.toggle('is-liked');
        if (typeof opts.onToggle === 'function') opts.onToggle(on);
      });
    });
  }

  function copy(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      host.addEventListener('click', function () {
        var text = typeof opts.text === 'function' ? opts.text(host) : (opts.text || host.dataset.copy || '');
        navigator.clipboard.writeText(text).then(function () {
          host.classList.add('is-copied');
          var original = host.textContent;
          host.textContent = '✓';
          setTimeout(function () {
            host.classList.remove('is-copied');
            host.textContent = original;
          }, 1200);
        });
      });
    });
  }

  function share(target) {
    each(target, function (host) {
      var trig = host.querySelector('.mi-share-trig');
      if (trig) trig.addEventListener('click', function (e) {
        e.stopPropagation();
        host.classList.toggle('is-open');
      });
      document.addEventListener('click', function () { host.classList.remove('is-open'); });
    });
  }

  function follow(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      host.addEventListener('click', function () {
        var on = host.classList.toggle('is-following');
        if (typeof opts.onToggle === 'function') opts.onToggle(on);
      });
    });
  }

  function bookmark(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      host.addEventListener('click', function () {
        var on = host.classList.toggle('is-saved');
        if (typeof opts.onToggle === 'function') opts.onToggle(on);
      });
    });
  }

  function draft(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      function setSaving() {
        host.classList.add('is-saving');
        host.classList.remove('is-error');
        host.textContent = 'Saving…';
      }
      function setSaved() {
        host.classList.remove('is-saving', 'is-error');
        var t = new Date();
        host.textContent = 'Saved ' + t.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      }
      function setError() {
        host.classList.add('is-error');
        host.classList.remove('is-saving');
        host.textContent = 'Save failed';
      }
      host._setSaving = setSaving;
      host._setSaved  = setSaved;
      host._setError  = setError;
      if (opts.simulate) {
        setSaving();
        setTimeout(setSaved, 900);
      }
    });
  }

  function kbd(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      host.addEventListener('click', function () {
        host.classList.add('is-pressed');
        setTimeout(function () { host.classList.remove('is-pressed'); }, 200);
        if (typeof opts.onTrigger === 'function') opts.onTrigger();
      });
      if (opts.combo) {
        document.addEventListener('keydown', function (e) {
          if (matchCombo(e, opts.combo)) {
            host.classList.add('is-pressed');
            setTimeout(function () { host.classList.remove('is-pressed'); }, 200);
            if (typeof opts.onTrigger === 'function') opts.onTrigger(e);
            e.preventDefault();
          }
        });
      }
    });
  }
  function matchCombo(e, combo) {
    var parts = combo.toLowerCase().split('+').map(function (s) { return s.trim(); });
    var key = parts.pop();
    var mod = parts.indexOf('mod') !== -1;
    var ctrl = parts.indexOf('ctrl') !== -1;
    var alt = parts.indexOf('alt') !== -1;
    var shift = parts.indexOf('shift') !== -1;
    var meta = parts.indexOf('meta') !== -1 || parts.indexOf('cmd') !== -1;
    return e.key.toLowerCase() === key &&
      (!mod || e.metaKey || e.ctrlKey) &&
      (!ctrl || e.ctrlKey) &&
      (!alt || e.altKey) &&
      (!shift || e.shiftKey) &&
      (!meta || e.metaKey);
  }

  function shake(target) {
    each(target, function (host) {
      host._shake = function () {
        host.classList.add('is-shaking');
        setTimeout(function () { host.classList.remove('is-shaking'); }, 420);
      };
    });
  }

  function badge(target) {
    each(target, function (host) {
      host._bump = function (next) {
        if (typeof next === 'number') host.textContent = next;
        host.classList.add('is-bumped');
        setTimeout(function () { host.classList.remove('is-bumped'); }, 380);
      };
    });
  }

  var MicroIx = { like: like, copy: copy, share: share, follow: follow,
    bookmark: bookmark, draft: draft, kbd: kbd, shake: shake, badge: badge };
  if (typeof module !== 'undefined' && module.exports) module.exports = MicroIx;
  else root.MicroIx = MicroIx;
})(typeof window !== 'undefined' ? window : this);
