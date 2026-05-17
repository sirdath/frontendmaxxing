/* ============================================
   IOS DYNAMIC ISLAND — Morph between idle / dot / compact / expanded / call states
   ============================================
   Usage:
     var di = IosDynamicIsland.init('[data-ios-di]');
     di.setState('idle');
     di.compact({ icon: '✓', title: 'Saved', sub: 'iCloud', time: '0:32' });
     di.expand({ html: '<div>...</div>' });
     di.call({ name: 'Alice', avatar: 'A' });
     di.dot('green'); // green | orange | red
   ============================================ */
(function (root) {
  'use strict';

  function init(target, opts) {
    opts = opts || {};
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return null;
    el.dataset.state = el.dataset.state || 'idle';

    function setState(name) { el.dataset.state = name; }

    function setContent(html) {
      el.innerHTML = '<div class="ios-di-content">' + html + '</div>';
    }

    function compact(o) {
      setState('compact');
      o = o || {};
      var icon = o.icon != null ? o.icon : '✓';
      setContent(
        '<span class="ios-di-pill-icon">' + esc(icon) + '</span>' +
        '<span class="ios-di-info">' +
          '<span class="ios-di-title">' + esc(o.title || '') + '</span>' +
          (o.sub ? '<span class="ios-di-sub">' + esc(o.sub) + '</span>' : '') +
        '</span>' +
        (o.time ? '<span class="ios-di-time">' + esc(o.time) + '</span>' : '')
      );
    }

    function music(o) {
      setState('compact');
      o = o || {};
      setContent(
        '<span class="ios-di-pill-icon" style="background:linear-gradient(135deg,#ec4899,#8b5cf6);">♪</span>' +
        '<span class="ios-di-info">' +
          '<span class="ios-di-title">' + esc(o.title || 'Now Playing') + '</span>' +
          '<span class="ios-di-sub">' + esc(o.artist || '') + '</span>' +
        '</span>' +
        '<span class="ios-di-bars"><span></span><span></span><span></span><span></span></span>'
      );
    }

    function call(o) {
      setState('call');
      o = o || {};
      var initials = (o.name || 'A').split(' ').map(function (s) { return s[0]; }).join('').slice(0, 2).toUpperCase();
      setContent(
        '<span class="ios-di-avatar">' + esc(initials) + '</span>' +
        '<span class="ios-di-info" style="text-align:left;">' +
          '<span class="ios-di-title">' + esc(o.name || 'Incoming…') + '</span>' +
          '<span class="ios-di-sub">' + esc(o.sub || 'mobile') + '</span>' +
        '</span>' +
        '<span class="ios-di-actions">' +
          '<button class="ios-di-act is-decline" data-act="decline">×</button>' +
          '<button class="ios-di-act is-accept"  data-act="accept">✓</button>' +
        '</span>'
      );
    }

    function expand(o) {
      setState('expanded');
      o = o || {};
      setContent(o.html || '<div style="text-align:center;font-size:14px;font-weight:600;">' + esc(o.title || 'Expanded') + '</div>');
    }

    function dot(color) {
      setState('dot');
      setContent('');
      if (color) {
        var map = { green: '#34c759', orange: '#ff9500', red: '#ff3b30', blue: '#0a84ff' };
        el.style.setProperty('--ios-di-dot', map[color] || color);
      }
    }

    function idle() {
      setState('idle');
      setContent('');
    }

    return { el: el, setState: setState, compact: compact, music: music, call: call, expand: expand, dot: dot, idle: idle };
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var IosDynamicIsland = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = IosDynamicIsland;
  else root.IosDynamicIsland = IosDynamicIsland;
})(typeof window !== 'undefined' ? window : this);
