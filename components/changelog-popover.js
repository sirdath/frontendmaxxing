/* ============================================
   CHANGELOG POPOVER — Controller for "What's new" bell drawer
   Inspired by Linear, Vercel changelog popovers
   ============================================
   Usage:
     ChangelogPopover.init({
       trigger: '[data-chl-trigger]',
       entries: [{ id, date, title, body, tag, image, video, read, link }],
       title: "What's new",
       persistKey: 'chl-read',   // optional localStorage key for read state
       onMarkRead, onMarkAllRead, onClickEntry
     });

     ChangelogPopover.open();
     ChangelogPopover.close();
     ChangelogPopover.setEntries(arr);
     ChangelogPopover.markRead(id);
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    trigger: '[data-chl-trigger]',
    entries: [],
    title: "What's new",
    subtitle: '',
    persistKey: null,
    style: 'popover',         // 'popover' (anchored) | 'drawer' (right rail) | 'fullscreen'
    onMarkRead: null,
    onMarkAllRead: null,
    onClickEntry: null,
    onOpen: null,
    onClose: null
  };

  var state = { opts: null, panel: null, triggerEl: null, readSet: null };

  function init(opts) {
    state.opts = mergeOpts(opts);
    state.readSet = loadReadSet();

    // Bind triggers
    document.querySelectorAll(state.opts.trigger).forEach(function (t) {
      t.addEventListener('click', function (e) {
        state.triggerEl = t;
        open();
        e.stopPropagation();
      });
    });

    updateBadges();
  }

  function loadReadSet() {
    var s = new Set();
    if (!state.opts.persistKey) return s;
    try {
      var data = JSON.parse(localStorage.getItem(state.opts.persistKey) || '[]');
      data.forEach(function (id) { s.add(id); });
    } catch (e) {}
    return s;
  }
  function saveReadSet() {
    if (!state.opts.persistKey) return;
    try { localStorage.setItem(state.opts.persistKey, JSON.stringify(Array.from(state.readSet))); } catch (e) {}
  }

  function setEntries(entries) {
    state.opts.entries = entries;
    if (state.panel) render();
    updateBadges();
  }

  function updateBadges() {
    var unread = state.opts.entries.filter(function (e) { return !state.readSet.has(e.id) && !e.read; }).length;
    document.querySelectorAll(state.opts.trigger + ' .chl-badge').forEach(function (b) {
      b.textContent = unread > 0 ? (unread > 9 ? '9+' : String(unread)) : '';
    });
  }

  function open() {
    if (state.panel) return;
    state.panel = document.createElement('div');
    state.panel.className = 'chl' + (state.opts.style === 'fullscreen' ? ' chl-fullscreen' : '');
    state.panel.setAttribute('role', 'dialog');
    state.panel.setAttribute('aria-label', state.opts.title);
    document.body.appendChild(state.panel);
    render();
    positionPanel();
    requestAnimationFrame(function () { if (state.panel) state.panel.classList.add('is-open'); });

    document.addEventListener('click', onOutside);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', positionPanel);
    window.addEventListener('scroll', positionPanel, { passive: true });

    if (typeof state.opts.onOpen === 'function') state.opts.onOpen();
  }

  function close() {
    if (!state.panel) return;
    state.panel.classList.remove('is-open');
    var p = state.panel;
    setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 200);
    state.panel = null;
    document.removeEventListener('click', onOutside);
    document.removeEventListener('keydown', onKey);
    window.removeEventListener('resize', positionPanel);
    window.removeEventListener('scroll', positionPanel);
    if (typeof state.opts.onClose === 'function') state.opts.onClose();
  }

  function onOutside(e) {
    if (!state.panel) return;
    if (state.panel.contains(e.target)) return;
    if (state.triggerEl && state.triggerEl.contains(e.target)) return;
    close();
  }
  function onKey(e) {
    if (e.key === 'Escape') close();
  }

  function positionPanel() {
    if (!state.panel || state.opts.style === 'fullscreen') return;
    if (!state.triggerEl) return;
    var rect = state.triggerEl.getBoundingClientRect();
    var w = state.panel.offsetWidth || 380;
    var top = rect.bottom + window.scrollY + 6;
    var left = rect.right + window.scrollX - w;
    if (left < 8) left = 8;
    state.panel.style.top = top + 'px';
    state.panel.style.left = left + 'px';
  }

  function render() {
    if (!state.panel) return;
    var entries = state.opts.entries || [];
    var unread = entries.filter(function (e) { return !state.readSet.has(e.id) && !e.read; }).length;

    var html =
      '<header class="chl-head">' +
        '<div>' +
          '<div class="chl-title">' + escape(state.opts.title) + '</div>' +
          (state.opts.subtitle ? '<div class="chl-subtitle">' + escape(state.opts.subtitle) + '</div>' : '') +
        '</div>' +
        '<div class="chl-actions">' +
          (unread ? '<button class="chl-mark-all" type="button">Mark all read</button>' : '') +
        '</div>' +
      '</header>';

    if (!entries.length) {
      html += '<div class="chl-empty">No updates yet</div>';
    } else {
      html += '<div class="chl-list">';
      entries.forEach(function (e) {
        var isUnread = !state.readSet.has(e.id) && !e.read;
        html += '<a class="chl-entry' + (isUnread ? ' is-unread' : '') + '" ' +
                  'href="' + escapeAttr(e.link || '#') + '" ' +
                  'data-chl-id="' + escapeAttr(e.id) + '">' +
          '<div class="chl-entry-head">' +
            '<span class="chl-entry-date">' + escape(formatDate(e.date)) + '</span>' +
            (e.tag ? '<span class="chl-entry-tag is-' + escape(e.tag) + '">' + escape(e.tag) + '</span>' : '') +
          '</div>' +
          '<div class="chl-entry-title">' + escape(e.title) + '</div>' +
          (e.image ? '<img class="chl-entry-image" src="' + escapeAttr(e.image) + '" alt="">' : '') +
          (e.video ? '<video class="chl-entry-video" src="' + escapeAttr(e.video) + '" autoplay muted loop playsinline></video>' : '') +
          (e.body ? '<div class="chl-entry-body">' + escape(e.body) + '</div>' : '') +
        '</a>';
      });
      html += '</div>';
    }

    html +=
      '<footer class="chl-foot">' +
        '<span>' + entries.length + ' total</span>' +
        (state.opts.allLink ? '<a href="' + escapeAttr(state.opts.allLink) + '">View all →</a>' : '') +
      '</footer>';

    state.panel.innerHTML = html;

    var markAll = state.panel.querySelector('.chl-mark-all');
    if (markAll) markAll.addEventListener('click', function (e) {
      e.stopPropagation();
      markAllRead();
    });

    state.panel.querySelectorAll('.chl-entry').forEach(function (entry) {
      entry.addEventListener('click', function (ev) {
        var id = entry.dataset.chlId;
        markRead(id);
        if (typeof state.opts.onClickEntry === 'function') {
          state.opts.onClickEntry(state.opts.entries.find(function (e) { return e.id === id; }));
        }
      });
    });
  }

  function markRead(id) {
    state.readSet.add(id);
    saveReadSet();
    var el = state.panel && state.panel.querySelector('[data-chl-id="' + escapeAttr(id) + '"]');
    if (el) el.classList.remove('is-unread');
    updateBadges();
    if (typeof state.opts.onMarkRead === 'function') state.opts.onMarkRead(id);
  }
  function markAllRead() {
    state.opts.entries.forEach(function (e) { state.readSet.add(e.id); });
    saveReadSet();
    if (state.panel) state.panel.querySelectorAll('.is-unread').forEach(function (e) { e.classList.remove('is-unread'); });
    updateBadges();
    render();
    if (typeof state.opts.onMarkAllRead === 'function') state.opts.onMarkAllRead();
  }

  function formatDate(d) {
    if (!d) return '';
    var date = new Date(d);
    if (isNaN(date)) return d;
    var now = new Date();
    var diff = (now - date) / 1000;
    if (diff < 60)     return 'just now';
    if (diff < 3600)   return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400)  return Math.floor(diff / 3600) + 'h ago';
    if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: now.getFullYear() === date.getFullYear() ? undefined : 'numeric' });
  }

  function escape(s) {
    return String(s == null ? '' : s).replace(/[<>&]/g, function (c) {
      return ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]);
    });
  }
  function escapeAttr(s) { return escape(s).replace(/"/g, '&quot;'); }
  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var ChangelogPopover = {
    init: init,
    open: open,
    close: close,
    setEntries: setEntries,
    markRead: markRead,
    markAllRead: markAllRead
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = ChangelogPopover;
  else root.ChangelogPopover = ChangelogPopover;
})(typeof window !== 'undefined' ? window : this);
